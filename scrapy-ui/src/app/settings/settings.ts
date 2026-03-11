import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Middleware {
  path: string;
  priority: number | null;
  enabled: boolean;
  isCustom: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    DragDropModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;

  downloaderMiddlewares: Middleware[] = [];
  spiderMiddlewares: Middleware[] = [];
  isLoading = true;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient) {}

  ngOnInit() {
    this.initForm();
    this.loadSettings();
  }

  initForm() {
    this.settingsForm = this.fb.group({
      core: this.fb.group({
        BOT_NAME: ['', Validators.required],
        USER_AGENT: [''],
        ROBOTSTXT_OBEY: [true]
      }),
      concurrency: this.fb.group({
        CONCURRENT_REQUESTS: [16, [Validators.min(1)]],
        CONCURRENT_REQUESTS_PER_DOMAIN: [8, [Validators.min(1)]],
        CONCURRENT_REQUESTS_PER_IP: [0, [Validators.min(0)]],
        DOWNLOAD_DELAY: [0, [Validators.min(0)]],
        RANDOMIZE_DOWNLOAD_DELAY: [true]
      }),
      autothrottle: this.fb.group({
        AUTOTHROTTLE_ENABLED: [false],
        AUTOTHROTTLE_START_DELAY: [5.0, [Validators.min(0)]],
        AUTOTHROTTLE_MAX_DELAY: [60.0, [Validators.min(0)]],
        AUTOTHROTTLE_TARGET_CONCURRENCY: [1.0, [Validators.min(0)]],
        AUTOTHROTTLE_DEBUG: [false]
      }),
      caching: this.fb.group({
        HTTPCACHE_ENABLED: [false],
        HTTPCACHE_DIR: ['httpcache'],
        HTTPCACHE_EXPIRATION_SECS: [0, [Validators.min(0)]],
        HTTPCACHE_STORAGE: [''],
        HTTPCACHE_POLICY: [''],
        HTTPCACHE_IGNORE_HTTP_CODES: [[]]
      }),
      raw: this.fb.array([])
    });
  }

  loadSettings() {
    this.isLoading = true;
    this.http.get<any>('/api/settings').subscribe({
      next: (data) => {
        // Load Form Values
        if (data.form) {
           this.settingsForm.patchValue({
             core: data.form.core || {},
             concurrency: data.form.concurrency || {},
             autothrottle: data.form.autothrottle || {},
             caching: data.form.caching || {}
           });

           // Clear and load raw settings
           this.rawSettings.clear();
           if (data.form.raw) {
              data.form.raw.forEach((item: any) => {
                 this.addRawSetting(item.key, item.value);
              });
           }
        }

        // Load Middlewares
        if (data.middlewares) {
           this.downloaderMiddlewares = data.middlewares.downloader || [];
           this.spiderMiddlewares = data.middlewares.spider || [];
        }

        this.settingsForm.markAsPristine();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load settings', err);
        this.snackBar.open('Failed to load settings from server', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  get rawSettings(): FormArray {
    return this.settingsForm.get('raw') as FormArray;
  }

  addRawSetting(key: string = '', value: string = '') {
    this.rawSettings.push(this.fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required]
    }));
  }

  removeRawSetting(index: number) {
    this.rawSettings.removeAt(index);
    this.settingsForm.markAsDirty();
  }

  dropDownloaderMiddleware(event: CdkDragDrop<Middleware[]>) {
    moveItemInArray(this.downloaderMiddlewares, event.previousIndex, event.currentIndex);
    this.recalculatePriorities(this.downloaderMiddlewares);
    this.settingsForm.markAsDirty();
  }

  dropSpiderMiddleware(event: CdkDragDrop<Middleware[]>) {
    moveItemInArray(this.spiderMiddlewares, event.previousIndex, event.currentIndex);
    this.recalculatePriorities(this.spiderMiddlewares);
    this.settingsForm.markAsDirty();
  }

  recalculatePriorities(middlewares: Middleware[]) {
    // Basic recalculation: space them out by 10s starting from 100, but only for enabled ones that don't have None
    let currentPriority = 100;
    middlewares.forEach(mw => {
        mw.priority = currentPriority;
        currentPriority += 50;
    });
  }

  toggleMiddleware(middleware: Middleware) {
    middleware.enabled = !middleware.enabled;
    this.settingsForm.markAsDirty();
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      const payload = {
         form: this.settingsForm.value,
         middlewares: {
            downloader: this.downloaderMiddlewares,
            spider: this.spiderMiddlewares
         }
      };

      this.http.post('/api/settings', payload).subscribe({
         next: () => {
            this.snackBar.open('Settings saved successfully', 'Close', { duration: 3000 });
            this.settingsForm.markAsPristine();
         },
         error: (err) => {
            console.error('Failed to save settings', err);
            this.snackBar.open('Failed to save settings', 'Close', { duration: 3000 });
         }
      });
    } else {
      this.snackBar.open('Please correct errors before saving', 'Close', { duration: 3000 });
    }
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}
