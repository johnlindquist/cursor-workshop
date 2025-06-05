'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './presets.module.css';

interface Preset {
  id: string;
  name: string;
  description: string;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
    sepia: number;
    blur: number;
  };
}

const defaultPresets: Preset[] = [
  {
    id: '1',
    name: 'Vintage',
    description: 'Classic vintage photo effect',
    filters: {
      brightness: 110,
      contrast: 120,
      saturation: 60,
      grayscale: 0,
      sepia: 40,
      blur: 0
    }
  },
  {
    id: '2',
    name: 'Black & White',
    description: 'Classic monochrome',
    filters: {
      brightness: 100,
      contrast: 110,
      saturation: 0,
      grayscale: 100,
      sepia: 0,
      blur: 0
    }
  },
  {
    id: '3',
    name: 'Dreamy',
    description: 'Soft, ethereal look',
    filters: {
      brightness: 120,
      contrast: 90,
      saturation: 110,
      grayscale: 0,
      sepia: 0,
      blur: 2
    }
  }
];

export default function PresetsPage() {
  const [presets] = useState<Preset[]>(defaultPresets);

  return (
    <div className={styles.presetsPage}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Gallery
        </Link>
        <h1>Filter Presets</h1>
        <button 
          className={styles.createButton}
          onClick={() => console.log('Create preset')}
        >
          Create New Preset
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.presetGrid}>
          {presets.map(preset => (
            <div key={preset.id} className={styles.presetCard}>
              <div className={styles.presetHeader}>
                <h3>{preset.name}</h3>
                <button className={styles.deleteButton}>×</button>
              </div>
              <p className={styles.presetDescription}>{preset.description}</p>
              
              <div className={styles.filtersList}>
                {Object.entries(preset.filters).map(([filter, value]) => (
                  value !== 100 && value !== 0 && (
                    <span key={filter} className={styles.filterTag}>
                      {filter}: {value}
                    </span>
                  )
                ))}
              </div>
              
              <button className={styles.applyButton}>
                Apply to Images
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}