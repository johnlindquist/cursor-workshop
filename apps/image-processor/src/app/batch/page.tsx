'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './batch.module.css';

interface BatchJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export default function BatchPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    grayscale: false,
    sepia: false,
    blur: false,
    sharpen: false,
    vintage: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    
    // Create batch jobs
    const jobs = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      fileName: file.name,
      status: 'pending' as const,
      progress: 0
    }));
    setBatchJobs(jobs);
  };

  const handleFilterToggle = (filter: keyof typeof selectedFilters) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const processBatch = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    // Intentionally inefficient: process sequentially
    for (let i = 0; i < batchJobs.length; i++) {
      setBatchJobs(prev => prev.map((job, idx) => 
        idx === i ? { ...job, status: 'processing' } : job
      ));
      
      // Simulate processing with delays
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setBatchJobs(prev => prev.map((job, idx) => 
          idx === i ? { ...job, progress } : job
        ));
      }
      
      setBatchJobs(prev => prev.map((job, idx) => 
        idx === i ? { ...job, status: 'completed', progress: 100 } : job
      ));
    }
    
    setIsProcessing(false);
  };

  return (
    <div className={styles.batchPage}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Gallery
        </Link>
        <h1>Batch Processing</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.uploadSection}>
          <h2>Select Images</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className={styles.fileInput}
            id="batch-upload"
          />
          <label htmlFor="batch-upload" className={styles.uploadButton}>
            Choose Images ({selectedFiles.length} selected)
          </label>
        </section>

        <section className={styles.filtersSection}>
          <h2>Select Filters to Apply</h2>
          <div className={styles.filterGrid}>
            {Object.entries(selectedFilters).map(([filter, isSelected]) => (
              <label key={filter} className={styles.filterOption}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFilterToggle(filter as keyof typeof selectedFilters)}
                />
                <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.jobsSection}>
          <h2>Processing Queue</h2>
          {batchJobs.length === 0 ? (
            <p className={styles.emptyState}>No images selected</p>
          ) : (
            <div className={styles.jobsList}>
              {batchJobs.map(job => (
                <div key={job.id} className={styles.jobItem}>
                  <span className={styles.fileName}>{job.fileName}</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className={styles.status}>{job.status}</span>
                </div>
              ))}
            </div>
          )}
          
          <button
            className={styles.processButton}
            onClick={processBatch}
            disabled={isProcessing || selectedFiles.length === 0}
          >
            {isProcessing ? 'Processing...' : 'Start Batch Processing'}
          </button>
        </section>
      </main>
    </div>
  );
}