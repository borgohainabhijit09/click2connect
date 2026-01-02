# 🚀 SWITCH TO PRODUCTION MODE - ACTION REQUIRED

## ⚠️ IMPORTANT: Manual Steps Required

I cannot automatically update your `.env.local` file for security reasons (it's protected by `.gitignore`).
You need to manually update it with your production credentials.

## 📋 Step-by-Step Instructions

### Step 1: Get Your Production Keys

1. **Login to Razorpay Dashboard**
   - Visit: https://dashboard.razorpay.com/
   - Login with your credentials

2. **Check Account Status**
   - Ensure your account is activated
   - KYC should be completed and approved
   - If not activated, complete KYC first

3. **Generate Live Keys**
   - Go to: **Settings** → **API Keys**
   - Click on **"Generate Live Keys"** button
   - You'll see:
     - **Key ID**: `rzp_live_XXXXXXXXXX`
     - **Key Secret**: `XXXXXXXXXXXXXXXX`
   - ⚠️ **Copy both keys immediately** (secret shown only once!)

### Step 2: Update Your .env.local File

**Location**: `c:\Users\320301827\Documents\Development Area\Web Projects\click2connect\.env.local`

**Open the file and replace the Razorpay section:**

```env
# ============================================
# RAZORPAY - PRODUCTION MODE
# ============================================
# IMPORTANT: These are LIVE keys - keep them secret!
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_KEY_HERE

# Webhook Secret (get from Razorpay Dashboard → Webhooks)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# ============================================
# OTHER CONFIGURATIONS
# ============================================
# Google Sheets Webhook (Google Apps Script)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxekPFus1Hb3hYxPW6b-89CLsxfEe21-9jqxv_j07otPsDkJEH80tNByiDgNN-4-sElVQ/exec

# Resend Email
RESEND_API_KEY=re_HxFupkDK_LinFsPM8jgy4UKamnnKD2ifA
RESEND_FROM_EMAIL=onboarding@resend.dev

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Configure Webhook (Highly Recommended)

1. **Go to Razorpay Dashboard**
   - Navigate to: **Settings** → **Webhooks**

2. **Create New Webhook**
   - Click **"+ New Webhook"**
   - Enter details:
     - **Webhook URL**: `https://yourdomain.com/api/razorpay-webhook`
       (Replace `yourdomain.com` with your actual domain)
     - **Alert Email**: Your email address
     - **Secret**: Click "Generate" to create a secret

3. **Select Events**
   Check these events:
   - ✅ `payment.authorized`
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `order.paid`

4. **Save & Copy Secret**
   - Click **"Create Webhook"**
   - Copy the webhook secret
   - Add it to your `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

### Step 4: Verify Configuration

Run this command to check your environment:

```bash
npm run dev
```

Then check the console for any errors related to Razorpay configuration.

### Step 5: Test with Small Amount

Before going fully live:

1. **Test with ₹1**
   - Create a test order
   - Complete payment
   - Verify email received
   - Check Google Sheets logging

2. **Verify Payment Flow**
   - Order creation works
   - Payment modal opens
   - Payment processes successfully
   - Confirmation email sent
   - Data logged correctly

### Step 6: Deploy to Production

Once tested locally:

```bash
# Build for production
npm run build

# Start production server
npm start
```

Or deploy to your hosting platform (Vercel, Netlify, etc.)

## ✅ Verification Checklist

Before accepting real payments:

- [ ] Production keys added to `.env.local`
- [ ] Webhook configured in Razorpay Dashboard
- [ ] Webhook secret added to `.env.local`
- [ ] HTTPS enabled on production domain
- [ ] Test payment successful (₹1)
- [ ] Email delivery working
- [ ] Google Sheets logging working
- [ ] Error handling tested
- [ ] Refund process documented

## 🔒 Security Reminders

1. **Never commit `.env.local` to Git**
   - Already in `.gitignore` ✅
   - Double-check before pushing

2. **Keep secrets secret**
   - Don't share in chat/email
   - Don't log to console
   - Don't expose in client code

3. **Use HTTPS in production**
   - Required by Razorpay
   - Required for PCI compliance

## 🆘 Troubleshooting

### "Razorpay credentials not configured"
- Check `.env.local` file exists
- Verify keys are correct
- Restart dev server

### "Invalid API key"
- Ensure using `rzp_live_` prefix (not `rzp_test_`)
- Check for typos in key
- Verify account is activated

### "Webhook signature verification failed"
- Check webhook secret is correct
- Ensure webhook URL is correct
- Verify HTTPS is enabled

## 📞 Need Help?

- **Razorpay Support**: support@razorpay.com
- **Phone**: 1800-102-0555
- **Docs**: https://razorpay.com/docs/

## 🎯 Quick Reference

**Test Mode Keys** (Current):
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RwYjngWkeG6b6K
```

**Production Mode Keys** (After Setup):
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

---

## ⚡ NEXT STEPS

1. **Get your production keys** from Razorpay Dashboard
2. **Update `.env.local`** with the keys above
3. **Configure webhook** in Razorpay Dashboard
4. **Test with ₹1** to verify everything works
5. **Deploy to production** when ready

**File to edit**: `.env.local` (in your project root)

---

**Created**: December 31, 2024
**Status**: ⏳ Waiting for manual configuration
