# Scrapy Web UI/UX Design Document

This document outlines the features, functionalities, and proposed UI/UX architecture for a comprehensive, web-based frontend for the Scrapy framework, built using the latest Angular version.

## 1. Scrapy Features & Functionalities Analyzed

Based on the official Scrapy documentation (`docs/intro/overview.rst`, `docs/index.rst`, `docs/faq.rst`), the following core features must be accessible and manageable via the Web UI:

### Core Concepts
- **Spiders:** Define the rules to crawl websites, including `start_urls`, `allowed_domains`, and parsing logic.
- **Selectors:** Extract data from web pages using CSS selectors, XPath expressions, and regular expressions.
- **Items & Item Loaders:** Define the structured data to scrape and populate it cleanly.
- **Item Pipelines:** Post-process (clean, validate, filter) and store scraped data (e.g., databases).
- **Feed Exports:** Output scraped data in different formats (JSON, JSON Lines, CSV, XML) and storage backends (Local, FTP, Amazon S3).
- **Settings:** Configure Scrapy behavior (e.g., concurrency, download delay, auto-throttling, caching, user-agent spoofing).

### Built-in Services & Debugging
- **Command Line Tool / Execution:** Running spiders (`runspider`, `crawl`), passing arguments.
- **Scrapy Shell:** Interactive environment to test extraction code (CSS/XPath) against live responses.
- **Logging & Stats:** Monitoring crawler execution, collecting statistics about scraping runs, and viewing logs.
- **Telnet Console / Introspection:** Debugging a running crawler.
- **Jobs:** Pausing and resuming large crawls.

### Extending Scrapy
- **Middlewares (Downloader & Spider):** Managing cookies, sessions, proxy handling, custom headers.
- **Extensions & Signals:** Plugging in custom functionality.
- **Contracts:** Testing spiders natively.

---

## 2. Proposed UI/UX Architecture (Angular)

To expose these features intuitively, the Angular application will be structured into several logical modules and views. The UX should focus on real-time monitoring, visual configuration, and ease of debugging.

### 2.1. Global Navigation / Sidebar
A persistent navigation menu providing quick access to all core modules:
- 📊 Dashboard
- 🕷️ Spiders
- ⏱️ Jobs & Runs
- 🧪 Interactive Shell (Selector Tester)
- 📦 Data & Exports
- ⚙️ Global Settings

### 2.2. Views & Screens

#### 1. Dashboard
**Purpose:** High-level overview of the scraping infrastructure.
- **Widgets:**
  - Active jobs currently running.
  - Recent jobs with status (Success, Failed, Canceled).
  - Global statistics (Total items scraped today, error rates, memory usage).
  - Quick action to "Run a Spider".

#### 2. Spiders Management
**Purpose:** View, configure, and manage spider definitions.
- **List View:** Table of available spiders with their associated project, default domains, and last run status.
- **Spider Detail View:**
  - **Code Editor Component:** Integrate a code editor (like Monaco Editor) to view/edit spider code directly.
  - **Configuration Tab:** Form to override specific settings for this spider (e.g., custom `DOWNLOAD_DELAY`, custom headers).
  - **Run Button:** Triggers a modal to input custom spider arguments and start a job.

#### 3. Jobs & Runs Monitoring
**Purpose:** Real-time monitoring of active and historical spider runs.
- **Live Job Details:**
  - **Status:** Running, Paused, Finished. Action buttons to Pause/Resume/Cancel jobs (utilizing Scrapy's jobs feature).
  - **Live Terminal/Logs:** A streaming log viewer (using WebSockets) showing `DEBUG`, `INFO`, `ERROR` logs.
  - **Live Stats:** Real-time counters for Items Scraped, Pages Crawled, 404/500 HTTP errors.

#### 4. Interactive Shell (Visual Selector Tester)
**Purpose:** Bring the power of `scrapy shell` to the browser.
- **UX:**
  - Input field for a URL -> "Fetch" button.
  - Split View:
    - **Left pane:** Rendered HTML / Source Code view of the fetched page.
    - **Right pane:** Input fields for CSS or XPath selectors.
  - **Real-time Feedback:** As the user types an XPath/CSS query, highlight the matching elements in the DOM view and display the extracted text/JSON array below.

#### 5. Items, Pipelines & Exports
**Purpose:** Visual management of data structuring and delivery.
- **Item Definitions:** Visual builder to define item schemas (fields).
- **Pipeline Configurator:** Drag-and-drop interface to order Item Pipelines and toggle them on/off.
- **Feed Exports Manager:**
  - Form to define export endpoints (e.g., Set up S3 Bucket credentials, choose JSON/CSV format).
  - View scraped datasets directly in a data grid/table format.

#### 6. Settings & Middleware
**Purpose:** Global configuration management.
- **Categorized Forms:** Group settings logically (e.g., Concurrency, AutoThrottle, Proxies, User-Agents).
- **Middleware Manager:** List active Downloader and Spider middlewares with their respective integer priorities. Allow toggling standard middlewares (e.g., `HttpProxyMiddleware`, `OffsiteMiddleware`).

#### 7. Future Roadmap & Advanced Features
**Purpose:** Moving from basic CRUD to an enterprise-grade Command Center.
- **Advanced Orchestration:** Distributed crawling (Scrapyd), Playwright orchestration, and Node Topology.
- **Resilience & Anti-Ban:** Proxy Rotation health, AI-powered auto-healing selectors, and Ban Analytics.
- **Data Quality:** Spidermon observability, visual item validation, and drop rate alerts.
- **Visual Builder:** A no-code/low-code node-based canvas to construct spiders visually.
- **See `07_FUTURE_ROADMAP.md` for a comprehensive breakdown of these planned capabilities.**

---

## 3. Technology Stack & Integration

- **Frontend:** Angular 16+
- **Styling:** Tailwind CSS or Angular Material for clean, responsive UI components.
- **State Management:** NgRx or standard Angular Services with RxJS for real-time state updates (critical for live job monitoring).
- **Code/Log Editor:** Monaco Editor integration for Python syntax highlighting and log tailing.
- **Backend Integration:** The Angular frontend will communicate with Scrapy via a backend API layer (e.g., Scrapyd API, or a custom FastAPI/Flask wrapper around the Scrapy crawler engine) using REST for CRUD operations and WebSockets for real-time logs and stats.
