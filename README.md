# DataLab AI Artist V2

Browser-first AI Artist for DataLab - Hogeschool van Amsterdam.

## Local installation (real AI)

The production kiosk runs the browser frontend and the AI backend on the same Windows computer.

### Requirements
- Windows
- Python 3.11
- Node.js + npm
- NVIDIA GPU + current NVIDIA driver recommended for the full FaceID pipeline

### First installation

From the repository root:

```bat
cd src
python -m pip install -r requirements.txt
python download.py
cd ..
```

Then double-click:

```
start-datalab.bat
```

The launcher starts:
- frontend: http://localhost:3000
- AI API: http://127.0.0.1:5000
- browser automatically after startup

The camera is handled directly by the browser. Allow camera permission when asked.

## Development

```bat
cd src
python run.py
```

In a second terminal:

```bat
cd web
npm run dev
```

## GitHub Pages

GitHub Pages remains useful as a frontend preview. Real image generation requires the local AI backend on the computer opening the page. For the kiosk, use http://localhost:3000 so frontend and AI run together locally.
