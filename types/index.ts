export interface BusinessCardData {
    fullName: string;
    businessName: string;
    phone: string;
    whatsapp?: string;
    email: string;
    city?: string;
    website?: string;
    instagram?: string;
    googleMaps?: string;
    templateId: string;
    photoDataUrl?: string;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    preview: string;
    colors: {
        primary: string;
        secondary: string;
        text: string;
        background: string;
    };
}

export interface PaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface GeneratedAssets {
    pdfUrl: string;
    qrUrl: string;
    vcfUrl: string;
    email: string;
    paymentId: string;
}
