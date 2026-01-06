'use client';

import { useState } from 'react';
import TemplateSelector from '@/components/TemplateSelector';
import BusinessDetailsForm from '@/components/BusinessDetailsForm';
import SuccessPage from '@/components/SuccessPage';
import { BusinessCardData, GeneratedAssets } from '@/types';

type Step = 'landing' | 'template' | 'form' | 'success';

export default function Home() {
    const [step, setStep] = useState<Step>('landing');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssets | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // For FAQ accordion

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        setStep('form');
    };

    const handleFormSubmit = async (formData: Omit<BusinessCardData, 'templateId'>) => {
        if (!selectedTemplate) return;

        setUserEmail(formData.email);
        setIsProcessing(true);

        try {
            const orderResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 99 }),
            });

            const orderData = await orderResponse.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.orderId,
                name: 'Click2Connect',
                description: 'Smart Digital Business Card',
                handler: async function (response: any) {
                    try {
                        setIsProcessing(true);

                        const cardData: BusinessCardData = {
                            ...formData,
                            templateId: selectedTemplate,
                        };

                        const generateResponse = await fetch('/api/generate-card', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: orderData.orderId,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                cardData,
                            }),
                        });

                        const result = await generateResponse.json();

                        if (result.success) {
                            setGeneratedAssets({
                                paymentId: result.paymentId,
                                email: result.email,
                            } as any);
                            setStep('success');
                        } else {
                            const errorMsg = result.error || 'Failed to process your order. Please contact support.';
                            alert(errorMsg);
                        }
                    } catch (error) {
                        console.error('Error processing order:', error);
                        alert('Something went wrong. Please contact support.');
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#2563eb',
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    },
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Failed to initiate payment. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <>
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            <div className="min-h-screen bg-white">
                {/* Header - Full Width with Container */}
                <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <a href="#" onClick={() => setStep('landing')} className="flex items-center space-x-2 cursor-pointer">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Click2Connect</h1>
                                    <p className="text-xs text-gray-500">Digital Business Cards</p>
                                </div>
                            </a>
                            <div className="flex gap-3">
                                <a
                                    href="/builder"
                                    className="hidden md:block bg-white text-blue-600 border-2 border-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
                                >
                                    Try Builder
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content - No max-w on wrapper to allow full width sections */}
                <main>
                    {step === 'landing' && (
                        <>


                            {/* Hero Section - Redesigned with Split Layout */}
                            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50/30 to-white">
                                {/* Animated Background Elements */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
                                </div>

                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                                        {/* Left Column - Content */}
                                        <div className="space-y-8">
                                            {/* Badge */}
                                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 px-4 py-2 rounded-full shadow-sm">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                </span>
                                                <span className="text-sm font-semibold text-gray-700">Delivered in 24 Hours</span>
                                            </div>

                                            {/* Headline */}
                                            <div>
                                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4">
                                                    Smart Digital<br />
                                                    Visiting Card
                                                </h1>
                                                <div className="flex items-baseline gap-3 mb-6">
                                                    <span className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">₹99</span>
                                                    <span className="text-2xl text-gray-500 line-through">₹299</span>
                                                </div>
                                            </div>

                                            {/* Subheadline */}
                                            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                                                Let people <strong className="text-gray-900">call, WhatsApp, or save your contact</strong> in one tap.
                                            </p>

                                            {/* Trust Badges */}
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
                                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    <span className="text-sm font-medium text-gray-700">One-time payment</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
                                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    <span className="text-sm font-medium text-gray-700">No subscription</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
                                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    <span className="text-sm font-medium text-gray-700">Works on all phones</span>
                                                </div>
                                            </div>

                                            {/* CTA Button */}
                                            <div className="space-y-4">
                                                <a
                                                    href="/builder"
                                                    className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all cursor-pointer"
                                                >
                                                    <span>Create My Digital Card – ₹99</span>
                                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </a>

                                                {/* Payment Trust */}
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                                    <span className="font-medium">Secure payments powered by Razorpay</span>
                                                </div>
                                            </div>

                                            {/* See Examples Link */}
                                            <button
                                                onClick={() => setShowGallery(true)}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm underline cursor-pointer inline-flex items-center gap-1"
                                            >
                                                See live examples
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Right Column - Visual */}
                                        <div className="relative lg:block hidden">
                                            {/* Card Preview Mockup */}
                                            <div className="relative">
                                                {/* Floating Elements */}
                                                <div className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-2xl p-4 animate-float">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">One-Tap</p>
                                                            <p className="font-bold text-gray-900">Call Direct</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-4 animate-float" style={{ animationDelay: '0.5s' }}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Share via</p>
                                                            <p className="font-bold text-gray-900">WhatsApp</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Main Card Display */}
                                                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 aspect-[9/16] max-w-sm mx-auto border border-gray-700">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl"></div>
                                                    <div className="relative h-full flex flex-col justify-between">
                                                        {/* Card Header */}
                                                        <div className="space-y-4">
                                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                                                <span className="text-3xl">👤</span>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl font-bold text-white mb-1">Your Name</h3>
                                                                <p className="text-blue-300">Your Profession</p>
                                                            </div>
                                                        </div>

                                                        {/* Card Actions */}
                                                        <div className="space-y-3">
                                                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-white font-medium">Tap to Call</span>
                                                            </div>
                                                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-white font-medium">Send Email</span>
                                                            </div>
                                                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-white font-medium">Save Contact</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post-Payment Expectation - Below on Mobile, Centered */}
                                    <div className="mt-12 max-w-2xl mx-auto">
                                        <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-6 shadow-xl">
                                            <p className="text-gray-900 font-bold mb-4 text-center flex items-center justify-center gap-2">
                                                <span className="text-2xl">📩</span>
                                                <span>After payment, you'll receive:</span>
                                            </p>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                                        <span className="text-xl">📱</span>
                                                    </div>
                                                    <span className="text-gray-700 font-medium text-sm">Interactive PDF</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
                                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                                        <span className="text-xl">📷</span>
                                                    </div>
                                                    <span className="text-gray-700 font-medium text-sm">QR Code</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
                                                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                                                        <span className="text-xl">💾</span>
                                                    </div>
                                                    <span className="text-gray-700 font-medium text-sm">VCF File</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-4 text-center">
                                                ⚡ Delivered via email within 24 hours
                                            </p>
                                        </div>
                                    </div>

                                    {/* Social Proof */}
                                    <div className="mt-8 text-center">
                                        <p className="text-gray-600 text-sm">
                                            ❤️ Loved by professionals across India
                                        </p>
                                    </div>
                                </div>

                                <style jsx>{`
                                    @keyframes float {
                                        0%, 100% { transform: translateY(0px); }
                                        50% { transform: translateY(-20px); }
                                    }
                                    .animate-float {
                                        animation: float 3s ease-in-out infinite;
                                    }
                                `}</style>
                            </section>

                            {/* How It Works Section - Moved Up for Better Conversion */}
                            <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                                        <p className="text-xl text-gray-600">Get your professional digital card in 4 simple steps</p>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-8">
                                        {[
                                            { step: "1", title: "Choose Template", desc: "Pick from 5 stunning designs", time: "30 sec", icon: "🎨" },
                                            { step: "2", title: "Enter Details", desc: "Fill in your information", time: "2 min", icon: "✍️" },
                                            { step: "3", title: "Pay ₹99", desc: "100% secure payment", time: "1 min", icon: "💳" },
                                            { step: "4", title: "Get Your Card", desc: "Delivered to your email", time: "24 hours", icon: "📧" }
                                        ].map((item, i) => (
                                            <div key={i} className="relative text-center group">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg group-hover:scale-110 transition-transform">
                                                    {item.icon}
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                                    {item.step}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                                <p className="text-gray-600 mb-2">{item.desc}</p>
                                                <p className="text-sm text-blue-600 font-semibold">⏱️ {item.time}</p>
                                                {i < 3 && (
                                                    <div className="hidden md:block absolute top-10 -right-4 text-gray-300 text-2xl">→</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-12">
                                        <a href="/builder" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all cursor-pointer">
                                            Create My Card – ₹99 →
                                        </a>
                                    </div>
                                </div>
                            </section>

                            {/* Features Section - What You'll Receive - Redesigned */}
                            <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                                            📦 Your Complete Package
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What You'll Receive</h2>
                                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                            Everything you need to share your contact professionally
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8">
                                        {/* Interactive PDF Card */}
                                        <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 overflow-hidden">
                                            {/* Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <div className="relative z-10">
                                                {/* Icon */}
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Interactive PDF</h3>

                                                {/* Description */}
                                                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                                                    Share via WhatsApp or email with clickable buttons
                                                </p>

                                                {/* Features List */}
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Tap to call directly</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>WhatsApp integration</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Works on all devices</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* QR Code Card */}
                                        <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 overflow-hidden">
                                            {/* Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <div className="relative z-10">
                                                {/* Icon */}
                                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                    </svg>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">QR Code</h3>

                                                {/* Description */}
                                                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                                                    High-quality image ready to print or display
                                                </p>

                                                {/* Features List */}
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Instant scan & save</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Print-ready quality</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Perfect for displays</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* VCF File Card */}
                                        <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 overflow-hidden">
                                            {/* Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <div className="relative z-10">
                                                {/* Icon */}
                                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">VCF File</h3>

                                                {/* Description */}
                                                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                                                    Universal contact file for easy saving
                                                </p>

                                                {/* Features List */}
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>One-tap save to phone</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>iOS & Android compatible</span>
                                                    </li>
                                                    <li className="flex items-start gap-2 text-sm text-gray-700">
                                                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>No manual typing needed</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom CTA */}
                                    <div className="mt-16 text-center">
                                        <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
                                            <p className="text-gray-900 font-bold text-lg mb-2">All 3 files delivered to your email</p>
                                            <p className="text-gray-600 mb-4">Ready to use within 24 hours of payment</p>
                                            <a href="/builder" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                                                Get Started Now
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Testimonials Section - NEW */}
                            <section className="py-24 bg-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                                        <p className="text-xl text-gray-600">Loved by professionals across India</p>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {[
                                            {
                                                name: "Priya Sharma",
                                                role: "Marketing Consultant",
                                                image: "👩‍💼",
                                                rating: 5,
                                                text: "Absolutely love it! I've shared my card with 50+ clients this month. The QR code feature is a game-changer at networking events."
                                            },
                                            {
                                                name: "Rajesh Kumar",
                                                role: "Real Estate Agent",
                                                image: "👨‍💼",
                                                rating: 5,
                                                text: "Best ₹99 I've ever spent! No more printing hundreds of cards. My clients love how easy it is to save my contact."
                                            },
                                            {
                                                name: "Sneha Patel",
                                                role: "Freelance Designer",
                                                image: "👩‍🎨",
                                                rating: 5,
                                                text: "The designs are stunning! Got my card in less than 24 hours. Super professional and worth every rupee."
                                            }
                                        ].map((testimonial, i) => (
                                            <div key={i} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                                                <div className="flex items-center gap-1 mb-4">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                                                        {testimonial.image}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Comparison Section - NEW */}
                            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Click2Connect?</h2>
                                        <p className="text-xl text-gray-600">See how we compare to traditional business cards</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
                                            <h3 className="text-2xl font-bold text-gray-400 mb-6 text-center">❌ Traditional Cards</h3>
                                            <ul className="space-y-4">
                                                {[
                                                    "Cost ₹500-2000 for 100 cards",
                                                    "Run out quickly",
                                                    "Can't update information",
                                                    "Easy to lose or damage",
                                                    "Not eco-friendly",
                                                    "Limited space for info"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-gray-600">
                                                        <span className="text-red-500 font-bold">✗</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-xl border-2 border-blue-500 relative">
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                                BEST CHOICE
                                            </div>
                                            <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">✅ Click2Connect</h3>
                                            <ul className="space-y-4">
                                                {[
                                                    "Only ₹99 one-time payment",
                                                    "Never runs out - share unlimited",
                                                    "Update anytime for free",
                                                    "Always accessible on phone",
                                                    "100% eco-friendly",
                                                    "Unlimited information + links"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                                                        <span className="text-green-500 font-bold">✓</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="text-center mt-12">
                                        <a href="/builder" className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all cursor-pointer">
                                            Create My Card – ₹99 • One-time payment →
                                        </a>
                                    </div>
                                </div>
                            </section>

                            {/* FAQ Section - Compact Redesign */}
                            <section className="py-16 bg-white">
                                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-12">
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Quick Questions</h2>
                                        <p className="text-gray-600">Everything you need to know</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-10">
                                        {[
                                            {
                                                q: "How long does delivery take?",
                                                a: "Within 24 hours via email. You'll receive PDF, QR Code, and VCF files.",
                                            },
                                            {
                                                q: "What files do I receive?",
                                                a: "Interactive PDF, high-quality QR Code image, and VCF contact file.",
                                            },
                                            {
                                                q: "Can I update my card later?",
                                                a: "Yes! Contact us anytime for free updates. No additional charges.",
                                            },
                                            {
                                                q: "Is payment secure?",
                                                a: "100% secure via Razorpay with bank-level encryption.",
                                            },
                                            {
                                                q: "Do clients need an app?",
                                                a: "No app needed. Works on any device with a web browser.",
                                            },
                                            {
                                                q: "Who operates Click2Connect?",
                                                a: "Sygmia Innovative, an India-based digital solutions company.",
                                            }
                                        ].map((faq, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-50 rounded-xl p-5 hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                                            >
                                                <button
                                                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                                    className="w-full text-left"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h3 className="font-bold text-gray-900 text-sm flex-1">{faq.q}</h3>
                                                        <div className={`shrink-0 transition-transform duration-200 ${openFaqIndex === i ? 'rotate-180' : ''}`}>
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === i ? 'max-h-40 mt-3' : 'max-h-0'}`}>
                                                        <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Compact Contact CTA */}
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center text-white">
                                        <p className="font-bold text-lg mb-3">Still have questions?</p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                            <a
                                                href="tel:+917760133445"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                <span>Call Us</span>
                                            </a>
                                            <a
                                                href="mailto:support@click2connect.com"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur border border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <span>Email Support</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>


                            {/* Footer - Full Width Background */}
                            <footer className="bg-gray-900 text-white py-16">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                                        <div className="col-span-1 md:col-span-1">
                                            <h3 className="text-2xl font-bold mb-6">Click2Connect</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Empowering professionals with smart, sustainable, and shareable digital business cards.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-6">Product</h4>
                                            <ul className="space-y-3 text-sm text-gray-400">
                                                <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Features</a></li>
                                                <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Templates</a></li>
                                                <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Pricing</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-6">Support</h4>
                                            <ul className="space-y-3 text-sm text-gray-400">
                                                <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">FAQs</a></li>
                                                <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Contact Us</a></li>
                                                <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-6">Get in Touch</h4>
                                            <ul className="space-y-4 text-sm text-gray-400">
                                                <li className="flex items-start gap-3">
                                                    <span className="p-1 bg-gray-800 rounded text-blue-400">✉️</span> support@click2connect.com
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="p-1 bg-gray-800 rounded text-green-400">📞</span> +91 776 0133445
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="p-1 bg-gray-800 rounded text-red-400">📍</span> Mumbai, India
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                                        <p className="text-gray-500">
                                            © 2025 Click2Connect. A product by <a href="https://sygmiainnovative.co.in/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Sygmia Innovative</a>, India.
                                        </p>
                                        <div className="flex gap-8 mt-4 md:mt-0">
                                            <a href="#" className="text-gray-500 hover:text-white transition-colors cursor-pointer">Privacy</a>
                                            <a href="#" className="text-gray-500 hover:text-white transition-colors cursor-pointer">Terms</a>
                                            <a href="#" className="text-gray-500 hover:text-white transition-colors cursor-pointer">Cookies</a>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </>
                    )}

                    {step === 'success' && generatedAssets && (
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <SuccessPage
                                email={generatedAssets.email}
                                paymentId={generatedAssets.paymentId}
                            />
                        </div>
                    )}
                </main>

                {/* Modal Logic */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {step === 'landing' ? 'Select Your Template' : step === 'form' ? 'Enter Your Details' : 'Complete'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => { setShowModal(false); setStep('landing'); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6">
                                {step === 'landing' && (
                                    <TemplateSelector
                                        selectedTemplate={selectedTemplate}
                                        onSelect={(templateId) => {
                                            handleTemplateSelect(templateId);
                                        }}
                                    />
                                )}

                                {step === 'form' && selectedTemplate && (
                                    <BusinessDetailsForm
                                        templateId={selectedTemplate}
                                        onSubmit={handleFormSubmit}
                                        onBack={() => {
                                            setShowModal(false);
                                            setStep('landing');
                                            setTimeout(() => { document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Modal */}
                {showGallery && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowGallery(false)}>
                        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Digital Card Gallery</h3>
                                    <p className="text-gray-500 text-sm">Real examples of cards created by our customers</p>
                                </div>
                                <button onClick={() => setShowGallery(false)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-8 bg-gray-50 min-h-[400px]">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {/* Real Sample Cards */}
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="group relative aspect-[9/16] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                                            <img
                                                src={`/samples/sample-${i}.png`}
                                                alt={`Sample Business Card ${i}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Hover Overlay with Info */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                                <p className="text-white font-semibold text-sm mb-2">Design {i}</p>
                                                <p className="text-white/80 text-xs">Click to view full size</p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Call to action card */}
                                    <div className="aspect-[9/16] bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center p-6 hover:border-blue-400 transition-colors">
                                        <h4 className="font-bold text-gray-900 mb-2">Want a card like this?</h4>
                                        <p className="text-gray-600 text-sm mb-4">Create your own professional digital card in minutes.</p>
                                        <a href="/builder" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg cursor-pointer inline-block">
                                            Get Started Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 z-[110] flex items-center justify-center">
                        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Order...</h3>
                            <p className="text-gray-600">Please wait while we save your details.</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
