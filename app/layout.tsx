import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://click2connect.digital'),
  title: {
    default: 'Click2Connect - Smart Digital Business Cards | Create Your Card in 24 Hours',
    template: '%s | Click2Connect'
  },
  description: 'Create stunning digital business cards with interactive PDF, QR code, and instant contact sharing. Professional designs delivered in 24 hours. No app needed. Starting at ₹99.',
  keywords: [
    'digital business card',
    'smart business card',
    'QR code business card',
    'virtual business card',
    'electronic business card',
    'contactless business card',
    'NFC business card alternative',
    'digital visiting card',
    'online business card maker',
    'professional business card',
    'business card India',
    'digital card creator',
    'VCF card',
    'PDF business card'
  ],
  authors: [{ name: 'Click2Connect' }],
  creator: 'Click2Connect',
  publisher: 'Click2Connect',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://click2connect.digital',
    siteName: 'Click2Connect',
    title: 'Click2Connect - Smart Digital Business Cards',
    description: 'Create stunning digital business cards with interactive PDF, QR code, and instant contact sharing. Professional designs delivered in 24 hours.',
    images: [
      {
        url: '/samples/sample-1.png',
        width: 1200,
        height: 630,
        alt: 'Click2Connect - Smart Digital Business Cards',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Click2Connect - Smart Digital Business Cards',
    description: 'Create stunning digital business cards with interactive PDF, QR code, and instant contact sharing. Starting at ₹99.',
    images: ['/samples/sample-1.png'],
    creator: '@click2connect',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://click2connect.digital',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Click2Connect',
              url: 'https://click2connect.digital',
              logo: 'https://click2connect.digital/icon.svg',
              description: 'Smart digital business cards with interactive PDF, QR code, and instant contact sharing',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Mumbai',
                addressCountry: 'IN'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-91776-01334',
                contactType: 'Customer Service',
                email: 'support@click2connect.digital'
              },
              sameAs: [
                'https://twitter.com/click2connect',
                'https://facebook.com/click2connect',
                'https://linkedin.com/company/click2connect'
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Digital Business Card',
              description: 'Professional digital business card with PDF, QR code, and VCF file',
              brand: {
                '@type': 'Brand',
                name: 'Click2Connect'
              },
              offers: {
                '@type': 'Offer',
                price: '99',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                url: 'https://click2connect.digital'
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
