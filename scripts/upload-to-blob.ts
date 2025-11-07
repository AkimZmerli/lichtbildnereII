#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function uploadDirectory(dirPath: string, blobPrefix: string, uploadWebPOnly = true) {
  try {
    const items = await readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // Recursively upload subdirectories
        await uploadDirectory(itemPath, `${blobPrefix}/${item.name}`, uploadWebPOnly);
      } else if (item.isFile()) {
        // Only upload WebP files (and one remaining JPG for the failed conversion)
        const isWebP = item.name.endsWith('.webp');
        const isFailedJPG = item.name === '22 - No Human.jpg';
        
        if (uploadWebPOnly && !(isWebP || isFailedJPG)) {
          console.log(`⏭️  Skipping ${itemPath} (not WebP format)`);
          continue;
        }
        
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
  } catch (error) {
    console.error(`❌ Error uploading ${dirPath}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting WebP blob upload...\n');
  
  // Upload all media directories (WebP files only)
  await uploadDirectory('public/media/hero', 'hero');
  await uploadDirectory('public/media/gallery', 'gallery');
  await uploadDirectory('public/media/exhibition', 'exhibition');
  await uploadDirectory('public/media/flipbook-images', 'flipbook-images');
  await uploadDirectory('public/flipbook-images', 'flipbook-images'); // Updated to use same blob path as the other flipbook images
  
  console.log('\n🎉 WebP upload complete!');
}

main().catch(console.error);