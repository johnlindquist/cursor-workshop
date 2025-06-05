'use client';

import styles from './page.module.css';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import { useImages } from './contexts/ImageContext';

export default function Home() {
  const { images } = useImages();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Image Transformation Service</h1>
      <p className={styles.description}>
        Upload images to apply filters and transformations
      </p>
      
      <nav className={styles.navigation}>
        <a href="/batch" className={styles.navLink}>
          Batch Processing
        </a>
        <a href="/presets" className={styles.navLink}>
          Filter Presets
        </a>
      </nav>
      
      <ImageUpload />
      
      {images.length > 0 && (
        <ImageGallery images={images} />
      )}
    </main>
  );
}