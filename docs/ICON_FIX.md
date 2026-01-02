# Temporary Icon Placeholder

The icon-192.png and icon-512.png files are referenced in the manifest but don't exist yet.

## Quick Fix

For now, you can either:

1. **Remove the manifest reference** (temporary):
   - Comment out the manifest line in `app/layout.tsx`

2. **Create placeholder icons**:
   - Use the generated favicon image
   - Resize to 192x192 and 512x512
   - Save as `public/icon-192.png` and `public/icon-512.png`

3. **Use online tool**:
   - Visit https://realfavicongenerator.net/
   - Upload the generated favicon
   - Download all sizes

The 404 error won't affect functionality, but it's best to add the icons for a complete PWA experience.
