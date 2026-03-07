# Scrapy UI/UX: Dashboard Design Specifications

## 1. Overview
The Dashboard serves as the central command center for the Scrapy web interface. It provides an immediate, high-level snapshot of the crawler's health, active jobs, recent executions, and overall system statistics. It is designed to be highly responsive, updating data in real-time.

## 2. Key Components & Widgets

### 2.1. System Health & Global Stats Summary
A row of metric cards at the top of the dashboard.
- **Active Jobs:** Count of currently running spiders.
- **Items Scraped (24h):** Total items successfully parsed and exported in the last 24 hours.
- **Pages Crawled (24h):** Total HTTP responses processed.
- **Error Rate:** Percentage of non-200 HTTP responses (e.g., 403 Forbidden, 404 Not Found, 500 Server Error) over total requests.
- **Memory/CPU Usage:** High-level indication of resource consumption (if the backend API exposes this).

### 2.2. Quick Action Toolbar
- **"Run Spider" Button:** A prominent call-to-action that opens a modal window to select a spider, input custom arguments, override settings, and trigger a new job.
- **"View Logs" Shortcut:** Quick access to the global logging interface.

### 2.3. Active Jobs Monitoring Widget
A real-time, self-updating data grid displaying currently executing jobs.
- **Columns:**
  - Job ID (Link to detailed Job view)
  - Spider Name
  - Status (Running, Pausing, Paused)
  - Duration (Live counter: HH:MM:SS)
  - Items Scraped (Live counter)
  - Pages/Min (Live speed indicator)
- **Quick Actions (Per row):**
  - Pause Job (Sends pause signal)
  - Cancel Job (Sends stop signal)

### 2.4. Recent Job History
A tabular view of the most recently finished jobs (Successful, Failed, or Canceled).
- **Columns:**
  - Status Icon (Green check for success, Red cross for failure, Orange dash for canceled)
  - Spider Name
  - Start Time & End Time
  - Total Items
  - Logs Link

## 3. Angular Implementation Notes
- **State Management:** Use NgRx to maintain the global state of active jobs. The state should be updated via a WebSocket connection connected to the backend API (e.g., a Scrapyd-compatible layer).
- **UI Components:** Use Angular Material Cards (`mat-card`) for the summary metrics, and Angular Material Data Tables (`mat-table`) for the Active Jobs and Recent History views.
- **Real-time Updates:** Implement RxJS `interval` or WebSocket subscriptions to keep the "Duration", "Items Scraped", and "Pages/Min" metrics updating without full page reloads.

## 4. Backend Requirements
- API endpoint to fetch global scraping statistics.
- API endpoint to list active/pending jobs.
- API endpoint to list recent completed jobs.
- WebSocket stream emitting job status changes and live counters.