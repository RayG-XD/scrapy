import re

with open("server.py", "r") as f:
    content = f.read()

new_endpoints = """
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

# --- Static Files / Angular Application Routing ---"""

content = content.replace("# --- Static Files / Angular Application Routing ---", new_endpoints)

with open("server.py", "w") as f:
    f.write(content)
