# Storage Migration Guide (Vercel Blob → S3)

## Current Setup
✅ **Vercel Blob** (Free up to 1GB)
- Automatic setup in Vercel
- Zero configuration
- Perfect for < 1GB media

## When to Migrate to S3
- When approaching 1GB limit
- When Vercel shows storage warnings
- Before uploads start failing

## Migration Steps (When Needed)

### 1. Choose S3 Provider

| Provider | Cost for 5GB | Setup | Best For |
|----------|--------------|-------|----------|
| **Cloudflare R2** | $0.075/month | Easy | Best value |
| **AWS S3** | $0.12/month | Medium | Most features |
| **Backblaze B2** | $0.03/month | Easy | Cheapest |

### 2. Set Up S3 (Cloudflare R2 Example)

1. **Create R2 Bucket:**
   - Login to Cloudflare
   - Go to R2 → Create Bucket
   - Name: `portfolio-media`

2. **Generate API Credentials:**
   - R2 → Manage API Tokens
   - Create token with Read/Write permissions
   - Save credentials

### 3. Update Vercel Environment Variables

Add these variables (S3 will automatically activate):
```
S3_BUCKET=portfolio-media
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=auto
S3_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
```

Remove or keep (doesn't matter):
```
BLOB_READ_WRITE_TOKEN=xxx
```

### 4. Migrate Existing Files

```bash
# Download from Vercel Blob
vercel blob download --all ./media-backup

# Upload to S3 (using AWS CLI)
aws s3 sync ./media-backup s3://portfolio-media/media/ --endpoint-url=https://[account-id].r2.cloudflarestorage.com

# Or use rclone for easier migration
rclone copy ./media-backup r2:portfolio-media/media/
```

### 5. Redeploy
```bash
git push
```

## How It Works

Your `payload.config.ts` automatically detects storage:
1. **If S3 variables exist** → Uses S3
2. **If only Blob token exists** → Uses Vercel Blob
3. **If neither** → Local storage (dev only)

## Cost Comparison

| Storage Size | Vercel Blob | Cloudflare R2 | AWS S3 |
|-------------|-------------|---------------|---------|
| < 1GB | FREE | $0.015/month | $0.02/month |
| 5GB | $20/month* | $0.075/month | $0.12/month |
| 10GB | $20/month* | $0.15/month | $0.23/month |
| 50GB | $20/month* | $0.75/month | $1.15/month |

*Vercel Pro includes 100GB

## Quick Decision Tree

```
Is media < 1GB?
  ├─ YES → Use Vercel Blob (FREE)
  └─ NO → 
      Is media < 100GB?
        ├─ YES → Use Cloudflare R2 ($0.015/GB)
        └─ NO → Consider dedicated CDN

Budget < $20/month?
  ├─ YES → Use R2/S3 when > 1GB
  └─ NO → Stay with Vercel Pro (easier)
```

## Emergency Fallback

If storage fails during deployment:
1. Remove all storage env variables
2. Deploy without cloud storage
3. Files save locally (temporary fix)
4. Fix storage configuration
5. Redeploy

## Monitoring Usage

Check Vercel Blob usage:
```bash
vercel blob ls --size
```

Or in Vercel Dashboard:
- Project → Storage → Blob → Usage

## Notes
- Migration is one-way (keep backups!)
- URLs change when migrating
- Test with staging environment first
- S3 is more complex but much cheaper at scale