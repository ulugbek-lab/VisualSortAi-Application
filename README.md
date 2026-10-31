# VisualSort AI

An AI-powered waste classification application for uploaded or camera-captured images. A fine-tuned MobileNetV2 model identifies six waste categories through a FastAPI backend and a React dashboard.

## Features

- Image upload, drag and drop, preview, and input validation.
- Device camera preview and capture using the same prediction flow.
- Predicted category, confidence, and available alternative probabilities.
- Searchable, filterable history with thumbnails, stored in browser localStorage.
- History-based analytics: counts, average confidence, material distribution, and daily activity.
- Model information, light/dark themes, and persistent display preferences.
- Responsive dashboard with desktop and mobile navigation.

Example photo cards are illustrative only; their badges are not live model results. Photo credits are in [the example assets README](frontend/src/assets/images/examples/README.md).

## Waste Categories

| Display label | API class |
| --- | --- |
| Paper / Cardboard | `paper-cardboard` |
| Glass | `glass` |
| Metal | `metal` |
| Plastic | `plastic` |
| Organic | `organic` |
| Textile | `textile` |

## How It Works

```text
Image → Resize & Normalize → MobileNetV2 CNN → 1280 visual features
      → 6-class linear classifier → Softmax → Category + confidence
```

Transfer learning adapts ImageNet-pretrained visual features to a custom waste classification task. At inference, the backend recreates the architecture with `weights=None` and loads the saved state dictionary; it does not download pretrained weights or retrain the model.

## Architecture

```text
React + TypeScript + Tailwind dashboard
              |
              | multipart image upload (file)
              v
          FastAPI backend
              |
              v
     PyTorch / MobileNetV2
              |
              | category + confidence + top 3 predictions
              v
        Frontend results
              |
              v
 Browser localStorage → History / Analytics
```

Vite forwards frontend requests from `/api/predict` to `http://127.0.0.1:8000/predict` during development. History, thumbnails, and settings are local to the browser; there is no database or account system.

## Tech Stack

- **AI / Machine Learning:** Python, PyTorch, TorchVision, MobileNetV2, Pillow.
- **Backend:** FastAPI, Uvicorn, python-multipart.
- **Frontend:** React, TypeScript, Tailwind CSS, Vite, React Router.
- **Charts and checks:** HTML/Tailwind bars, TypeScript, Node.js assertions; no chart or test framework dependency.

## Project Structure

```text
visualsort-ai/
├── app.py                       # FastAPI routes and model inference
├── visualsort_ai.pth             # Trained model state dictionary
├── requirements.txt             # Direct backend dependencies
├── .gitignore
├── README.md
└── frontend/
    ├── src/
    │   ├── pages/               # Classify, History, Analytics, Model Info, Settings
    │   ├── components/          # Upload, camera, results, shared UI
    │   ├── assets/images/examples/  # Local photographs and credits
    │   ├── App.tsx              # Dashboard layout and routes
    │   ├── AppContext.tsx       # Shared history and preferences
    │   ├── api.ts               # Multipart prediction request
    │   ├── analytics.ts         # History-derived statistics
    │   ├── storage.ts           # Storage validation and thumbnails
    │   ├── constants.ts         # Categories and defaults
    │   └── types.ts             # Shared TypeScript types
    ├── scripts/check-data.mjs
    ├── tests/data.cjs
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── README.md                # Frontend-specific testing and hosting notes
```

## Getting Started

### Prerequisites

- Python **3.13** (the existing environment uses 3.13.5).
- Node.js **20.19+ or 22.12+**, with npm.
- The trained `visualsort_ai.pth` file in the project root, beside `app.py`.

### 1. Clone Repository

Replace the placeholder URL with this repository's actual GitHub URL:

```bash
git clone https://github.com/YOUR_USERNAME/visualsort-ai.git
cd visualsort-ai
```

### 2. Backend Setup

Run from the project root so the backend can locate the model file:

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

On Windows, activate with `venv\Scripts\activate` in Command Prompt, or `.\venv\Scripts\Activate.ps1` in PowerShell.

- API: http://127.0.0.1:8000
- Swagger documentation: http://127.0.0.1:8000/docs

The backend uses CUDA when available and otherwise CPU. Requirements pin the direct package versions found in the local environment; hardware-specific PyTorch installations may need the appropriate compatible PyTorch/TorchVision builds.

### 3. Frontend Setup

In a second terminal, from the project root:

```bash
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173. If that port is occupied, Vite may select another. Keep both servers running.

## API

### `GET /`

Returns `{"message": "VisualSort AI API is running"}`.

### `POST /predict`

Send `multipart/form-data` with an image in the **`file`** field:

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -F "file=@frontend/src/assets/images/examples/metal.jpg"
```

Illustrative response; values depend on the image and model:

```json
{
  "filename": "bottle.jpg",
  "prediction": { "class": "plastic", "confidence": 94.72 },
  "top_predictions": [
    { "class": "plastic", "confidence": 94.72 },
    { "class": "glass", "confidence": 3.84 },
    { "class": "metal", "confidence": 0.91 }
  ]
}
```

Confidence is a percentage. The backend returns the **top three**, including the winning class; it does not return all six probabilities. Display settings can hide alternatives without changing the saved response. The frontend accepts image MIME types and limits files to 10 MB; these are frontend checks, not backend upload limits. Invalid image bytes are not currently handled with a custom API error response.

## Model

- **Architecture:** MobileNetV2 with its final linear layer changed from 1280 features to six outputs.
- **Input:** RGB image resized to 224 × 224, converted to a tensor.
- **Normalization:** mean `[0.485, 0.456, 0.406]`, standard deviation `[0.229, 0.224, 0.225]`.
- **Inference:** evaluation mode, gradients disabled, softmax over six logits, top-three selection.
- **Weights:** loaded from `visualsort_ai.pth`.

The project author's training setup used ImageNet-pretrained weights, a custom waste image dataset, `CrossEntropyLoss`, and the Adam optimizer. Training scripts/notebooks and the training dataset are **not included here**, so this checkout supports inference, not reproduction of training. Dataset size, measured accuracy, and training duration are not documented.

The current weight file is **9,168,395 bytes (about 8.74 MiB)**, suitable for regular Git storage. Git LFS is optional for this file; consider LFS or release assets if future models grow or are updated frequently. See [GitHub's file-size guidance](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github). Keep the file at the documented location if distributing weights separately.

## Running a Prediction

1. Start the FastAPI backend and frontend development server.
2. Open the frontend and go to **Classify**.
3. Upload/drag in a clear photo of one waste item, or choose **Use Camera → Capture**.
4. Click **Predict Waste Type** to see the category and confidence.
5. Open **History** or **Analytics** to inspect saved results.

Camera access requires browser permission and localhost or HTTPS. Plain HTTP on a phone's LAN IP does not provide a secure camera context. Camera tracks stop when the dialog closes or unmounts.

## Testing

From `frontend/`:

```bash
npm run typecheck
npm test
npm run build
```

The data checks cover analytics aggregation, ties, daily activity, history validation/order, settings, and prediction validation. They are not a browser or model-accuracy test suite. The production build is written to `frontend/dist/`.

With the backend running, verify health and an actual model prediction:

```bash
curl --fail http://127.0.0.1:8000/
curl --fail http://127.0.0.1:8000/predict \
  -F "file=@frontend/src/assets/images/examples/metal.jpg"
```

For manual testing, exercise upload validation, camera capture/cancel/denied permission, prediction failure with the backend stopped, history search/filter/refresh/clear, analytics empty states, and persistent theme/alternative settings. See the [frontend test guide](frontend/README.md) for the checklist.

## Screenshots

<!-- Add repository-relative screenshots of Classify, History, and Analytics here when available. -->

## Limitations

- Predictions depend on training data quality and may fail on unfamiliar images or multiple items.
- Confidence expresses model certainty, not guaranteed correctness or authoritative recycling guidance.
- History and settings are browser-local; clearing site data removes them.
- This is a local inference demo; authentication, server-side history, and production upload hardening are not implemented.
- Production hosting needs frontend route fallback to `index.html` and an `/api/*` proxy to FastAPI with `/api` removed. Vite's development proxy does not apply to static hosting or `npm run preview`.

## Future Improvements

- More diverse training data and stronger augmentation.
- Documented evaluation, per-class metrics, and a confusion matrix.
- Cloud deployment and persistent server-side history.
- Object detection for images containing several waste items.

## License

No project license has been specified yet. Example photographs have separate source and license information in their [credits file](frontend/src/assets/images/examples/README.md).
