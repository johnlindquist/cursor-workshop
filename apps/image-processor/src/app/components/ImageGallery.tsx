'use client';

import Link from 'next/link';
import styles from './ImageGallery.module.css';
import { ProcessedImage } from '../contexts/ImageContext';

interface ImageGalleryProps {
  images: ProcessedImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className={styles.gallery}>
      <h2 className={styles.galleryTitle}>Your Images</h2>
      <div className={styles.imageGrid}>
        {images.map((image) => (
          <Link
            key={image.id}
            href={`/editor/${image.id}`}
            className={styles.imageCard}
          >
            <img
              src={image.processedUrl || image.originalUrl}
              alt={image.name}
              className={styles.thumbnail}
            />
            <div className={styles.imageInfo}>
              <p className={styles.imageName}>{image.name}</p>
              <p className={styles.clickToEdit}>Click to edit</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}