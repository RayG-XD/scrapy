# Scrapy UI/UX: Data Management & Pipelines

## 1. Overview
The Data Management view handles everything that happens *after* an item is scraped. This includes defining the structure of the data (Items), filtering and processing that data (Item Pipelines), and exporting it to storage (Feed Exports).

## 2. Key Components

### 2.1. Item Schema Builder (The "Items" Tab)
A visual interface for defining Scrapy Items (classes inheriting from `scrapy.Item` or simple dicts if used directly).
- **List View:** Shows all currently defined Items in the project.
- **Visual Builder (Add/Edit Item):**
  - **Item Name:** e.g., `ProductItem`.
  - **Fields Definition:** An interactive, dynamic form.
    - **Add Field:** "Price", "Name", "URL", "Image_URLs".
    - **Field Type (Optional/Metadata):** String, Integer, Array (useful for validation in pipelines, though Scrapy fields are loosely typed by default).
    - **Delete Field:** A trash can icon next to each field row.
- **Code Preview (Optional):** As the user visually builds the schema, a small, read-only code block updates in real-time showing the generated Python class (e.g., `class ProductItem(scrapy.Item): name = scrapy.Field() ...`).

### 2.2. Pipeline Configurator (The "Pipelines" Tab)
A critical feature for managing the flow of data processing.
- **List of Available Pipelines:** Displays all pipelines defined in `settings.py` (e.g., `ImagePipeline`, `DuplicatesPipeline`, `DatabasePipeline`).
- **Drag-and-Drop Ordering:**
  - **Interface:** Use a drag-and-drop list (like Angular CDK DragDrop) to reorder active pipelines. The order dictates the priority integer assigned in `ITEM_PIPELINES`. The top pipeline runs first (lowest integer).
- **Enable/Disable Toggles:** A simple switch next to each pipeline to activate or deactivate it globally.
- **Pipeline Details (Clicking a pipeline):**
  - Shows the integer priority value.
  - Optionally, if the pipeline has specific configurable parameters (e.g., `IMAGES_STORE` for the Image Pipeline), display form fields to override them here.

### 2.3. Feed Exports Manager (The "Exports" Tab)
A centralized hub for configuring where and how scraped data is saved automatically.
- **Global Export Configuration (Overrides `FEEDS` setting):**
  - **List of configured feeds:** e.g., `s3://bucket/run-123.json`, `ftp://user:pass@ftp.example.com/data.csv`.
- **Add New Export Feed Wizard:**
  - **Step 1: Storage Backend:** Dropdown (Local File, S3, FTP, Google Cloud Storage, Standard Output).
  - **Step 2: Format:** Dropdown (JSON, JSONLines, CSV, XML, Pickle).
  - **Step 3: Destination Details:**
    - If S3: Input fields for Bucket Name, Path (e.g., `runs/%(name)s/%(time)s.json`), AWS Access Key, AWS Secret Key.
    - If FTP: Input fields for Host, Port, Username, Password, Path.
    - If Local: Input field for file path.
  - **Step 4: Advanced Options (Optional):**
    - `encoding`: Default `utf-8`.
    - `fields`: Comma-separated list to export only specific fields (e.g., `name,price`).
    - `indent`: Integer for JSON formatting.
  - **Test Connection Button:** Sends a small test payload to the configured destination to verify credentials and permissions before running a massive crawl.
- **Data Browser / Export Viewer:**
  - A simple file browser interface to view and download previously exported files from local storage (if applicable).
  - Integrations with external storage (S3/GCS) are more complex and might simply display a link to the bucket rather than browsing its contents directly.

## 3. Angular Implementation Notes
- **Drag and Drop:** Strongly recommend the `@angular/cdk/drag-drop` module. It is robust, accessible, and handles the list reordering logic elegantly. Update the underlying integer priorities based on the new index in the array after a drop event.
- **Form Wizard:** For the "Add New Export Feed", a multi-step form (like `mat-stepper`) provides a guided, less overwhelming experience than a massive single form, especially when dealing with complex S3/FTP credentials.
- **Dynamic Forms:** The Item Schema Builder relies heavily on Angular's `FormArray` within Reactive Forms to handle an arbitrary number of dynamically added/removed fields.

## 4. Backend Requirements
- API endpoints to read, create, update, and delete Python Item definitions (this implies the backend can parse and modify Python source files or that Items are defined dynamically via a database schema that Scrapy loads at runtime).
- API endpoint to fetch the current `ITEM_PIPELINES` dictionary from `settings.py` and an endpoint to update it (saving the new integer priorities).
- API endpoint to fetch the `FEEDS` dictionary from settings and an endpoint to update it.
- **Crucial:** An endpoint that executes a test write operation to a given feed configuration to power the "Test Connection" button.