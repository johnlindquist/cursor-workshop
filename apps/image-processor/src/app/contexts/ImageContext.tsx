'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  name: string;
  width: number;
  height: number;
  timestamp: number;
}

interface ImageContextType {
  images: ProcessedImage[];
  addImage: (image: ProcessedImage) => void;
  updateImage: (id: string, updates: Partial<ProcessedImage>) => void;
  getImage: (id: string) => ProcessedImage | undefined;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<ProcessedImage[]>([]);

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.originalUrl.startsWith('blob:')) {
          URL.revokeObjectURL(image.originalUrl);
        }
        if (image.processedUrl && image.processedUrl.startsWith('blob:')) {
          URL.revokeObjectURL(image.processedUrl);
        }
      });
    };
  }, [images]);

  const addImage = (image: ProcessedImage) => {
    setImages(prev => [...prev, image]);
  };

  const updateImage = (id: string, updates: Partial<ProcessedImage>) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  const getImage = (id: string) => {
    return images.find(img => img.id === id);
  };

  return (
    <ImageContext.Provider value={{ images, addImage, updateImage, getImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
}