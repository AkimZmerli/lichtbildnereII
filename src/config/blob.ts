export const BLOB_BASE_URL = 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com';

export const getImageUrl = (path: string): string => {
  // Remove leading slash and /media/ prefix if present
  const cleanPath = path.replace(/^\/?(media\/)?/, '');
  return `${BLOB_BASE_URL}/${cleanPath}`;
};