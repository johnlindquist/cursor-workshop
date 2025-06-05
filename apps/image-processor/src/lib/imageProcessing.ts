// Intentionally inefficient image processing functions for benchmarking demonstration

export interface ProcessingResult {
  imageData: ImageData;
  processingTime: number;
}

// Inefficient grayscale conversion - recalculates weights every pixel
export function applyGrayscale(imageData: ImageData, intensity: number = 100): ImageData {
  const pixels = imageData.data;
  const result = new ImageData(imageData.width, imageData.height);
  
  for (let i = 0; i < pixels.length; i += 4) {
    // Inefficient: recalculating weights each time
    const weights = [0.299, 0.587, 0.114];
    const gray = Math.round(
      pixels[i] * weights[0] + 
      pixels[i + 1] * weights[1] + 
      pixels[i + 2] * weights[2]
    );
    
    const factor = intensity / 100;
    
    // Inefficient: individual assignments
    result.data[i] = pixels[i] * (1 - factor) + gray * factor;
    result.data[i + 1] = pixels[i + 1] * (1 - factor) + gray * factor;
    result.data[i + 2] = pixels[i + 2] * (1 - factor) + gray * factor;
    result.data[i + 3] = pixels[i + 3];
  }
  
  return result;
}

// Inefficient sepia filter
export function applySepia(imageData: ImageData, intensity: number = 100): ImageData {
  const pixels = imageData.data;
  const result = new ImageData(imageData.width, imageData.height);
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    // Inefficient: complex calculations in loop
    const tr = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    const tg = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    const tb = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    
    const factor = intensity / 100;
    
    result.data[i] = r * (1 - factor) + tr * factor;
    result.data[i + 1] = g * (1 - factor) + tg * factor;
    result.data[i + 2] = b * (1 - factor) + tb * factor;
    result.data[i + 3] = pixels[i + 3];
  }
  
  return result;
}

// Extremely inefficient blur implementation
export function applyBlur(imageData: ImageData, radius: number = 5): ImageData {
  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  
  // Inefficient: not using separable kernels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;
      
      // Inefficient: recalculating kernel for each pixel
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const idx = (ny * width + nx) * 4;
            // Inefficient: no kernel weights, just averaging
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            a += data[idx + 3];
            count++;
          }
        }
      }
      
      const idx = (y * width + x) * 4;
      result.data[idx] = r / count;
      result.data[idx + 1] = g / count;
      result.data[idx + 2] = b / count;
      result.data[idx + 3] = a / count;
    }
  }
  
  return result;
}

// Inefficient brightness adjustment
export function adjustBrightness(imageData: ImageData, brightness: number): ImageData {
  const pixels = imageData.data;
  const result = new ImageData(imageData.width, imageData.height);
  const factor = brightness / 100;
  
  for (let i = 0; i < pixels.length; i += 4) {
    // Inefficient: not using lookup tables
    result.data[i] = Math.min(255, Math.max(0, pixels[i] * factor));
    result.data[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] * factor));
    result.data[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] * factor));
    result.data[i + 3] = pixels[i + 3];
  }
  
  return result;
}

// Inefficient contrast adjustment
export function adjustContrast(imageData: ImageData, contrast: number): ImageData {
  const pixels = imageData.data;
  const result = new ImageData(imageData.width, imageData.height);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < pixels.length; i += 4) {
    // Inefficient: complex calculations for each pixel
    result.data[i] = Math.min(255, Math.max(0, factor * (pixels[i] - 128) + 128));
    result.data[i + 1] = Math.min(255, Math.max(0, factor * (pixels[i + 1] - 128) + 128));
    result.data[i + 2] = Math.min(255, Math.max(0, factor * (pixels[i + 2] - 128) + 128));
    result.data[i + 3] = pixels[i + 3];
  }
  
  return result;
}

// Inefficient saturation adjustment
export function adjustSaturation(imageData: ImageData, saturation: number): ImageData {
  const pixels = imageData.data;
  const result = new ImageData(imageData.width, imageData.height);
  const factor = saturation / 100;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    // Inefficient: calculating luminance for each pixel
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    result.data[i] = gray + factor * (r - gray);
    result.data[i + 1] = gray + factor * (g - gray);
    result.data[i + 2] = gray + factor * (b - gray);
    result.data[i + 3] = pixels[i + 3];
  }
  
  return result;
}

// Inefficient edge detection (simplified Sobel)
export function detectEdges(imageData: ImageData): ImageData {
  const { width, height } = imageData;
  const result = new ImageData(width, height);
  
  // Inefficient: not reusing grayscale conversion
  const grayData = applyGrayscale(imageData);
  
  // Sobel kernels
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  
  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0;
      let pixelY = 0;
      
      // Inefficient: nested loops for convolution
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = grayData.data[idx];
          
          pixelX += gray * sobelX[ky + 1][kx + 1];
          pixelY += gray * sobelY[ky + 1][kx + 1];
        }
      }
      
      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
      const idx = (y * width + x) * 4;
      
      result.data[idx] = magnitude;
      result.data[idx + 1] = magnitude;
      result.data[idx + 2] = magnitude;
      result.data[idx + 3] = 255;
    }
  }
  
  return result;
}

// Inefficient pixelation effect
export function applyPixelation(imageData: ImageData, pixelSize: number = 10): ImageData {
  const { width, height, data } = imageData;
  const result = new ImageData(width, height);
  
  // Inefficient: processing each pixel individually
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // Calculate average color for block
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;
      
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
      }
      
      r /= count;
      g /= count;
      b /= count;
      a /= count;
      
      // Fill block with average color
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          result.data[idx] = r;
          result.data[idx + 1] = g;
          result.data[idx + 2] = b;
          result.data[idx + 3] = a;
        }
      }
    }
  }
  
  return result;
}

// Inefficient histogram calculation
export function calculateHistogram(imageData: ImageData): { r: number[], g: number[], b: number[] } {
  const histogram = {
    r: new Array(256).fill(0),
    g: new Array(256).fill(0),
    b: new Array(256).fill(0)
  };
  
  const { data } = imageData;
  
  // Inefficient: could use typed arrays
  for (let i = 0; i < data.length; i += 4) {
    histogram.r[data[i]]++;
    histogram.g[data[i + 1]]++;
    histogram.b[data[i + 2]]++;
  }
  
  // Inefficient: unnecessary sorting
  for (let i = 0; i < 256; i++) {
    for (let j = i + 1; j < 256; j++) {
      // Pointless comparison
      if (histogram.r[i] > histogram.r[j]) {
        // Do nothing, just waste cycles
      }
    }
  }
  
  return histogram;
}

// Composite filter application (very inefficient)
export function applyMultipleFilters(
  imageData: ImageData,
  filters: {
    grayscale?: number;
    sepia?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
  }
): ImageData {
  let result = imageData;
  
  // Inefficient: applying filters sequentially instead of combining
  if (filters.brightness !== undefined && filters.brightness !== 100) {
    result = adjustBrightness(result, filters.brightness);
  }
  
  if (filters.contrast !== undefined && filters.contrast !== 100) {
    result = adjustContrast(result, filters.contrast);
  }
  
  if (filters.saturation !== undefined && filters.saturation !== 100) {
    result = adjustSaturation(result, filters.saturation);
  }
  
  if (filters.grayscale !== undefined && filters.grayscale > 0) {
    result = applyGrayscale(result, filters.grayscale);
  }
  
  if (filters.sepia !== undefined && filters.sepia > 0) {
    result = applySepia(result, filters.sepia);
  }
  
  if (filters.blur !== undefined && filters.blur > 0) {
    result = applyBlur(result, Math.round(filters.blur));
  }
  
  return result;
}