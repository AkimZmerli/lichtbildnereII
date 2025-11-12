#!/usr/bin/env tsx

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { put } from '@vercel/blob';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

// Folders to upload with their blob destinations
const COLLECTIONS = [
  { 
    localPath: 'public/media/human', 
    blobPath: 'human',
    description: 'Human gallery images'
  },
  { 
    localPath: 'public/media/non-human', 
    blobPath: 'non-human',
    description: 'Non-human gallery images'
  },
  { 
    localPath: 'public/media/works-preview', 
    blobPath: 'works-preview',
    description: 'Works preview images'
  },
];

async function uploadCollections() {
  try {
    console.log('🚀 Starting upload of collections to blob storage...\n');
    
    let totalFiles = 0;
    let totalUploaded = 0;
    
    for (const collection of COLLECTIONS) {
      console.log(`📁 Processing collection: ${collection.description}`);
      console.log(`   Local:  ${collection.localPath}`);
      console.log(`   Blob:   ${collection.blobPath}/`);
      
      try {
        // Check if directory exists
        await stat(collection.localPath);
        
        const files = await readdir(collection.localPath);
        console.log(`   Found:  ${files.length} files\n`);
        
        totalFiles += files.length;
        
        for (const file of files) {
          const filePath = join(collection.localPath, file);
          const fileStats = await stat(filePath);
          
          // Skip if it's a directory
          if (fileStats.isDirectory()) {
            console.log(`   ⏭️  Skipping directory: ${file}`);
            continue;
          }
          
          const fileBuffer = await readFile(filePath);
          const blobPath = `${collection.blobPath}/${file}`;
          
          console.log(`   📤 Uploading ${file}... (${Math.round(fileStats.size / 1024)}KB)`);
          
          const { url } = await put(blobPath, fileBuffer, {
            access: 'public',
            allowOverwrite: true,
          });
          
          console.log(`   ✅ Uploaded: ${url}`);
          totalUploaded++;
        }
        
        console.log(`   🎯 Collection complete: ${collection.blobPath}/\n`);
        
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          console.log(`   ⚠️  Directory not found: ${collection.localPath}`);
          console.log(`   ⏭️  Skipping this collection...\n`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('🎉 Upload complete!');
    console.log(`📊 Summary: ${totalUploaded}/${totalFiles} files uploaded successfully`);
    
  } catch (error) {
    console.error('❌ Error uploading collections:', error);
    process.exit(1);
  }
}

// Run the upload function
uploadCollections();