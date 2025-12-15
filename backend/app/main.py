from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.utils.idotmatrix import controller
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "service": "iDotMatrix Controller"}

@app.get("/scan")
def scan_devices():
    try:
        devices = controller.scan_devices()
        return {"devices": devices}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/connect")
def connect_device(data: dict):
    address = data.get("address")
    if not address:
        raise HTTPException(status_code=400, detail="Address is required")
    try:
        success = controller.connect(address)
        return {"status": "connected", "success": success}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/disconnect")
def disconnect_device():
    try:
        controller.disconnect()
        return {"status": "disconnected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fetch-url")
def fetch_url_and_send(data: dict):
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    try:
        import requests
        import io
        
        # Fake user agent to avoid some blockings
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        content = response.content
        img_bytes = controller.convert_image_to_32x32(io.BytesIO(content))
        controller.send_image(img_bytes)
        
        return {"status": "uploaded_from_url"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch or process URL: {str(e)}")

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        import io
        img_bytes = controller.convert_image_to_32x32(io.BytesIO(contents))
        controller.send_image(img_bytes)
        return {"status": "uploaded", "size": len(img_bytes)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- New Modules ---

from duckduckgo_search import DDGS

@app.get("/search")
async def search_images(q: str):
    """
    Search for images using DuckDuckGo (no API key required).
    """
    results = []
    try:
        search_query = f"{q} pixel art"
        with DDGS() as ddgs:
            # Get up to 20 results
            ddgs_images = list(ddgs.images(
                search_query, 
                max_results=20,
                type_image="gif"
            ))
            for img in ddgs_images:
                results.append({
                    "title": img.get("title", ""),
                    "url": img.get("image", ""),
                    "thumbnail": img.get("thumbnail", "")
                })
    except Exception as e:
        print(f"Search error: {e}")
        return []
    return results

@app.post("/text")
def send_text(data: dict):
    from app.utils.text_gen import create_scrolling_text_gif
    
    text = data.get("text")
    color_hex = data.get("color", "#FFFFFF")
    
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
        
    # Convert Hex to RGB
    color_hex = color_hex.lstrip('#')
    rgb = tuple(int(color_hex[i:i+2], 16) for i in (0, 2, 4))
    
    try:
        gif_bytes = create_scrolling_text_gif(text, rgb)
        controller.send_image(gif_bytes)
        return {"status": "text_sent"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sync-time")
def sync_device_time():
    try:
        controller.sync_time()
        return {"status": "time_synced"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
