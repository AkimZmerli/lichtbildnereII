#!/usr/bin/env tsx

import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function uploadFile(filePath: string, blobPath: string) {
  try {
    const fileBuffer = await readFile(filePath);
    
    console.log(`Uploading ${filePath} to ${blobPath}...`);
    
    const { url } = await put(blobPath, fileBuffer, {
      access: 'public',
    });
    
    console.log(`✅ Uploaded: ${url}`);
    return url;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting preview images upload...\n');
  
  // Upload works preview images
  const humanUrl = await uploadFile(
    'public/media/works-preview/WorksPreviewHuman.png', 
    'works-preview/WorksPreviewHuman.png'
  );
  
  const nonHumanUrl = await uploadFile(
    'public/media/works-preview/WorksPreviewNonHuman.png', 
    'works-preview/WorksPreviewNonHuman.png'
  );
  
  // Upload social book preview
  const socialUrl = await uploadFile(
    'public/images/placeholderSocial.png', 
    'social-book/placeholderSocial.png'
  );
  
  console.log('\n📋 Blob URLs generated:');
  console.log('Human preview:', humanUrl);
  console.log('Non-Human preview:', nonHumanUrl);
  console.log('Social book preview:', socialUrl);
  
  console.log('\n🎉 Upload complete!');
}

main().catch(console.error);