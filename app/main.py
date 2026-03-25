from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os
from app.api.routes import router as api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Since the frontend is now a standalone React App (e.g., via Vite),
# the FastAPI backend acts strictly as an API server.
# Ensure you run the React frontend separately (e.g., `npm run dev`)
# while this server handles `/api/...` endpoints.

app.include_router(api_router, prefix="/api")

# The root endpoint for serving the frontend (e.g., index.html) is removed
# because the frontend is now a separate application.
