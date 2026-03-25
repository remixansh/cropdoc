# CropDoc Backend System Specification

## 1. Overview
The CropDoc backend is a high-performance, asynchronous REST API built with FastAPI. It handles image-based crop disease classification using a lightweight TensorFlow model (MobileNetV2), retrieves hyper-local weather data, and leverages Generative AI (Google Gemini) to provide actionable, localized treatment plans and yield impact estimations.

## 2. Technology Stack
*   **Framework**: FastAPI (Python) - chosen for native asynchronous support, speed, and auto-generated Swagger documentation.
*   **Machine Learning**: TensorFlow / Keras (MobileNetV2 architecture).
*   **Generative AI**: Google Gemini API via `google-generativeai` Python SDK.

## 3. Machine Learning Pipeline (Inference)
The backend incorporates an ML inference pipeline to process user uploads directly, structured specifically around the [sunritjana MobileNetV2 Kaggle implementation](https://www.kaggle.com/code/sunritjana/plant-disease-detection-mobilenetv2/notebook):

### Model Architecture
*   **Base Model**: MobileNetV2 (via `tf.keras.applications`), with base layers frozen (`trainable = False`).
*   **Weights**: Pre-trained on `imagenet` (top layer excluded).
*   **Input Shape**: `(224, 224, 3)`.
*   **Custom Classification Head**: 
    *   `GlobalAveragePooling2D()` for feature map normalization.
    *   `Dropout(0.2)` to prevent overfitting.
    *   `Dense(38, activation='softmax')` for the 38 plant disease classes.

### Hyperparameters & Training Configuration
*   **Optimizer**: Adam (`learning_rate=0.001`).
*   **Loss Function**: Categorical Crossentropy.
*   **Batch Size**: 32.
*   **Epochs**: 30 (with `EarlyStopping` monitoring `loss` at `patience=3`).
*   **Format**: The trained model defaults to an `.h5` output format.

### Serving Image Preprocessing
To match the notebook's `ImageDataGenerator` logic during inference, incoming user images must be:
*   Dynamically resized to `224x224` pixels.
*   Rescaled/Normalized by a factor of `1./255.0` to match the `[0, 1]` ranges trained on.

## 4. Third-Party Services Integration
*   **Open-Meteo API**: Fetches the next 48 hours of precipitation and temperature data using the client-provided GPS coordinates (latitude/longitude). This service requires no API keys.
*   **Google Gemini API**: Utilized for generating natural-language summaries. The prompt dynamically injects the ML-predicted disease class, the user's farm size, and the 48-hour weather forecast to generate:
    1.  A weather-aware 3-step organic treatment plan taking weather into account (e.g., advising against spraying if rain is imminent).
    2.  An estimation of potential yield loss.
    3.  Translation to the requested vernacular language (e.g., English or Hindi).

## 5. API Interface Specification

### Endpoint: `/api/predict`
*   **Method**: `POST`
*   **Content-Type**: `multipart/form-data`

#### Request Payload
| Field | Type | Description |
| :--- | :--- | :--- |
| `file` | File (Image) | The plant leaf image captured by the user. |
| `latitude` | Float | GPS latitude of the farm. |
| `longitude` | Float | GPS longitude of the farm. |
| `farm_size` | Float | The size of the farm in acres/hectares. |
| `language` | String | Target language code for the response (e.g., `"en"` or `"hi"`). |

#### Workflow & Parallel Processing
1.  **Image Processing & Inference**: The image is saved/buffered, resized to `224x224`, and passed to the MobileNetV2 `.h5` model to determine the highest probability class and confidence score.
2.  **Weather Fetch**: In parallel (or sequentially, optimized via `async`), the backend pings Open-Meteo using the `latitude` and `longitude`.
3.  **GenAI Prompt Formulation**:
    *   *System Prompt Example*: "A farmer's `{farm_size}` acre crop has `{predicted_class}`. The local weather for the next 48 hours is `{weather_summary}`. 1. Provide a 3-step organic treatment plan taking the weather into account (e.g., don't spray if raining). 2. Estimate the potential yield loss percentage if untreated."
4.  **Response Aggregation**: The ML output, weather forecast, and GenAI-generated action plan are bundled into a unified JSON response.

#### Success Response (HTTP 200 OK)
```json
{
  "status": "success",
  "data": {
    "crop": "Tomato",
    "disease": "Early Blight",
    "confidence_score": 0.965,
    "weather_context": "Heavy rain expected in 4 hours.",
    "yield_impact_estimate": "Potential 20-30% yield loss if left untreated.",
    "treatment_plan": "1. Remove and destroy lower infected leaves immediately.\n2..."
  }
}
```

#### Error Response (HTTP 400 Bad Request)
```json
{
  "status": "error",
  "message": "Invalid file type. Please upload a valid image."
}
```

## 6. Directory Structure (Proposed)
To maintain a clean and scalable codebase, the following structure is recommended for the FastAPI backend application:

```text
cropdoc-backend/
├── app/
│   ├── main.py               # FastAPI application instance and router setup
│   ├── api/
│   │   └── routes.py         # /api/predict endpoint controller
│   ├── core/
│   │   └── config.py         # Environment variables and API keys
│   ├── models/
│   │   └── model.h5          # Trained MobileNetV2 TensorFlow model
│   ├── services/
│   │   ├── inference.py      # TF image resizing and ML prediction logic
│   │   ├── weather.py        # Open-Meteo API integration
│   │   └── ai_generator.py   # Google Gemini API prompt composition
│   └── utils/
│       └── image_utils.py    # Image validation and transformation utilities
├── requirements.txt          # Python dependencies (fastapi, tensorflow, google-generativeai, etc.)
└── Dockerfile                # Containerization config for Render/Railway deployment
```
