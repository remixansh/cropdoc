import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
});

/**
 * Upload a leaf image and get disease prediction + treatment plan.
 * @param {File}   file        – Leaf image (JPEG/PNG)
 * @param {number} latitude    – Farm latitude
 * @param {number} longitude   – Farm longitude
 * @param {number} farmSize    – Farm size in acres
 * @param {string} [language]  – ISO language code (default "en")
 * @returns {Promise<object>}  – API response data
 */
export async function predictDisease(file, latitude, longitude, farmSize, language = "en") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("farm_size", farmSize);
  formData.append("language", language);

  const response = await api.post("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export default api;
