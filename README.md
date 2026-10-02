# DataLab AI Artist V2

Browser-first AI Artist for DataLab - Hogeschool van Amsterdam.

## Local installation

The base application is deliberately simple: browser frontend + local FastAPI backend + Stable Diffusion 1.5 img2img.

### Requirements
- Windows
- Python 3.11
- Node.js + npm
- No C++ Build Tools required for the base application
- NVIDIA GPU is optional for the base application; CPU fallback is supported but slower

### First installation

From the repository root, run:

```bat
start-datalab.bat
```

The launcher creates an isolated Python 3.11 virtual environment, installs the base AI dependencies, downloads Stable Diffusion 1.5, installs the frontend dependencies and starts:
- frontend: http://localhost:3000
- AI API: http://127.0.0.1:5000
- browser automatically after startup

The camera is handled directly by the browser. Allow camera permission when asked.

## FaceID extension

InsightFace + IP-Adapter FaceID are intentionally not part of the base installation. They are an optional extension for the final DataLab computer with an NVIDIA GPU. The base application must keep working when FaceID is not installed.

## Development

Backend:

```bat
cd src
..\.venv\Scripts\python.exe run.py
```

Frontend in a second terminal:

```bat
cd web
npm run dev
```

## GitHub Pages

GitHub Pages remains useful as a frontend preview. Real image generation requires the local AI backend on the computer opening the page. For the kiosk, use http://localhost:3000 so frontend and AI run together locally.
