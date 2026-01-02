# Razorpay Production Setup Guide

## 🚀 Moving from Test to Production Mode

### Step 1: Get Production Credentials

1. **Login to Razorpay Dashboard**
   - Visit: https://dashboard.razorpay.com/
   - Login with your account

2. **Activate Your Account**
   - Complete KYC verification
   - Submit business documents
   - Wait for approval (usually 24-48 hours)

3. **Get Production Keys**
   - Go to Settings → API Keys
   - Click on "Generate Live Keys"
   - You'll get:
     - **Key ID**: `rzp_live_XXXXXXXXXX`
     - **Key Secret**: `XXXXXXXXXXXXXXXX`
   - ⚠️ **IMPORTANT**: Keep these secret! Never commit to Git

### Step 2: Update Environment Variables

Update your `.env.local` file:

```env
# Razorpay PRODUCTION Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET

# Google Sheets Webhook
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Resend Email
RESEND_API_KEY=re_YOUR_RESEND_API_KEY
RESEND_FROM_EMAIL=orders@yourdomain.com

# App Config
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 3: Configure Razorpay Webhooks (Recommended)

1. **Go to Razorpay Dashboard → Webhooks**
2. **Create New Webhook**:
   - URL: `https://yourdomain.com/api/razorpay-webhook`
   - Secret: Generate a strong secret
   - Events to subscribe:
     - ✅ `payment.authorized`
     - ✅ `payment.captured`
     - ✅ `payment.failed`
     - ✅ `order.paid`

3. **Add Webhook Secret to .env.local**:
```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Step 4: Test Before Going Live

1. **Use Test Mode First**
   - Test with `rzp_test_` keys
   - Use test card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

2. **Test Scenarios**:
   - ✅ Successful payment
   - ✅ Failed payment
   - ✅ Payment timeout
   - ✅ Order creation
   - ✅ Email delivery
   - ✅ Google Sheets logging

### Step 5: Production Checklist

Before going live, ensure:

- [ ] KYC approved on Razorpay
- [ ] Production keys added to `.env.local`
- [ ] Webhook configured and tested
- [ ] SSL certificate installed (HTTPS)
- [ ] Email sending configured
- [ ] Google Sheets integration working
- [ ] Error handling implemented
- [ ] Payment verification working
- [ ] Test transactions successful
- [ ] Refund process documented

### Step 6: Security Best Practices

1. **Never expose secret keys**:
   - ✅ Use environment variables
   - ✅ Add `.env.local` to `.gitignore`
   - ❌ Never commit keys to Git
   - ❌ Never log keys in console

2. **Always verify payments server-side**:
   - ✅ Verify signature
   - ✅ Check order amount
   - ✅ Validate order ID
   - ❌ Never trust client-side data

3. **Use HTTPS in production**:
   - Required for Razorpay
   - Required for secure payments

### Step 7: Monitoring & Logging

1. **Monitor Payments**:
   - Check Razorpay Dashboard daily
   - Set up email alerts
   - Monitor failed payments

2. **Log Important Events**:
   - Payment attempts
   - Successful payments
   - Failed payments
   - Refunds

### Step 8: Handle Refunds

```typescript
// Example refund code (add to your admin panel)
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function refundPayment(paymentId: string, amount?: number) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount, // Optional: partial refund
      notes: {
        reason: 'Customer request'
      }
    });
    return refund;
  } catch (error) {
    console.error('Refund failed:', error);
    throw error;
  }
}
```

## 🔄 Switching Between Test and Production

### For Development:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=test_secret
```

### For Production:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=live_secret
```

## 📞 Support

- **Razorpay Support**: support@razorpay.com
- **Documentation**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/

## ⚠️ Important Notes

1. **Test Mode vs Live Mode**:
   - Test keys start with `rzp_test_`
   - Live keys start with `rzp_live_`
   - They are completely separate environments

2. **Pricing**:
   - Razorpay charges 2% + GST per transaction
   - No setup fees
   - No annual fees

3. **Settlement**:
   - Payments settled to your bank account
   - T+3 days settlement cycle (configurable)
   - Instant settlements available (extra charges)

## 🎉 You're Ready!

Once you've completed all steps above, your Razorpay integration will be live and ready to accept real payments!

---

**Last Updated**: December 31, 2024
