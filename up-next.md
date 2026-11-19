# up next

## try diff apis

Currently using Roboflow's hosted `detect.roboflow.com` + `playing-cards-ow27d/4`. Things to compare on the same set of card photos (accuracy, latency, cost):

- **Claude / GPT-4o / Gemini vision** — no model to pick, forgiving on angle/glare/occlusion, non-deterministic.
- **Roboflow serverless with different model versions** — bump `ROBOFLOW_VERSION` (1-4) or try other public card models on Universe.
- **In-browser TF.js** — convert a card YOLO to ONNX/TFJS, serve from `/public`, run via `onnxruntime-web`. Zero API calls, deterministic, bigger first load.
- **OpenCV.js contour + template match** — classical, fully local, fragile to lighting.
- **Replicate hosted YOLO** — pay-per-call alternative to Roboflow.

Compare: same test images, same JSON output shape, record (accuracy, p50 latency, $ per 1k).
