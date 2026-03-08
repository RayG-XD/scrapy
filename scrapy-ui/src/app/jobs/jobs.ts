import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, CommonModule, DecimalPipe } from '@angular/common';

export interface JobItem {
  id: string;
  spider: string;
  status: 'Running' | 'Paused' | 'Completed' | 'Failed';
  startedAt: Date;
  endedAt?: Date;
  elapsedTime: string;
  itemsScraped: number;
  itemsPerMin: number;
  errorCount: number;
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss'
})
export class Jobs {
  displayedColumns: string[] = [
    'id',
    'spider',
    'status',
    'startedAt',
    'elapsedTime',
    'itemsScraped',
    'itemsPerMin',
    'errorCount',
    'actions'
  ];

  jobsData: JobItem[] = [
    {
      id: 'job-105',
      spider: 'amazon_products',
      status: 'Running',
      startedAt: new Date(Date.now() - 15 * 60000), // 15 mins ago
      elapsedTime: '00:15:22',
      itemsScraped: 1250,
      itemsPerMin: 81.3,
      errorCount: 2
    },
    {
      id: 'job-104',
      spider: 'news_crawler',
      status: 'Paused',
      startedAt: new Date(Date.now() - 45 * 60000),
      elapsedTime: '00:45:00',
      itemsScraped: 850,
      itemsPerMin: 0,
      errorCount: 0
    },
    {
      id: 'job-103',
      spider: 'crypto_prices',
      status: 'Completed',
      startedAt: new Date(Date.now() - 120 * 60000),
      endedAt: new Date(Date.now() - 110 * 60000),
      elapsedTime: '00:10:00',
      itemsScraped: 450,
      itemsPerMin: 45.0,
      errorCount: 0
    },
    {
      id: 'job-102',
      spider: 'real_estate_scraper',
      status: 'Failed',
      startedAt: new Date(Date.now() - 300 * 60000),
      endedAt: new Date(Date.now() - 295 * 60000),
      elapsedTime: '00:05:12',
      itemsScraped: 12,
      itemsPerMin: 2.3,
      errorCount: 50
    },
    {
      id: 'job-101',
      spider: 'amazon_products',
      status: 'Completed',
      startedAt: new Date(Date.now() - 1440 * 60000),
      endedAt: new Date(Date.now() - 1380 * 60000),
      elapsedTime: '01:00:00',
      itemsScraped: 15000,
      itemsPerMin: 250.0,
      errorCount: 15
    }
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('Filtering jobs for:', filterValue);
  }

  viewDetails(job: JobItem) {
    console.log('Viewing details for job:', job.id);
  }

  pauseJob(job: JobItem) {
    console.log('Pausing job:', job.id);
  }

  resumeJob(job: JobItem) {
    console.log('Resuming job:', job.id);
  }

  stopJob(job: JobItem) {
    console.log('Stopping job:', job.id);
  }
}
