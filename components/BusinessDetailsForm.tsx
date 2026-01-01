'use client';

import { useState } from 'react';
import { BusinessCardData } from '@/types';

interface BusinessDetailsFormProps {
    templateId: string;
    onSubmit: (data: Omit<BusinessCardData, 'templateId'>) => void;
    onBack: () => void;
}

export default function BusinessDetailsForm({
    templateId,
    onSubmit,
    onBack,
}: BusinessDetailsFormProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        phone: '',
        whatsapp: '',
        email: '',
        city: '',
        website: '',
        instagram: '',
        googleMaps: '',
    });

    const [usePhoneForWhatsApp, setUsePhoneForWhatsApp] = useState(true);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            whatsapp: usePhoneForWhatsApp ? formData.phone : formData.whatsapp,
            photoDataUrl: photoPreview || undefined,
        };

        onSubmit(dataToSubmit);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Back to Templates
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enter Your Business Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Photo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                        {photoPreview && (
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
                                <img
                                    src={photoPreview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <label className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg px-6 py-4 flex flex-col items-center hover:border-blue-500 transition-colors">
                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-gray-600">
                                    {photoFile ? photoFile.name : 'Click to upload photo'}
                                </span>
                                <span className="text-xs text-gray-400 mt-1">
                                    PNG, JPG up to 5MB
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Full Name */}
                <div>
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="John Doe"
                    />
                </div>

                {/* Business Name */}
                <div>
                    <label
                        htmlFor="businessName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Acme Corporation"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="+91 98765 43210"
                    />
                </div>

                {/* WhatsApp Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="usePhoneForWhatsApp"
                        checked={usePhoneForWhatsApp}
                        onChange={(e) => setUsePhoneForWhatsApp(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                        htmlFor="usePhoneForWhatsApp"
                        className="ml-2 text-sm text-gray-700"
                    >
                        Use same number for WhatsApp
                    </label>
                </div>

                {/* WhatsApp (if different) */}
                {!usePhoneForWhatsApp && (
                    <div>
                        <label
                            htmlFor="whatsapp"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            id="whatsapp"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                )}

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="john@example.com"
                    />
                </div>

                {/* City */}
                <div>
                    <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Mumbai"
                    />
                </div>

                {/* Website */}
                <div>
                    <label
                        htmlFor="website"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Website
                    </label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="https://example.com"
                    />
                </div>

                {/* Instagram */}
                <div>
                    <label
                        htmlFor="instagram"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Instagram
                    </label>
                    <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="@username"
                    />
                </div>

                {/* Google Maps */}
                <div>
                    <label
                        htmlFor="googleMaps"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Google Maps Link
                    </label>
                    <input
                        type="url"
                        id="googleMaps"
                        name="googleMaps"
                        value={formData.googleMaps}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="https://maps.google.com/..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Continue to Payment (₹1 - Test Mode)
                </button>
            </form>
        </div>
    );
}
