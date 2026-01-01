'use client';

interface SuccessPageProps {
    email: string;
    paymentId: string;
}

export default function SuccessPage({ email, paymentId }: SuccessPageProps) {
    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                        className="w-12 h-12 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🎉 Order Confirmed!
            </h1>

            <p className="text-xl text-gray-600 mb-8">
                Thank you for your order! Your custom business card is being prepared.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                    <svg className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Your business card will be delivered to:
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">{email}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <svg className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Delivery Time:
                        </h3>
                        <p className="text-xl font-bold text-blue-600">Within 24 Hours</p>
                        <p className="text-sm text-gray-600 mt-1">
                            You'll receive your business card files via email
                        </p>
                    </div>
                </div>
            </div>

            {/* What You'll Receive */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    📦 What You'll Receive
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">PDF Card</h4>
                        <p className="text-sm text-gray-600">Share digitally</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">QR Code</h4>
                        <p className="text-sm text-gray-600">Print & display</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">Contact File</h4>
                        <p className="text-sm text-gray-600">One-tap save</p>
                    </div>
                </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                <div className="text-sm text-gray-600">
                    <p><strong>Payment ID:</strong> {paymentId}</p>
                    <p className="mt-2 text-xs">Save this for your records</p>
                </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-gray-700 mb-4">
                    Have questions or need to make changes to your order?
                </p>
                <a
                    href="https://wa.me/917760133445?text=Hi, I have a question about my order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    💬 Chat on WhatsApp
                </a>
            </div>

            {/* Back to Home */}
            <button
                onClick={() => window.location.href = '/'}
                className="text-blue-600 hover:text-blue-700 font-semibold"
            >
                ← Back to Home
            </button>
        </div>
    );
}
