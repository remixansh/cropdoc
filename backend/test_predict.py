import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
import json
from PIL import Image
import io

client = TestClient(app)

def test_api():
    # Create dummy image in memory
    img = Image.new('RGB', (10, 10), color='green')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    data = {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "farm_size": 2.5,
        "language": "en"
    }
    
    files = {
        "file": ("dummy.jpg", img_byte_arr, "image/jpeg")
    }
    
    print("Testing /api/predict via TestClient...")
    response = client.post("/api/predict", data=data, files=files)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    try:
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Failed to decode JSON. Raw response:")
        print(response.text)

if __name__ == "__main__":
    test_api()
