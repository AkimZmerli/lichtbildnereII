#!/usr/bin/env tsx

import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import sharp from 'sharp';

interface ConversionStats {
  totalFiles: number;
  convertedFiles: number;
  totalSizeBefore: number;
  totalSizeAfter: number;
  errors: string[];
}

async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function convertImageToWebP(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .webp({ quality: 85, effort: 6 }) // High quality with good compression
    .toFile(outputPath);
}

async function processDirectory(dirPath: string, stats: ConversionStats): Promise<void> {
  try {
    const items = await readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(itemPath, stats);
      } else if (item.isFile()) {
        const ext = extname(item.name).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          stats.totalFiles++;
          
          try {
            // Calculate original file size
            const originalSize = await getFileSize(itemPath);
            stats.totalSizeBefore += originalSize;
            
            // Create output path with .webp extension
            const outputPath = join(dirname(itemPath), `${basename(item.name, ext)}.webp`);
            
            console.log(`Converting ${itemPath} → ${outputPath}...`);
            
            await convertImageToWebP(itemPath, outputPath);
            
            // Calculate converted file size
            const convertedSize = await getFileSize(outputPath);
            stats.totalSizeAfter += convertedSize;
            stats.convertedFiles++;
            
            const savings = ((originalSize - convertedSize) / originalSize * 100).toFixed(1);
            console.log(`✅ Saved ${savings}% (${(originalSize / 1024).toFixed(1)}KB → ${(convertedSize / 1024).toFixed(1)}KB)`);
            
          } catch (error) {
            const errorMsg = `Failed to convert ${itemPath}: ${error}`;
            console.error(`❌ ${errorMsg}`);
            stats.errors.push(errorMsg);
          }
        }
      }
    }
  } catch (error) {
    const errorMsg = `Error processing directory ${dirPath}: ${error}`;
    console.error(`❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
  }
}

async function main() {
  console.log('🚀 Starting WebP conversion...\n');
  
  const stats: ConversionStats = {
    totalFiles: 0,
    convertedFiles: 0,
    totalSizeBefore: 0,
    totalSizeAfter: 0,
    errors: []
  };
  
  // Process all media directories
  const directories = [
    'public/media/hero',
    'public/media/gallery',
    'public/media/exhibition',
    'public/media/flipbook-images',
    'public/flipbook-images'
  ];
  
  for (const dir of directories) {
    console.log(`\n📁 Processing ${dir}...`);
    await processDirectory(dir, stats);
  }
  
  // Print summary
  console.log('\n📊 Conversion Summary:');
  console.log(`Total files processed: ${stats.totalFiles}`);
  console.log(`Successfully converted: ${stats.convertedFiles}`);
  console.log(`Failed conversions: ${stats.errors.length}`);
  
  if (stats.totalSizeBefore > 0) {
    const totalSavings = ((stats.totalSizeBefore - stats.totalSizeAfter) / stats.totalSizeBefore * 100).toFixed(1);
    console.log(`Total size reduction: ${totalSavings}% (${(stats.totalSizeBefore / 1024 / 1024).toFixed(2)}MB → ${(stats.totalSizeAfter / 1024 / 1024).toFixed(2)}MB)`);
  }
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  console.log('\n🎉 WebP conversion complete!');
}

main().catch(console.error);