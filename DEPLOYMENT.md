# GitHub Deployment Guide

## 🚀 Push to GitHub

### First Time Setup

1. **Initialize Git (if not already done):**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - ESDU 25th Anniversary Portfolio v1.0"
   ```

2. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `ESDU_25_v2` or `esdu-25th-anniversary`
   - Description: "ESDU 25th Anniversary Portfolio - Exploring Solutions, Defying Uncertainties"
   - Public or Private (your choice)
   - Do NOT initialize with README (we have one)

3. **Connect and Push:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Subsequent Updates

```powershell
# Stage all changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Push to GitHub
git push
```

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

### Method 1: Settings (Recommended)

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes
6. Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Method 2: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## ✅ Pre-Deployment Checklist

- [ ] Test locally in all browsers
- [ ] Check all images load correctly
- [ ] Verify PDF export works
- [ ] Test map interactions
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test contact forms (if any)
- [ ] Update `og:image` and `og:url` in index.html with actual URL
- [ ] Update canonical URL in index.html
- [ ] Add Google Analytics ID (already done)

---

## 🔧 Post-Deployment Steps

### Update URLs in index.html

Once deployed, update these lines:

```html
<!-- Line ~16: Canonical URL -->
<link rel="canonical" href="https://YOUR-ACTUAL-URL.github.io/REPO-NAME/" />

<!-- Line ~23: OG URL -->
<meta property="og:url" content="https://YOUR-ACTUAL-URL.github.io/REPO-NAME/" />

<!-- Line ~25: OG Image (upload an og-image.jpg) -->
<meta property="og:image" content="https://YOUR-ACTUAL-URL.github.io/REPO-NAME/og-image.jpg" />
```

### Create OG Image

Create a social media preview image:
- Size: 1200x630px
- Include: ESDU logo + "25 Years" text
- Save as: `og-image.jpg` in root directory

---

## 🎯 Custom Domain (Optional)

If you have a custom domain:

1. **Add CNAME file to root:**
   ```
   esdu.yourdomain.com
   ```

2. **Configure DNS:**
   - Add CNAME record pointing to: `YOUR_USERNAME.github.io`
   - Or A records pointing to GitHub IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

3. **Update in GitHub Settings:**
   - Settings > Pages > Custom domain
   - Enter: `esdu.yourdomain.com`
   - Check "Enforce HTTPS"

---

## 📊 Monitoring

### Analytics
- Google Analytics already configured (ID: G-4XE0FR7ZBY)
- View at: https://analytics.google.com

### Uptime Monitoring
Consider using:
- UptimeRobot (free)
- StatusCake (free tier)
- Pingdom (paid)

---

## 🔄 Update Workflow

When Communications team provides new images:

```powershell
# 1. Add new images to assets/images/
# (copy files)

# 2. Update HTML if needed
# (edit index.html)

# 3. Test locally
# (open in browser)

# 4. Commit and push
git add .
git commit -m "Add timeline and project images"
git push

# 5. Wait 1-2 minutes for GitHub Pages to rebuild
```

---

## 🐛 Troubleshooting

### Site not loading
- Wait 2-3 minutes after first deployment
- Check Settings > Pages shows green checkmark
- Try incognito/private browsing

### Images not showing
- Verify paths are relative (./assets/images/...)
- Check file names match exactly (case-sensitive)
- Ensure images are committed to repository

### PDF export not working
- Check browser console for errors
- Verify html2pdf.js CDN is accessible
- Test in different browser

### Map not loading
- Check Leaflet.js CDN is accessible
- Verify esdu_locations.js is loaded
- Check browser console for JavaScript errors

---

## 📝 Git Commands Quick Reference

```powershell
# Check status
git status

# View changes
git diff

# Stage specific file
git add path/to/file.txt

# Commit
git commit -m "Description of changes"

# Push
git push

# Pull latest
git pull

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## 🔐 Security Notes

- Never commit sensitive data (API keys, passwords)
- Current setup has no secrets (all public data)
- Google Analytics ID is safe to be public
- If adding forms, use external service (Formspree, etc.)

---

## 📞 Need Help?

- **GitHub Docs:** https://docs.github.com/pages
- **Git Basics:** https://git-scm.com/book/en/v2
- **Contact Developer:** [Add contact info]

---

**Ready to Deploy!** 🎉

Your portfolio is fully functional and ready for the world to see. Just follow the steps above, and you'll have a live website in minutes.
