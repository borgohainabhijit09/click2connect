# Image Setup Instructions

## Generated Images

I've generated the following images for you:
1. **Logo/Favicon** - A professional Click2Connect logo
2. **Open Graph Image** - Social media preview image (1200x630)

## Manual Steps Required

### 1. Copy Generated Images

The images have been generated and saved. You need to:

1. **For the logo/favicon:**
   - Resize to 192x192 and save as `public/icon-192.png`
   - Resize to 512x512 and save as `public/icon-512.png`
   - Resize to 180x180 and save as `public/apple-icon.png`
   - Convert to .ico format and save as `app/favicon.ico` (or use existing)

2. **For the Open Graph image:**
   - Save as `public/og-image.png` (1200x630)

### 2. Using Online Tools

You can use these free tools to resize/convert:
- **Favicon Generator**: https://realfavicongenerator.net/
- **Image Resizer**: https://www.iloveimg.com/resize-image
- **ICO Converter**: https://www.icoconverter.com/

### 3. Quick PowerShell Commands (if you have ImageMagick)

```powershell
# Install ImageMagick first: winget install ImageMagick.ImageMagick

# Then resize images:
magick logo.png -resize 192x192 public/icon-192.png
magick logo.png -resize 512x512 public/icon-512.png
magick logo.png -resize 180x180 public/apple-icon.png
magick logo.png -resize 32x32 app/favicon.ico
```

## Verification

After copying images, verify:
1. All images are in the correct locations
2. Images load correctly in browser
3. Favicon appears in browser tab
4. Open Graph image shows in social media preview tools

## Testing Social Media Previews

Use these tools to test:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/
