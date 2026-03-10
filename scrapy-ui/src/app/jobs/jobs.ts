import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
export class Jobs implements OnInit {
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

  jobsData: JobItem[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.http.get<any[]>('/api/jobs').subscribe({
      next: (data) => {
        this.jobsData = data.map(job => ({
          ...job,
          startedAt: new Date(job.startedAt),
          endedAt: job.endedAt ? new Date(job.endedAt) : undefined
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch jobs:', err);
      }
    });
  }

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
