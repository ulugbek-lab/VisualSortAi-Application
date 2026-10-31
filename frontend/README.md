# Frontend development

See the [root README](../README.md) for project setup, the model, API, architecture, and features.

## Development and checks

From this directory, with the backend running on `http://127.0.0.1:8000`:

```bash
npm ci
npm run dev
```

```bash
npm run typecheck
npm test
npm run build
```

`src/api.ts` posts multipart data to `/api/predict`; `vite.config.ts` forwards it to FastAPI. The `file` field and API URL are shared by uploads and camera captures.

## Manual test checklist

- **Classify:** predict without an image; upload/drag a photo; check preview, filename, real results and progress bars; remove it. Reject non-images and files over 10 MB. Stop FastAPI and check the prediction error message. Demo cards should never submit images automatically.
- **Camera:** allow permission, capture, and predict through the normal flow. Reopen and cancel; check the camera indicator turns off. Deny permission and check the error. Use localhost or HTTPS, including for mobile testing; audio is never requested.
- **History:** check thumbnails, category, confidence, alternatives, and local date/time; refresh; search and filter; check no-match and empty states. Clearing history requires confirmation and also empties analytics.
- **Analytics:** compare counts and average confidence against History; check category ties, missing categories, and activity over 14 local calendar days. Empty history must show no fabricated data.
- **Model Info:** review the metadata, eight-step inference pipeline, and six categories.
- **Settings:** change theme and alternative limit, then refresh. A limit of zero hides alternatives but keeps the winner. Reset restores defaults without deleting history. The header theme button uses the same preference.
- **Navigation/layout:** test all five routes, `/` redirect, Back/Forward, direct route refresh, desktop sidebar, mobile navigation, and stacked classification sections.

## Browser persistence

`visualsort-history-v1` and `visualsort-settings-v1` are localStorage keys. Thumbnails are compressed to a maximum 160px dimension. If storage fills, history retries without thumbnails; if storage is unavailable, a notice explains that changes are session-only. Clearing site data removes saved results/preferences.

The alternative limit affects display only; complete returned predictions are saved. The backend currently returns the winner and two alternatives, not all six probabilities.

## Hosting

Serve `index.html` for frontend routes such as `/history` and forward `/api/*` to FastAPI with `/api` removed. Vite's development proxy does not apply to static hosting or `npm run preview`. Use HTTPS for camera access outside localhost.

Local demonstration photo sources and licensing are in [the asset credits](src/assets/images/examples/README.md).
