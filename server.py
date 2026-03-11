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

from pydantic import BaseModel
import httpx
from scrapy import Selector

class FetchRequest(BaseModel):
    url: str

class EvaluateRequest(BaseModel):
    source: str
    expression: str
    type: str

@app.post("/api/shell/fetch")
async def fetch_url(req: FetchRequest):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(req.url, follow_redirects=True)
            return {"source": response.text}
        except Exception as e:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/shell/evaluate")
async def evaluate_selector(req: EvaluateRequest):
    try:
        sel = Selector(text=req.source)
        results = []
        if req.type == "css":
            results = sel.css(req.expression).getall()
        elif req.type == "xpath":
            results = sel.xpath(req.expression).getall()
        elif req.type == "regex":
            results = sel.re(req.expression)
        else:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=400, content={"error": f"Invalid selector type: {req.type}"})

        return {
            "valid": True,
            "count": len(results),
            "data": results
        }
    except Exception as e:
        return {
            "valid": False,
            "count": 0,
            "data": [],
            "error": str(e)
        }


# --- Data Management Endpoints ---

class ItemSchema(BaseModel):
    name: str
    fields: list[str]

class PipelineSchema(BaseModel):
    name: str
    path: str
    active: bool
    priority: int

class FeedSchema(BaseModel):
    uri: str
    format: str
    encoding: str
    active: bool

# --- Settings Endpoints ---

mock_settings = {
    "core": {
        "BOT_NAME": "myproject_api",
        "USER_AGENT": "Scrapy/2.14 (+http://scrapy.org)",
        "ROBOTSTXT_OBEY": True
    },
    "concurrency": {
        "CONCURRENT_REQUESTS": 32,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 16,
        "CONCURRENT_REQUESTS_PER_IP": 0,
        "DOWNLOAD_DELAY": 0.5,
        "RANDOMIZE_DOWNLOAD_DELAY": True
    },
    "autothrottle": {
        "AUTOTHROTTLE_ENABLED": True,
        "AUTOTHROTTLE_START_DELAY": 5.0,
        "AUTOTHROTTLE_MAX_DELAY": 60.0,
        "AUTOTHROTTLE_TARGET_CONCURRENCY": 2.0,
        "AUTOTHROTTLE_DEBUG": False
    },
    "caching": {
        "HTTPCACHE_ENABLED": False,
        "HTTPCACHE_DIR": "httpcache",
        "HTTPCACHE_EXPIRATION_SECS": 86400,
        "HTTPCACHE_STORAGE": "scrapy.extensions.httpcache.FilesystemCacheStorage",
        "HTTPCACHE_POLICY": "scrapy.extensions.httpcache.DummyPolicy"
    },
    "raw": [
        {"key": "LOG_LEVEL", "value": "DEBUG"},
        {"key": "COOKIES_ENABLED", "value": "False"}
    ]
}

mock_downloader_middlewares = [
    {"path": "scrapy.downloadermiddlewares.robotstxt.RobotsTxtMiddleware", "priority": 100, "enabled": True, "isCustom": False},
    {"path": "myproject.middlewares.CustomAuthMiddleware", "priority": 200, "enabled": True, "isCustom": True},
    {"path": "scrapy.downloadermiddlewares.httpauth.HttpAuthMiddleware", "priority": 300, "enabled": False, "isCustom": False},
    {"path": "scrapy.downloadermiddlewares.downloadtimeout.DownloadTimeoutMiddleware", "priority": 350, "enabled": True, "isCustom": False},
    {"path": "scrapy.downloadermiddlewares.defaultheaders.DefaultHeadersMiddleware", "priority": 400, "enabled": True, "isCustom": False},
    {"path": "scrapy.downloadermiddlewares.useragent.UserAgentMiddleware", "priority": 500, "enabled": True, "isCustom": False},
]

mock_spider_middlewares = [
    {"path": "scrapy.spidermiddlewares.httperror.HttpErrorMiddleware", "priority": 50, "enabled": True, "isCustom": False},
    {"path": "scrapy.spidermiddlewares.offsite.OffsiteMiddleware", "priority": 500, "enabled": True, "isCustom": False},
    {"path": "scrapy.spidermiddlewares.referer.RefererMiddleware", "priority": 700, "enabled": True, "isCustom": False},
    {"path": "scrapy.spidermiddlewares.urllength.UrlLengthMiddleware", "priority": 800, "enabled": True, "isCustom": False},
    {"path": "scrapy.spidermiddlewares.depth.DepthMiddleware", "priority": 900, "enabled": True, "isCustom": False}
]

@app.get("/api/settings")
async def get_settings():
    return {
        "form": mock_settings,
        "middlewares": {
            "downloader": mock_downloader_middlewares,
            "spider": mock_spider_middlewares
        }
    }

class SaveSettingsRequest(BaseModel):
    form: dict
    middlewares: dict

@app.post("/api/settings")
async def save_settings(req: SaveSettingsRequest):
    global mock_settings
    global mock_downloader_middlewares
    global mock_spider_middlewares

    mock_settings = req.form
    mock_downloader_middlewares = req.middlewares.get("downloader", [])
    mock_spider_middlewares = req.middlewares.get("spider", [])

    return {"message": "Settings saved successfully", "status": "success"}


# In-memory mock databases
mock_items = [
    {"name": "ProductItem", "fields": ["url", "name", "price", "image_urls"]},
    {"name": "ReviewItem", "fields": ["product_id", "author", "rating", "text", "date"]}
]

mock_pipelines = [
    {"name": "DuplicatesPipeline", "path": "myproject.pipelines.DuplicatesPipeline", "active": True, "priority": 100},
    {"name": "PriceCalculationPipeline", "path": "myproject.pipelines.PriceCalculationPipeline", "active": True, "priority": 200},
    {"name": "ImagePipeline", "path": "scrapy.pipelines.images.ImagesPipeline", "active": False, "priority": 300},
    {"name": "DatabasePostgresPipeline", "path": "myproject.pipelines.DatabasePostgresPipeline", "active": True, "priority": 800}
]

mock_feeds = [
    {"uri": "s3://my-bucket/scrapy-exports/%(name)s/%(time)s.json", "format": "json", "encoding": "utf-8", "active": True},
    {"uri": "ftp://user:pass@ftp.example.com/daily-dump.csv", "format": "csv", "encoding": "utf-8", "active": False}
]

@app.get("/api/items")
async def get_items():
    return mock_items

@app.post("/api/items")
async def create_item(item: ItemSchema):
    new_item = item.dict()
    mock_items.append(new_item)
    return {"message": "Item created successfully", "item": new_item}

@app.get("/api/pipelines")
async def get_pipelines():
    return mock_pipelines

@app.post("/api/pipelines/toggle")
async def toggle_pipeline(pipeline: PipelineSchema):
    for p in mock_pipelines:
        if p["name"] == pipeline.name:
            p["active"] = pipeline.active
            return {"message": "Pipeline toggled successfully", "pipeline": p}
    from fastapi.responses import JSONResponse
    return JSONResponse(status_code=404, content={"error": "Pipeline not found"})

@app.post("/api/pipelines/reorder")
async def reorder_pipelines(pipelines: list[PipelineSchema]):
    global mock_pipelines
    mock_pipelines = [p.dict() for p in pipelines]
    return {"message": "Pipelines reordered successfully"}

@app.get("/api/feeds")
async def get_feeds():
    return mock_feeds

@app.post("/api/feeds/test")
async def test_feed_connection(feed: FeedSchema):
    # Mocking a successful test connection for all feeds
    return {"message": f"Connection to {feed.uri} successful!", "success": True}

@app.post("/api/feeds")
async def create_feed(feed: FeedSchema):
    new_feed = feed.dict()
    mock_feeds.append(new_feed)
    return {"message": "Export feed created successfully", "feed": new_feed}

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
            from fastapi.responses import JSONResponse
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