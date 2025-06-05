'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './editor.module.css';
import { useImages } from '../../contexts/ImageContext';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpen: number;
  grayscale: number;
  sepia: number;
  invert: number;
  pixelation: number;
  posterize: number;
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { getImage, updateImage } = useImages();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 800, height: 600 });
  
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sharpen: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    pixelation: 1,
    posterize: 256
  });

  useEffect(() => {
    const imageId = params.id as string;
    const imageData = getImage(imageId);
    
    if (!imageData) {
      // Redirect back to home if image not found
      router.push('/');
      return;
    }
    
    // Load the actual image
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      
      // Set canvas dimensions
      if (canvasRef.current && previewCanvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        previewCanvasRef.current.width = img.width;
        previewCanvasRef.current.height = img.height;
        
        // Draw original image
        const ctx = canvasRef.current.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        // Store original image data
        setOriginalImage(ctx.getImageData(0, 0, img.width, img.height));
        
        // Also draw to preview canvas initially
        const previewCtx = previewCanvasRef.current.getContext('2d')!;
        previewCtx.drawImage(img, 0, 0);
      }
    };
    img.src = imageData.processedUrl || imageData.originalUrl;
  }, [params.id, getImage, router]);

  const handleFilterChange = (filterName: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    applyFilters();
  };

  const applyFilters = () => {
    if (!originalImage || !canvasRef.current || !previewCanvasRef.current) return;
    
    setIsProcessing(true);
    
    // Apply filters with intentional inefficiencies
    setTimeout(() => {
      const ctx = previewCanvasRef.current!.getContext('2d')!;
      const processedData = processImage(originalImage, filters);
      ctx.putImageData(processedData, 0, 0);
      setIsProcessing(false);
    }, 50);
  };

  // Intentionally inefficient image processing
  const processImage = (imageData: ImageData, settings: FilterSettings): ImageData => {
    const result = new ImageData(imageData.width, imageData.height);
    const pixels = imageData.data;
    const outputPixels = result.data;

    // Apply filters sequentially (inefficient)
    for (let i = 0; i < pixels.length; i += 4) {
      let r = pixels[i];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      let a = pixels[i + 3];

      // Brightness (inefficient: recalculating factor each time)
      const brightnessFactor = settings.brightness / 100;
      r = Math.min(255, r * brightnessFactor);
      g = Math.min(255, g * brightnessFactor);
      b = Math.min(255, b * brightnessFactor);

      // Contrast (inefficient: complex calculations in loop)
      const contrastFactor = (settings.contrast - 100) / 100;
      r = Math.min(255, Math.max(0, ((r / 255 - 0.5) * (1 + contrastFactor) + 0.5) * 255));
      g = Math.min(255, Math.max(0, ((g / 255 - 0.5) * (1 + contrastFactor) + 0.5) * 255));
      b = Math.min(255, Math.max(0, ((b / 255 - 0.5) * (1 + contrastFactor) + 0.5) * 255));

      // Grayscale (inefficient: recalculating weights)
      if (settings.grayscale > 0) {
        const weights = [0.299, 0.587, 0.114]; // Should be constants
        const gray = r * weights[0] + g * weights[1] + b * weights[2];
        const factor = settings.grayscale / 100;
        r = r * (1 - factor) + gray * factor;
        g = g * (1 - factor) + gray * factor;
        b = b * (1 - factor) + gray * factor;
      }

      outputPixels[i] = r;
      outputPixels[i + 1] = g;
      outputPixels[i + 2] = b;
      outputPixels[i + 3] = a;
    }

    return result;
  };

  return (
    <div className={styles.editor}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Gallery
        </Link>
        <h1>Image Editor</h1>
        <button className={styles.saveButton}>
          Save Image
        </button>
      </header>

      <div className={styles.workspace}>
        <div className={styles.canvasContainer}>
          <canvas 
            ref={canvasRef} 
            className={styles.canvas}
            width={imageDimensions.width}
            height={imageDimensions.height}
            style={{ display: 'none' }}
          />
          <canvas 
            ref={previewCanvasRef} 
            className={styles.previewCanvas}
            width={imageDimensions.width}
            height={imageDimensions.height}
          />
          {isProcessing && <div className={styles.processingOverlay}>Processing...</div>}
        </div>

        <aside className={styles.controls}>
          <h2>Adjustments</h2>
          
          <div className={styles.filterGroup}>
            <label>
              Brightness: {filters.brightness}%
              <input
                type="range"
                min="0"
                max="200"
                value={filters.brightness}
                onChange={(e) => handleFilterChange('brightness', Number(e.target.value))}
              />
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label>
              Contrast: {filters.contrast}%
              <input
                type="range"
                min="0"
                max="200"
                value={filters.contrast}
                onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
              />
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label>
              Saturation: {filters.saturation}%
              <input
                type="range"
                min="0"
                max="200"
                value={filters.saturation}
                onChange={(e) => handleFilterChange('saturation', Number(e.target.value))}
              />
            </label>
          </div>

          <h2>Effects</h2>

          <div className={styles.filterGroup}>
            <label>
              Grayscale: {filters.grayscale}%
              <input
                type="range"
                min="0"
                max="100"
                value={filters.grayscale}
                onChange={(e) => handleFilterChange('grayscale', Number(e.target.value))}
              />
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label>
              Sepia: {filters.sepia}%
              <input
                type="range"
                min="0"
                max="100"
                value={filters.sepia}
                onChange={(e) => handleFilterChange('sepia', Number(e.target.value))}
              />
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label>
              Blur: {filters.blur}px
              <input
                type="range"
                min="0"
                max="20"
                value={filters.blur}
                onChange={(e) => handleFilterChange('blur', Number(e.target.value))}
              />
            </label>
          </div>

          <button 
            className={styles.resetButton}
            onClick={() => setFilters({
              brightness: 100,
              contrast: 100,
              saturation: 100,
              blur: 0,
              sharpen: 0,
              grayscale: 0,
              sepia: 0,
              invert: 0,
              pixelation: 1,
              posterize: 256
            })}
          >
            Reset All Filters
          </button>
        </aside>
      </div>
    </div>
  );
}