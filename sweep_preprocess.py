import numpy as np
from PIL import Image
import tensorflow as tf
import json

model = tf.keras.models.load_model('app/models/plant_disease_detection.h5', compile=False)
with open('app/categories/categories.json') as f:
    cat = json.load(f)
CLASSES = [k for k, v in sorted(cat.items(), key=lambda x: x[1])]

img = Image.open('apple-leaf-soft-shadow-isolated-260nw-1309340179.webp').convert('RGB').resize((224, 224))
arr_rgb = np.array(img, dtype=np.float32)
arr_bgr = arr_rgb[..., ::-1]

configs = [
    ("RGB, 1/255", arr_rgb / 255.0),
    ("BGR, 1/255", arr_bgr / 255.0),
    ("RGB, preprocess_input", tf.keras.applications.mobilenet_v2.preprocess_input(np.copy(arr_rgb))),
    ("BGR, preprocess_input", tf.keras.applications.mobilenet_v2.preprocess_input(np.copy(arr_bgr)))
]

print("\n=== RESULTS ===")
for name, arr in configs:
    arr = np.expand_dims(arr, 0)
    pred = model.predict(arr, verbose=0)[0]
    idx = np.argmax(pred)
    top3 = np.argsort(pred)[-3:][::-1]
    str_top3 = ", ".join([f"{CLASSES[i]}({pred[i]:.2f})" for i in top3])
    print(f"{name:<25}: {CLASSES[idx]:<25} ({pred[idx]:.4f}) | Top 3: {str_top3}")
print("================\n")
