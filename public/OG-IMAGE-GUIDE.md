# Open Graph Image - Quick Guide

## 📐 Specifications

**Required size:** 1200 × 630 pixels  
**Format:** JPG or PNG  
**Max file size:** < 5 MB (recommend < 300 KB)  
**Aspect ratio:** 1.91:1

## 🎨 Design Tips

### Content Guidelines:
- **Brand logo** - Top left or center
- **Key message** - Large readable text
- **Visual elements** - Related to your service
- **Contrast** - Dark background + light text (or vice versa)

### Text Recommendations:
- Font size: 60-80px for main heading
- Font size: 30-40px for subheading
- Safe zone: 50px padding from edges

### Example Structure:
```
┌─────────────────────────────────────┐
│  [Logo]                             │
│                                     │
│         Blitz Web Studio            │
│     Swiss Design × Engineering      │
│                                     │
│    blitzwebstudio.com               │
└─────────────────────────────────────┘
```

## 🛠️ Tools to Create OG Image

### Online (Free):
1. **Canva** - https://canva.com (template: Facebook Post)
2. **Figma** - https://figma.com (create 1200x630 frame)
3. **Remove.bg** - Remove backgrounds first

### Design Software:
- Photoshop
- Sketch
- Affinity Designer

## 📥 How to Add

1. **Create/Download** your 1200x630px image
2. **Rename** to `og-image.jpg`
3. **Place** in `/public/og-image.jpg`
4. **Test** at:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

## ✅ Verification

After adding image, check:

```bash
# File exists
ls -la public/og-image.jpg

# File size (should be < 300KB)
du -h public/og-image.jpg
```

Then open admin panel → SEO Settings and verify:
- OG Image Path: `/og-image.jpg`

## 🔄 Cache Clearing

After adding new image, clear social media cache:

**Facebook Debugger:**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your URL
3. Click "Scrape Again"

**Twitter Card Validator:**
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Click "Preview card"

## 🎯 Current Status

- [x] Folder created: `/public/`
- [x] Path configured: `/og-image.jpg`
- [ ] **TODO:** Add real image file

**Next:** Replace `og-image-placeholder.txt` with `og-image.jpg`
