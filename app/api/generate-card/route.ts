import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { saveToGoogleSheetsWebhook } from '@/lib/sheets-webhook';
import { BusinessCardData } from '@/types';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    // Initialize Resend safe check
    const resendApiKey = process.env.RESEND_API_KEY;
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    if (!resend) {
        console.warn('RESEND_API_KEY is missing. Emails will not be sent.');
    }

    try {
        console.log('=== Generate Card API Started ===');
        const body = await request.json();
        const {
            orderId,
            paymentId,
            signature,
            cardData,
        }: {
            orderId: string;
            paymentId: string;
            signature: string;
            cardData: BusinessCardData;
        } = body;

        console.log('Payment verification starting...', { orderId, paymentId });

        // Verify payment signature
        const isValid = verifyPaymentSignature(orderId, paymentId, signature);
        if (!isValid) {
            console.error('Payment signature verification failed');
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }
        console.log('Payment verified successfully');

        // Save to Google Sheets
        console.log('Saving to Google Sheets...');
        try {
            await saveToGoogleSheetsWebhook(cardData, paymentId);
            console.log('Saved to Google Sheets successfully');
        } catch (error) {
            console.error('Failed to save to Google Sheets:', error);
            // Return error if Google Sheets fails - this is critical now
            return NextResponse.json(
                { error: 'Failed to save your order. Please contact support with your payment ID: ' + paymentId },
                { status: 500 }
            );
        }

        // Send confirmation email
        console.log('Sending confirmation email...');
        if (resend) {
            try {
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'Click2Connect <onboarding@resend.dev>',
                    to: cardData.email,
                    subject: '✅ Order Confirmed - Your Digital Business Card',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
                                <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for choosing Click2Connect</p>
                            </div>
                            
                            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                                <p>Hi <strong>${cardData.fullName}</strong>,</p>
                                
                                <p>Great news! We've received your payment and your order is confirmed. 🎊</p>
                                
                                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                                    <h2 style="color: #667eea; font-size: 20px; margin-top: 0;">📋 Order Details</h2>
                                    <div style="margin: 10px 0;">
                                        <span style="font-weight: 600; color: #4b5563;">Payment ID:</span> ${paymentId}
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <span style="font-weight: 600; color: #4b5563;">Name:</span> ${cardData.fullName}
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <span style="font-weight: 600; color: #4b5563;">Business:</span> ${cardData.businessName}
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <span style="font-weight: 600; color: #4b5563;">Email:</span> ${cardData.email}
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <span style="font-weight: 600; color: #4b5563;">Phone:</span> ${cardData.phone}
                                    </div>
                                </div>
                                
                                <h2 style="color: #667eea; font-size: 20px;">⏰ What's Next?</h2>
                                <p>Your professional digital business card will be created and delivered to this email within <strong>24 hours</strong>.</p>
                                
                                <p>You'll receive:</p>
                                <ul style="line-height: 1.8;">
                                    <li><strong>Interactive PDF</strong> - Share via WhatsApp, email, or social media</li>
                                    <li><strong>QR Code</strong> - Print on marketing materials for easy scanning</li>
                                    <li><strong>VCF Contact File</strong> - One-tap contact saving for your clients</li>
                                </ul>
                                
                                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                    <p style="margin: 0; color: #92400e;">
                                        <strong>📧 Important:</strong> Keep this email safe! It contains your payment confirmation and order details.
                                    </p>
                                </div>
                                
                                <p style="margin-top: 30px;">Need help or have questions? Just reply to this email - we're here to help!</p>
                                
                                <p style="margin-top: 20px;">Best regards,<br><strong>The Click2Connect Team</strong></p>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                                <p>Click2Connect - Smart Digital Business Cards</p>
                                <p>Made with ❤️ in India</p>
                                <p style="font-size: 12px; color: #9ca3af;">This is an automated confirmation email. Please do not reply to this message.</p>
                            </div>
                        </body>
                        </html>
                    `,
                });
                console.log('Confirmation email sent successfully to:', cardData.email);
            } catch (error) {
                console.error('Failed to send confirmation email:', error);
                // Don't fail the request if email fails - order is still saved
                console.warn('Order saved but email failed. Customer will need manual follow-up.');
            }
        } else {
            console.log('Resend not initialized, skipping email.');
        }

        console.log('=== Generate Card API Completed Successfully ===');
        return NextResponse.json({
            success: true,
            message: 'Order received! Check your email for confirmation. Your business card will be delivered within 24 hours.',
            paymentId: paymentId,
            email: cardData.email,
        });
    } catch (error) {
        console.error('=== ERROR in generate-card API ===');
        console.error('Error details:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
            { error: 'Failed to process your order. Please contact support.' },
            { status: 500 }
        );
    }
}
