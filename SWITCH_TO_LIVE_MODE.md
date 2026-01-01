# 🔴 SWITCH TO LIVE MODE - MANUAL STEPS

## ⚠️ YOU'RE STILL IN TEST MODE!

The screenshot shows "Test Mode" because your `.env.local` file still has test keys.

---

## 📝 **MANUAL UPDATE REQUIRED**

### **Step 1: Open `.env.local` File**

1. In VS Code, open: `.env.local` (in project root)
2. Or create it if it doesn't exist

### **Step 2: Replace Razorpay Keys**

Find these lines:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RwYjngWkeG6b6K
RAZORPAY_KEY_SECRET=3SJC42qsopMOTtEvpOHqBwgG
```

Replace with:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
```

### **Step 3: Complete `.env.local` File**

Your complete `.env.local` should look like this:

```env
# ⚠️⚠️⚠️ PRODUCTION MODE - LIVE KEYS ⚠️⚠️⚠️
# Real money will be charged!

# Razorpay - LIVE PRODUCTION MODE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard

# Google Sheets Webhook
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxekPFus1Hb3hYxPW6b-89CLsxfEe21-9jqxv_j07otPsDkJEH80tNByiDgNN-4-sElVQ/exec

# Resend Email
RESEND_API_KEY=re_HxFupkDK_LinFsPM8jgy4UKamnnKD2ifA
RESEND_FROM_EMAIL=onboarding@resend.dev

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Step 4: Save and Restart Server**

1. **Save** the `.env.local` file
2. **Stop** the server (Ctrl+C in terminal)
3. **Restart**: `npm run dev`

---

## ✅ **Verify Live Mode**

After restarting, the Razorpay checkout should:
- ❌ **NOT** show "Test Mode" ribbon
- ✅ Show normal payment options
- ✅ Accept real cards only (test cards won't work)

---

## 🔍 **How to Check**

1. Go to `/builder`
2. Fill the form
3. Click "Order Now"
4. **Look at Razorpay popup**:
   - Test Mode: Red "Test Mode" ribbon (❌ Wrong)
   - Live Mode: No ribbon (✅ Correct)

---

## 🚨 **If Still Shows Test Mode**

1. **Check** `.env.local` has `rzp_live_` (not `rzp_test_`)
2. **Restart** server completely
3. **Clear** browser cache (Ctrl+Shift+R)
4. **Try** in incognito/private window

---

## 📋 **Quick Copy-Paste**

Copy this entire block to your `.env.local`:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxekPFus1Hb3hYxPW6b-89CLsxfEe21-9jqxv_j07otPsDkJEH80tNByiDgNN-4-sElVQ/exec
RESEND_API_KEY=re_HxFupkDK_LinFsPM8jgy4UKamnnKD2ifA
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ⚡ **Quick Commands**

```bash
# Stop server
Ctrl+C

# Restart server
npm run dev

# Clear browser cache
Ctrl+Shift+R
```

---

**Status**: 🔴 Currently in TEST MODE
**Action**: Update `.env.local` and restart server
**Goal**: Remove "Test Mode" ribbon from Razorpay
