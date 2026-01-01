// Alternative Google Sheets implementation using Google Apps Script Webhook
// Use this if you prefer webhook approach over Service Account

import { BusinessCardData } from '@/types';

export async function saveToGoogleSheetsWebhook(
    data: BusinessCardData,
    paymentId: string
): Promise<void> {
    try {
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

        if (!webhookUrl) {
            throw new Error('Google Sheets webhook URL not configured');
        }

        const payload = {
            timestamp: new Date().toISOString(),
            paymentId,
            fullName: data.fullName,
            businessName: data.businessName,
            phone: data.phone,
            whatsapp: data.whatsapp || '',
            email: data.email,
            city: data.city || '',
            website: data.website || '',
            instagram: data.instagram || '',
            googleMaps: data.googleMaps || '',
            templateId: data.templateId,
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Webhook request failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Data saved to Google Sheets via webhook:', result);
    } catch (error) {
        console.error('Error saving to Google Sheets webhook:', error);
        throw new Error('Failed to save data to Google Sheets');
    }
}
