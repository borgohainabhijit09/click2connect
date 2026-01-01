import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Razorpay Webhook Handler
 * This endpoint receives payment notifications from Razorpay
 * and processes them securely.
 */
export async function POST(request: NextRequest) {
    try {
        // Get the webhook signature from headers
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature found' },
                { status: 400 }
            );
        }

        // Get the raw body
        const body = await request.text();

        // Verify webhook signature
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('Webhook secret not configured');
            return NextResponse.json(
                { error: 'Webhook not configured' },
                { status: 500 }
            );
        }

        // Generate expected signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        // Verify signature
        if (expectedSignature !== signature) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Parse the event
        const event = JSON.parse(body);
        const eventType = event.event;
        const payload = event.payload;

        console.log('Received webhook event:', eventType);

        // Handle different event types
        switch (eventType) {
            case 'payment.authorized':
                await handlePaymentAuthorized(payload);
                break;

            case 'payment.captured':
                await handlePaymentCaptured(payload);
                break;

            case 'payment.failed':
                await handlePaymentFailed(payload);
                break;

            case 'order.paid':
                await handleOrderPaid(payload);
                break;

            default:
                console.log('Unhandled event type:', eventType);
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

/**
 * Handle payment authorized event
 */
async function handlePaymentAuthorized(payload: any) {
    const payment = payload.payment.entity;
    console.log('Payment authorized:', payment.id);

    // TODO: Update your database
    // - Mark order as payment authorized
    // - Send confirmation email
}

/**
 * Handle payment captured event
 */
async function handlePaymentCaptured(payload: any) {
    const payment = payload.payment.entity;
    console.log('Payment captured:', payment.id);

    // TODO: Update your database
    // - Mark order as paid
    // - Trigger order fulfillment
    // - Send receipt email

    // Example: Log to Google Sheets
    try {
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        if (webhookUrl) {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'payment_captured',
                    paymentId: payment.id,
                    orderId: payment.order_id,
                    amount: payment.amount / 100, // Convert from paise
                    email: payment.email,
                    contact: payment.contact,
                    timestamp: new Date().toISOString(),
                }),
            });
        }
    } catch (error) {
        console.error('Error logging to Google Sheets:', error);
    }
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(payload: any) {
    const payment = payload.payment.entity;
    console.log('Payment failed:', payment.id);

    // TODO: Update your database
    // - Mark order as payment failed
    // - Send failure notification
    // - Log for analytics
}

/**
 * Handle order paid event
 */
async function handleOrderPaid(payload: any) {
    const order = payload.order.entity;
    console.log('Order paid:', order.id);

    // TODO: Update your database
    // - Mark order as completed
    // - Trigger fulfillment process
}
