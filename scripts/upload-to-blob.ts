#!/usr/bin/env tsx

import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function uploadDirectory(dirPath: string, blobPrefix: string) {
  try {
    const items = await readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // Recursively upload subdirectories
        await uploadDirectory(itemPath, `${blobPrefix}/${item.name}`);
      } else if (item.isFile()) {
        const fileBuffer = await readFile(itemPath);
        const blobPath = `${blobPrefix}/${item.name}`;
        
        console.log(`Uploading ${itemPath} to ${blobPath}...`);
        
        const { url } = await put(blobPath, fileBuffer, {
          access: 'public',
        });
        
        console.log(`✅ Uploaded: ${url}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error uploading ${dirPath}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting blob upload...\n');
  
  // Upload all media directories
  await uploadDirectory('public/media/gallery', 'gallery');
  await uploadDirectory('public/media/exhibition', 'exhibition');
  await uploadDirectory('public/media/flipbook-images', 'flipbook-images');
  await uploadDirectory('public/flipbook-images', 'social-book');
  
  console.log('\n🎉 Upload complete!');
}

main().catch(console.error);