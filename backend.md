# CropDoc Backend

## Backend Architecture
The backend is a FastAPI service that coordinates three stages per request:
1. image inference
2. weather summarization
3. advisory generation and streaming

Key modules:
- `app/main.py`: app bootstrap, CORS, router mount
- `app/api/routes.py`: `/api/predict` endpoint and stream orchestration
- `app/services/inference.py`: model loading, preprocessing, prediction
- `app/services/weather.py`: Open-Meteo call and summary text
- `app/services/ai_generator.py`: Gemini prompt + streamed output fallback path
- `app/core/config.py`: settings and env wiring

## Endpoint Contract
Endpoint:
- `POST /api/predict`

Request format:
- `multipart/form-data`

Request fields:
- `file` (required image)
- `latitude` (required float)
- `longitude` (required float)
- `farm_size` (required float)
- `language` (optional, default `en`)

Response format:
- content type: `application/x-ndjson`
- event sequence:
  - `init` event with diagnosis + weather context
  - `chunk` events with incremental advisory text

## Processing Pipeline
1. Read uploaded image bytes.
2. Preprocess image (RGB conversion, resize to 224x224, MobileNetV2 preprocessing).
3. Run model inference, map class index to crop/disease label.
4. Fetch weather forecast summary for provided coordinates.
5. Build advisory prompt and stream generated response chunks.
6. Send stream to frontend for progressive UI updates.

## Fallback Logic
- Inference fallback: if model/classes are unavailable, return default diagnosis data.
- Weather fallback: return failure-safe summary text if weather API fails.
- GenAI fallback: stream canned treatment steps if Gemini key or call fails.
