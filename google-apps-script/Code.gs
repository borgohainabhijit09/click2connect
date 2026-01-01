// Updated Google Apps Script for Click2Connect
// This saves customer orders to Google Sheets

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add row with data
    sheet.appendRow([
      new Date(),                    // Timestamp
      data.paymentId || '',          // Payment ID
      data.fullName || '',           // Full Name
      data.businessName || '',       // Business Name
      data.phone || '',              // Phone
      data.whatsapp || '',           // WhatsApp
      data.email || '',              // Email
      data.city || '',               // City
      data.website || '',            // Website
      data.instagram || '',          // Instagram
      data.googleMaps || '',         // Google Maps
      data.templateId || '',         // Template ID
      data.photoDataUrl || 'No Photo'  // Photo Data URL (or "No Photo")
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
