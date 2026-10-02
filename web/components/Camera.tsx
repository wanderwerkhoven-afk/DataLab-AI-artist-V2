"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface CameraHandle {
  capture: () => string | null;
}

interface CameraProps {
  stopCamera: boolean;
}

const Camera = forwardRef<CameraHandle, CameraProps>(({ stopCamera }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [error, setError] = useState("");

  const scanCameras = async () => {
    try {
      setError("");
      const permissionStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      permissionStream.getTracks().forEach(track => track.stop());
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const cameras = allDevices.filter(device => device.kind === "videoinput");
      setDevices(cameras);
      if (cameras.length && !cameras.some(camera => camera.deviceId === deviceId)) {
        setDeviceId(cameras[0].deviceId);
      }
      if (!cameras.length) setError("No camera found");
    } catch {
      setError("Camera access is blocked. Allow camera access in your browser.");
    }
  };

  useEffect(() => { scanCameras(); }, []);

  useEffect(() => {
    if (stopCamera) {
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      return;
    }
    if (!deviceId) return;

    let cancelled = false;
    navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    }).then(stream => {
      if (cancelled) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    }).catch(() => setError("This camera could not be started."));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };
  }, [deviceId, stopCamera]);

  useImperativeHandle(ref, () => ({
    capture: () => {
      const video = videoRef.current;
      if (!video || !video.videoWidth || !video.videoHeight) return null;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.92);
    },
  }));

  return (
    <div className="browser-camera">
      <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
      <div className="camera-tools">
        {devices.length > 1 && (
          <select aria-label="Select camera" value={deviceId} onChange={e => setDeviceId(e.target.value)}>
            {devices.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        )}
        <button type="button" onClick={scanCameras}>Rescan cameras</button>
      </div>
      {error && <div className="camera-error">{error}</div>}
    </div>
  );
});

Camera.displayName = "Camera";
export default Camera;
