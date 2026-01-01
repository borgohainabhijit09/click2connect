import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf';
import { generateQRCodeDataURL } from '@/lib/qrcode';
import { generateVCF } from '@/lib/vcf';
import { BusinessCardData } from '@/types';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        console.log('=== Test Generate API Started ===');
        const cardData: BusinessCardData = await request.json();

        console.log('Generating VCF...');
        const vcfContent = generateVCF(cardData);

        console.log('Generating QR code...');
        const vcfDataURL = `data:text/vcard;charset=utf-8,${encodeURIComponent(
            vcfContent
        )}`;
        const qrCodeDataURL = await generateQRCodeDataURL(vcfDataURL);

        console.log('Generating PDF...');
        const pdfBuffer = await generatePDF(cardData, qrCodeDataURL);

        // Save to public directory
        console.log('Saving test file...');
        const publicDir = path.join(process.cwd(), 'public', 'generated');
        await mkdir(publicDir, { recursive: true });

        const timestamp = Date.now();
        const pdfPath = path.join(publicDir, `test_${timestamp}.pdf`);

        await writeFile(pdfPath, pdfBuffer);
        console.log('Test file saved');

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const pdfUrl = `${baseUrl}/generated/test_${timestamp}.pdf`;

        console.log('=== Test Generate API Completed ===');
        return NextResponse.json({
            success: true,
            pdfUrl,
        });
    } catch (error) {
        console.error('=== ERROR in test-generate API ===');
        console.error('Error details:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        return NextResponse.json(
            {
                error: 'Failed to generate test PDF',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
