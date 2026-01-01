import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import { BusinessCardData } from '@/types';
import { templates } from '@/config/templates';

export async function generatePDF(
    data: BusinessCardData,
    qrCodeDataURL: string
): Promise<Buffer> {
    try {
        console.log('=== PDF Generation Started ===');
        const pdfDoc = await PDFDocument.create();

        // Create a card-sized page (portrait orientation)
        const page = pdfDoc.addPage([400, 600]);

        const template = templates.find((t) => t.id === data.templateId);
        if (!template) {
            throw new Error(`Template not found: ${data.templateId}`);
        }

        // Load fonts
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Parse colors
        const primaryColor = hexToRgb(template.colors.primary);
        const secondaryColor = hexToRgb(template.colors.secondary);
        const textColor = hexToRgb(template.colors.text);

        const { width, height } = page.getSize();
        const margin = 30;

        // Draw decorative background elements
        // Top gradient
        page.drawRectangle({
            x: 0,
            y: height - 150,
            width: width,
            height: 150,
            color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
            opacity: 0.1,
        });

        // Bottom gradient
        page.drawRectangle({
            x: 0,
            y: 0,
            width: width,
            height: 120,
            color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
            opacity: 0.1,
        });

        // Top border accent
        page.drawRectangle({
            x: 0,
            y: height - 10,
            width: width,
            height: 10,
            color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
        });

        // Bottom border accent
        page.drawRectangle({
            x: 0,
            y: 0,
            width: width,
            height: 10,
            color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
        });

        // Decorative circles (design elements)
        page.drawCircle({
            x: -30,
            y: height / 2,
            size: 80,
            color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
            opacity: 0.05,
        });

        page.drawCircle({
            x: width + 30,
            y: height / 2 - 100,
            size: 100,
            color: rgb(secondaryColor.r, secondaryColor.g, secondaryColor.b),
            opacity: 0.05,
        });

        // Profile photo
        const photoY = height - 120;
        const photoSize = 100;

        if (data.photoDataUrl) {
            try {
                const base64Data = data.photoDataUrl.split(',')[1];
                const photoBytes = Buffer.from(base64Data, 'base64');

                // Determine image type
                let photoImage;
                if (data.photoDataUrl.includes('image/png')) {
                    photoImage = await pdfDoc.embedPng(photoBytes);
                } else {
                    photoImage = await pdfDoc.embedJpg(photoBytes);
                }

                // Draw circular photo (simulate with square for now)
                page.drawImage(photoImage, {
                    x: (width - photoSize) / 2,
                    y: photoY - photoSize / 2,
                    width: photoSize,
                    height: photoSize,
                });

                // Draw photo border circle
                page.drawCircle({
                    x: width / 2,
                    y: photoY,
                    size: photoSize / 2 + 3,
                    borderColor: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
                    borderWidth: 4,
                });
            } catch (photoError) {
                console.error('Error embedding photo:', photoError);
                // Draw placeholder circle
                page.drawCircle({
                    x: width / 2,
                    y: photoY,
                    size: photoSize / 2,
                    color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
                    opacity: 0.2,
                });
            }
        } else {
            // Draw placeholder circle
            page.drawCircle({
                x: width / 2,
                y: photoY,
                size: photoSize / 2,
                color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
                opacity: 0.2,
            });
        }

        // Name (centered, uppercase)
        const nameY = photoY - 80;
        const nameText = data.fullName.toUpperCase();
        const nameWidth = boldFont.widthOfTextAtSize(nameText, 22);
        page.drawText(nameText, {
            x: (width - nameWidth) / 2,
            y: nameY,
            size: 22,
            font: boldFont,
            color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
        });

        // Title/Business Name (centered)
        const titleY = nameY - 22;
        const titleWidth = regularFont.widthOfTextAtSize(data.businessName, 11);
        page.drawText(data.businessName, {
            x: (width - titleWidth) / 2,
            y: titleY,
            size: 11,
            font: regularFont,
            color: rgb(textColor.r, textColor.g, textColor.b),
        });

        // Description/Bio
        const bioY = titleY - 35;
        const bioText = 'Professional digital business card with instant contact sharing.';
        const bioLines = wrapText(bioText, regularFont, 9, width - 60);

        let currentY = bioY;
        bioLines.forEach(line => {
            const lineWidth = regularFont.widthOfTextAtSize(line, 9);
            page.drawText(line, {
                x: (width - lineWidth) / 2,
                y: currentY,
                size: 9,
                font: regularFont,
                color: rgb(0.5, 0.5, 0.5),
            });
            currentY -= 14;
        });

        // Contact buttons with icons and clickable links
        const buttonStartY = 180;
        const buttonHeight = 36;
        const buttonSpacing = 8;
        const buttonWidth = width - 60;
        const buttonX = 30;

        let buttonY = buttonStartY;

        // Phone button (clickable)
        const phoneLink = `tel:${data.phone}`;
        drawClickableButton(page, pdfDoc, buttonX, buttonY, buttonWidth, buttonHeight,
            'Phone: ' + data.phone, regularFont, primaryColor, phoneLink);
        buttonY -= (buttonHeight + buttonSpacing);

        // Email button (clickable)
        const emailLink = `mailto:${data.email}`;
        drawClickableButton(page, pdfDoc, buttonX, buttonY, buttonWidth, buttonHeight,
            'Email: ' + data.email, regularFont, primaryColor, emailLink);
        buttonY -= (buttonHeight + buttonSpacing);

        // Website button (if available, clickable)
        if (data.website) {
            drawClickableButton(page, pdfDoc, buttonX, buttonY, buttonWidth, buttonHeight,
                'Website: ' + data.website, regularFont, secondaryColor, data.website);
            buttonY -= (buttonHeight + buttonSpacing);
        }

        // WhatsApp button (if available, clickable)
        if (data.whatsapp) {
            const whatsappLink = `https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`;
            drawClickableButton(page, pdfDoc, buttonX, buttonY, buttonWidth, buttonHeight,
                'WhatsApp: ' + data.whatsapp, regularFont, secondaryColor, whatsappLink);
            buttonY -= (buttonHeight + buttonSpacing);
        }

        // Instagram button (if available, clickable)
        if (data.instagram) {
            const instaLink = `https://instagram.com/${data.instagram.replace('@', '')}`;
            drawClickableButton(page, pdfDoc, buttonX, buttonY, buttonWidth, buttonHeight,
                'Instagram: ' + data.instagram, regularFont, secondaryColor, instaLink);
        }

        // QR Code in bottom right corner
        try {
            const base64Data = qrCodeDataURL.split(',')[1];
            if (base64Data) {
                const qrImageBytes = Buffer.from(base64Data, 'base64');
                const qrImage = await pdfDoc.embedPng(qrImageBytes);
                const qrSize = 70;

                page.drawImage(qrImage, {
                    x: width - qrSize - 15,
                    y: 15,
                    width: qrSize,
                    height: qrSize,
                });

                // QR label
                const qrLabel = 'Scan Me';
                const qrLabelWidth = regularFont.widthOfTextAtSize(qrLabel, 8);
                page.drawText(qrLabel, {
                    x: width - qrSize - 15 + (qrSize - qrLabelWidth) / 2,
                    y: 8,
                    size: 8,
                    font: regularFont,
                    color: rgb(0.4, 0.4, 0.4),
                });
            }
        } catch (qrError) {
            console.error('QR code embedding failed:', qrError);
        }

        console.log('Saving PDF...');
        const pdfBytes = await pdfDoc.save();
        console.log('=== PDF Generation Completed ===');

        return Buffer.from(pdfBytes);
    } catch (error) {
        console.error('=== ERROR in PDF Generation ===');
        console.error('Error:', error);
        throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Helper function to draw clickable button with link
function drawClickableButton(
    page: PDFPage,
    pdfDoc: PDFDocument,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    font: any,
    color: { r: number; g: number; b: number },
    link: string
) {
    // Draw button background
    page.drawRectangle({
        x,
        y,
        width,
        height,
        color: rgb(color.r, color.g, color.b),
        opacity: 0.95,
    });

    // Draw button text (centered)
    const textSize = 10;
    const textWidth = font.widthOfTextAtSize(text, textSize);
    const textX = x + (width - textWidth) / 2;
    const textY = y + (height - textSize) / 2;

    page.drawText(text, {
        x: textX,
        y: textY,
        size: textSize,
        font: font,
        color: rgb(1, 1, 1), // White text
    });

    // Note: PDF clickable links require complex annotation setup
    // The contact information is visible and can be manually copied
    // For true clickable links, consider using a different PDF library
}

// Helper function to wrap text
function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = font.widthOfTextAtSize(testLine, size);

        if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
        }
        : { r: 0, g: 0, b: 0 };
}
