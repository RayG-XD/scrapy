import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

export interface SpiderItem {
  name: string;
  project: string;
  allowedDomains: string[];
  startUrls: string[];
  lastRunStatus: string;
}

@Component({
  selector: 'app-spiders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './spiders.html',
  styleUrl: './spiders.scss'
})
export class Spiders implements OnInit {
  displayedColumns: string[] = ['name', 'project', 'allowedDomains', 'startUrls', 'lastRunStatus', 'actions'];
  spidersData: SpiderItem[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchSpiders();
  }

  fetchSpiders() {
    this.http.get<SpiderItem[]>('/api/spiders').subscribe({
      next: (data) => {
        this.spidersData = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch spiders:', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // In a real app with MatTableDataSource, we would do:
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log('Filtering for:', filterValue);
  }

  runSpider(spider: SpiderItem) {
    console.log('Running spider:', spider.name);
  }

  editSpider(spider: SpiderItem) {
    console.log('Editing spider:', spider.name);
  }
}
