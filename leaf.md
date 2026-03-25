# CropDoc Supported Flora & Pathologies
*An overview of the 38 distinct plant and disease classes identifiable by the CropDoc ML infrastructure.*

## Overview
The CropDoc diagnostic engine is powered by a fine-tuned MobileNetV2 architecture. It is currently capable of distinguishing between **14 distinct agricultural crop species** and identifying **26 unique pathologies**, alongside establishing healthy baseline classifications.

---

## Supported Crops & Diagnostic Scope

### 🍎 Apple
*   **Apple Scab**
*   **Black Rot**
*   **Cedar Apple Rust**
*   Healthy

### 🫐 Blueberry
*   Healthy

### 🍒 Cherry *(including sour variants)*
*   **Powdery Mildew**
*   Healthy

### 🌽 Corn *(maize)*
*   **Cercospora Leaf Spot** / **Gray Leaf Spot**
*   **Common Rust**
*   **Northern Leaf Blight**
*   Healthy

### 🍇 Grape
*   **Black Rot**
*   **Esca (Black Measles)**
*   **Leaf Blight (Isariopsis Leaf Spot)**
*   Healthy

### 🍊 Orange
*   **Haunglongbing (Citrus Greening)**

### 🍑 Peach
*   **Bacterial Spot**
*   Healthy

### 🫑 Bell Pepper
*   **Bacterial Spot**
*   Healthy

### 🥔 Potato
*   **Early Blight**
*   **Late Blight**
*   Healthy

### 🍓 Berry Family *(Raspberry & Strawberry)*
*   Raspberry: Healthy
*   Strawberry: **Leaf Scorch**
*   Strawberry: Healthy

### 🌱 Miscellaneous *(Soybean & Squash)*
*   Soybean: Healthy
*   Squash: **Powdery Mildew**

### 🍅 Tomato *(Highest coverage)*
*   **Bacterial Spot**
*   **Early Blight**
*   **Late Blight**
*   **Leaf Mold**
*   **Septoria Leaf Spot**
*   **Spider Mites (Two-spotted Spider Mite)**
*   **Target Spot**
*   **Tomato Yellow Leaf Curl Virus**
*   **Tomato Mosaic Virus**
*   Healthy

---

## Technical Specifications
*   **Model Framework**: TensorFlow / Keras
*   **Base Architecture**: MobileNetV2
*   **Total Output Classes**: 38
*   **Required Image Resolution**: 224 x 224 RGB
*   **AI Advisory Agent**: Google GenAI `gemini-2.5-flash` with dual NDJSON streaming
