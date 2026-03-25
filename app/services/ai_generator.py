import google.generativeai as genai
from typing import AsyncGenerator
from app.core.config import settings
import asyncio

def configure_genai():
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)

async def generate_action_plan_stream(
    crop: str, 
    disease: str, 
    farm_size: float, 
    weather_summary: str,
    language: str = "en"
) -> AsyncGenerator[str, None]:
    """
    Streams the organic treatment plan context chunks dynamically over time.
    """
    configure_genai()
    
    if not settings.GEMINI_API_KEY:
        await asyncio.sleep(1)
        yield "Potential 20-30% yield loss if untreated.\\n\\n"
        await asyncio.sleep(1)
        yield "1. Remove infected leaves.\\n"
        await asyncio.sleep(1)
        yield "2. Ensure proper spacing.\\n"
        await asyncio.sleep(1)
        yield "3. Apply appropriate fungicide."
        return

    prompt = f"""
    A farmer's {farm_size} acre crop has {crop} {disease}. 
    The local weather for the next 48 hours is: {weather_summary}. 
    
    Please provide:
    1. A single sentence estimating the potential yield loss percentage if left untreated on the first line.
    2. A 3-step organic treatment plan taking the weather into account.
    
    Format the output elegantly in plain text markdown, do not use JSON. Do not use asterisks or bolding.
    """
    
    if language != "en":
        prompt += f" Ensure all output is translated into the primary language matching the ISO code: {language}."

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = await model.generate_content_async(prompt, stream=True)
        async for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        print(f"GenAI Error: {e}")
        yield f"Error generating: {str(e)}\\n"
        yield "1. Isolate the affected plants immediately to prevent spread.\\n"
        yield "2. Improve air circulation and reduce moisture.\\n"
        yield "3. Apply an organic treatment such as neem oil during dry periods."
