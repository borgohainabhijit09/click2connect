import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json();

        if (!amount || amount !== 99) {
            return NextResponse.json(
                { error: 'Invalid amount. Must be ₹99' },
                { status: 400 }
            );
        }

        const order = await createOrder(amount);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Error in create-order API:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
