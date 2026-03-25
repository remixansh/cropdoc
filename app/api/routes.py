from fastapi import APIRouter, File, UploadFile, Form
from app.services.inference import predict_image
from app.services.weather import get_weather_forecast
from app.services.ai_generator import generate_action_plan

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
    Takes an image file and context parameters, returns action plan and predictions.
    """
    # 1. Image preprocessing and inference
    image_bytes = await file.read()
    crop, disease, confidence = predict_image(image_bytes)
    
    # 2. Weather fetching
    weather_context = await get_weather_forecast(latitude, longitude)
    
    # 3. GenAI prompt formulation
    treatment_plan, yield_impact_estimate = await generate_action_plan(
        crop, disease, farm_size, weather_context, language
    )
    
    return {
        "status": "success",
        "data": {
            "crop": crop,
            "disease": disease,
            "confidence_score": confidence,
            "weather_context": weather_context,
            "yield_impact_estimate": yield_impact_estimate,
            "treatment_plan": treatment_plan
        }
    }
