from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import StreamingResponse
import json
from app.services.inference import predict_image
from app.services.weather import get_weather_forecast
from app.services.ai_generator import generate_action_plan_stream

router = APIRouter()

@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    farm_size: float = Form(...),
    language: str = Form("en")
):
    """
    Endpoint for plant disease prediction.
    Streams an initialization payload and then sequential AI text chunks identically matching NDJSON format.
    """
    image_bytes = await file.read()
    crop, disease, confidence = predict_image(image_bytes)
    
    weather_context = await get_weather_forecast(latitude, longitude)
    
    async def generate_response():
        # First yield the completely processed ML and Weather data synchronously to bootstrap React UI
        init_payload = {
            "type": "init",
            "data": {
                "crop": crop,
                "disease": disease,
                "confidence_score": confidence,
                "weather_context": weather_context
            }
        }
        yield json.dumps(init_payload) + "\n"
        
        async for chunk in generate_action_plan_stream(crop, disease, farm_size, weather_context, language):
            yield json.dumps({"type": "chunk", "text": chunk}) + "\n"
            
    return StreamingResponse(generate_response(), media_type="application/x-ndjson")
