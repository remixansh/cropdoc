# CropDoc Frontend

## Route And State Flow
Primary routes:
- `/` Home page: capture image + farm metadata
- `/analyzing` Analysis page: execute request + consume stream
- `/result` Result page: render diagnosis and advisory output

State flow:
1. Home stores selected image and form values.
2. App navigates to `/analyzing` with route state payload.
3. Analysis page posts multipart data to backend.
4. Stream parser handles `init` + `chunk` events.
5. UI transitions to result view as soon as `init` arrives.
6. Advisory text continues streaming and updating result cards.

## Streaming UX Behavior
- The analyzing screen shows staged progress states while awaiting stream events.
- First meaningful paint is `init` payload (fast diagnosis visibility).
- Advisory content appears progressively from `chunk` payloads.
- If streaming fails or no usable payload arrives, user is redirected with an error.

## Frontend Stack
- React 19
- React Router
- Vite 7
- Tailwind CSS v4
- Axios utility file present, while streaming path uses native fetch in analysis flow

## Strengths
- Mobile-first layout and clear 3-step experience.
- Strong visual consistency with design tokens.
- Progressive streaming experience improves perceived responsiveness.
- Simple navigation and repeat-scan loop are demo-friendly.

## Gaps
- API integration is split (stream fetch vs separate Axios helper).
- Some UI elements are presentational only (for example language toggle behavior).
- Shared component reuse can be improved to reduce duplicated layout markup.
- Accessibility and validation behavior can be further hardened.
