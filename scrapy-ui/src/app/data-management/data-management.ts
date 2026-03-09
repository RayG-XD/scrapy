import { Component } from '@angular/core';
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
export class DataManagementComponent {
  // Tab 1: Item Schema Builder
  itemForm: FormGroup;
  definedItems = [
    { name: 'ProductItem', fields: ['url', 'name', 'price', 'image_urls'] },
    { name: 'ReviewItem', fields: ['product_id', 'author', 'rating', 'text', 'date'] }
  ];

  // Tab 2: Pipelines
  pipelines: Pipeline[] = [
    { name: 'DuplicatesPipeline', path: 'myproject.pipelines.DuplicatesPipeline', active: true, priority: 100 },
    { name: 'PriceCalculationPipeline', path: 'myproject.pipelines.PriceCalculationPipeline', active: true, priority: 200 },
    { name: 'ImagePipeline', path: 'scrapy.pipelines.images.ImagesPipeline', active: false, priority: 300 },
    { name: 'DatabasePostgresPipeline', path: 'myproject.pipelines.DatabasePostgresPipeline', active: true, priority: 800 }
  ];

  // Tab 3: Feed Exports
  exportFeeds: ExportFeed[] = [
    { uri: 's3://my-bucket/scrapy-exports/%(name)s/%(time)s.json', format: 'json', encoding: 'utf-8', active: true },
    { uri: 'ftp://user:pass@ftp.example.com/daily-dump.csv', format: 'csv', encoding: 'utf-8', active: false }
  ];

  constructor(private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      fields: this.fb.array([this.createField()])
    });
  }

  // --- Items Form Methods ---
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
      const newFields = formValue.fields.map((f: any) => f.name);
      this.definedItems.push({
        name: formValue.itemName,
        fields: newFields
      });
      // Reset form
      this.itemForm.reset({ itemName: '' });
      this.fields.clear();
      this.addField();
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
  }

  togglePipeline(pipeline: Pipeline) {
    pipeline.active = !pipeline.active;
  }

  // --- Exports Methods ---
  addNewExport() {
    this.exportFeeds.push({
      uri: 'file:///tmp/export.jsonlines',
      format: 'jsonlines',
      encoding: 'utf-8',
      active: true
    });
  }

  testConnection(feed: ExportFeed) {
    alert(`Mock: Sending test payload to ${feed.uri}... Success!`);
  }
}
