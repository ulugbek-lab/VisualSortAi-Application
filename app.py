import io

import torch
import torch.nn as nn
import torchvision.transforms as transforms

from fastapi import FastAPI, UploadFile, File
from PIL import Image
from torchvision.models import mobilenet_v2


app = FastAPI(title="VisualSort AI")


CLASSES = [
    "paper-cardboard",
    "glass",
    "metal",
    "plastic",
    "organic",
    "textile"
]

NUM_CLASSES = len(CLASSES)


device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# Same preprocessing used during training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# Recreate MobileNetV2 architecture
model = mobilenet_v2(weights=None)

# Replace original 1000-class classifier with our 6 classes
model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    NUM_CLASSES
)

# Load our trained weights
model.load_state_dict(
    torch.load(
        "visualsort_ai.pth",
        map_location=device
    )
)

model = model.to(device)
model.eval()


@app.get("/")
def root():
    return {
        "message": "VisualSort AI API is running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    image_bytes = await file.read()

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    image_tensor = (
        transform(image)
        .unsqueeze(0)
        .to(device)
    )

    with torch.no_grad():
        output = model(image_tensor)

        probabilities = torch.softmax(
            output,
            dim=1
        )[0]

        topk = torch.topk(
            probabilities,
            k=3
        )

    predictions = []

    for i in range(topk.indices.size(0)):

        class_index = topk.indices[i].item()
        label = CLASSES[class_index]

        confidence = (
            topk.values[i].item() * 100
        )

        predictions.append({
            "class": label,
            "confidence": round(confidence, 2)
        })

    return {
        "filename": file.filename,
        "prediction": predictions[0],
        "top_predictions": predictions
    }
