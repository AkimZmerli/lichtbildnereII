#!/usr/bin/env tsx

import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';

async function uploadPlaceholder() {
  try {
    const file = await readFile('public/media/flipbook-images/placeholderSocial.png');
    const { url } = await put('flipbook-images/placeholderSocial.png', file, { access: 'public' });
    console.log('✅ Uploaded placeholder:', url);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

uploadPlaceholder();