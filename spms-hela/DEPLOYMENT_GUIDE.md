# SPMS-Hela Deployment Guide

## Test & Production Deployment Options

**Last Updated:** December 28, 2025  
**Project:** SPMS-Hela  
**Status:** Ready for Deployment

---

## 🎯 Quick Deployment Summary

| Platform    | Difficulty  | Cost      | Best For             | Deploy Time |
| ----------- | ----------- | --------- | -------------------- | ----------- |
| **Vercel**  | ⭐ Easy     | Free      | Production & Testing | 5 minutes   |
| **Netlify** | ⭐⭐ Easy   | Free      | Alternative option   | 10 minutes  |
| **Railway** | ⭐⭐ Medium | Free tier | Full-stack apps      | 15 minutes  |
| **Render**  | ⭐⭐ Medium | Free tier | Long-running apps    | 15 minutes  |

---

## 🚀 Option 1: Vercel (RECOMMENDED)

### Why Vercel?

- ✅ **Built for Next.js** - Created by Next.js team
- ✅ **Free Tier** - Generous limits for testing
- ✅ **Automatic Deployments** - Push to GitHub = auto deploy
- ✅ **Preview URLs** - Test before production
- ✅ **Global CDN** - Fast worldwide
- ✅ **SSL Included** - HTTPS automatic
- ✅ **Easy Setup** - 5-minute deployment

### Free Tier Limits

- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ Preview deployments
- ✅ Analytics

### Step-by-Step Deployment

#### Method A: Using Vercel Dashboard (Easiest)

1. **Create Vercel Account**

   - Go to https://vercel.com
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize Vercel

2. **Import Your Repository**

   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find `spms-hela` repository
   - Click "Import"

3. **Configure Project**

   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL: `https://spms-hela.vercel.app`

#### Method B: Using Vercel CLI

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy from Project Directory**

```bash
cd "c:\Users\Joel_Namuri\Desktop\Student Profiles Management Web App\spms-hela"
vercel
```

4. **Follow Prompts**

```
? Set up and deploy "spms-hela"? [Y/n] Y
? Which scope? Your Name
? Link to existing project? [y/N] N
? What's your project's name? spms-hela
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

5. **Add Environment Variables**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key
```

6. **Deploy to Production**

```bash
vercel --prod
```

### Post-Deployment

**Your URLs:**

- **Preview:** `https://spms-hela-git-main-wicked3000.vercel.app`
- **Production:** `https://spms-hela.vercel.app`

**Next Steps:**

1. Visit your deployment URL
2. Test all features
3. Check admin login
4. Verify database connection
5. Test PDF export
6. Check responsive design

---

## 🌐 Option 2: Netlify

### Why Netlify?

- ✅ **Easy Setup** - Similar to Vercel
- ✅ **Free Tier** - Good for testing
- ✅ **Form Handling** - Built-in forms
- ✅ **Serverless Functions** - API support
- ✅ **Custom Domains** - Free SSL

### Free Tier Limits

- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic SSL
- ✅ Custom domains

### Deployment Steps

1. **Create Netlify Account**

   - Go to https://netlify.com
   - Sign up with GitHub

2. **Import Repository**

   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select `spms-hela` repository

3. **Configure Build Settings**

   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Add Environment Variables**

   - Go to Site settings → Environment variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Deploy**
   - Click "Deploy site"
   - Get URL: `https://spms-hela.netlify.app`

---

## 🚂 Option 3: Railway

### Why Railway?

- ✅ **Full-Stack Support** - Database + app
- ✅ **Free Tier** - $5 credit/month
- ✅ **Easy Setup** - GitHub integration
- ✅ **Custom Domains** - Free SSL

### Deployment Steps

1. **Create Railway Account**

   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**

   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select `spms-hela`

3. **Add Environment Variables**

   - Click on your service
   - Go to "Variables"
   - Add Supabase credentials

4. **Deploy**
   - Railway auto-deploys
   - Get URL from "Settings" → "Domains"

---

## 🎨 Option 4: Render

### Why Render?

- ✅ **Free Tier** - Static sites free
- ✅ **Auto-Deploy** - GitHub integration
- ✅ **Custom Domains** - Free SSL

### Deployment Steps

1. **Create Render Account**

   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**

   - Click "New +" → "Web Service"
   - Connect `spms-hela` repository

3. **Configure**

   ```
   Name: spms-hela
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables**

   - Add Supabase credentials

5. **Deploy**
   - Click "Create Web Service"

---

## 🧪 Testing Your Deployment

### Checklist After Deployment

#### Basic Functionality

- [ ] Home page loads
- [ ] Navigation works
- [ ] All public pages accessible
- [ ] Images load correctly
- [ ] Styles applied properly

#### Database Connection

- [ ] Student profiles load
- [ ] Search works
- [ ] Filters function
- [ ] Pagination works
- [ ] Profile details display

#### Admin Features

- [ ] Admin login works
- [ ] Dashboard shows data
- [ ] Student table displays
- [ ] Inline editing saves
- [ ] CSV import functions

#### Performance

- [ ] Page load < 3 seconds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] PDF export works

#### Security

- [ ] HTTPS enabled
- [ ] Admin routes protected
- [ ] Environment variables secure
- [ ] No sensitive data exposed

---

## 🔧 Troubleshooting

### Common Issues

#### Build Fails

**Problem:** Build fails with module errors
**Solution:**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variables Not Working

**Problem:** Supabase connection fails
**Solution:**

1. Check variable names match exactly
2. Ensure they start with `NEXT_PUBLIC_`
3. Redeploy after adding variables

#### 404 on Routes

**Problem:** Direct URLs return 404
**Solution:**

- Vercel: Automatically handled
- Netlify: Add `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Slow Performance

**Problem:** Pages load slowly
**Solution:**

1. Enable caching in platform settings
2. Optimize images
3. Check Supabase region matches deployment

---

## 📊 Deployment Comparison

### Feature Comparison

| Feature             | Vercel     | Netlify  | Railway | Render  |
| ------------------- | ---------- | -------- | ------- | ------- |
| **Next.js Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐  | ⭐⭐⭐  |
| **Free Tier**       | Generous   | Good     | Limited | Good    |
| **Setup Ease**      | Very Easy  | Easy     | Medium  | Medium  |
| **Auto Deploy**     | ✅         | ✅       | ✅      | ✅      |
| **Custom Domain**   | ✅ Free    | ✅ Free  | ✅ Free | ✅ Free |
| **SSL**             | ✅ Auto    | ✅ Auto  | ✅ Auto | ✅ Auto |
| **Preview URLs**    | ✅         | ✅       | ❌      | ❌      |
| **Build Time**      | Fast       | Fast     | Medium  | Medium  |
| **Global CDN**      | ✅         | ✅       | ❌      | ❌      |

### Cost Comparison (Monthly)

| Platform    | Free Tier         | Paid Tier          |
| ----------- | ----------------- | ------------------ |
| **Vercel**  | 100 GB bandwidth  | $20/month (Pro)    |
| **Netlify** | 100 GB bandwidth  | $19/month (Pro)    |
| **Railway** | $5 credit         | Pay as you go      |
| **Render**  | Static sites free | $7/month (Starter) |

---

## 🎯 Recommended Workflow

### For Testing

1. **Deploy to Vercel** (free preview deployment)
2. Test all features
3. Fix any issues
4. Redeploy automatically on push

### For Production

1. **Use Vercel Production** deployment
2. Add custom domain
3. Enable analytics
4. Set up monitoring
5. Configure backups

---

## 🔐 Security Checklist

Before deploying:

- [ ] Environment variables set correctly
- [ ] No secrets in code
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase RLS policies active
- [ ] Admin routes protected
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting considered

---

## 📱 Custom Domain Setup

### Vercel Custom Domain

1. **Add Domain**

   - Go to Project Settings → Domains
   - Enter your domain: `spms-hela.com`
   - Click "Add"

2. **Configure DNS**
   Add these records to your domain registrar:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for Verification**
   - Usually takes 5-60 minutes
   - SSL certificate auto-generated

---

## 🚀 Quick Deploy Commands

### Vercel

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Netlify

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics

- Enable in dashboard
- Track page views
- Monitor performance
- View real-time data

### Custom Analytics

Add to `app/layout.tsx`:

```typescript
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## ✅ Post-Deployment Checklist

### Immediate Tasks

- [ ] Visit deployment URL
- [ ] Test home page
- [ ] Test student profiles
- [ ] Test admin login
- [ ] Verify database connection
- [ ] Check all pages load
- [ ] Test mobile view
- [ ] Test PDF export

### Within 24 Hours

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test all features thoroughly
- [ ] Get user feedback
- [ ] Fix any issues
- [ ] Update documentation

### Within 1 Week

- [ ] Add custom domain (optional)
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Train admin users
- [ ] Gather analytics
- [ ] Plan improvements

---

## 🎉 Success!

Once deployed, your SPMS-Hela app will be:

- ✅ **Live on the internet**
- ✅ **Accessible worldwide**
- ✅ **Secure with HTTPS**
- ✅ **Fast with CDN**
- ✅ **Auto-deploying** on updates
- ✅ **Professional** and production-ready

---

## 📞 Support

### Deployment Issues

- **Vercel:** https://vercel.com/support
- **Netlify:** https://www.netlify.com/support/
- **Railway:** https://railway.app/help
- **Render:** https://render.com/docs

### Developer Contact

- **Name:** Joel Namuri (Wicked3000)
- **Email:** joelnamuri005@gmail.com
- **GitHub:** https://github.com/Wicked3000/spms-hela

---

**Deployment Guide Version:** 1.0  
**Last Updated:** December 28, 2025  
**Status:** Ready to Deploy ✅

---

_Choose Vercel for the easiest and fastest deployment experience!_
