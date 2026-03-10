from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Scrapy UI API")

# Setup CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- API Routes ---

@app.get("/api/system-status")
async def get_system_status():
    """Mock endpoint returning system statistics."""
    return {
        "active_jobs": 3,
        "items_scraped": 45210,
        "pages_crawled": 12050,
        "error_rate": "0.5%",
        "memory_usage": "256 MB"
    }


@app.get("/api/jobs/active")
async def get_active_jobs():
    return [
        {"id": "job-101", "spider": "amazon_products", "status": "Running", "duration": "00:15:20", "items": 1250, "speed": "80/min"},
        {"id": "job-102", "spider": "news_crawler", "status": "Running", "duration": "01:05:10", "items": 5600, "speed": "120/min"},
        {"id": "job-103", "spider": "real_estate", "status": "Paused", "duration": "00:45:00", "items": 850, "speed": "0/min"},
    ]

@app.get("/api/jobs/recent")
async def get_recent_jobs():
    return [
        {"id": "job-099", "statusIcon": "check_circle", "statusColor": "text-green-500", "spider": "amazon_products", "startTime": "2023-10-25T10:00:00Z", "endTime": "2023-10-25T11:00:00Z", "totalItems": 15000},
        {"id": "job-098", "statusIcon": "cancel", "statusColor": "text-red-500", "spider": "crypto_prices", "startTime": "2023-10-24T09:00:00Z", "endTime": "2023-10-24T09:15:00Z", "totalItems": 450},
        {"id": "job-097", "statusIcon": "check_circle", "statusColor": "text-green-500", "spider": "news_crawler", "startTime": "2023-10-23T08:00:00Z", "endTime": "2023-10-23T10:30:00Z", "totalItems": 42000},
    ]


@app.get("/api/spiders")
async def get_spiders():
    return [
        {
          "name": "amazon_products",
          "project": "default",
          "allowedDomains": ["amazon.com", "amazon.co.uk"],
          "startUrls": ["https://www.amazon.com/s?k=laptops"],
          "lastRunStatus": "Success"
        },
        {
          "name": "news_crawler",
          "project": "default",
          "allowedDomains": ["cnn.com", "bbc.com", "reuters.com"],
          "startUrls": ["https://cnn.com", "https://bbc.com/news"],
          "lastRunStatus": "Running"
        },
        {
          "name": "crypto_prices",
          "project": "finance",
          "allowedDomains": ["coinmarketcap.com"],
          "startUrls": ["https://coinmarketcap.com/all/views/all/"],
          "lastRunStatus": "Failed"
        },
        {
          "name": "real_estate_scraper",
          "project": "housing",
          "allowedDomains": ["zillow.com", "redfin.com"],
          "startUrls": ["https://www.zillow.com/homes/for_sale/"],
          "lastRunStatus": "Success"
        }
    ]


@app.get("/api/jobs")
async def get_all_jobs():
    return [
        {
          "id": "job-105",
          "spider": "amazon_products",
          "status": "Running",
          "startedAt": "2023-10-25T11:45:00Z",
          "elapsedTime": "00:15:22",
          "itemsScraped": 1250,
          "itemsPerMin": 81.3,
          "errorCount": 2
        },
        {
          "id": "job-104",
          "spider": "news_crawler",
          "status": "Paused",
          "startedAt": "2023-10-25T11:15:00Z",
          "elapsedTime": "00:45:00",
          "itemsScraped": 850,
          "itemsPerMin": 0,
          "errorCount": 0
        },
        {
          "id": "job-103",
          "spider": "crypto_prices",
          "status": "Completed",
          "startedAt": "2023-10-25T10:00:00Z",
          "endedAt": "2023-10-25T10:10:00Z",
          "elapsedTime": "00:10:00",
          "itemsScraped": 450,
          "itemsPerMin": 45.0,
          "errorCount": 0
        },
        {
          "id": "job-102",
          "spider": "real_estate_scraper",
          "status": "Failed",
          "startedAt": "2023-10-25T07:00:00Z",
          "endedAt": "2023-10-25T07:05:12Z",
          "elapsedTime": "00:05:12",
          "itemsScraped": 12,
          "itemsPerMin": 2.3,
          "errorCount": 50
        },
        {
          "id": "job-101",
          "spider": "amazon_products",
          "status": "Completed",
          "startedAt": "2023-10-24T12:00:00Z",
          "endedAt": "2023-10-24T13:00:00Z",
          "elapsedTime": "01:00:00",
          "itemsScraped": 15000,
          "itemsPerMin": 250.0,
          "errorCount": 15
        }
    ]

# --- Static Files / Angular Application Routing ---

# Path to the compiled Angular build output
angular_dist_path = os.path.join(os.path.dirname(__file__), "scrapy-ui", "dist", "scrapy-ui", "browser")

if os.path.exists(angular_dist_path):
    # Mount the static files (JS, CSS, Images, etc.)
    app.mount("/static", StaticFiles(directory=angular_dist_path), name="static")

    # Catch-all route to serve the Angular index.html for client-side routing
    @app.get("/{full_path:path}", response_class=HTMLResponse)
    async def serve_angular(request: Request, full_path: str):
        # Ignore API routes
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"message": "API route not found"})

        # Check if the requested file exists in the static directory (e.g. styles.css)
        potential_static_file = os.path.join(angular_dist_path, full_path)
        if os.path.isfile(potential_static_file):
            # We must await get_response since it returns an ASGI coroutine
            static_files = StaticFiles(directory=angular_dist_path)
            return await static_files.get_response(full_path, request.scope)

        # Fallback to index.html for Angular router to handle
        index_file = os.path.join(angular_dist_path, "index.html")
        with open(index_file, "r") as f:
            return HTMLResponse(content=f.read())
else:
    print(f"Warning: Angular dist directory not found at {angular_dist_path}. Run 'ng build' first.")
    @app.get("/")
    def no_frontend():
        return {"message": "Frontend not built. API is running."}

if __name__ == "__main__":
    import uvicorn
    # Run the server
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)