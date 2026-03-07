# Scrapy UI/UX: Jobs Monitoring & Logs

## 1. Overview
The Jobs Monitoring view provides detailed, real-time oversight of individual scraping jobs. It is essential for tracking progress, diagnosing errors, and managing execution states.

## 2. Key Components

### 2.1. Jobs Overview Table
A comprehensive table displaying all jobs across all spiders.
- **Filters:** By Status (Running, Paused, Completed, Failed), by Spider Name, and by Date Range.
- **Columns:**
  - Job ID
  - Spider
  - Status Indicator
  - Started / Ended timestamps
  - Elapsed Time
  - Items Scraped
  - Items / Min
  - Error Count (Non-200 responses)
  - Action Buttons (View Details, Download Items, Download Logs)

### 2.2. Live Job Details View
Clicking a Job ID opens a dedicated, real-time dashboard for that specific run.

#### 2.2.1. Header & Controls
- **Job ID & Status Badge**
- **Action Buttons:**
  - Pause / Resume
  - Cancel / Stop Job
- **Key Metrics (Real-time updates):**
  - Items Scraped
  - Pages Crawled
  - Memory Usage (if available)

#### 2.2.2. Live Terminal / Log Viewer (The Core Feature)
A terminal-like window displaying the live output of the Scrapy job.
- **Implementation:** Use a WebSocket connection to stream logs from the backend. The UI should use a virtualization library (like `ngx-virtual-scroller` or Monaco Editor in read-only mode) to handle thousands of lines without performance degradation.
- **Features:**
  - Auto-scroll to bottom (Toggleable).
  - Search/Filter within logs.
  - Highlight errors (Red), warnings (Yellow), and specific Scrapy log levels.
  - "Download Full Log" button.

#### 2.2.3. Statistics Breakdown (The "Stats" Tab)
A detailed breakdown of the Scrapy `stats` dictionary.
- **Visualizations:**
  - A line chart showing Items Scraped over time.
  - A pie chart showing HTTP response codes (e.g., 200 vs 403 vs 404).
- **Raw Data Table:** Display the raw key-value pairs from the Scrapy stats collector (e.g., `downloader/request_count`, `scheduler/enqueued`, `item_scraped_count`).

#### 2.2.4. Items Preview (The "Data" Tab)
A preview of the structured data being extracted.
- A table showing the first 50-100 items yielded by the spider.
- Useful for quick visual verification that the XPath/CSS selectors are working correctly during a live run.

## 3. Angular Implementation Notes
- **WebSocket Integration:** Use RxJS `webSocket` to establish a connection. Create a service that manages the connection lifecycle and emits log lines to the terminal component.
- **Charts:** Use a library like `Chart.js` (via `ng2-charts`) or Apache ECharts for the live visualizations in the Stats tab.
- **Log Virtualization:** Crucial for performance. Rendering every log line as a DOM element will crash the browser on long crawls. Use a virtual scrolling technique.

## 4. Backend Requirements
- API endpoint to list all jobs with their current status and summary stats.
- API endpoint to fetch detailed stats for a specific job.
- API endpoint to fetch the first N items of a job for preview.
- WebSocket server that tails the Scrapy log file for a specific job and broadcasts new lines to connected clients.
- API endpoints to handle Pause, Resume, and Cancel commands (interacting with Scrapy's engine or Scrapyd).