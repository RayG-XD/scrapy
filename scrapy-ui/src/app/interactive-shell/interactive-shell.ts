import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface ExtractionResult {
  valid: boolean;
  count: number;
  data: string[];
  error?: string;
}

@Component({
  selector: 'app-interactive-shell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './interactive-shell.html',
  styleUrls: ['./interactive-shell.scss']
})
export class InteractiveShellComponent {
  targetUrl: string = 'https://quotes.toscrape.com';
  isFetching: boolean = false;
  hasFetched: boolean = false;
  fetchError: string | null = null;
  fetchedSource: string = '';

  selectorType: 'css' | 'xpath' | 'regex' = 'css';
  selectorExpression: string = '';

  private selectorSubject = new Subject<string>();

  extractionResult: ExtractionResult | null = null;
  isEvaluating: boolean = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    // Setup debounced selector evaluation
    this.selectorSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(expression => {
      this.evaluateSelector(expression);
    });
  }

  fetchUrl() {
    if (!this.targetUrl) return;

    this.isFetching = true;
    this.fetchError = null;
    this.extractionResult = null;

    this.http.post<{source: string}>('/api/shell/fetch', { url: this.targetUrl }).subscribe({
      next: (res) => {
        this.isFetching = false;
        this.hasFetched = true;
        this.fetchedSource = res.source;
        this.cdr.detectChanges();

        if (this.selectorExpression) {
          this.evaluateSelector(this.selectorExpression);
        }
      },
      error: (err) => {
        this.isFetching = false;
        this.fetchError = err.message || 'Error fetching URL';
        this.cdr.detectChanges();
      }
    });
  }

  onSelectorInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectorExpression = value;
    this.selectorSubject.next(value);
  }

  onTypeChange() {
    // Re-evaluate immediately when type changes if we have an expression
    if (this.selectorExpression) {
      this.evaluateSelector(this.selectorExpression);
    }
  }

  public evaluateSelector(expression: string) {
    if (!this.hasFetched) return;
    if (!expression.trim()) {
      this.extractionResult = null;
      return;
    }

    this.isEvaluating = true;

    const payload = {
      source: this.fetchedSource,
      expression: expression,
      type: this.selectorType
    };

    this.http.post<ExtractionResult>('/api/shell/evaluate', payload).subscribe({
      next: (res) => {
        this.isEvaluating = false;
        this.extractionResult = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isEvaluating = false;
        this.extractionResult = {
          valid: false,
          count: 0,
          data: [],
          error: err.error?.error || 'Error evaluating selector'
        };
        this.cdr.detectChanges();
      }
    });
  }
}
