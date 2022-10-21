"use strict";

export function getHeightmapData(image, size) {
    const canvas = document.createElement("canvas");
  
    // Assume the image is square:
    canvas.width = size;
    canvas.height = size;
  
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
  
    context.drawImage(image, 0, 0, size, size);
  
    const imageData = context.getImageData(0, 0, size, size).data;
  
    const data = new Float32Array(size * size);
    for (let i = 0; i < imageData.length; i += 4) {
      data[i / 4] = imageData[i] / 255;
    }
  
    return data;
  }