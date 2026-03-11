import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface Pipeline {
  name: string;
  path: string;
  active: boolean;
  priority: number;
}

interface ExportFeed {
  uri: string;
  format: string;
  encoding: string;
  active: boolean;
}

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatTableModule,
    DragDropModule
  ],
  templateUrl: './data-management.html',
  styleUrls: ['./data-management.scss']
})
export class DataManagementComponent implements OnInit {
  // Tab 1: Item Schema Builder
  itemForm: FormGroup;
  definedItems: any[] = [];

  // Tab 2: Pipelines
  pipelines: Pipeline[] = [];

  // Tab 3: Feed Exports
  exportFeeds: ExportFeed[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      fields: this.fb.array([this.createField()])
    });
  }

  // --- Items Form Methods ---

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>('/api/items').subscribe(res => {
      this.definedItems = res;
      this.cdr.detectChanges();
    });

    this.http.get<Pipeline[]>('/api/pipelines').subscribe(res => {
      this.pipelines = res;
      this.cdr.detectChanges();
    });

    this.http.get<ExportFeed[]>('/api/feeds').subscribe(res => {
      this.exportFeeds = res;
      this.cdr.detectChanges();
    });
  }

  get fields() {
    return this.itemForm.get('fields') as FormArray;
  }

  createField(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['string']
    });
  }

  addField() {
    this.fields.push(this.createField());
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  saveItem() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      const newFields = formValue.fields.map((f: any) => f.name).filter((n: string) => !!n);

      const payload = {
        name: formValue.itemName,
        fields: newFields
      };

      this.http.post<any>('/api/items', payload).subscribe({
        next: (res) => {
          this.definedItems = [...this.definedItems, res.item];
          // Reset form
          this.itemForm.reset({ itemName: '' });
          this.fields.clear();
          this.addField();
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Error saving item", err)
      });
    }
  }

  getGeneratedPythonCode(): string {
    const formValue = this.itemForm.value;
    const name = formValue.itemName || 'NewItem';

    let code = `import scrapy\n\nclass ${name}(scrapy.Item):\n`;
    if (!formValue.fields || formValue.fields.length === 0 || !formValue.fields[0].name) {
       code += `    pass\n`;
    } else {
       formValue.fields.forEach((f: any) => {
         if (f.name) {
            code += `    ${f.name} = scrapy.Field()\n`;
         }
       });
    }
    return code;
  }


  // --- Pipelines Methods ---
  dropPipeline(event: CdkDragDrop<Pipeline[]>) {
    moveItemInArray(this.pipelines, event.previousIndex, event.currentIndex);
    // Re-calculate priorities based on visual order
    this.pipelines.forEach((p, index) => {
      p.priority = (index + 1) * 100;
    });

    // Save new order to backend
    this.http.post('/api/pipelines/reorder', this.pipelines).subscribe({
      next: () => this.cdr.detectChanges(),
      error: (err) => console.error("Error reordering pipelines", err)
    });
  }

  togglePipeline(pipeline: Pipeline) {
    const newState = !pipeline.active;
    const payload = { ...pipeline, active: newState };

    this.http.post<any>('/api/pipelines/toggle', payload).subscribe({
      next: (res) => {
         pipeline.active = res.pipeline.active;
         this.cdr.detectChanges();
      },
      error: (err) => {
         console.error("Error toggling pipeline", err);
         // Revert on error
         pipeline.active = !newState;
         this.cdr.detectChanges();
      }
    });
  }

  // --- Exports Methods ---
  addNewExport() {
    const payload = {
      uri: 'file:///tmp/export.jsonlines',
      format: 'jsonlines',
      encoding: 'utf-8',
      active: true
    };

    this.http.post<any>('/api/feeds', payload).subscribe({
      next: (res) => {
        this.exportFeeds = [...this.exportFeeds, res.feed];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error adding feed", err)
    });
  }

  testConnection(feed: ExportFeed) {
    this.http.post<any>('/api/feeds/test', feed).subscribe({
      next: (res) => {
        alert(res.message);
      },
      error: (err) => {
        alert(`Error testing connection: ${err.message}`);
      }
    });
  }
}
