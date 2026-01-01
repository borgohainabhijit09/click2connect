import { google } from 'googleapis';
import { BusinessCardData } from '@/types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function saveToGoogleSheets(
    data: BusinessCardData,
    paymentId: string
): Promise<void> {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
                    /\\n/g,
                    '\n'
                ),
            },
            scopes: SCOPES,
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        const values = [
            [
                new Date().toISOString(),
                paymentId,
                data.fullName,
                data.businessName,
                data.phone,
                data.whatsapp || '',
                data.email,
                data.city || '',
                data.website || '',
                data.instagram || '',
                data.googleMaps || '',
                data.templateId,
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:L',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        console.log('Data saved to Google Sheets successfully');
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        throw new Error('Failed to save data to Google Sheets');
    }
}

export async function initializeGoogleSheet(): Promise<void> {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
                    /\\n/g,
                    '\n'
                ),
            },
            scopes: SCOPES,
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Check if headers exist
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A1:L1',
        });

        if (!response.data.values || response.data.values.length === 0) {
            // Add headers
            const headers = [
                [
                    'Timestamp',
                    'Payment ID',
                    'Full Name',
                    'Business Name',
                    'Phone',
                    'WhatsApp',
                    'Email',
                    'City',
                    'Website',
                    'Instagram',
                    'Google Maps',
                    'Template ID',
                ],
            ];

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: 'Sheet1!A1:L1',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: headers,
                },
            });

            console.log('Google Sheet initialized with headers');
        }
    } catch (error) {
        console.error('Error initializing Google Sheet:', error);
        throw new Error('Failed to initialize Google Sheet');
    }
}
