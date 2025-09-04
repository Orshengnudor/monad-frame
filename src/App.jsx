import React, { useRef, useState, useEffect } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1); // Default zoom level
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "monad-frame.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3)); // Max zoom: 3x
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5)); // Min zoom: 0.5x
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const frameSize = 400;
    const radius = frameSize / 2 - 20; // Adjusted for thicker border

    canvas.width = frameSize;
    canvas.height = frameSize;

    ctx.clearRect(0, 0, frameSize, frameSize);

    if (image) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(frameSize / 2, frameSize / 2, radius, 0, Math.PI * 2);
      ctx.clip();

      const img = new Image();
      img.src = image;
      img.onload = () => {
        const imgAspect = img.width / img.height;
        const canvasAspect = frameSize / frameSize;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          drawWidth = frameSize * zoom;
          drawHeight = (frameSize / imgAspect) * zoom;
          offsetX = (frameSize - drawWidth) / 2;
          offsetY = (frameSize - drawHeight) / 2;
        } else {
          drawHeight = frameSize * zoom;
          drawWidth = (frameSize * imgAspect) * zoom;
          offsetX = (frameSize - drawWidth) / 2;
          offsetY = (frameSize - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();

        ctx.lineWidth = 30;
        ctx.strokeStyle = "#240361ff";
        ctx.beginPath();
        ctx.arc(frameSize / 2, frameSize / 2, radius, 0, Math.PI * 2);
        ctx.stroke();

        const text = " ⨀ ".repeat(10);
        ctx.save();
        ctx.translate(frameSize / 2, frameSize / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        for (let i = 0; i < text.length; i++) {
          const angle = (i / text.length) * (Math.PI * 2);
          ctx.save();
          ctx.rotate(angle);
          ctx.translate(0, -radius - 10);
          ctx.rotate(Math.PI / 2);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
        ctx.restore();
      };
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(frameSize / 2, frameSize / 2, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = "#E9D5FF";
      ctx.fillRect(0, 0, frameSize, frameSize);
      ctx.fillStyle = "#240361ff";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("10,000tps", frameSize / 2, frameSize / 2);
      ctx.restore();

      ctx.lineWidth = 30;
      ctx.strokeStyle = "#240361ff";
      ctx.beginPath();
      ctx.arc(frameSize / 2, frameSize / 2, radius, 0, Math.PI * 2);
      ctx.stroke();

      const text = " ⨀ ".repeat(10);
      ctx.save();
      ctx.translate(frameSize / 2, frameSize / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      for (let i = 0; i < text.length; i++) {
        const angle = (i / text.length) * (Math.PI * 2);
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -radius - 10);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [image, zoom]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-950 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Monad Photo Frame
      </h1>

      <canvas ref={canvasRef} className="rounded-full shadow-xl mb-4" />

      {/* Controls aligned horizontally */}
      <div className="flex items-center space-x-1">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block text-sm text-gray-200"
        />

        {image && (
          <div className="flex space-x-1">
            <button
              onClick={handleZoomIn}
              className="px-3 py-1 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-1 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800"
            >
              -
            </button>
          </div>
        )}

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800"
        >
          Save Image
        </button>
      </div>

      <footer className="mt-6 text-sm text-white">
        Made with love ❤️ by Orshengnudor
      </footer>
    </div>
  );
}

export default App;