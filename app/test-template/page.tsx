'use client';

import { useState } from 'react';
import { BusinessCardData } from '@/types';
import { templates } from '@/config/templates';

// Template testing page
export default function TestTemplatePage() {
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    // Sample data for testing
    const sampleData: BusinessCardData = {
        templateId: selectedTemplate,
        fullName: 'John Doe',
        businessName: 'Tech Solutions Inc.',
        phone: '+91 98765 43210',
        email: 'john@techsolutions.com',
        whatsapp: '+91 98765 43210',
        city: 'Mumbai',
        website: 'https://techsolutions.com',
        instagram: '@techsolutions',
        googleMaps: 'https://maps.google.com',
        photoDataUrl: '/profile-john.png', // Using the sample photo we created earlier
    };

    const handleGenerateTest = async () => {
        setIsGenerating(true);
        setPdfUrl(null);

        try {
            const response = await fetch('/api/test-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...sampleData,
                    templateId: selectedTemplate,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setPdfUrl(result.pdfUrl);
            } else {
                alert('Failed to generate PDF: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Template Testing Tool
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Test and preview business card templates without payment
                    </p>

                    {/* Template Selection */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Select Template</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedTemplate === template.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div
                                        className="w-full h-32 rounded-lg mb-3"
                                        style={{
                                            background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                                        }}
                                    />
                                    <p className="font-semibold text-gray-900">{template.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sample Data Display */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Sample Data</h2>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Name:</p>
                                <p className="font-semibold">{sampleData.fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Business:</p>
                                <p className="font-semibold">{sampleData.businessName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Phone:</p>
                                <p className="font-semibold">{sampleData.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email:</p>
                                <p className="font-semibold">{sampleData.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">City:</p>
                                <p className="font-semibold">{sampleData.city}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Website:</p>
                                <p className="font-semibold">{sampleData.website}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            💡 Tip: Edit the sampleData object in the code to test with different data
                        </p>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerateTest}
                        disabled={isGenerating}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? 'Generating...' : 'Generate Test PDF'}
                    </button>

                    {/* PDF Preview */}
                    {pdfUrl && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">Preview</h2>
                            <div className="border rounded-lg overflow-hidden">
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-[600px]"
                                    title="PDF Preview"
                                />
                            </div>
                            <div className="mt-4 flex gap-4">
                                <a
                                    href={pdfUrl}
                                    download
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                                >
                                    Download PDF
                                </a>
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
                                >
                                    Open in New Tab
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Back to Home */}
                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
