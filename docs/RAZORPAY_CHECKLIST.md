# Razorpay Production Setup - Quick Checklist

## ✅ Pre-Deployment Checklist

### 1. Razorpay Account Setup
- [ ] Razorpay account created
- [ ] KYC documents submitted
- [ ] Account activated (wait for approval email)
- [ ] Business details verified

### 2. Get Production Credentials
- [ ] Login to https://dashboard.razorpay.com/
- [ ] Navigate to Settings → API Keys
- [ ] Click "Generate Live Keys"
- [ ] Copy Key ID (starts with `rzp_live_`)
- [ ] Copy Key Secret (keep it secret!)

### 3. Update Environment Variables

Create/Update `.env.local` file:

```env
# PRODUCTION Razorpay Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE

# Other configs...
GOOGLE_SHEETS_WEBHOOK_URL=your_google_sheets_url
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=orders@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Configure Webhooks (Recommended)
- [ ] Go to Razorpay Dashboard → Webhooks
- [ ] Click "Create New Webhook"
- [ ] Enter URL: `https://yourdomain.com/api/razorpay-webhook`
- [ ] Generate and copy webhook secret
- [ ] Select events:
  - [ ] payment.authorized
  - [ ] payment.captured
  - [ ] payment.failed
  - [ ] order.paid
- [ ] Save webhook
- [ ] Add webhook secret to `.env.local`

### 5. Test in Production
- [ ] Deploy to production server
- [ ] Verify HTTPS is working
- [ ] Test with small amount (₹1)
- [ ] Verify payment success
- [ ] Check email delivery
- [ ] Verify Google Sheets logging
- [ ] Test payment failure scenario

### 6. Security Checklist
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets committed to Git
- [ ] HTTPS enabled on production
- [ ] Webhook signature verification enabled
- [ ] Payment verification on server-side
- [ ] Error logging configured

### 7. Monitoring Setup
- [ ] Set up Razorpay email alerts
- [ ] Monitor failed payments
- [ ] Check settlement reports
- [ ] Set up refund process

## 🚀 Quick Start Commands

### For Development (Test Mode):
```bash
# Use test keys in .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
```

### For Production (Live Mode):
```bash
# Use live keys in .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

### Deploy:
```bash
npm run build
npm start
```

## 🧪 Test Cards (Test Mode Only)

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card: `4000 0000 0000 0002`

## 📊 What Happens After Payment?

1. **User clicks "Place Order"**
2. **Order created** in Razorpay
3. **Payment modal opens**
4. **User completes payment**
5. **Payment verified** (signature check)
6. **Webhook received** (if configured)
7. **Email sent** to customer
8. **Data logged** to Google Sheets
9. **Card generation** triggered
10. **Success page** shown

## ⚠️ Important Notes

### Pricing:
- **Transaction Fee**: 2% + GST
- **No setup fee**
- **No annual fee**

### Settlement:
- **Default**: T+3 days
- **Instant**: Available (extra charges)
- **Bank account**: Must be verified

### Support:
- **Email**: support@razorpay.com
- **Phone**: 1800-102-0555
- **Docs**: https://razorpay.com/docs/

## 🔒 Security Best Practices

1. **Never expose secrets**:
   ```javascript
   // ❌ BAD
   const secret = "rzp_live_secret123";
   
   // ✅ GOOD
   const secret = process.env.RAZORPAY_KEY_SECRET;
   ```

2. **Always verify on server**:
   ```javascript
   // ✅ Server-side verification
   const isValid = verifyPaymentSignature(orderId, paymentId, signature);
   ```

3. **Use HTTPS in production**:
   - Required by Razorpay
   - Required for PCI compliance

## 📞 Need Help?

1. Check `RAZORPAY_PRODUCTION_GUIDE.md` for detailed guide
2. Visit Razorpay documentation
3. Contact Razorpay support
4. Check webhook logs in dashboard

## ✨ You're Ready!

Once all checkboxes are ticked, your payment system is production-ready! 🎉

---

**Last Updated**: December 31, 2024
