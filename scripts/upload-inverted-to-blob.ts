#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { put } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function uploadInvertedImages() {
  console.log('🚀 Starting inverted gallery images upload to blob...\n');

  const invertedDir = 'public/media/gallery/inverted';
  
  try {
    const files = await readdir(invertedDir);
    console.log('Found files:', files);

    for (const fileName of files) {
      const filePath = join(invertedDir, fileName);
      const fileBuffer = await readFile(filePath);

      // Determine destination based on filename
      let blobPath: string;
      if (fileName.includes('No Human.webp')) {
        // 18, 19, 21 - No Human.webp files go to non-human gallery
        blobPath = `gallery/non-human/${fileName}`;
        console.log(`📁 Uploading ${fileName} to non-human gallery...`);
      } else if (fileName.includes('Human.webp')) {
        // 20 - Human.webp goes to human gallery
        blobPath = `gallery/human/${fileName}`;
        console.log(`📁 Uploading ${fileName} to human gallery...`);
      } else {
        console.log(`⏭️  Skipping ${fileName} (doesn't match expected pattern)`);
        continue;
      }

      const { url } = await put(blobPath, fileBuffer, {
        access: 'public',
        allowOverwrite: true,
      });

      console.log(`✅ Uploaded: ${url}`);
    }

    console.log('\n🎉 Inverted gallery upload complete!');
    console.log('\nFiles uploaded:');
    console.log('• 20 - Human.webp → gallery/human/');
    console.log('• 18 - No Human.webp → gallery/non-human/');
    console.log('• 19 - No Human.webp → gallery/non-human/');
    console.log('• 21 - No Human.webp → gallery/non-human/');

  } catch (error) {
    console.error('❌ Error during upload:', error);
  }
}

uploadInvertedImages().catch(console.error);