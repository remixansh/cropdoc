# CropDoc Working Terms

## Product Terms
- CropDoc: AI-assisted crop disease triage MVP.
- Triage: rapid first-pass diagnosis and action guidance.
- Hyper-local advisory: recommendations influenced by local short-term weather.

## Backend Terms
- Inference: model prediction from uploaded leaf image.
- Class map: disease label to index mapping (`categories.json`).
- Confidence score: top predicted class confidence value.
- NDJSON stream: newline-delimited JSON events over one response.
- `init` event: first payload with diagnosis and weather context.
- `chunk` event: incremental advisory text payload.
- Fallback mode: safe default outputs when dependencies fail.

## Frontend Terms
- Route-state handoff: passing file/form payload via navigation state.
- Progressive rendering: updating UI as stream events arrive.
- Analyzing stage: interim UX state before result hydration.
- Yield-impact sentence: urgency phrase parsed from advisory text.
- Action list extraction: converting streamed text into readable steps.

## Contract Terms
- Multipart form-data: upload request containing image and metadata.
- Stream-first response: backend replies as event stream, not single JSON blob.
- Contract drift: mismatch between docs and current implementation behavior.

## Hackathon Terms
- Demo asset pack: sample images/scripts for predictable live demo runs.
- Time-to-first-insight: how quickly first diagnosis appears.
- Graceful degradation: app still provides output under partial dependency failure.
- Scan loop: repeat flow for multiple plants during demonstration.
