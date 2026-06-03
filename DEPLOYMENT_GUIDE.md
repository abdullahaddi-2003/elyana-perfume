# ELYANA - Deployment Guide to Netlify 🚀

## Quick Deployment Steps (5 minutes)

### Option 1: Deploy via GitHub (Recommended)

#### Step 1: Create GitHub Account
1. Go to https://github.com/signup
2. Create a free account

#### Step 2: Create a Repository
1. Go to https://github.com/new
2. Repository name: `elyana-perfume` (or any name)
3. Click "Create repository"

#### Step 3: Upload Files
1. After creating the repo, click "uploading an existing file"
2. Select all files from `C:\Users\abdul\OneDrive\Desktop\Elyana\`:
   - index.html
   - men.html
   - women.html
   - unisex.html
   - checkout.html
   - confirmation.html
   - style.css
   - script.js
   - category.js
   - checkout.js
   - confirmation.js
   - image-removebg-preview.png

3. Commit the files

#### Step 4: Deploy to Netlify
1. Go to https://app.netlify.com/
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose "GitHub"
5. Select your `elyana-perfume` repository
6. Click "Deploy site"

**Done!** Your site will be live in 1-2 minutes at a URL like: `https://elyana-perfume.netlify.app`

---

### Option 2: Direct Netlify Deployment (No GitHub Needed)

1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `Elyana` folder
3. Your site will be live instantly!

**Note:** This creates a temporary URL. For permanent URL, you'll need to link a GitHub repo.

---

## Important Notes

✅ **All Features Work:**
- Animated backgrounds
- Shopping cart (uses localStorage)
- Checkout process
- Order confirmation
- Category pages
- Responsive design

⚠️ **Limitations:**
- Cart data is stored locally in browser (not in cloud database)
- Order data saves in localStorage only (not in backend)
- No actual payment processing (demo only)

---

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to Netlify Dashboard
2. Click "Domain settings"
3. Add your custom domain
4. Update DNS settings with your domain provider

---

## Testing After Deployment

✅ Test these features:
- [ ] Homepage loads with animated background
- [ ] Add items to cart
- [ ] Cart counter updates
- [ ] Navigate to men.html, women.html, unisex.html
- [ ] Cart data persists across pages
- [ ] Go to checkout
- [ ] Fill form and submit
- [ ] Order confirmation page shows
- [ ] All styling looks correct
- [ ] Responsive on mobile

---

## Support & Help

If you need help:
1. Check Netlify dashboard for error logs
2. Check browser console (F12) for JavaScript errors
3. Make sure all files are uploaded
4. Ensure file names match exactly (case-sensitive on servers)

---

## Next Steps (Optional)

To add database/backend features in future:
- Firebase for user accounts
- Stripe for real payments
- Backend API for order storage

---

**Your website is production-ready! 🎉**
