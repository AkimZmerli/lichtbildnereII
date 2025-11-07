#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function uploadFlipbookImages() {
  try {
    const dirPath = 'public/media/flipbook-images';
    const files = await readdir(dirPath);
    
    console.log(`🚀 Uploading ${files.length} files from ${dirPath}...\n`);
    
    for (const file of files) {
      const filePath = join(dirPath, file);
      const fileBuffer = await readFile(filePath);
      const blobPath = `flipbook-images/${file}`;
      
      console.log(`📤 Uploading ${file}...`);
      
      const { url } = await put(blobPath, fileBuffer, {
        access: 'public',
        allowOverwrite: true,
      });
      
      console.log(`✅ Uploaded: ${url}`);
    }
    
    console.log('\n🎉 Flipbook images upload complete!');
  } catch (error) {
    console.error('❌ Error uploading flipbook images:', error);
  }
}

uploadFlipbookImages();