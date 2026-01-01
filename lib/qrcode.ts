import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<Buffer> {
    try {
        const qrBuffer = await QRCode.toBuffer(data, {
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 500,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return qrBuffer;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

export async function generateQRCodeDataURL(data: string): Promise<string> {
    try {
        const qrDataURL = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H',
            width: 500,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return qrDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}
