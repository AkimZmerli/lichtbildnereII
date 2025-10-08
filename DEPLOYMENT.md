# Deployment Instructions

## Prerequisites Completed
- ✅ Vercel account set up
- ✅ Neon PostgreSQL database configured
- ✅ Cloudflare R2/S3 bucket created

## Environment Variables to Configure in Vercel

### 1. Database Configuration (Neon)
```
POSTGRES_HOST=<your-neon-host>.neon.tech
POSTGRES_PORT=5432
POSTGRES_DB=<your-database-name>
POSTGRES_USER=<your-username>
POSTGRES_PASSWORD=<your-password>
```

### 2. Cloudflare R2 Configuration
```
S3_BUCKET=<your-bucket-name>
S3_ACCESS_KEY_ID=<your-r2-access-key-id>
S3_SECRET_ACCESS_KEY=<your-r2-secret-access-key>
S3_REGION=auto
S3_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
```

### 3. Application Configuration
```
PAYLOAD_SECRET=<generate-a-secure-random-string>
NEXT_PUBLIC_SERVER_URL=https://<your-production-domain>.vercel.app
NODE_ENV=production
```

## Getting Your Credentials

### Neon Database
1. Log into your Neon dashboard
2. Navigate to your project
3. Find connection details in the dashboard
4. Copy the connection string components

### Cloudflare R2
1. Log into Cloudflare dashboard
2. Go to R2 Object Storage
3. Create or select your bucket
4. Generate API tokens:
   - Go to R2 → Manage API Tokens
   - Create a new API token with Object Read & Write permissions
   - Save the Access Key ID and Secret Access Key

### Set Environment Variables in Vercel
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable listed above
4. Make sure to select "Production" environment

## Deploy Steps

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add S3 storage configuration"
   git push origin main
   ```

2. **In Vercel Dashboard:**
   - Import your GitHub repository (if not already done)
   - Configure environment variables
   - Deploy

3. **After Deployment:**
   - Run database migrations (if needed)
   - Test media uploads
   - Configure custom domain (if available)

## Troubleshooting

### Database Connection Issues
- Ensure SSL is enabled in production
- Check firewall/IP allowlist in Neon dashboard
- Verify credentials are correct

### Media Upload Issues
- Check R2 bucket permissions
- Verify CORS settings in Cloudflare R2
- Ensure API tokens have correct permissions

### Build Failures
- Check build logs in Vercel
- Ensure all environment variables are set
- Verify package.json scripts are correct