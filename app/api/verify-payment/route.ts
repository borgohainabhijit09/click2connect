import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';

/**
 * Verify Razorpay Payment
 * This endpoint verifies the payment signature after successful payment
 */
export async function POST(request: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await request.json();

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing required payment details' },
                { status: 400 }
            );
        }

        // Verify the payment signature
        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            console.error('Payment verification failed:', {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            });

            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // Payment verified successfully
        console.log('Payment verified successfully:', {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });

    } catch (error) {
        console.error('Error in verify-payment API:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
