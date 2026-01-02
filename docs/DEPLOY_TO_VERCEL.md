# Quick Vercel Deployment - 5 Minutes! 🚀

## ⚡ FASTEST WAY TO DEPLOY

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login**
```bash
vercel login
```

### **Step 3: Deploy**
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- What's your project's name? **click2connect**
- In which directory is your code? **./** (press Enter)
- Want to override settings? **No**

### **Step 4: Add Environment Variables**

Go to: https://vercel.com/dashboard

1. Click your project
2. Settings → Environment Variables
3. Add these one by one:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET = ggLZFq0SmqJ2bOpF43M1rRGe
RAZORPAY_WEBHOOK_SECRET = your_webhook_secret_here
GOOGLE_SHEETS_WEBHOOK_URL = https://script.google.com/macros/s/AKfycbxekPFus1Hb3hYxPW6b-89CLsxfEe21-9jqxv_j07otPsDkJEH80tNByiDgNN-4-sElVQ/exec
RESEND_API_KEY = re_HxFupkDK_LinFsPM8jgy4UKamnnKD2ifA
RESEND_FROM_EMAIL = onboarding@resend.dev
```

### **Step 5: Redeploy**
```bash
vercel --prod
```

### **Step 6: Done! 🎉**

Your app is now live at: `https://click2connect.vercel.app`

---

## 🔗 Update Razorpay Webhook

1. Go to: https://dashboard.razorpay.com/
2. Settings → Webhooks
3. Add webhook URL: `https://click2connect.vercel.app/api/razorpay-webhook`
4. Copy webhook secret
5. Add to Vercel environment variables
6. Redeploy

---

## ✅ Test Your Live Site

1. Visit your Vercel URL
2. Go to `/builder`
3. Create a test order (₹99)
4. Verify payment works
5. Check email delivery
6. Confirm Google Sheets update

---

## 🌐 Add Custom Domain (Optional)

1. In Vercel dashboard
2. Project → Settings → Domains
3. Add your domain (e.g., `click2connect.com`)
4. Update DNS:
   - Type: **A**
   - Name: **@**
   - Value: **76.76.21.21**
   
   - Type: **CNAME**
   - Name: **www**
   - Value: **cname.vercel-dns.com**

5. Wait for DNS propagation (5-30 minutes)
6. Done! Your site is at your custom domain

---

**Total Time**: 5-10 minutes
**Cost**: FREE
**Status**: Production Ready! 🚀
