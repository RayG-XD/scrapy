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

  constructor() {
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

    // Simulate network delay and fetching source code
    setTimeout(() => {
      this.isFetching = false;
      this.hasFetched = true;

      // Mock source code for quotes.toscrape.com
      this.fetchedSource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quotes to Scrape</title>
    <link rel="stylesheet" href="/static/bootstrap.min.css">
    <link rel="stylesheet" href="/static/main.css">
</head>
<body>
    <div class="container">
        <div class="row header-box">
            <div class="col-md-8">
                <h1><a href="/" style="text-decoration: none">Quotes to Scrape</a></h1>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="quote" itemscope itemtype="http://schema.org/CreativeWork">
                    <span class="text" itemprop="text">“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”</span>
                    <span>by <small class="author" itemprop="author">Albert Einstein</small>
                    <a href="/author/Albert-Einstein">(about)</a>
                    </span>
                    <div class="tags">
                        Tags:
                        <a class="tag" href="/tag/change/page/1/">change</a>
                        <a class="tag" href="/tag/deep-thoughts/page/1/">deep-thoughts</a>
                        <a class="tag" href="/tag/thinking/page/1/">thinking</a>
                        <a class="tag" href="/tag/world/page/1/">world</a>
                    </div>
                </div>

                <div class="quote" itemscope itemtype="http://schema.org/CreativeWork">
                    <span class="text" itemprop="text">“It is our choices, Harry, that show what we truly are, far more than our abilities.”</span>
                    <span>by <small class="author" itemprop="author">J.K. Rowling</small>
                    <a href="/author/J-K-Rowling">(about)</a>
                    </span>
                    <div class="tags">
                        Tags:
                        <a class="tag" href="/tag/abilities/page/1/">abilities</a>
                        <a class="tag" href="/tag/choices/page/1/">choices</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 tags-box">
                <h2>Top Ten tags</h2>
                <span class="tag-item"><a class="tag" style="font-size: 28px" href="/tag/love/">love</a></span>
                <span class="tag-item"><a class="tag" style="font-size: 26px" href="/tag/inspirational/">inspirational</a></span>
            </div>
        </div>
    </div>
</body>
</html>`;

      // Re-evaluate current selector if any
      if (this.selectorExpression) {
         this.evaluateSelector(this.selectorExpression);
      }
    }, 800);
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

    // Simulate server-side evaluation delay
    setTimeout(() => {
      this.isEvaluating = false;

      try {
        // Mock evaluation logic for demonstration purposes
        let results: string[] = [];
        let isValid = true;
        let errorMessage = undefined;

        if (this.selectorType === 'css') {
           if (expression === '.quote .text' || expression === 'span.text') {
             results = [
               "“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”",
               "“It is our choices, Harry, that show what we truly are, far more than our abilities.”"
             ];
           } else if (expression === '.author') {
             results = ["Albert Einstein", "J.K. Rowling"];
           } else if (expression === '.tag') {
             results = ["change", "deep-thoughts", "thinking", "world", "abilities", "choices", "love", "inspirational"];
           } else if (expression.includes('invalid!@#')) {
             isValid = false;
             errorMessage = 'Invalid CSS selector syntax.';
           } else {
              // Generic fallback for mock
              results = [];
           }
        } else if (this.selectorType === 'xpath') {
          if (expression === '//span[@class="text"]/text()') {
            results = [
               "“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”",
               "“It is our choices, Harry, that show what we truly are, far more than our abilities.”"
             ];
          } else if (expression.startsWith('//')) {
            results = []; // valid xpath, no results
          } else {
             isValid = false;
             errorMessage = 'Invalid XPath expression. Must start with / or //';
          }
        }

        this.extractionResult = {
          valid: isValid,
          count: results.length,
          data: results,
          error: errorMessage
        };
      } catch (e: any) {
        this.extractionResult = {
          valid: false,
          count: 0,
          data: [],
          error: e.message || 'Error evaluating selector'
        };
      }
    }, 300);
  }
}
