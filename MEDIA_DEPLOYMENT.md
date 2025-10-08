# Media Deployment Strategy

## Current Situation
- Total media: ~166MB
- Large TIF file: 144MB (needs conversion)
- Rest of images: ~22MB
- Video files: ~11MB (already optimized)

## Recommended Approach: Commit to Repository

### Why commit to repo?
1. **Simplicity** - No external dependencies
2. **Performance** - Served directly from Vercel's CDN
3. **Free** - Under GitHub's 1GB repo limit
4. **Version Control** - Track changes to portfolio pieces

### Steps to Deploy:

#### 1. Optimize TIF file (REQUIRED)
```bash
# Convert 144MB TIF to ~2MB JPG
ffmpeg -i "media/hoch15.tif" -quality 95 "media/hoch15.jpg"
rm media/hoch15.tif
```

#### 2. Add to .gitignore exceptions
```gitignore
# In .gitignore, ensure media is tracked
!/media
!/public/images/*.mp4
!/public/images/*.webm
```

#### 3. Commit and push
```bash
git add media/ public/images/
git commit -m "Add portfolio media assets"
git push
```

## Alternative: Use Payload CMS

If client wants to manage images themselves:

1. **Don't commit media folder**
2. **After deployment:**
   - Login to Payload admin
   - Upload images via Media collection
   - Images stored in Vercel Blob

### Pros/Cons

| Approach | Pros | Cons |
|----------|------|------|
| **Commit to repo** | Simple, fast, free | Client can't change easily |
| **Payload upload** | Client control, dynamic | Setup time, complexity |

## File Structure for Deployment

```
/public/images/
  ├── animation.mp4 (8MB) ✅ Optimized
  ├── animation.webm (4MB) ✅ Optimized
  └── gif.gif (246MB) ❌ Remove before deploy

/media/
  ├── hoch15.tif (144MB) ❌ Convert to JPG
  ├── *.jpg (22MB) ✅ Ready
  └── flipbook PDFs ✅ Ready
```

## Quick Decision:
- **Static portfolio?** → Commit to repo
- **Client updates often?** → Use Payload
- **Mix?** → Commit flipbook, Payload for gallery