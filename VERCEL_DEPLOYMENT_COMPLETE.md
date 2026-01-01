# 🚀 VERCEL DEPLOYMENT - READY TO GO!

## ✅ All Configurations Complete!

Your app is now **100% ready** for Vercel deployment with `click2connect.digital` domain.

---

## 📁 Files Configured

1. ✅ `next.config.ts` - Optimized for Vercel
2. ✅ `vercel.json` - Deployment settings (Mumbai region)
3. ✅ `.vercelignore` - Exclude unnecessary files
4. ✅ `package.json` - Build scripts ready

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

Choose your login method (GitHub, Google, or Email)

### **Step 3: Deploy**

```bash
vercel
```

**Answer the prompts**:
- Set up and deploy? → **Yes**
- Which scope? → **Your account**
- Link to existing project? → **No**
- What's your project's name? → **click2connect**
- In which directory is your code? → **./** (press Enter)
- Want to override settings? → **No**

**Wait 2-3 minutes** for deployment to complete.

You'll get a URL like: `https://click2connect-xxxx.vercel.app`

---

## 🔐 Step 4: Add Environment Variables

### **Go to Vercel Dashboard**:
https://vercel.com/dashboard

1. Click your project: **click2connect**
2. Go to: **Settings** → **Environment Variables**
3. Add these **one by one**:

### **Required Environment Variables**:

```
Name: NEXT_PUBLIC_RAZORPAY_KEY_ID
Value: rzp_live_RySfQUMBuxV3tj
Environment: Production, Preview, Development
```

```
Name: RAZORPAY_KEY_SECRET
Value: ggLZFq0SmqJ2bOpF43M1rRGe
Environment: Production, Preview, Development
```

```
Name: RAZORPAY_WEBHOOK_SECRET
Value: your_webhook_secret_from_razorpay_dashboard
Environment: Production, Preview, Development
```

```
Name: GOOGLE_SHEETS_WEBHOOK_URL
Value: https://script.google.com/macros/s/AKfycbxekPFus1Hb3hYxPW6b-89CLsxfEe21-9jqxv_j07otPsDkJEH80tNByiDgNN-4-sElVQ/exec
Environment: Production, Preview, Development
```

```
Name: RESEND_API_KEY
Value: re_HxFupkDK_LinFsPM8jgy4UKamnnKD2ifA
Environment: Production, Preview, Development
```

```
Name: RESEND_FROM_EMAIL
Value: onboarding@resend.dev
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_APP_URL
Value: https://click2connect.digital
Environment: Production, Preview, Development
```

---

## 🔄 Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

This will deploy to production with all environment variables.

---

## 🌐 Step 6: Add Custom Domain

### **In Vercel Dashboard**:

1. Go to your project: **click2connect**
2. Click: **Settings** → **Domains**
3. Click: **Add Domain**
4. Enter: **click2connect.digital**
5. Click: **Add**

Vercel will show you DNS records to configure.

---

## 🔧 Step 7: Configure DNS in Hostinger

### **Login to Hostinger**:
https://hpanel.hostinger.com/

1. Go to: **Domains** → **click2connect.digital**
2. Click: **DNS / Name Servers** → **Manage**

### **Add These DNS Records**:

#### **A Record** (for root domain):
```
Type: A
Name: @
Points to: 76.76.21.21
TTL: 3600
```

#### **CNAME Record** (for www):
```
Type: CNAME
Name: www
Points to: cname.vercel-dns.com
TTL: 3600
```

### **Remove Old Records**:
- Delete any existing A record for `@`
- Delete any existing CNAME for `www`

### **Save Changes**

---

## ⏱️ Step 8: Wait for DNS Propagation

- **Typical time**: 5-30 minutes
- **Maximum**: 24 hours (rare)
- **Check status**: https://dnschecker.org/

---

## 🔗 Step 9: Update Razorpay Webhook

### **After domain is live**:

1. Go to: https://dashboard.razorpay.com/
2. Navigate: **Settings** → **Webhooks**
3. Click: **Add New Webhook** (or edit existing)
4. Enter:
   - **Webhook URL**: `https://click2connect.digital/api/razorpay-webhook`
   - **Secret**: (generate a strong secret)
   - **Active Events**: Select all payment events
5. Click: **Create Webhook**
6. **Copy the webhook secret**
7. **Add to Vercel**:
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Update `RAZORPAY_WEBHOOK_SECRET` with the new secret
8. **Redeploy**: Run `vercel --prod`

---

## ✅ Step 10: Test Your Live Site

### **Visit your domain**:
https://click2connect.digital

### **Test Complete Flow**:

1. ✅ Home page loads
2. ✅ Click "Get Started" → Builder page
3. ✅ Fill form with real details
4. ✅ Select a design
5. ✅ Click "Order Now" (₹99)
6. ✅ Complete payment with real card
7. ✅ Check email for confirmation
8. ✅ Verify Google Sheets entry
9. ✅ Check Razorpay dashboard

---

## 📊 Deployment Checklist

- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Initial deployment complete
- [ ] All 7 environment variables added
- [ ] Redeployed with `vercel --prod`
- [ ] Custom domain added in Vercel
- [ ] DNS records updated in Hostinger
- [ ] DNS propagation complete (30 min wait)
- [ ] Domain shows ✅ in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] Razorpay webhook updated
- [ ] Test payment completed
- [ ] Email confirmation received
- [ ] Google Sheets updated
- [ ] Site fully functional

---

## 🎯 Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

---

## 🔍 Verify Deployment

### **Check Build Status**:
```bash
vercel logs
```

### **Check Environment Variables**:
- Vercel Dashboard → Settings → Environment Variables
- All 7 variables should be present

### **Check Domain**:
- Vercel Dashboard → Settings → Domains
- Should show: ✅ Valid Configuration

### **Check SSL**:
- Visit: https://click2connect.digital
- Browser should show 🔒 (secure)

---

## 🐛 Troubleshooting

### **Build Failed**:
```bash
# Check logs
vercel logs

# Common fixes:
# 1. Clear cache and rebuild
vercel --force

# 2. Check package.json scripts
npm run build  # Test locally first
```

### **Environment Variables Not Working**:
1. Check spelling (case-sensitive)
2. Ensure "Production" is selected
3. Redeploy after adding: `vercel --prod`

### **Domain Not Working**:
1. Check DNS records in Hostinger
2. Wait 30 minutes for propagation
3. Check: https://dnschecker.org/
4. Clear browser cache (Ctrl+Shift+R)

### **Payment Not Working**:
1. Check Razorpay keys are live (not test)
2. Verify webhook URL is correct
3. Check webhook secret matches
4. Test in Razorpay dashboard

### **Email Not Sending**:
1. Check Resend API key
2. Verify email in Resend dashboard
3. Check spam folder
4. Test with different email provider

---

## 📱 Mobile Testing

After deployment, test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)
- [ ] Different screen sizes

---

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ `https://click2connect.digital` loads
2. ✅ SSL certificate shows 🔒
3. ✅ All pages work (home, builder)
4. ✅ Payment completes successfully
5. ✅ Email confirmation received
6. ✅ Google Sheets updated
7. ✅ No console errors
8. ✅ Fast loading (< 2 seconds)

---

## 📊 Performance Monitoring

### **Vercel Analytics** (Free):
- Vercel Dashboard → Analytics
- Track page views, performance, etc.

### **Google Analytics** (Optional):
Add to your site for detailed tracking.

---

## 🔄 Future Updates

### **To Deploy Updates**:

```bash
# Make your code changes
# Then deploy:
vercel --prod

# Or setup automatic deployments:
# Connect GitHub repo in Vercel dashboard
# Every push to main = auto deploy
```

---

## 💰 Cost Summary

| Service | Cost |
|---------|------|
| **Vercel Hosting** | FREE |
| **SSL Certificate** | FREE |
| **Global CDN** | FREE |
| **Bandwidth** | FREE (100GB/mo) |
| **Builds** | FREE (6000 min/mo) |
| **Domain** | ₹99/year (Hostinger) |
| **Total** | **₹99/year** |

---

## 🎯 Next Steps After Deployment

1. **Monitor First Orders**:
   - Watch Razorpay dashboard
   - Check email delivery
   - Verify Google Sheets

2. **Marketing**:
   - Share your link
   - Add to social media
   - Start promoting

3. **Optimization**:
   - Monitor analytics
   - Improve based on data
   - A/B test if needed

4. **Support**:
   - Respond to customer emails
   - Handle refunds if needed
   - Improve based on feedback

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Razorpay Support**: support@razorpay.com
- **Resend Support**: https://resend.com/support

---

## ✅ You're Ready!

**Everything is configured and ready to deploy!**

**Just run**:
```bash
vercel
```

**And you're live in 5 minutes!** 🚀

---

**Created**: January 1, 2026
**Status**: ✅ Ready for Deployment
**Domain**: click2connect.digital
**Region**: Mumbai (BOM1)
**Cost**: FREE (₹0/month)
