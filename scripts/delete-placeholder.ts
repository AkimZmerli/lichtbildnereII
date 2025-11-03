#!/usr/bin/env tsx

import { del } from '@vercel/blob';

async function deletePlaceholder() {
  try {
    await del('https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/flipbook-images/placeholderSocial.png');
    console.log('✅ Deleted placeholderSocial.png');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deletePlaceholder();