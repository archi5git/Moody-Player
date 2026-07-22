import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Camera, LoaderCircle } from "lucide-react";

const moodMapping = {
  happy: "happy",
  sad: "sad",
  angry: "relaxed",
  neutral: "relaxed",
  surprised: "energetic",
  fearful: "relaxed",
  disgusted: "energetic",
};

function FacialExpression({ onMoodDetected }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelPath = "/models";

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
          faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
        ]);

        setModelsLoaded(true);
      } catch (error) {
        console.error("Model loading error:", error);
        setMessage("Mood detection models could not load.");
      }
    };

    loadModels();

    return () => stopCamera();
  }, []);

  const openCamera = async () => {
    if (!modelsLoaded) {
      setMessage("Models are still loading.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      setCameraOpen(true);
      setMessage("Look at the camera, then detect your mood.");
    } catch (error) {
      console.error("Camera error:", error);
      setMessage("Camera permission was denied.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraOpen(false);
  };

  const detectMood = async () => {
    if (!videoRef.current) {
      return;
    }

    setDetecting(true);
    setMessage("Detecting your mood...");

    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (!detection) {
        setMessage("Face not detected. Try again in better light.");
        return;
      }

      const expressions = detection.expressions;

      const detectedExpression = Object.keys(expressions).reduce(
        (highest, expression) =>
          expressions[expression] > expressions[highest]
            ? expression
            : highest,
        "neutral"
      );

      const detectedMood =
        moodMapping[detectedExpression] || "relaxed";

      onMoodDetected(detectedMood);

      setMessage(
        `Expression: ${detectedExpression}. Mood selected: ${detectedMood}.`
      );

      stopCamera();
    } catch (error) {
      console.error("Detection error:", error);
      setMessage("Unable to detect mood. Please try again.");
    } finally {
      setDetecting(false);
    }
  };

  return (
    <section className="camera-section">
      <div>
        <p className="camera-section__label">Automatic mood selection</p>
        <h2>Detect mood using camera</h2>
      </div>

      {!cameraOpen ? (
        <button
          type="button"
          className="camera-button"
          onClick={openCamera}
          disabled={!modelsLoaded}
        >
          <Camera size={20} />
          {modelsLoaded ? "Open Camera" : "Loading Models..."}
        </button>
      ) : (
        <div className="camera-box">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="camera-video"
          />

          <div className="camera-actions">
            <button
              type="button"
              className="camera-button"
              onClick={detectMood}
              disabled={detecting}
            >
              {detecting ? (
                <LoaderCircle className="spin" size={20} />
              ) : (
                <Camera size={20} />
              )}

              {detecting ? "Detecting..." : "Detect Mood"}
            </button>

            <button
              type="button"
              className="camera-cancel-button"
              onClick={stopCamera}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {message && <p className="camera-message">{message}</p>}
    </section>
  );
}

export default FacialExpression;