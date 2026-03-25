import asyncio
import traceback
from app.services.inference import predict_image
from app.services.weather import get_weather_forecast
from app.services.ai_generator import generate_action_plan_stream

async def test_backend():
    try:
        with open("app/api/routes.py", "rb") as f:
            image_bytes = f.read()

        print("Testing predict_image...")
        crop, disease, confidence = predict_image(image_bytes)
        print(f"Result: {crop}, {disease}, {confidence}")

        print("Testing get_weather_forecast...")
        weather = await get_weather_forecast(40.7, -74.0)
        print(f"Weather: {weather}")

        print("Testing generate_action_plan_stream...")
        async for chunk in generate_action_plan_stream(crop, disease, 2.0, weather, "en"):
            print("CHUNK:", repr(chunk))
            
    except Exception as e:
        print("EXCEPTION CAUGHT:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_backend())
