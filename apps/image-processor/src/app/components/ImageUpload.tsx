'use client';

import { useRef } from 'react';
import styles from './ImageUpload.module.css';
import { useImages } from '../contexts/ImageContext';

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImage } = useImages();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        addImage({
          id: `${Date.now()}-${i}`,
          name: file.name,
          originalUrl: url,
          width: img.width,
          height: img.height,
          timestamp: Date.now()
        });
      };
      img.src = url;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className={styles.fileInput}
        id="image-upload"
      />
      <label htmlFor="image-upload" className={styles.uploadButton}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>Upload Images</span>
      </label>
      <p className={styles.hint}>
        Select one or more images to begin editing
      </p>
    </div>
  );
}