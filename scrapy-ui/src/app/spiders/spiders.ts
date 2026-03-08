import { Component } from '@angular/core';
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
export class Spiders {
  displayedColumns: string[] = ['name', 'project', 'allowedDomains', 'startUrls', 'lastRunStatus', 'actions'];

  spidersData: SpiderItem[] = [
    {
      name: 'amazon_products',
      project: 'default',
      allowedDomains: ['amazon.com', 'amazon.co.uk'],
      startUrls: ['https://www.amazon.com/s?k=laptops'],
      lastRunStatus: 'Success'
    },
    {
      name: 'news_crawler',
      project: 'default',
      allowedDomains: ['cnn.com', 'bbc.com', 'reuters.com'],
      startUrls: ['https://cnn.com', 'https://bbc.com/news'],
      lastRunStatus: 'Running'
    },
    {
      name: 'crypto_prices',
      project: 'finance',
      allowedDomains: ['coinmarketcap.com'],
      startUrls: ['https://coinmarketcap.com/all/views/all/'],
      lastRunStatus: 'Failed'
    },
    {
      name: 'real_estate_scraper',
      project: 'housing',
      allowedDomains: ['zillow.com', 'redfin.com'],
      startUrls: ['https://www.zillow.com/homes/for_sale/'],
      lastRunStatus: 'Success'
    }
  ];

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
