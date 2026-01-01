'use client';

import { templates } from '@/config/templates';
import { Template } from '@/types';
import Image from 'next/image';

interface TemplateSelectorProps {
    selectedTemplate: string | null;
    onSelect: (templateId: string) => void;
}

export default function TemplateSelector({
    selectedTemplate,
    onSelect,
}: TemplateSelectorProps) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Choose Your Template
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={`relative group rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate === template.id
                                ? 'border-blue-600 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                            }`}
                    >
                        <div
                            className="aspect-[3/2] flex items-center justify-center p-8"
                            style={{ backgroundColor: template.colors.background }}
                        >
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 rounded-full mx-auto mb-3"
                                    style={{ backgroundColor: template.colors.primary }}
                                />
                                <div
                                    className="h-3 rounded mb-2"
                                    style={{ backgroundColor: template.colors.primary }}
                                />
                                <div
                                    className="h-2 rounded w-3/4 mx-auto"
                                    style={{ backgroundColor: template.colors.secondary }}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <div className="flex gap-2 mt-2">
                                <div
                                    className="w-6 h-6 rounded-full border border-gray-300"
                                    style={{ backgroundColor: template.colors.primary }}
                                    title="Primary color"
                                />
                                <div
                                    className="w-6 h-6 rounded-full border border-gray-300"
                                    style={{ backgroundColor: template.colors.secondary }}
                                    title="Secondary color"
                                />
                            </div>
                        </div>

                        {selectedTemplate === template.id && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-2">
                                <svg
                                    className="w-5 h-5"
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
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
