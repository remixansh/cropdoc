# CropDoc API Contract

## Base URL
`http://localhost:8000/api`

## Endpoints

### 1. Predict Crop Disease and Get Treatment Plan
- **Endpoint**: `/predict`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

#### Description
Upload an image of a crop leaf along with farm and location details to receive a disease prediction, yield impact estimate, and a weather-aware treatment plan.

#### Request Parameters (Form Data)
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `file` | file | Yes | The image file of the crop leaf (JPEG/PNG). |
| `latitude` | float | Yes | Latitude of the farm location for weather forecasting. |
| `longitude` | float | Yes | Longitude of the farm location for weather forecasting. |
| `farm_size` | float | Yes | Size of the farm in acres. |
| `language` | string | No | Target language ISO code for the response (default: `"en"`). |

#### Example HTTP Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/leaf_image.jpg" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "farm_size=2.5" \
  -F "language=en"
```

#### Success Response (200 OK)
**Content-Type**: `application/json`

```json
{
  "status": "success",
  "data": {
    "crop": "Tomato",
    "disease": "Early blight",
    "confidence_score": 0.985,
    "weather_context": "Expected temp range: 22.0°C to 29.5°C. Total expected precipitation: 0.0mm. Relatively dry.",
    "yield_impact_estimate": "Potential 20-30% yield loss if left untreated.",
    "treatment_plan": "1. Remove and destroy lower infected leaves immediately.\\n2. Apply a copper-based organic fungicide.\\n3. Ensure adequate spacing between plants to improve air circulation."
  }
}
```

#### Error Response (422 Unprocessable Entity)
When required validation parameters are missing or incorrect:

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "latitude"],
      "msg": "Field required",
      "input": null
    }
  ]
}
```
