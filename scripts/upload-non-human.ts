#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function uploadNonHumanGallery() {
  const dirPath = 'public/media/gallery/non-human';
  const blobPrefix = 'gallery/non-human';
  
  try {
    console.log(`🚀 Starting upload of ${dirPath} to blob storage...\n`);
    
    const items = await readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.webp')) {
        const itemPath = join(dirPath, item.name);
        const fileBuffer = await readFile(itemPath);
        const blobPath = `${blobPrefix}/${item.name}`;
        
        console.log(`Uploading ${itemPath} to ${blobPath}...`);
        
        const { url } = await put(blobPath, fileBuffer, {
          access: 'public',
          allowOverwrite: true,
        });
        
        console.log(`✅ Uploaded: ${url}`);
      }
    }
    
    console.log('\n🎉 Non-human gallery upload complete!');
  } catch (error) {
    console.error(`❌ Error uploading ${dirPath}:`, error);
  }
}

uploadNonHumanGallery().catch(console.error);