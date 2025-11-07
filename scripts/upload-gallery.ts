#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function uploadGalleryImages() {
  try {
    const dirPath = 'public/media/gallery';
    const subdirs = await readdir(dirPath, { withFileTypes: true });
    
    console.log(`🚀 Uploading gallery images from ${dirPath}...\n`);
    
    for (const subdir of subdirs) {
      if (subdir.isDirectory()) {
        const subdirPath = join(dirPath, subdir.name);
        const files = await readdir(subdirPath);
        
        console.log(`📁 Processing ${subdir.name} folder (${files.length} files)...`);
        
        for (const file of files) {
          const filePath = join(subdirPath, file);
          const fileBuffer = await readFile(filePath);
          const blobPath = `gallery/${subdir.name}/${file}`;
          
          console.log(`📤 Uploading ${subdir.name}/${file}...`);
          
          const { url } = await put(blobPath, fileBuffer, {
            access: 'public',
            allowOverwrite: true,
          });
          
          console.log(`✅ Uploaded: ${url}`);
        }
        console.log();
      }
    }
    
    console.log('🎉 Gallery images upload complete!');
  } catch (error) {
    console.error('❌ Error uploading gallery images:', error);
  }
}

uploadGalleryImages();