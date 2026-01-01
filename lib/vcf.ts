import { BusinessCardData } from '@/types';

export function generateVCF(data: BusinessCardData): string {
    const vcfLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${data.fullName}`,
        `ORG:${data.businessName}`,
        `TEL;TYPE=CELL:${data.phone}`,
        `EMAIL:${data.email}`,
    ];

    if (data.whatsapp) {
        vcfLines.push(`TEL;TYPE=WORK:${data.whatsapp}`);
    }

    if (data.website) {
        vcfLines.push(`URL:${data.website}`);
    }

    if (data.city) {
        vcfLines.push(`ADR;TYPE=WORK:;;${data.city};;;;`);
    }

    vcfLines.push('END:VCARD');

    return vcfLines.join('\r\n');
}

export function generateVCFBuffer(data: BusinessCardData): Buffer {
    const vcfContent = generateVCF(data);
    return Buffer.from(vcfContent, 'utf-8');
}
