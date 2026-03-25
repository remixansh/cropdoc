import os
import tensorflow as tf

def generate_mock_model():
    print("Generating MobileNetV2 architecture with 38 classes...")
    
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze the base_model
    base_model.trainable = False
    
    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(38, activation='softmax')(x)
    
    model = tf.keras.Model(inputs, outputs)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Save model
    models_dir = os.path.join(os.path.dirname(__file__), "..", "app", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "model.h5")
    # tf.keras model save
    model.save(model_path)
    
    print(f"Mock model saved successfully at {os.path.abspath(model_path)}.")

if __name__ == "__main__":
    generate_mock_model()
