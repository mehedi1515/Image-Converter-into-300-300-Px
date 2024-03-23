import React, { useState } from 'react';

function ImageConverter() {
  const [image, setImage] = useState(null);
  const [converted, setConverted] = useState(null);

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertTo300x300 = () => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);

      // Start with a quality that may exceed 100KB
      let quality = 0.9;

      // Binary search to find the appropriate quality level
      let minQuality = 0;
      let maxQuality = 1;
      while (minQuality <= maxQuality) {
        quality = (minQuality + maxQuality) / 2;
        const imageData = canvas.toDataURL('image/jpeg', quality);
        const fileSize = imageData.length / 1024; // Size in KB
        if (fileSize > 100) {
          maxQuality = quality - 0.01;
        } else if (fileSize < 50) {
          minQuality = quality + 0.01;
        } else {
          setConverted(imageData);
          break;
        }
      }
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (converted) {
      const a = document.createElement('a');
      a.href = converted;
      a.download = 'converted_image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="container">
      <h2>Image Converter</h2>
      <div className="input-container">
        <input type="file" accept="image/*" onChange={handleImageInputChange} />
        <button onClick={convertTo300x300}>Convert</button>
      </div>
      {converted && (
        <div className="output-container">
          <h3>Converted Image (300x300)</h3>
          <img src={converted} alt="Converted" className="converted-image" />
          <br />
          <button onClick={handleDownload} className="download-button">Download</button>
        </div>
      )}
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        .input-container {
          margin-bottom: 20px;
        }
        .converted-image {
          max-width: 300px;
          max-height: 300px;
          margin-top: 10px;
        }
        .download-button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .download-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default ImageConverter;