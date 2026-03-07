# Scrapy UI/UX: Spiders Management

## 1. Overview
The Spiders Management view allows users to browse all available Scrapy spiders in their projects, inspect their code, configure per-spider overrides, and launch them with custom arguments.

## 2. Key Components

### 2.1. Spider Directory (List View)
A searchable, filterable, and paginated table listing all deployed spiders.
- **Columns:**
  - **Spider Name:** Extracted from the `name` attribute of the spider class.
  - **Allowed Domains:** Extracted from the `allowed_domains` attribute.
  - **Start URLs:** Quick preview of the starting points.
  - **Status/Last Run:** Quick indicator of the spider's latest job (Success, Failed, Currently Running).
- **Search Bar:** Real-time filtering by spider name or domain.
- **Actions (Per Row):**
  - "Run Spider" Button.
  - "Edit/View Details" Button (Navigates to the Spider Detail View).

### 2.2. Spider Detail View
A split-pane or tabbed interface dedicated to a specific spider.

#### Tab A: Code Editor (Read-Only or Editable)
- **Monaco Editor Integration:** Embed the Monaco Editor component (the core of VS Code) configured for Python syntax highlighting.
- **Content:** Display the `spider.py` file contents.
- **Functionality:**
  - If editing is supported by the backend, provide a "Save Changes" button.
  - "Test Code" Button: Sends a request to the backend to run a quick syntax check or a dry run (`scrapy check`).

#### Tab B: Configuration Overrides
A form to override default Scrapy settings specifically for this spider (these override `settings.py`).
- **Input Fields:**
  - `CONCURRENT_REQUESTS_PER_DOMAIN`
  - `DOWNLOAD_DELAY`
  - `USER_AGENT`
  - Checkboxes for standard Middlewares (e.g., Enable HttpProxyMiddleware).
- **Functionality:** Save these overrides to a database or a configuration file linked to the spider.

#### Tab C: Run Trigger Modal
When a user clicks "Run Spider" from either view, open a modal window.
- **Spider Arguments:**
  - Dynamic key-value pair input fields to pass arguments to the spider's `__init__` method (e.g., `-a category=electronics`).
- **Feed Exports:**
  - Override the export format for this run (e.g., Output to `JSON Lines` on `S3://my-bucket/run-123.jsonl`).
- **Start Job Button:** Sends the execution command to the backend.

## 3. Angular Implementation Notes
- Use `@angular/forms` (Reactive Forms) for the Configuration Overrides and Run Trigger Modal to handle validation (e.g., ensuring `DOWNLOAD_DELAY` is a valid number).
- Implement an `ngx-monaco-editor` wrapper for displaying the spider code.
- Route parameters should dictate which spider is currently being viewed (e.g., `/spiders/:spider_name`).

## 4. Backend Requirements
- API endpoint to list all available spiders (`scrapy list`).
- API endpoint to retrieve the source code of a specific spider.
- API endpoint to save configuration overrides for a spider.
- API endpoint to schedule a new spider job with arguments and setting overrides (`scrapyd schedule.json`).