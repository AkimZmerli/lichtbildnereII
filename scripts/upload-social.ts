#!/usr/bin/env tsx

import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';

async function uploadSocial() {
  try {
    const file = await readFile('public/media/flipbook-images/Social.png');
    const { url } = await put('flipbook-images/Social.png', file, { access: 'public' });
    console.log('✅ Uploaded Social.png:', url);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

uploadSocial();