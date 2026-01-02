# 🚀 Hostinger Deployment Guide - Complete Setup

## ⚠️ IMPORTANT: API Routes Won't Work on Shared Hosting!

**CRITICAL ISSUE**: Your app uses Next.js API routes which **require Node.js server**. Hostinger's `public_html` is **static hosting only** (no Node.js).

### **What Won't Work**:
- ❌ `/api/create-order` - Payment creation
- ❌ `/api/generate-card` - Card generation
- ❌ `/api/verify-payment` - Payment verification
- ❌ `/api/razorpay-webhook` - Webhook handling
- ❌ Razorpay payment processing
- ❌ Email sending
- ❌ Google Sheets integration

### **What Will Work**:
- ✅ Static pages (home, builder UI)
- ✅ Client-side form validation
- ✅ Design previews
- ❌ **BUT NO ACTUAL PAYMENTS OR ORDERS**

---

## 🎯 **SOLUTION OPTIONS**

### **Option 1: Use Hostinger VPS/Cloud (RECOMMENDED)**
- ✅ Full Node.js support
- ✅ All API routes work
- ✅ Complete functionality
- 💰 Cost: ~₹300-500/month
- 🔗 https://www.hostinger.in/vps-hosting

### **Option 2: Use Vercel (FREE & EASIEST)**
- ✅ Free tier available
- ✅ Perfect for Next.js
- ✅ Automatic deployments
- ✅ Built-in SSL
- ✅ Global CDN
- 🔗 https://vercel.com

### **Option 3: Use Netlify (FREE Alternative)**
- ✅ Free tier available
- ✅ Supports Next.js
- ✅ Easy deployment
- 🔗 https://www.netlify.com

### **Option 4: Keep Hostinger, Use External APIs**
- ⚠️ Complex setup
- Requires rewriting entire payment flow
- Not recommended

---

## 📦 **IF YOU STILL WANT STATIC EXPORT (Limited Functionality)**

### **What You'll Get**:
- ✅ Beautiful landing page
- ✅ Card builder UI
- ❌ NO payment processing
- ❌ NO order creation
- ❌ NO email delivery

### **Build Steps**:

```bash
# 1. Build static export
npm run build

# 2. Files will be in 'out' folder
# Upload 'out' folder contents to public_html
```

---

## 🚀 **RECOMMENDED: Deploy to Vercel (FREE)**

### **Why Vercel?**
1. ✅ **FREE** for personal projects
2. ✅ **Made for Next.js** (by same company)
3. ✅ **All features work** (API routes, payments, emails)
4. ✅ **Automatic SSL** (HTTPS)
5. ✅ **Global CDN** (fast worldwide)
6. ✅ **Easy deployment** (connect GitHub)
7. ✅ **Custom domain** (free)

### **Deployment Steps**:

#### **Step 1: Create Vercel Account**
1. Go to https://vercel.com
2. Sign up with GitHub/Google
3. Free account is enough

#### **Step 2: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 3: Deploy**
```bash
# In your project folder
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? click2connect
# - In which directory is your code? ./
# - Want to override settings? No
```

#### **Step 4: Add Environment Variables**
```bash
# In Vercel dashboard:
# Project Settings → Environment Variables

# Add these:
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
GOOGLE_SHEETS_WEBHOOK_URL=your_sheets_url
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

#### **Step 5: Redeploy**
```bash
vercel --prod
```

#### **Step 6: Add Custom Domain (Optional)**
1. In Vercel dashboard
2. Project Settings → Domains
3. Add your domain (e.g., click2connect.com)
4. Update DNS settings as instructed

---

## 🔧 **IF USING HOSTINGER VPS**

### **Requirements**:
- Hostinger VPS or Cloud hosting
- Node.js 18+ installed
- PM2 for process management

### **Deployment Steps**:

#### **Step 1: Connect to VPS**
```bash
ssh username@your-server-ip
```

#### **Step 2: Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **Step 3: Install PM2**
```bash
sudo npm install -g pm2
```

#### **Step 4: Upload Files**
```bash
# On your local machine
# Zip your project (exclude node_modules)
# Upload via FTP or SCP
```

#### **Step 5: Setup on Server**
```bash
cd /path/to/your/app
npm install
npm run build

# Create .env.local with your production variables
nano .env.local
# Paste your environment variables
# Save: Ctrl+X, Y, Enter
```

#### **Step 6: Start with PM2**
```bash
pm2 start npm --name "click2connect" -- start
pm2 save
pm2 startup
```

#### **Step 7: Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/click2connect

# Add:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/click2connect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### **Step 8: Setup SSL**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📋 **Comparison Table**

| Feature | Hostinger Shared | Hostinger VPS | Vercel | Netlify |
|---------|------------------|---------------|--------|---------|
| **Cost** | ₹99/mo | ₹300/mo | FREE | FREE |
| **Node.js** | ❌ | ✅ | ✅ | ✅ |
| **API Routes** | ❌ | ✅ | ✅ | ✅ |
| **Payments** | ❌ | ✅ | ✅ | ✅ |
| **Setup Difficulty** | Easy | Hard | Very Easy | Easy |
| **SSL** | Manual | Manual | Auto | Auto |
| **CDN** | ❌ | ❌ | ✅ | ✅ |
| **Recommended** | ❌ | ⚠️ | ✅✅✅ | ✅✅ |

---

## 🎯 **MY RECOMMENDATION**

### **Use Vercel (FREE)**

**Why?**
1. ✅ **FREE** - No cost
2. ✅ **5 minutes** to deploy
3. ✅ **Everything works** - All features
4. ✅ **Auto SSL** - HTTPS included
5. ✅ **Fast** - Global CDN
6. ✅ **Easy** - No server management

**Steps**:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in dashboard

# 4. Done! 🎉
```

---

## 📝 **Environment Variables Needed**

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/...
RESEND_API_KEY=re_HxFupkDK_...
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🚨 **CRITICAL NOTES**

### **For Hostinger Shared Hosting (`public_html`)**:
- ⚠️ **WILL NOT WORK** for your app
- Your app needs Node.js server
- Shared hosting = static files only
- **DO NOT DEPLOY** to `public_html`

### **For Vercel/Netlify**:
- ✅ **WILL WORK** perfectly
- All features supported
- Free tier sufficient
- **RECOMMENDED**

### **For Hostinger VPS**:
- ✅ **WILL WORK** but complex
- Requires server management
- Costs more than shared
- Only if you need full control

---

## ✅ **Quick Decision Guide**

**Choose Vercel if**:
- ✅ You want FREE hosting
- ✅ You want easy deployment
- ✅ You don't want server management
- ✅ You want fast global performance

**Choose Hostinger VPS if**:
- ✅ You need full server control
- ✅ You're comfortable with Linux
- ✅ You want to host multiple apps
- ✅ You don't mind paying ₹300/mo

**DON'T Choose Hostinger Shared if**:
- ❌ Your app needs Node.js (yours does!)
- ❌ Your app has API routes (yours does!)
- ❌ Your app processes payments (yours does!)

---

## 🚀 **NEXT STEPS**

### **Recommended Path**:

1. **Deploy to Vercel** (5 minutes)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add Environment Variables** (in Vercel dashboard)

3. **Test Payment** (with ₹1 first)

4. **Add Custom Domain** (optional)

5. **Go Live!** 🎉

### **Alternative Path** (Hostinger VPS):

1. **Upgrade to VPS** (₹300/mo)
2. **Follow VPS setup** (above)
3. **Configure Nginx**
4. **Setup SSL**
5. **Deploy**

---

## 📞 **Need Help?**

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Hostinger Support**: https://www.hostinger.in/contact

---

**Created**: January 1, 2026
**Recommendation**: 🚀 **Deploy to Vercel (FREE)**
**Status**: Ready to deploy!
