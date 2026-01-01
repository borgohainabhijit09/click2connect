'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';

export default function CardBuilder() {
    const router = useRouter();
    const [cardData, setCardData] = useState({
        fullName: '',
        businessName: '', // Changed from jobTitle and companyName
        phone: '',
        email: '',
        address: '',
        website: '',
        instagram: '', // New field
        facebook: '', // New field
        themeColor: 'black',
        design: 'tech',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
    });
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const themeColors: Record<string, string> = {
        blue: 'bg-slate-900',
        purple: 'bg-purple-900',
        green: 'bg-emerald-950',
        black: 'bg-black',
        red: 'bg-red-900',
        teal: 'bg-cyan-950'
    };

    const accentColors: Record<string, string> = {
        blue: 'text-amber-200',
        purple: 'text-purple-200',
        green: 'text-emerald-400',
        black: 'text-white',
        red: 'text-red-200',
        teal: 'text-cyan-400'
    }

    const designs = [
        { id: 'modern', name: 'Design 1 (Modern)' },
        { id: 'sleek', name: 'Design 2 (Sleek)' },
        { id: 'paris', name: 'Design 3 (Paris)' },
        { id: 'luxury', name: 'Design 4 (Luxury)' },
        { id: 'tech', name: 'Design 5 (Tech)' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCardData(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
                const link = document.createElement('a');
                link.download = `${cardData.fullName.replace(/\s+/g, '_')}_BusinessCard.png`;
                link.href = dataUrl;
                link.click();
            } catch (error) {
                console.error('Error saving card:', error);
                alert('Failed to save card image. Please try again.');
            }
        }
    };

    const handlePlaceOrder = async () => {
        // Validate required fields
        if (!cardData.fullName || !cardData.email || !cardData.phone) {
            alert('Please fill in all required fields (Name, Email, Phone) before placing an order.');
            return;
        }

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

                        const businessCardData = {
                            fullName: cardData.fullName,
                            businessName: cardData.businessName,
                            phone: cardData.phone,
                            email: cardData.email,
                            website: cardData.website,
                            address: cardData.address,
                            instagram: cardData.instagram,
                            facebook: cardData.facebook,
                            templateId: cardData.design,
                        };

                        const generateResponse = await fetch('/api/generate-card', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: orderData.orderId,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                cardData: businessCardData,
                            }),
                        });

                        const result = await generateResponse.json();

                        if (result.success) {
                            setShowOrderModal(true);
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
                    name: cardData.fullName,
                    email: cardData.email,
                    contact: cardData.phone,
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

    const getThemeBg = () => {
        const map: Record<string, string> = {
            blue: 'bg-blue-600',
            purple: 'bg-purple-600',
            green: 'bg-emerald-600',
            black: 'bg-gray-900',
            red: 'bg-red-600',
            teal: 'bg-cyan-600'
        };
        return map[cardData.themeColor] || 'bg-black';
    };

    return (
        <>
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;700&display=swap');
      `}</style>

                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <a href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </a>
                        <h1 className="text-xl font-bold text-gray-900">Card Builder</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download Preview
                        </button>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {isProcessing ? 'Processing...' : 'Place Order - ₹99'}
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)]">
                    {/* Left Panel: Form Controls - Scrollable */}
                    <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 h-full">
                        <div className="space-y-8">
                            {/* Design Selection */}
                            <div>
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Design</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {designs.map(d => (
                                        <button
                                            key={d.id}
                                            onClick={() => setCardData(prev => ({ ...prev, design: d.id }))}
                                            className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${cardData.design === d.id ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                        >
                                            {d.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Theme Color</h2>
                                <div className="flex gap-3 flex-wrap">
                                    {Object.keys(themeColors).map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setCardData(prev => ({ ...prev, themeColor: color }))}
                                            className={`w-8 h-8 rounded-full ${themeColors[color]} ${cardData.themeColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'} transition-all cursor-pointer border border-gray-200 shadow-sm`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Details</h2>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                            <img src={cardData.profileImage} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={cardData.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g., John Doe"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name / Profession <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={cardData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g., Marketing Manager or Acme Corp"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Info</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={cardData.phone}
                                        onChange={handleChange}
                                        placeholder="e.g., +91 98765 43210"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={cardData.email}
                                        onChange={handleChange}
                                        placeholder="e.g., john@example.com"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={cardData.address}
                                        onChange={handleChange}
                                        placeholder="e.g., Mumbai, India"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website <span className="text-gray-400 text-xs">(Optional)</span></label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={cardData.website}
                                        onChange={handleChange}
                                        placeholder="e.g., www.example.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Social Media <span className="text-gray-400 text-xs font-normal">(Optional - Choose One)</span></h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">@</span>
                                        <input
                                            type="text"
                                            name="instagram"
                                            value={cardData.instagram}
                                            onChange={handleChange}
                                            placeholder="username"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">facebook.com/</span>
                                        <input
                                            type="text"
                                            name="facebook"
                                            value={cardData.facebook}
                                            onChange={handleChange}
                                            placeholder="username"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Live Preview - Fixed, No Scroll, Card Fits Screen */}
                    <div className="flex-1 bg-gray-100 flex flex-col h-full overflow-hidden">
                        <div className="p-6 flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Preview</h2>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-gray-200 shadow-sm">Mobile View</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                            <div className="w-full max-w-md mx-auto">

                                {/* WRAPPED DESIGNS FOR CAPTURE */}
                                <div ref={cardRef} className="w-full">

                                    {/* 
                   ================================================================
                   DESIGN 1: MODERN SPLIT
                   ================================================================
                */}
                                    {cardData.design === 'modern' && (
                                        <div className="relative w-full aspect-[9/18] bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-gray-900 ring-2 ring-gray-900/50">
                                            <div className={`h-[45%] ${themeColors[cardData.themeColor]} relative p-8 flex flex-col`}>
                                                <div className="flex items-center gap-2 mb-6 opacity-90">
                                                    <svg className={`w-6 h-6 ${accentColors[cardData.themeColor]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                                    <span className={`font-bold tracking-wide ${accentColors[cardData.themeColor]} uppercase text-xs`}>{cardData.businessName}</span>
                                                </div>

                                                <div className="mt-auto pb-4 z-10">
                                                    <h1 className={`text-2xl font-bold ${accentColors[cardData.themeColor]} mb-1`}>{cardData.fullName}</h1>
                                                    <p className="text-blue-100/60 text-sm italic font-light">(she/her)</p>
                                                    <p className={`mt-2 ${accentColors[cardData.themeColor]} font-medium text-sm tracking-wide`}>{cardData.businessName}</p>
                                                </div>

                                                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
                                                    <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center">
                                                        <div className="w-32 h-32 rounded-full border border-dashed border-white/20"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Overlapping Profile Image - Updated to use Uploaded Image */}
                                            <div className="absolute top-[35%] right-6 w-32 h-32 rounded-full border-4 border-white shadow-xl z-20 overflow-hidden bg-gray-200">
                                                <img src={cardData.profileImage} alt="Profile" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                            </div>

                                            <div className="h-[55%] bg-white px-8 pt-16 flex flex-col">
                                                <div className="mb-8">
                                                    <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                                        {cardData.businessName}
                                                    </p>
                                                </div>

                                                <div className="space-y-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full ${themeColors[cardData.themeColor]} flex items-center justify-center shrink-0`}>
                                                            <svg className={`w-5 h-5 ${accentColors[cardData.themeColor]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 006.516 6.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-gray-900 text-sm font-semibold">{cardData.phone}</p>
                                                            <p className="text-gray-400 text-xs">Work</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full ${themeColors[cardData.themeColor]} flex items-center justify-center shrink-0`}>
                                                            <svg className={`w-5 h-5 ${accentColors[cardData.themeColor]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-gray-900 text-sm font-semibold truncate">{cardData.email}</p>
                                                            <p className="text-gray-400 text-xs">Work</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full ${themeColors[cardData.themeColor]} flex items-center justify-center shrink-0`}>
                                                            <svg className={`w-5 h-5 ${accentColors[cardData.themeColor]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-gray-900 text-sm font-semibold truncate">{cardData.website}</p>
                                                            <p className="text-gray-400 text-xs">Company</p>
                                                        </div>
                                                    </div>
                                                    {cardData.instagram && (
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full ${themeColors[cardData.themeColor]} flex items-center justify-center shrink-0`}>
                                                                <svg className={`w-5 h-5 ${accentColors[cardData.themeColor]}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-gray-900 text-sm font-semibold truncate">@{cardData.instagram}</p>
                                                                <p className="text-gray-400 text-xs">Instagram</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {cardData.facebook && (
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full ${themeColors[cardData.themeColor]} flex items-center justify-center shrink-0`}>
                                                                <svg className={`w-5 h-5 ${accentColors[cardData.themeColor]}`} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-gray-900 text-sm font-semibold truncate">{cardData.facebook}</p>
                                                                <p className="text-gray-400 text-xs">Facebook</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-auto mb-8">
                                                    <button className={`w-full py-4 rounded-xl ${themeColors[cardData.themeColor]} text-white font-semibold text-sm shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                        Add to Contacts
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {/* 
                   ================================================================
                   DESIGN 2: SLEEK DARK
                   ================================================================
                */}
                                    {cardData.design === 'sleek' && (
                                        <div className="relative w-full aspect-[9/18] bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-gray-900 ring-2 ring-gray-900/50 flex flex-col font-sans">
                                            <div className={`h-[48%] ${themeColors[cardData.themeColor]} relative flex flex-col items-center pt-8`}>
                                                <div className="absolute top-6 left-6 flex flex-col items-center">
                                                    <svg className={`w-6 h-6 ${accentColors[cardData.themeColor]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                    <span className={`text-[0.6rem] uppercase tracking-wide ${accentColors[cardData.themeColor]} mt-1`}>{cardData.businessName?.split(' ')[0] || 'Business'}</span>
                                                </div>

                                                <div className="mt-6 w-28 h-28 rounded-full border-4 border-gray-800 overflow-hidden shadow-2xl relative z-10">
                                                    <img src={cardData.profileImage} alt="Adam" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="text-center mt-4">
                                                    <h1 className={`text-3xl font-bold ${accentColors[cardData.themeColor]} mb-1`}>{cardData.fullName}</h1>
                                                    <p className={`text-sm ${accentColors[cardData.themeColor]} opacity-80 font-medium`}>{cardData.businessName}</p>
                                                </div>

                                                <div className="absolute -bottom-6 w-full flex justify-center gap-12 z-20">
                                                    <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border border-gray-100">
                                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 006.516 6.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                    </div>
                                                    <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border border-gray-100">
                                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 bg-white pt-10 px-6 pb-6 relative">
                                                <div className="mb-6 border-b border-gray-100 pb-4">
                                                    <p className="text-gray-900 text-sm font-medium leading-relaxed">
                                                        {cardData.businessName}
                                                    </p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-xs text-gray-400 font-medium">Work</label>
                                                        <p className="text-sm font-semibold text-gray-900">{cardData.phone}</p>
                                                    </div>
                                                    <div className="border-t border-gray-50 pt-2">
                                                        <label className="text-xs text-gray-400 font-medium">Work</label>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{cardData.email}</p>
                                                    </div>
                                                    <div className="border-t border-gray-50 pt-2">
                                                        <label className="text-xs text-gray-400 font-medium">Company</label>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{cardData.website}</p>
                                                    </div>
                                                    <div className="border-t border-gray-50 pt-2 pb-8">
                                                        <label className="text-xs text-gray-400 font-medium">Address</label>
                                                        <p className="text-sm font-semibold text-gray-900 leading-tight">{cardData.address}</p>
                                                    </div>
                                                    {cardData.instagram && (
                                                        <div className="border-t border-gray-50 pt-2">
                                                            <label className="text-xs text-gray-400 font-medium">Instagram</label>
                                                            <p className="text-sm font-semibold text-gray-900 truncate">@{cardData.instagram}</p>
                                                        </div>
                                                    )}
                                                    {cardData.facebook && (
                                                        <div className="border-t border-gray-50 pt-2">
                                                            <label className="text-xs text-gray-400 font-medium">Facebook</label>
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{cardData.facebook}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`absolute bottom-6 right-6 w-14 h-14 rounded-full ${themeColors[cardData.themeColor]} shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ring-4 ring-white`}>
                                                    <svg className={`w-6 h-6 ${accentColors[cardData.themeColor]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 
                   ================================================================
                   DESIGN 3: PARIS BOUTIQUE
                   ================================================================
                */}
                                    {cardData.design === 'paris' && (
                                        <div className="relative w-full aspect-[9/18] bg-[#F9F5F0] rounded-[2rem] shadow-2xl overflow-hidden border-8 border-gray-900 ring-2 ring-gray-900/50 flex flex-col font-serif">
                                            <div className={`h-[25%] ${themeColors[cardData.themeColor]} text-white flex flex-col items-center justify-center relative border-b-4 border-white`}>
                                                <div className="text-center z-10">
                                                    <h1 className="text-3xl font-serif tracking-widest font-thin">PARIS</h1>
                                                    <p className="text-2xl font-[Great Vibes] -mt-2 ml-16 text-gray-300">Boutique</p>
                                                </div>
                                            </div>

                                            <div className="flex-1 px-8 pt-16 pb-24 relative flex flex-col items-center text-center">
                                                <div className="absolute -top-16 w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                                                    <img src={cardData.profileImage} alt="Ashley" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="mt-2 mb-8">
                                                    <h2 className="text-5xl text-gray-800 font-[Great Vibes] mb-4">{cardData.fullName}</h2>
                                                    <div className={`${themeColors[cardData.themeColor]} text-white px-6 py-2 tracking-[0.2em] text-xs font-sans font-bold`}>
                                                        {cardData.businessName?.toUpperCase() || 'BUSINESS'}
                                                    </div>
                                                </div>

                                                <div className="space-y-6 w-full font-['Montserrat'] font-medium text-sm text-gray-800">
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="w-8 flex justify-center">
                                                            <svg className="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <p>Call Me: {cardData.phone}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="w-8 flex justify-center">
                                                            <svg className="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <p className="truncate">{cardData.email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="w-8 flex justify-center">
                                                            <svg className="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                        </div>
                                                        <p className="truncate">{cardData.website}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="w-8 flex justify-center">
                                                            <svg className="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        </div>
                                                        <p className="leading-tight">{cardData.address}</p>
                                                    </div>
                                                    {cardData.instagram && (
                                                        <div className="flex items-center gap-4 text-left">
                                                            <div className="w-8 flex justify-center">
                                                                <svg className="w-6 h-6 stroke-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                                            </div>
                                                            <p className="truncate">@{cardData.instagram}</p>
                                                        </div>
                                                    )}
                                                    {cardData.facebook && (
                                                        <div className="flex items-center gap-4 text-left">
                                                            <div className="w-8 flex justify-center">
                                                                <svg className="w-6 h-6 stroke-1" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                            </div>
                                                            <p className="truncate">{cardData.facebook}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={`${themeColors[cardData.themeColor]} py-4 flex flex-col items-center justify-center text-white border-t-4 border-white h-[12%]`}>
                                                <p className="font-[Great Vibes] text-2xl mb-2">follow me</p>
                                                <div className="flex gap-4">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black cursor-pointer hover:scale-110 transition-transform">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 
                   ================================================================
                   DESIGN 4: LUXURY GOLD
                   ================================================================
                */}
                                    {cardData.design === 'luxury' && (
                                        <div className={`relative w-full aspect-[9/18] ${themeColors[cardData.themeColor]} rounded-[2rem] shadow-2xl overflow-hidden border-8 border-gray-900 ring-2 ring-gray-900/50 flex flex-col font-sans text-amber-200`}>
                                            <div className="flex-1 px-8 py-12 flex flex-col items-center text-center">
                                                {/* Added Profile Image for Luxury Design */}
                                                <div className="w-24 h-24 rounded-full border-2 border-amber-200 mb-6 overflow-hidden shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                                    <img src={cardData.profileImage} alt="Profile" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="mb-2">
                                                    <h2 className="text-4xl font-[Great Vibes] text-amber-200" style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}>{cardData.businessName || 'Business'}</h2>
                                                </div>

                                                <div className="mb-8">
                                                    <h1 className="text-lg font-[Cinzel] tracking-[0.3em] text-amber-100 uppercase">{cardData.fullName}</h1>
                                                </div>

                                                <div className="space-y-6 w-full font-['Montserrat'] font-light text-sm text-amber-100/90 tracking-wide">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 flex justify-center shrink-0">
                                                            <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.116 15.116 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.59 3.91c0-.55-.45-1-1-1H4.39c-.55 0-1 .45-1 1 13.84 13.84 0 0013.84 13.84h3.78c.55 0 1-.45 1-1v-3.21c0-.56-.45-1.01-1-.99z" /></svg>
                                                        </div>
                                                        <p>{cardData.phone}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 flex justify-center shrink-0">
                                                            <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z" /></svg>
                                                        </div>
                                                        <p className="truncate">{cardData.website}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 flex justify-center shrink-0">
                                                            <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                                        </div>
                                                        <p className="truncate">{cardData.email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 flex justify-center shrink-0">
                                                            <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                                        </div>
                                                        <p className="leading-tight">{cardData.address}</p>
                                                    </div>
                                                    {cardData.instagram && (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 flex justify-center shrink-0">
                                                                <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                                            </div>
                                                            <p className="truncate">@{cardData.instagram}</p>
                                                        </div>
                                                    )}
                                                    {cardData.facebook && (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 flex justify-center shrink-0">
                                                                <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                            </div>
                                                            <p className="truncate">{cardData.facebook}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-8 flex flex-col items-center">
                                                    <div className="bg-amber-200 p-2 rounded-lg">
                                                        <div className="border-2 border-black p-1">
                                                            <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 2h2v2h-2v-2zm3 2h3v2h-3v-2zM3 21h3v-3H3v3zm18 0h-3v-3h3v3zm-9-3h3v3h-3v-3zm-1-8h2v2h-2v-2zm-2 2h2v2H9v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm1-5h3v3h-3V7z" /></svg>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex items-center gap-2">
                                                        <span className="text-amber-200 text-lg">✦</span>
                                                        <p className="text-amber-100 text-[0.6rem] tracking-[0.2em] font-medium">BOOK APPOINTMENT</p>
                                                        <span className="text-amber-200 text-lg">✦</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-6 flex gap-6">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="border border-amber-200/50 rounded-lg p-2 hover:bg-amber-200/10 cursor-pointer transition-colors">
                                                            <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5.01 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" /></svg>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 
                   ================================================================
                   DESIGN 5: TECH / WONDER MUFFIN
                   ================================================================
                */}
                                    {cardData.design === 'tech' && (
                                        <div className="relative w-full aspect-[9/18] bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-gray-900 ring-2 ring-gray-900/50 flex flex-col font-sans">
                                            <div className="relative pt-12 pb-6 px-6 text-center border-b border-gray-100 flex flex-col items-center">
                                                <div className="w-12 h-12 mb-4">
                                                    <svg className="w-full h-full text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a9 9 0 00-9 9v11h18V11a9 9 0 00-9-9zM6 11a6 6 0 1112 0v7H6v-7z" /><path d="M8 8a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                                </div>

                                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight mb-8 font-['Inter']">
                                                    {cardData.businessName}
                                                </h2>

                                                <div className="absolute -bottom-6 right-6 w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                                                    <img src={cardData.profileImage} alt="Profile" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                                </div>
                                            </div>

                                            <div className="flex-1 px-6 pt-10 pb-6 flex flex-col">
                                                <div className="mb-8 font-['Inter']">
                                                    <h1 className="text-2xl font-bold text-gray-900">{cardData.fullName}</h1>
                                                    <p className="text-sm font-medium text-gray-500 italic">{cardData.businessName}</p>
                                                </div>

                                                <div className="space-y-4 font-medium text-sm">
                                                    <div className="flex items-center gap-4 group cursor-pointer">
                                                        <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <span className="text-gray-800 group-hover:text-black">Book a meeting with me</span>
                                                    </div>

                                                    <div className="flex items-center gap-4 group cursor-pointer">
                                                        <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                        </div>
                                                        <span className="text-gray-800 group-hover:text-black">Visit our website</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 group cursor-pointer">
                                                        <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                                        </div>
                                                        <span className="text-gray-800 group-hover:text-black">Connect with me on LinkedIn</span>
                                                    </div>

                                                    <div className="flex items-center gap-4 group cursor-pointer">
                                                        <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 006.516 6.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-800 font-bold group-hover:text-black">{cardData.phone}</span>
                                                            <span className="text-xs text-gray-400 font-normal">Call Me</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 group cursor-pointer">
                                                        <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-800 font-bold group-hover:text-black truncate w-48">{cardData.email}</span>
                                                            <span className="text-xs text-gray-400 font-normal">Email</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 group cursor-pointer">
                                                        <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-800 font-bold group-hover:text-black">{cardData.address}</span>
                                                            <span className="text-xs text-gray-400 font-normal">Address</span>
                                                        </div>
                                                    </div>
                                                    {cardData.instagram && (
                                                        <div className="flex items-center gap-4 group cursor-pointer">
                                                            <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-800 font-bold group-hover:text-black">@{cardData.instagram}</span>
                                                                <span className="text-xs text-gray-400 font-normal">Instagram</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {cardData.facebook && (
                                                        <div className="flex items-center gap-4 group cursor-pointer">
                                                            <div className={`${getThemeBg()} w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-800 font-bold group-hover:text-black">{cardData.facebook}</span>
                                                                <span className="text-xs text-gray-400 font-normal">Facebook</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="px-6 pb-6 mt-auto relative">
                                                <div className="absolute -top-6 right-6">
                                                    <button className={`${getThemeBg()} text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity`}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                                        Send
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-around border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
                                                    <div className="flex flex-col items-center gap-1 text-red-500 cursor-pointer">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2h-5.66c.413-1.165 1.524-2 2.83-2z" /></svg>
                                                        <span>Your Card</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 hover:text-gray-800 cursor-pointer">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                        <span>Contacts</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className="mt-8 text-center space-y-2">
                                    <p className="text-gray-500 text-sm">
                                        Showing <span className="font-semibold text-gray-700">&quot;{designs.find(d => d.id === cardData.design)?.name}&quot;</span>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Theme: {cardData.themeColor.charAt(0).toUpperCase() + cardData.themeColor.slice(1)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div >
                </main >

                {/* Success Modal */}
                {
                    showOrderModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 z-[110] flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully! 🎉</h3>
                                <p className="text-gray-600 mb-6">
                                    Your digital business card is being generated. You'll receive your files (PDF, QR Code, VCF) via email at <strong>{cardData.email}</strong> within 24 hours.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => router.push('/')}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                                    >
                                        Go to Home
                                    </button>
                                    <button
                                        onClick={() => setShowOrderModal(false)}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                                    >
                                        Create Another Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Processing Overlay */}
                {
                    isProcessing && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 z-[110] flex items-center justify-center">
                            <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Order...</h3>
                                <p className="text-gray-600">Please wait while we process your payment.</p>
                            </div>
                        </div>
                    )
                }
            </div >
        </>
    );
}
