#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';

async function uploadJPGFile() {
  const filePath = 'public/media/gallery/non-human/22 - No Human.jpg';
  const blobPath = 'gallery/non-human/22 - No Human.jpg';
  
  try {
    console.log(`🚀 Uploading ${filePath} to blob storage...\n`);
    
    const fileBuffer = await readFile(filePath);
    
    console.log(`Uploading ${filePath} to ${blobPath}...`);
    
    const { url } = await put(blobPath, fileBuffer, {
      access: 'public',
      allowOverwrite: true,
    });
    
    console.log(`✅ Uploaded: ${url}`);
    console.log('\n🎉 JPG upload complete!');
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error);
  }
}

uploadJPGFile().catch(console.error);