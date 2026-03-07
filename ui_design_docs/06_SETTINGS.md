# Scrapy UI/UX: Settings & Configuration

## 1. Overview
The Settings view is the control panel for the entire Scrapy project. It provides a user-friendly interface to view and modify the global `settings.py` file, abstracting away the need to manually edit Python dictionaries for common configurations.

## 2. Key Components

### 2.1. Categorized Settings Forms (The "General" Tab)
A long, scrollable form divided into logical, collapsible sections (e.g., using `mat-accordion`).
- **Core Settings:**
  - **Bot Name:** String input.
  - **User Agent:** Text input (e.g., `Scrapy/2.11 (+http://scrapy.org)`).
  - **Robots.txt:** Toggle switch (Obey or Ignore).
- **Concurrency & Delay:**
  - **Concurrent Requests:** Integer slider or input (Global max).
  - **Concurrent Requests Per Domain/IP:** Integer inputs.
  - **Download Delay:** Number input (seconds between requests to same domain).
  - **Randomize Download Delay:** Toggle switch.
- **AutoThrottle Extension:**
  - **Enable:** Toggle switch.
  - **Initial/Max Delay:** Number inputs.
  - **Target Concurrency:** Number input (average number of requests Scrapy should be sending in parallel to remote websites).
  - **Debug Toggles:** Checkboxes to log AutoThrottle actions.
- **HTTP Caching (Middleware):**
  - **Enable:** Toggle switch.
  - **Cache Dir/Storage/Policy:** Dropdowns or text inputs.
  - **Expiration Secs:** Number input.

### 2.2. Middleware Manager (The "Middlewares" Tab)
A dedicated interface for managing both Downloader and Spider Middlewares.
- **Two separate lists:** One for `DOWNLOADER_MIDDLEWARES` and one for `SPIDER_MIDDLEWARES`.
- **Drag-and-Drop Ordering (Priority):**
  - Similar to the Item Pipelines view, use drag-and-drop to reorder middlewares. The position dictates the integer priority (lower number = closer to the engine/earlier execution).
- **Enable/Disable Toggles:** A switch next to each middleware to quickly turn it on or off (sets the priority to `None` or its default value in `settings.py`).
- **Standard Middlewares List:** Pre-populate the list with Scrapy's built-in middlewares (e.g., `HttpProxyMiddleware`, `UserAgentMiddleware`, `RetryMiddleware`) even if they aren't explicitly in the user's `settings.py`, allowing them to be easily enabled and configured.

### 2.3. Advanced / Custom Settings (The "Raw" Tab)
For settings not covered by the UI forms.
- **Key-Value Editor:** A dynamic list of key-value pairs representing any custom settings defined in the project.
- **Add New Setting:** Button to add a new string, integer, boolean, list, or dict setting to the global configuration.
- **Code Editor Fallback:** An option to open the raw `settings.py` file in a Monaco Editor instance for manual overrides.

## 3. Angular Implementation Notes
- **Form Controls:** Use `mat-slide-toggle` for booleans, `mat-slider` or `<input type="number">` for integers/floats, and standard `mat-form-field` for strings.
- **Reactive Forms:** Group the categorized settings into `FormGroups` to manage validation and submission state effectively.
- **Save State:** A floating "Save Settings" FAB (Floating Action Button) or a sticky header that appears when changes are detected (`form.dirty`).

## 4. Backend Requirements
- API endpoint to parse the `settings.py` file (or a configuration database) and return it as a JSON object structured by category.
- API endpoint to accept a modified JSON object and safely rewrite the `settings.py` file (or update the database). This requires careful handling of Python syntax (e.g., ensuring strings are quoted, booleans are `True/False`, and dictionaries are formatted correctly).
- API endpoint to list all available (built-in and custom) middlewares and their current priorities.