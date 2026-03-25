import google.generativeai as genai
from typing import Tuple
from app.core.config import settings

def configure_genai():
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)

async def generate_action_plan(
    crop: str, 
    disease: str, 
    farm_size: float, 
    weather_summary: str,
    language: str = "en"
) -> Tuple[str, str]:
    """
    Returns (treatment_plan, yield_impact_estimate)
    """
    configure_genai()
    
    if not settings.GEMINI_API_KEY:
        return (
            "1. Remove infected leaves.\\n2. Ensure proper spacing.\\n3. Apply appropriate fungicide.",
            "Potential 20-30% yield loss if untreated."
        )

    prompt = f"""
    A farmer's {farm_size} acre crop has {crop} {disease}. 
    The local weather for the next 48 hours is: {weather_summary}. 
    
    Please provide:
    1. A 3-step organic treatment plan taking the weather into account (e.g., don't spray if rain is expected soon).
    2. An estimation of the potential yield loss percentage if left untreated.
    
    Respond strictly in JSON format with exactly two keys: "treatment_plan" and "yield_impact_estimate".
    """
    
    if language != "en":
        prompt += f" Ensure the values for treatment_plan and yield_impact_estimate are translated into the primary language matching the ISO code: {language}."

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text
        
        # Parse simple JSON from response text
        import json
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
            
        data = json.loads(text)
        return data.get("treatment_plan", ""), data.get("yield_impact_estimate", "")
    except Exception as e:
        print(f"GenAI Error: {e}")
        return (
            "1. Isolate the affected plants immediately to prevent spread.\\n2. Improve air circulation and reduce moisture.\\n3. Apply an organic treatment such as neem oil during dry periods.",
            "Potential 15-25% yield loss depending on progression."
        )
