import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';

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
export class Dashboard {
  // System Health
  activeJobsCount = 3;
  itemsScraped24h = '45,210';
  pagesCrawled24h = '12,050';
  errorRate = '0.5%';
  memoryUsage = '256 MB';

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
