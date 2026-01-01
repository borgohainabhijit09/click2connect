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
                            {/* Urgency Banner - NEW */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 text-center font-semibold text-sm">
                                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
                                    <span className="animate-pulse">🔥</span>
                                    <span>Limited Time: Get Your Card for ₹99 (Regular ₹299) - Offer Ends Soon!</span>
                                    <span className="animate-pulse">🔥</span>
                                </div>
                            </div>

                            {/* Hero Section - Enhanced */}
                            <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                                    <div className="text-center max-w-5xl mx-auto">
                                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-blue-100 px-4 py-1.5 rounded-full text-blue-700 text-sm font-semibold mb-6 shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            ✅ Delivered in 24 Hours | 🔒 100% Secure | 💯 Money-Back Guarantee
                                        </div>

                                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                                            Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">10X More Clients</span><br className="hidden md:block" />
                                            with a Professional Digital Card
                                        </h1>

                                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                                            Stop losing clients to lost business cards. Share your contact instantly via <strong>WhatsApp, Email, or QR Code</strong>. No app needed.
                                        </p>

                                        {/* Trust Badges - NEW */}
                                        <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                <span className="font-medium">100% Secure Payment</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                <span className="font-medium">Money-Back Guarantee</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                <span className="font-medium">500+ Happy Customers</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8">
                                            <a
                                                href="/builder"
                                                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all cursor-pointer min-w-[280px] text-center relative overflow-hidden"
                                            >
                                                <span className="relative z-10">Get My Card - Only ₹99</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </a>
                                            <button
                                                onClick={() => setShowGallery(true)}
                                                className="px-10 py-5 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer flex items-center gap-2 min-w-[280px] justify-center group"
                                            >
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                See Live Examples
                                            </button>
                                        </div>

                                        {/* Risk Reversal - NEW */}
                                        <p className="text-sm text-gray-500 mb-12">
                                            <span className="font-semibold text-green-600">✓ No Risk:</span> Not satisfied? Get 100% refund within 7 days. No questions asked.
                                        </p>

                                        {/* Social Proof Stats - Enhanced */}
                                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-10">
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-blue-600 mb-1">24h</p>
                                                <p className="text-sm text-gray-600 font-medium">Fast Delivery</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-green-600 mb-1">₹99</p>
                                                <p className="text-sm text-gray-600 font-medium">One-Time Cost</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-purple-600 mb-1">500+</p>
                                                <p className="text-sm text-gray-600 font-medium">Happy Customers</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-orange-600 mb-1">4.9★</p>
                                                <p className="text-sm text-gray-600 font-medium">Average Rating</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Features Section - Contained */}
                            <section id="features" className="py-24 bg-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <h2 className="text-3xl font-bold text-gray-900">Everything you need to grow</h2>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-12">
                                        <div className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                                                <span className="text-3xl group-hover:grayscale brightness-0 invert">📱</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive PDF</h3>
                                            <p className="text-gray-600 leading-relaxed">Share your card digitally via WhatsApp or email with clickable links.</p>
                                        </div>
                                        <div className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                                                <span className="text-3xl group-hover:grayscale brightness-0 invert">📷</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">QR Code</h3>
                                            <p className="text-gray-600 leading-relaxed">Print and display your unique QR code for instant scanning.</p>
                                        </div>
                                        <div className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                                                <span className="text-3xl group-hover:grayscale brightness-0 invert">💾</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">VCF File</h3>
                                            <p className="text-gray-600 leading-relaxed">One-tap contact saving makes it easy for clients to save your number.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* How It Works Section - NEW */}
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
                                            Start Now - It's Quick! →
                                        </a>
                                    </div>
                                </div>
                            </section>

                            {/* Testimonials Section - NEW */}
                            <section className="py-24 bg-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                                        <p className="text-xl text-gray-600">Join 500+ professionals who love their digital cards</p>
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
                                            Get Started for Just ₹99 →
                                        </a>
                                    </div>
                                </div>
                            </section>

                            {/* FAQ Section - Redesigned with Accordion */}
                            <section className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
                                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                                            💡 Got Questions?
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                                        <p className="text-xl text-gray-600">Everything you need to know about Click2Connect</p>
                                    </div>

                                    <div className="space-y-4 mb-12">
                                        {[
                                            {
                                                q: "How long does it take to get my card?",
                                                a: "Your digital business card will be delivered to your email within 24 hours of payment. Most orders are completed even faster! You'll receive 3 professional files ready to use immediately.",
                                                icon: "⏱️"
                                            },
                                            {
                                                q: "What files do I receive?",
                                                a: "You'll get 3 professional files: (1) Interactive PDF with clickable links for easy sharing, (2) High-quality QR Code image for printing, and (3) VCF contact file for one-tap saving to phone contacts.",
                                                icon: "📁"
                                            },
                                            {
                                                q: "Can I update my card later?",
                                                a: "Yes! Contact us anytime and we'll update your information for free. Your card links will automatically reflect the changes. No additional charges, ever.",
                                                icon: "🔄"
                                            },
                                            {
                                                q: "Is the payment secure?",
                                                a: "Absolutely! We use Razorpay, India's most trusted payment gateway with bank-level encryption. Your payment information is 100% secure and we never store your card details.",
                                                icon: "🔒"
                                            },
                                            {
                                                q: "What if I'm not satisfied?",
                                                a: "We offer a 100% money-back guarantee within 7 days. If you're not happy with your card, we'll refund you immediately - no questions asked. Your satisfaction is our priority!",
                                                icon: "💯"
                                            },
                                            {
                                                q: "Do my clients need an app to view my card?",
                                                a: "No! Your card works on any device with a web browser. No app installation required. Just share the link via WhatsApp, Email, or let them scan your QR code. It's that simple!",
                                                icon: "📱"
                                            }
                                        ].map((faq, i) => (
                                            <div
                                                key={i}
                                                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg"
                                            >
                                                <button
                                                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-blue-50/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-md">
                                                            {faq.icon}
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.q}</h3>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180' : ''}`}>
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ${openFaqIndex === i ? 'max-h-96' : 'max-h-0'}`}
                                                >
                                                    <div className="px-6 pb-6 pt-2">
                                                        <div className="pl-16 pr-12">
                                                            <p className="text-gray-700 leading-relaxed text-base">{faq.a}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Contact CTA Card - Redesigned */}
                                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl">
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

                                        <div className="relative z-10">
                                            <div className="text-center mb-8">
                                                <div className="inline-block p-4 bg-white/10 backdrop-blur rounded-2xl mb-4">
                                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-bold mb-3">Still have questions?</h3>
                                                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                                    We're here to help! Our team is ready to answer all your questions.
                                                </p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                                <a
                                                    href="tel:+917760133445"
                                                    className="group flex items-center gap-4 p-6 bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl hover:bg-white hover:text-blue-600 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
                                                >
                                                    <div className="w-14 h-14 bg-white/20 group-hover:bg-blue-100 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-semibold opacity-90 mb-1">Call Us Now</p>
                                                        <p className="text-lg font-bold">+91 776 0133445</p>
                                                    </div>
                                                </a>

                                                <a
                                                    href="mailto:support@click2connect.com"
                                                    className="group flex items-center gap-4 p-6 bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl hover:bg-white hover:text-blue-600 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
                                                >
                                                    <div className="w-14 h-14 bg-white/20 group-hover:bg-blue-100 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-semibold opacity-90 mb-1">Email Support</p>
                                                        <p className="text-lg font-bold">Get Help 24/7</p>
                                                    </div>
                                                </a>
                                            </div>

                                            <div className="text-center mt-8">
                                                <p className="text-sm text-blue-100">
                                                    <span className="font-semibold">⚡ Quick Response:</span> We typically reply within 2 hours during business hours
                                                </p>
                                            </div>
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
                                            © 2025 Click2Connect. Made with ❤️ in India.
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
