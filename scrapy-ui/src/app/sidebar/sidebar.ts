import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  navItems = [
    { name: 'Dashboard', route: '/', icon: 'dashboard' },
    { name: 'Spiders', route: '/spiders', icon: 'bug_report' },
    { name: 'Jobs', route: '/jobs', icon: 'schedule' },
    { name: 'Interactive Shell', route: '/interactive-shell', icon: 'terminal' },
    { name: 'Data & Exports', route: '/data', icon: 'dataset' },
    { name: 'Settings', route: '/settings', icon: 'settings' },
  ];
}