# Scrapy UI/UX: Interactive Shell & Selector Tester

## 1. Overview
The Interactive Shell feature brings the powerful `scrapy shell` command directly into the browser. It allows developers and analysts to test CSS and XPath selectors visually against real, live web pages, making spider development and debugging significantly faster.

## 2. Key Components

### 2.1. URL Fetch & Request Configuration
The entry point for testing.
- **URL Input:** A prominent text field to enter the target URL.
- **Fetch Button:** Sends a request (via the Scrapy backend) to retrieve the page source.
- **Advanced Options (Accordion/Expandable Panel):**
  - **Headers:** Define custom headers for the request (e.g., specific `User-Agent`, `Referer`).
  - **Cookies:** Provide a JSON object or string to send with the request.
  - **Method:** `GET` (default) or `POST` (with an optional data payload).

### 2.2. Split-Pane Layout (The Core UI)
Once a page is successfully fetched, the view splits into two primary panes (Left/Right or Top/Bottom, adjustable by the user).

#### Pane A: Source Explorer (The "Browser" View)
Displays the fetched HTML content.
- **Rendered HTML Tab:** An `iframe` displaying the visual representation of the fetched HTML. This is crucial for understanding context.
- **Source Code Tab:** A Monaco Editor instance (read-only, HTML syntax highlighting) displaying the raw HTML source code returned by the server. This is essential for precise selector targeting.
- **Visual Highlighting:** When a selector is successfully tested in Pane B, the corresponding elements in the Source Code Tab should be highlighted or emphasized.

#### Pane B: Selector Tester & Extraction Preview
The workspace for crafting extraction rules.
- **Selector Input Fields:**
  - **Type Selector:** A dropdown to choose between `CSS`, `XPath`, or `Regex`.
  - **Expression Input:** A text field to enter the actual expression.
- **Real-time Feedback Loop:** As the user types (with a slight debounce, e.g., 300ms), the UI should attempt to evaluate the selector against the fetched source code.
- **Extraction Results Panel:**
  - **Status:** Shows "Valid" or "Invalid Selector" (with error details if applicable).
  - **Count:** Number of elements matching the expression.
  - **Extracted Data (JSON/Array view):** Displays the raw text or attributes extracted by the selector. Useful for verifying `::text` or `@href` targeting.
- **"Save to Spider" Shortcut:** An optional button (if editing spiders is supported) to append the verified selector directly into a specific spider's parse method.

## 3. Angular Implementation Notes
- **Split Pane Component:** Use a library like `angular-split` to allow users to resize the Source Explorer and Selector Tester panes dynamically.
- **Debounce Input:** Utilize RxJS `debounceTime` and `distinctUntilChanged` on the selector input field to prevent overwhelming the client or server with evaluation requests on every keystroke.
- **DOM Evaluation (Client-Side vs. Server-Side):**
  - *Option A (Faster):* The backend returns the raw HTML, and the Angular frontend uses browser APIs (like `document.evaluate` for XPath and `document.querySelectorAll` for CSS) to run the selectors directly in the browser. This is extremely fast but might have subtle differences from Scrapy's `parsel` library.
  - *Option B (More Accurate):* Every keystroke (debounced) sends the selector expression back to the server, where `scrapy.Selector` evaluates it against the cached HTML and returns the exact results Scrapy would produce. This is slower but guarantees fidelity. **Recommendation:** Proceed with Option B for accuracy, perhaps using a WebSocket for lower latency.

## 4. Backend Requirements
- API endpoint to initiate a Scrapy Request to a specific URL (respecting custom headers/cookies) and return the raw Response body, status code, and final URL (handling redirects).
- API endpoint (or WebSocket message) to accept a cached response ID and a selector expression, run it using `parsel`/Scrapy Selectors, and return the extracted data array and element count.