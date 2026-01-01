# 🎴 Click2Connect - Digital Business Card Platform

> Transform your networking with professional digital business cards. Share your contact instantly via WhatsApp, Email, or QR Code.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

- 🎨 **5 Professional Designs** - Modern, Sleek, Paris, Luxury, and Tech themes
- 💳 **Secure Payments** - Razorpay integration with live payment processing
- 📧 **Email Delivery** - Automatic confirmation emails via Resend
- 📊 **Order Tracking** - Google Sheets integration for order management
- 🔒 **100% Secure** - Payment signature verification and HTTPS
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast & Optimized** - Built with Next.js 16 and deployed on Vercel
- 🌐 **Custom Domain** - Professional branding with your own domain

## 🚀 Live Demo

**Production**: [https://click2connect.digital](https://click2connect.digital)

## 📸 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Card Builder
![Card Builder](docs/screenshots/builder.png)

### Card Designs
![Card Designs](docs/screenshots/designs.png)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom React components

### Backend
- **API Routes**: Next.js API Routes
- **Payment**: Razorpay (Live Mode)
- **Email**: Resend
- **Database**: Google Sheets (via Apps Script)

### Deployment
- **Hosting**: Vercel (Mumbai region)
- **Domain**: Custom domain support
- **SSL**: Automatic HTTPS
- **CDN**: Global edge network

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Razorpay account (live keys)
- Resend account (API key)
- Google account (for Sheets integration)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/click2connect.git
cd click2connect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Razorpay (Live Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Google Sheets
GOOGLE_SHEETS_WEBHOOK_URL=your_google_apps_script_url

# Resend Email
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_from_email

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

5. **Add custom domain** in Vercel settings

For detailed deployment instructions, see [VERCEL_DEPLOYMENT_COMPLETE.md](VERCEL_DEPLOYMENT_COMPLETE.md)

## 📚 Documentation

- [Deployment Guide](VERCEL_DEPLOYMENT_COMPLETE.md) - Complete Vercel deployment instructions
- [Email Testing](EMAIL_TESTING_GUIDE.md) - Email configuration and testing
- [Production Setup](PRODUCTION_MODE_LIVE.md) - Razorpay live mode setup
- [FAQ Redesign](FAQ_REDESIGN.md) - FAQ section documentation

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key (live) | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (live) | Yes |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | Yes |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Google Apps Script webhook URL | Yes |
| `RESEND_API_KEY` | Resend API key | Yes |
| `RESEND_FROM_EMAIL` | Email sender address | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL | Yes |

## 💳 Payment Flow

1. User fills business card form
2. Selects card design
3. Clicks "Order Now" (₹99)
4. Razorpay payment gateway opens
5. User completes payment
6. Payment verified via signature
7. Order saved to Google Sheets
8. Confirmation email sent
9. Success page displayed

## 📧 Email Notifications

Customers receive:
- ✅ Order confirmation email
- 📋 Payment details
- ⏰ Delivery timeline (24 hours)
- 📎 What to expect (PDF, QR Code, VCF)

## 🎨 Card Designs

1. **Modern** - Clean and professional
2. **Sleek Dark** - Bold and elegant
3. **Paris Boutique** - Sophisticated and classy
4. **Luxury** - Premium gold theme
5. **Tech** - Modern app-style design

## 🔒 Security Features

- ✅ Payment signature verification
- ✅ Environment variables protection
- ✅ HTTPS encryption
- ✅ Secure API routes
- ✅ Input validation
- ✅ XSS protection

## 📊 Analytics & Monitoring

- Order tracking via Google Sheets
- Payment monitoring via Razorpay dashboard
- Email delivery tracking via Resend dashboard
- Performance monitoring via Vercel Analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- Website: [click2connect.digital](https://click2connect.digital)
- Email: support@click2connect.com
- Phone: +91 776 0133445

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Razorpay](https://razorpay.com/) - Payment gateway
- [Resend](https://resend.com/) - Email service
- [Vercel](https://vercel.com/) - Hosting platform

## 📞 Support

For support, email support@click2connect.com or call +91 776 0133445

## 🗺️ Roadmap

- [ ] Automated card generation (PDF, QR, VCF)
- [ ] Admin dashboard for order management
- [ ] Bulk order support
- [ ] More card designs
- [ ] Card customization options
- [ ] Analytics dashboard
- [ ] Customer portal

## ⚡ Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **SEO Score**: 100

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

Made with ❤️ in India 🇮🇳

**Star ⭐ this repo if you find it helpful!**
