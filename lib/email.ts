import { Resend } from 'resend';
import { BusinessCardData } from '@/types';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}


export async function sendEmailWithAssets(
  data: BusinessCardData,
  pdfBuffer: Buffer,
  qrBuffer: Buffer,
  vcfBuffer: Buffer
): Promise<void> {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: data.email,
      subject: 'Your Smart Digital Business Card is Ready! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .card-info {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
              }
              h1 {
                margin: 0;
                font-size: 28px;
              }
              h2 {
                color: #667eea;
                font-size: 20px;
              }
              .info-row {
                margin: 10px 0;
              }
              .label {
                font-weight: 600;
                color: #4b5563;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Your Business Card is Ready!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for choosing Click2Connect</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${data.fullName}</strong>,</p>
              
              <p>Congratulations! Your smart digital business card has been created successfully.</p>
              
              <div class="card-info">
                <h2>📋 Your Details</h2>
                <div class="info-row">
                  <span class="label">Name:</span> ${data.fullName}
                </div>
                <div class="info-row">
                  <span class="label">Business:</span> ${data.businessName}
                </div>
                <div class="info-row">
                  <span class="label">Email:</span> ${data.email}
                </div>
                <div class="info-row">
                  <span class="label">Phone:</span> ${data.phone}
                </div>
              </div>
              
              <h2>📎 Your Attachments</h2>
              <p>You'll find 3 files attached to this email:</p>
              <ul>
                <li><strong>Business Card PDF</strong> - Share this beautiful card digitally</li>
                <li><strong>QR Code</strong> - Print and display for easy contact sharing</li>
                <li><strong>VCF Contact File</strong> - Import directly to any phone</li>
              </ul>
              
              <h2>💡 How to Use</h2>
              <ol>
                <li>Share the PDF via WhatsApp, email, or social media</li>
                <li>Print the QR code on your marketing materials</li>
                <li>Send the VCF file for instant contact saving</li>
              </ol>
              
              <p style="margin-top: 30px;">Need help? Just reply to this email!</p>
            </div>
            
            <div class="footer">
              <p>Click2Connect - Smart Digital Business Cards</p>
              <p>Made with ❤️ in India</p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `${data.fullName.replace(/\s+/g, '_')}_BusinessCard.pdf`,
          content: pdfBuffer,
        },
        {
          filename: `${data.fullName.replace(/\s+/g, '_')}_QRCode.png`,
          content: qrBuffer,
        },
        {
          filename: `${data.fullName.replace(/\s+/g, '_')}_Contact.vcf`,
          content: vcfBuffer,
        },
      ],
    });

    console.log('Email sent successfully to:', data.email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
