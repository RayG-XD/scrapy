import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSystemStatus();
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
  activeJobsData: ActiveJob[] = [
    { id: 'job-101', spider: 'amazon_products', status: 'Running', duration: '00:15:20', items: 1250, speed: '80/min' },
    { id: 'job-102', spider: 'news_crawler', status: 'Running', duration: '01:05:10', items: 5600, speed: '120/min' },
    { id: 'job-103', spider: 'real_estate', status: 'Paused', duration: '00:45:00', items: 850, speed: '0/min' },
  ];

  // Recent Jobs Table Data
  displayedRecentColumns: string[] = ['status', 'spider', 'startTime', 'endTime', 'totalItems', 'actions'];
  recentJobsData: RecentJob[] = [
    { id: 'job-099', statusIcon: 'check_circle', statusColor: 'text-green-500', spider: 'amazon_products', startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() - 82800000), totalItems: 15000 },
    { id: 'job-098', statusIcon: 'cancel', statusColor: 'text-red-500', spider: 'crypto_prices', startTime: new Date(Date.now() - 172800000), endTime: new Date(Date.now() - 172000000), totalItems: 450 },
    { id: 'job-097', statusIcon: 'check_circle', statusColor: 'text-green-500', spider: 'news_crawler', startTime: new Date(Date.now() - 259200000), endTime: new Date(Date.now() - 250000000), totalItems: 42000 },
  ];

  runSpider() {
    console.log('Run Spider clicked');
  }

  viewLogs() {
    console.log('View Logs clicked');
  }
}
