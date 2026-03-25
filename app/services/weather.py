import httpx

async def get_weather_forecast(latitude: float, longitude: float) -> str:
    """
    Fetches the next 48 hours of weather data from Open-Meteo.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,precipitation&forecast_days=2"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Extract simple summary (e.g. max temp, total precipitation)
            hourly = data.get("hourly", {})
            temps = hourly.get("temperature_2m", [])
            precip = hourly.get("precipitation", [])
            
            if not temps:
                return "Weather data unavailable."
                
            max_temp = max(temps)
            min_temp = min(temps)
            total_precip = sum(precip)
            
            summary = f"Expected temp range: {min_temp}°C to {max_temp}°C. Total expected precipitation: {total_precip:.1f}mm."
            if total_precip > 5:
                summary += " Rain is expected."
            else:
                summary += " Relatively dry."
                
            return summary
            
        except httpx.HTTPError as e:
            print(f"Weather API error: {e}")
            return "Unable to fetch weather forecast."
