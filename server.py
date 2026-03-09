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