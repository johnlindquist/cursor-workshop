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
      
      <div className={styles.projectInfo}>
        <h2>AI-Driven Benchmarking Workshop</h2>
        <p>
          Learn how to use Cursor IDE and AI assistance to automatically implement performance 
          benchmarking in a real-world image processing application. This project contains 
          intentional performance bottlenecks perfect for demonstrating AI-driven optimization.
        </p>
        <h3>Workshop Focus:</h3>
        <ul>
          <li><strong>Vitest Setup</strong>: Use AI to configure and implement performance benchmarks</li>
          <li><strong>AI-Driven Analysis</strong>: Let AI identify bottlenecks and suggest optimizations</li>
          <li><strong>Automated Testing</strong>: Generate comprehensive benchmark suites with AI assistance</li>
        </ul>
        <p>
          You'll use Cursor IDE to prompt AI for setting up Vitest benchmarks, analyzing 
          performance metrics, and implementing optimizations—all through natural language prompts.
        </p>
      </div>
      
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