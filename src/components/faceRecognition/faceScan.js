import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";

export default function FaceScan({ onFoundFace, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Esperando...");
  const [processing, setProcessing] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    const loadModels = async () => {
      setStatus("Cargando modelos...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setStatus("Modelos cargados");
    };
    loadModels();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setStatus("No se pudo acceder a la cámara");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    async function processFrame() {
      if (
        !videoRef.current ||
        !canvasRef.current ||
        processing ||
        !faceapi.nets.tinyFaceDetector.params
      )
        return;

      const detections = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections && detections.box && !processing) {
        setProcessing(true);
        setStatus("Rostro detectado, enviando...");

        // Recortar la cara
        const { x, y, width, height } = detections.box;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Crear un canvas temporal para la cara recortada
        const faceCanvas = document.createElement("canvas");
        faceCanvas.width = width;
        faceCanvas.height = height;
        faceCanvas
          .getContext("2d")
          .drawImage(canvas, x, y, width, height, 0, 0, width, height);

        const base64 = faceCanvas.toDataURL("image/jpeg");

        await sendToBackend(base64);

        setTimeout(() => setProcessing(false), 3000); // Cooldown
      }
    }

    interval = setInterval(processFrame, 700);
    return () => clearInterval(interval);
  }, [processing]);

  const sendToBackend = async (base64) => {
    setStatus("Enviando al backend...");
    try {
      const res = await axios.get(`${config.API_URL}/clock_events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onFoundFace(res.data);
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={800}
        height={600}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          display: "none",
        }}
      />
      <div className="mt-4 text-lg text-white">{status}</div>
    </div>
  );
}
