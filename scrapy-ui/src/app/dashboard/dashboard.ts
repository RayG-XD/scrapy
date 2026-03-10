import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OnInit, ChangeDetectorRef } from '@angular/core';

export interface ActiveJob {
  id: string;
  spider: string;
  status: string;
  duration: string;
  items: number;
  speed: string;
}

export interface RecentJob {
  id: string;
  statusIcon: string;
  statusColor: string;
  spider: string;
  startTime: Date;
  endTime: Date;
  totalItems: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  // System Health (Initial placeholders, to be updated by API)
  activeJobsCount = 0;
  itemsScraped24h = '0';
  pagesCrawled24h = '0';
  errorRate = '0%';
  memoryUsage = '0 MB';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchSystemStatus();
    this.fetchActiveJobs();
    this.fetchRecentJobs();
  }

  fetchActiveJobs() {
    this.http.get<ActiveJob[]>('/api/jobs/active').subscribe({
      next: (data) => {
        this.activeJobsData = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch active jobs:', err);
      }
    });
  }

  fetchRecentJobs() {
    this.http.get<any[]>('/api/jobs/recent').subscribe({
      next: (data) => {
        this.recentJobsData = [...data.map(job => ({
          ...job,
          startTime: new Date(job.startTime),
          endTime: new Date(job.endTime)
        }))];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch recent jobs:', err);
      }
    });
  }

  fetchSystemStatus() {
    this.http.get<any>('/api/system-status').subscribe({
      next: (data) => {
        this.activeJobsCount = data.active_jobs;
        this.itemsScraped24h = data.items_scraped.toLocaleString();
        this.pagesCrawled24h = data.pages_crawled.toLocaleString();
        this.errorRate = data.error_rate;
        this.memoryUsage = data.memory_usage;
      },
      error: (err) => {
        console.error('Failed to fetch system status from backend API:', err);
      }
    });
  }

  // Active Jobs Table Data
  displayedActiveColumns: string[] = ['id', 'spider', 'status', 'duration', 'items', 'speed', 'actions'];
  activeJobsData: ActiveJob[] = [];

  // Recent Jobs Table Data
  displayedRecentColumns: string[] = ['status', 'spider', 'startTime', 'endTime', 'totalItems', 'actions'];
  recentJobsData: RecentJob[] = [];

  runSpider() {
    console.log('Run Spider clicked');
  }

  viewLogs() {
    console.log('View Logs clicked');
  }
}
