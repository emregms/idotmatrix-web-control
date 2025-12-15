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
        # Convert/Resize and get bytes suitable for device
        # We need to save it to a temp file or pass bytes-like object if PIL supports it (it does)
        import io
        img_bytes = controller.convert_image_to_32x32(io.BytesIO(contents))
        
        # Send to device
        controller.send_image(img_bytes)
        
        return {"status": "uploaded", "size": len(img_bytes)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
