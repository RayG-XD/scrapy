import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  downloaderMiddlewares: Middleware[] = [
    { path: 'scrapy.downloadermiddlewares.robotstxt.RobotsTxtMiddleware', priority: 100, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.httpauth.HttpAuthMiddleware', priority: 300, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.downloadtimeout.DownloadTimeoutMiddleware', priority: 350, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.defaultheaders.DefaultHeadersMiddleware', priority: 400, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware', priority: 500, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.retry.RetryMiddleware', priority: 550, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.redirect.MetaRefreshMiddleware', priority: 580, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware', priority: 590, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.redirect.RedirectMiddleware', priority: 600, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.cookies.CookiesMiddleware', priority: 700, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware', priority: 750, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.stats.DownloaderStats', priority: 850, enabled: true, isCustom: false },
    { path: 'scrapy.downloadermiddlewares.httpcache.HttpCacheMiddleware', priority: 900, enabled: true, isCustom: false }
  ];

  spiderMiddlewares: Middleware[] = [
    { path: 'scrapy.spidermiddlewares.httperror.HttpErrorMiddleware', priority: 50, enabled: true, isCustom: false },
    { path: 'scrapy.spidermiddlewares.offsite.OffsiteMiddleware', priority: 500, enabled: true, isCustom: false },
    { path: 'scrapy.spidermiddlewares.referer.RefererMiddleware', priority: 700, enabled: true, isCustom: false },
    { path: 'scrapy.spidermiddlewares.urllength.UrlLengthMiddleware', priority: 800, enabled: true, isCustom: false },
    { path: 'scrapy.spidermiddlewares.depth.DepthMiddleware', priority: 900, enabled: true, isCustom: false }
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.settingsForm = this.fb.group({
      core: this.fb.group({
        BOT_NAME: ['myproject', Validators.required],
        USER_AGENT: ['Scrapy/2.11 (+http://scrapy.org)'],
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
        HTTPCACHE_STORAGE: ['scrapy.extensions.httpcache.FilesystemCacheStorage'],
        HTTPCACHE_POLICY: ['scrapy.extensions.httpcache.DummyPolicy'],
        HTTPCACHE_IGNORE_HTTP_CODES: [[]]
      }),
      raw: this.fb.array([])
    });

    // Add a couple of initial custom settings for demo
    this.addRawSetting('LOG_LEVEL', 'INFO');
    this.addRawSetting('COOKIES_ENABLED', 'True');
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
      console.log('Settings Saved!', this.settingsForm.value);
      this.snackBar.open('Settings saved successfully', 'Close', { duration: 3000 });
      this.settingsForm.markAsPristine();
    } else {
      this.snackBar.open('Please correct errors before saving', 'Close', { duration: 3000 });
    }
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}
