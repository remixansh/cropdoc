import httpx
import asyncio
import time

async def main():
    with open("app/api/routes.py", "rb") as f:
        files = {'file': ('routes.py', f, 'text/plain')}
        data = {
            'latitude': '40.7',
            'longitude': '-74.0',
            'farm_size': '2.0',
            'language': 'en'
        }
        print(f"[{time.time()}] Sending request...")
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", "http://127.0.0.1:8000/api/predict", data=data, files=files) as response:
                print(f"[{time.time()}] Response headers received!")
                async for chunk in response.aiter_text():
                    print(f"[{time.time()}] CHUNK: {repr(chunk[:50])}...")

asyncio.run(main())
