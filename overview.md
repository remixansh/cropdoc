# CropDoc Hackathon Overview

## Pitch Narrative
CropDoc is a field-first AI assistant for rapid crop disease triage. A farmer uploads a leaf photo, provides farm size and location, and receives an instant diagnosis plus weather-aware treatment guidance.

The core pitch is speed-to-action:
- detect likely disease quickly
- estimate urgency with confidence and yield-risk language
- recommend practical next steps contextualized by local weather

## Architecture
CropDoc follows a lightweight split architecture:
- Frontend: React + Vite + Tailwind, mobile-first 3-screen flow
- Backend: FastAPI orchestration service
- ML layer: TensorFlow image inference for disease classification
- Weather layer: Open-Meteo API summary for next 48 hours
- GenAI layer: Gemini streaming advisory generation with fallback output

High-level data flow:
1. Frontend sends multipart request (`file`, `latitude`, `longitude`, `farm_size`, `language`) to `/api/predict`.
2. Backend runs image inference and weather fetch.
3. Backend starts NDJSON streaming:
   - `init` payload: crop, disease, confidence, weather context
   - `chunk` payloads: streamed advisory text
4. Frontend renders diagnosis immediately, then appends treatment guidance live.

## Demo Flow
1. Open Home page and upload a sample leaf image.
2. Enter farm size and coordinates.
3. Start analysis and show progress states.
4. Show instant diagnostic card once `init` arrives.
5. Let streamed advisory build action list in real time.
6. End with "Scan another plant" loop to show repeatability.

## Impact Framing
CropDoc reduces time-to-first-decision during early disease symptoms. By combining image diagnosis, local weather context, and actionable AI text in one flow, it helps farmers move faster from detection to intervention.

## Current Implementation Reality
What is implemented:
- end-to-end frontend journey from upload to result
- backend orchestration for inference, weather, and advisory generation
- streaming-first UX with progressive rendering

Current known gaps:
- docs and runtime contract can drift (JSON docs vs NDJSON implementation)
- language toggle is mostly visual in frontend
- validation hardening and production security posture still need work
- testing is mostly smoke-level, not deep assertion coverage
