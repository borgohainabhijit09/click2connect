# 🚀 PRODUCTION MODE - LIVE RAZORPAY KEYS

## ⚠️ CRITICAL WARNING ⚠️

**YOU ARE NOW IN PRODUCTION MODE!**

- ✅ Live Razorpay keys are configured
- 💰 **REAL MONEY** will be charged
- 🔴 **NOT A TEST** - Actual payments will be processed
- 📧 Customers will receive real confirmation emails

---

## 🔑 Live Keys Configured

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
```

**Status**: 🟢 **LIVE PRODUCTION MODE**

---

## 📋 IMMEDIATE ACTION REQUIRED

### **Step 1: Update Your `.env.local` File**

1. **Open**: `.env.local` in your project root
2. **Replace** the Razorpay keys with:

```env
# Razorpay - PRODUCTION MODE (LIVE)
# ⚠️ WARNING: These are LIVE keys - real money will be charged!
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard
```

3. **Save** the file

### **Step 2: Restart Your Dev Server**

**IMPORTANT**: You MUST restart the server for new keys to take effect!

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### **Step 3: Verify Live Mode**

1. Open browser console (F12)
2. Go to your payment page
3. Look for Razorpay checkout
4. **Check**: Key should start with `rzp_live_` (NOT `rzp_test_`)

---

## 💰 Current Pricing

**Price**: ₹1 (ONE RUPEE)

**Location**: 
- `app/builder/page.tsx` - Line 97
- `app/page.tsx` - Line 37

### ⚠️ **CHANGE PRICE BEFORE GOING LIVE!**

The price is currently set to ₹1 for testing. You need to change it to ₹99 (or your desired price).

**To change price to ₹99**:

1. Open `app/builder/page.tsx`
2. Find line 97: `body: JSON.stringify({ amount: 1 })`
3. Change to: `body: JSON.stringify({ amount: 99 })`
4. Save file

**OR** keep it at ₹1 if you want to test with real payments first.

---

## 🔐 Security Checklist

### **Before Accepting Real Payments**:

- [ ] **Live keys** in `.env.local` (NOT in git!)
- [ ] **Server restarted** with new keys
- [ ] **Price verified** (₹1 or ₹99?)
- [ ] **Email working** (tested with ₹1)
- [ ] **Google Sheets** logging orders
- [ ] **Webhook configured** (see below)
- [ ] **HTTPS enabled** (required for production)
- [ ] **Test payment** completed successfully

---

## 🔗 Webhook Configuration

### **Setup Razorpay Webhook**:

1. **Go to**: [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Navigate**: Settings → Webhooks
3. **Click**: "Add New Webhook"
4. **Enter**:
   - **Webhook URL**: `https://yourdomain.com/api/razorpay-webhook`
   - **Secret**: Generate a strong secret
   - **Events**: Select all payment events
5. **Save** and copy the webhook secret
6. **Update** `.env.local`:
   ```env
   RAZORPAY_WEBHOOK_SECRET=your_actual_webhook_secret
   ```

### **Important**:
- Webhook URL must be HTTPS (not HTTP)
- Webhook secret must match in both Razorpay and `.env.local`
- Test webhook after setup

---

## 🧪 Testing Production Mode

### **Test with ₹1 First!**

Before changing to ₹99, test with ₹1 to ensure everything works:

1. **Complete a real payment** (₹1)
2. **Check email delivery**
3. **Verify Google Sheets** entry
4. **Check Razorpay dashboard** for payment
5. **Verify webhook** (if configured)

### **Test Payment Flow**:

```bash
# 1. Server running with LIVE keys
npm run dev

# 2. Go to builder
http://localhost:3000/builder

# 3. Fill form with REAL email

# 4. Pay ₹1 with REAL card
# (Use your actual debit/credit card)

# 5. Verify:
# - Payment successful
# - Email received
# - Google Sheets updated
# - Razorpay dashboard shows payment
```

---

## 💳 Payment Methods

### **Live Mode Accepts**:
- ✅ Credit Cards (Visa, Mastercard, Amex, etc.)
- ✅ Debit Cards
- ✅ UPI (Google Pay, PhonePe, Paytm, etc.)
- ✅ Net Banking
- ✅ Wallets (Paytm, Mobikwik, etc.)

### **Test Cards DON'T Work**:
- ❌ `4111 1111 1111 1111` - Test card (will fail)
- ❌ Any test card numbers - Won't work in live mode

---

## 📊 Monitoring

### **Razorpay Dashboard**:
- **URL**: https://dashboard.razorpay.com/
- **Check**: Payments, Settlements, Disputes
- **Monitor**: Real-time payment status

### **Google Sheets**:
- All orders logged automatically
- Check for new entries after each payment

### **Email Logs**:
- Check Resend dashboard: https://resend.com/emails
- Verify email delivery status

---

## 🚨 Emergency Procedures

### **If Something Goes Wrong**:

1. **Stop Accepting Payments**:
   - Stop the server (`Ctrl+C`)
   - Switch back to test keys
   - Restart server

2. **Refund a Payment**:
   - Go to Razorpay Dashboard
   - Find the payment
   - Click "Refund"
   - Enter amount and reason

3. **Contact Support**:
   - Razorpay: support@razorpay.com
   - Your support: support@click2connect.com

---

## 📝 Pre-Launch Checklist

### **Before Going Live**:

- [ ] **Test Mode**: Completed all testing with test keys
- [ ] **Email**: Confirmed working (tested with ₹1)
- [ ] **Google Sheets**: Logging orders correctly
- [ ] **Live Keys**: Updated in `.env.local`
- [ ] **Server**: Restarted with live keys
- [ ] **Price**: Set to correct amount (₹99 or ₹1)
- [ ] **Webhook**: Configured in Razorpay dashboard
- [ ] **HTTPS**: Enabled (required for production)
- [ ] **Test Payment**: Completed with ₹1
- [ ] **Refund Test**: Know how to refund if needed
- [ ] **Support**: Ready to handle customer queries
- [ ] **Monitoring**: Dashboard access ready

---

## 🔄 Switching Between Test and Live

### **To Switch to TEST Mode**:

```env
# In .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RwYjngWkeG6b6K
RAZORPAY_KEY_SECRET=3SJC42qsopMOTtEvpOHqBwgG
```

### **To Switch to LIVE Mode**:

```env
# In .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RySfQUMBuxV3tj
RAZORPAY_KEY_SECRET=ggLZFq0SmqJ2bOpF43M1rRGe
```

**Always restart server after changing keys!**

---

## 💰 Pricing Recommendations

### **Current**: ₹1 (Testing)

### **Recommended Production Prices**:

**Option 1: Keep Low for Launch**
- Price: ₹1
- Reason: Get initial customers, test system
- Duration: First 100 orders
- Then: Increase to ₹99

**Option 2: Standard Price**
- Price: ₹99
- Reason: As advertised on website
- Best for: Regular operations

**Option 3: Premium**
- Price: ₹299
- Reason: Higher value, better margins
- Best for: After establishing reputation

### **To Change Price**:

Edit `app/builder/page.tsx` and `app/page.tsx`:

```typescript
// For ₹1
body: JSON.stringify({ amount: 1 })

// For ₹99
body: JSON.stringify({ amount: 99 })

// For ₹299
body: JSON.stringify({ amount: 299 })
```

---

## 📧 Email Configuration

### **Current Setup**:
```env
RESEND_API_KEY=re_HxFupkDK_LinFsPM8jgy4UKamnnKD2ifA
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### **For Production**:
Consider using a custom domain email:
- `orders@click2connect.com`
- `noreply@click2connect.com`
- `support@click2connect.com`

**Setup**: Configure in Resend dashboard

---

## 🎯 Success Metrics

### **Track These**:
1. **Total Orders**: Check Google Sheets
2. **Revenue**: Check Razorpay Dashboard
3. **Email Delivery**: Check Resend Dashboard
4. **Conversion Rate**: Orders / Visitors
5. **Refund Rate**: Refunds / Orders

---

## 🔒 Security Best Practices

### **DO**:
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Never commit API keys to git
- ✅ Use HTTPS in production
- ✅ Verify payment signatures
- ✅ Log all transactions
- ✅ Monitor for suspicious activity

### **DON'T**:
- ❌ Share API keys publicly
- ❌ Use live keys in test environment
- ❌ Skip payment verification
- ❌ Ignore failed payments
- ❌ Forget to test refunds

---

## 📞 Support Contacts

### **Razorpay**:
- Dashboard: https://dashboard.razorpay.com/
- Support: support@razorpay.com
- Docs: https://razorpay.com/docs/

### **Resend**:
- Dashboard: https://resend.com/
- Docs: https://resend.com/docs

### **Your Support**:
- Email: support@click2connect.com
- Phone: +91 776 0133445

---

## ✅ Final Steps

### **1. Update `.env.local`**
```bash
# Copy the live keys to .env.local
# Make sure to restart server!
```

### **2. Test with ₹1**
```bash
# Complete one real payment
# Verify everything works
```

### **3. Change Price (Optional)**
```bash
# If ready, change from ₹1 to ₹99
# Edit app/builder/page.tsx
```

### **4. Go Live!**
```bash
# You're ready to accept real payments!
# Monitor dashboard closely
```

---

## 🎉 You're Ready!

**Status**: 🟢 **PRODUCTION MODE ACTIVE**

**Next Steps**:
1. Update `.env.local` with live keys
2. Restart server
3. Test with ₹1
4. Monitor first few orders
5. Celebrate! 🎊

---

**Created**: January 1, 2026
**Mode**: 🔴 LIVE PRODUCTION
**Price**: ₹1 (Change to ₹99 when ready)
**Status**: Ready to accept real payments!

⚠️ **REMEMBER**: Real money will be charged. Test thoroughly before promoting!
