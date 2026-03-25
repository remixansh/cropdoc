# 🌿 CropDoc

**Team Name:** Megatron  
**Live Demo:** [https://tinyurl.com/cropdoc123]
**GitHub Repository:** [https://github.com/remixansh/cropdoc]
---

## 📖 Overview
CropDoc is a field-first AI assistant designed for rapid crop disease triage. By simply uploading a photo of a plant leaf and providing basic farm details (size and location), farmers receive an instantaneous diagnosis paired with a highly contextualized, weather-aware treatment plan. The core focus of CropDoc is **speed-to-action**.

## ⚠️ The Problem
Farmers often struggle with identifying crop diseases during their early stages. Delayed detection leads to delayed intervention, which significantly increases the risk of crop loss. Traditional lab diagnosis takes days, and generic internet advice lacks crucial context regarding the farmer's specific local weather conditions and severity.

## 💡 The Solution
CropDoc resolves this by reducing the *time-to-first-decision*. 
Our platform combines:
1. **Instant Image Diagnosis:** Identifies the likely disease rapidly.
2. **Contextual Weather Analysis:** Checks local weather for the next 48 hours to inform treatment urgency.
3. **Actionable AI Guidance:** Generates a practical, step-by-step treatment plan using generative AI, tailored to the specific disease and local climate.

## 🛠️ Tech Stack
CropDoc follows a lightweight, decoupled, and highly responsive streaming architecture:
- **Frontend:** React + Vite + Tailwind CSS (Mobile-first, 3-screen progressive flow)
- **Backend:** FastAPI (Lightning-fast Python orchestration service)
- **Machine Learning Layer:** TensorFlow with MobileNetV2 (Image inference for robust plant disease classification)
- **Weather API:** Open-Meteo API (Next 48-hour localized weather summary)
- **Generative AI Layer:** Google Gemini AI (NDJSON streaming advisory generation)

---

## 👥 Team Megatron (B.Tech 3rd Year 6th Semester )
- **Ansh** - 9709444143 | remixansh@gmail.com
- **Manjeet** - 8809289554 | manjeetjay00@gmail.com
- **Ankit** - 9598387377 | ankityyadav1207@gmail.com
- **Divyansh** - divyanshtaksalia2004@gmail.com

---

## 🔗 References & Datasets
Our Machine Learning models are trained using comprehensive open-source agricultural data:
- **PlantVillage Dataset 1:** [Kaggle Link](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset/data)
- **PlantVillage Dataset 2:** [Kaggle Link](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)

## 📚 Technical Documentation
Dive deeper into our system architecture and specific implementations:
- [Backend Documentation](https://github.com/remixansh/cropdoc/blob/main/backend.md)
- [Frontend Documentation](https://github.com/remixansh/cropdoc/blob/main/frontend.md)
- [Leaf/ML Documentation](https://github.com/remixansh/cropdoc/blob/main/leaf.md)
- [System Overview](https://github.com/remixansh/cropdoc/blob/main/overview.md)
