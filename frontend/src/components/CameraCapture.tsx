import { useRef, useState, useEffect } from "react";

interface Props {
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<Props> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    startCamera();
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");
      onCapture(imageData);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-sm rounded shadow"
        onCanPlay={() => setIsStreaming(true)}
      />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleCapture}
        disabled={!isStreaming}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Capture Image
      </button>
    </div>
  );
};

export default CameraCapture;
