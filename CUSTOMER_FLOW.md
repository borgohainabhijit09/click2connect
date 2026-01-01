# Click2Connect - Improved Customer Flow

## Overview
The new flow provides a seamless experience where customers can build their card, preview it, and place an order without re-entering data.

## Customer Journey

### **Flow 1: Direct Builder Access**
Perfect for customers who want full customization control.

```
Step 1: Visit /builder
   ↓
Step 2: Build & Customize Card
   - Choose from 5 professional designs
   - Select theme colors (6 options)
   - Upload profile photo
   - Enter personal details
   - Enter contact information
   - See LIVE PREVIEW in real-time
   ↓
Step 3: Download Preview (Optional)
   - Click "Download Preview" button
   - Get PNG image of card
   - Share with team/review offline
   ↓
Step 4: Place Order
   - Click "Place Order - ₹99" button
   - System validates required fields
   - Razorpay payment gateway opens
   - All data pre-filled from builder
   ↓
Step 5: Payment & Confirmation
   - Complete payment
   - Success modal appears
   - Professional files sent to email within 24 hours
```

### **Flow 2: Template Selection (Existing)**
For customers who prefer guided experience.

```
Step 1: Visit Homepage (/)
   ↓
Step 2: Browse Templates
   - View 5 template options
   - Click "Use This Template"
   ↓
Step 3: Fill Form
   - Enter details in modal
   - Preview selected template
   ↓
Step 4: Payment
   - Razorpay checkout
   ↓
Step 5: Success
   - Files sent via email
```

## Key Features

### Builder Page (`/builder`)

#### **Design Options**
1. **Design 1 (Modern)** - Modern split layout with overlapping profile
2. **Design 2 (Sleek)** - Sleek dark theme with centered profile
3. **Design 3 (Paris)** - Elegant boutique style
4. **Design 4 (Luxury)** - Premium gold/black aesthetic
5. **Design 5 (Tech)** - Clean tech-focused design

#### **Theme Colors**
- Blue
- Purple
- Green
- Black
- Red
- Teal

#### **Header Actions**
- **Reset Button** - Clear all data and start fresh
- **Download Preview** - Save card as PNG image (2x resolution)
- **Place Order - ₹99** - Seamless checkout with pre-filled data

### Data Flow

#### Builder → Order
When customer clicks "Place Order":
1. Validates required fields (Name, Email, Phone)
2. Creates Razorpay order
3. Maps builder data to order format:
   ```javascript
   {
     fullName: cardData.fullName,
     jobTitle: cardData.jobTitle,
     companyName: cardData.companyName,
     phone: cardData.phone,
     email: cardData.email,
     website: cardData.website,
     address: cardData.address,
     templateId: cardData.design  // Maps to selected design
   }
   ```
4. Opens payment gateway with pre-filled customer info
5. On success, calls `/api/generate-card` endpoint
6. Shows success modal with confirmation

## User Experience Improvements

### ✅ **No Data Re-entry**
- Customer builds card once
- All data automatically used for order
- Reduces friction and errors

### ✅ **Visual Confidence**
- See exactly what they're buying
- Download preview before ordering
- Real-time updates as they type

### ✅ **Clear Pricing**
- "Place Order - ₹99" button shows price upfront
- No hidden costs
- Transparent process

### ✅ **Flexible Access**
- Direct builder link in header: "Try Builder"
- Can access from homepage
- Can bookmark `/builder` for repeat use

## Technical Implementation

### State Management
```typescript
const [cardData, setCardData] = useState({...});
const [showOrderModal, setShowOrderModal] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
```

### Payment Integration
- Razorpay checkout integrated
- Script loaded: `https://checkout.razorpay.com/v1/checkout.js`
- Environment variable: `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Success Handling
- Success modal shows confirmation
- Email confirmation displayed
- Options to:
  - Go to Home
  - Create Another Card

### Processing States
- Loading overlay during payment
- Disabled button during processing
- Clear error messages

## Navigation

### Homepage Header
- **Logo** - Returns to landing page
- **Try Builder** - Direct access to `/builder`
- **Get Started** - Scrolls to template selection

### Builder Header
- **Back Arrow** - Returns to homepage
- **Card Builder** - Current page indicator
- **Reset** - Clear all fields
- **Download Preview** - Save PNG
- **Place Order** - Checkout

## API Endpoints Used

### `/api/create-order`
- Creates Razorpay order
- Returns order ID and amount

### `/api/generate-card`
- Validates payment
- Generates PDF, QR, VCF files
- Sends email with assets
- Returns success status

## Files Modified

1. **`/app/builder/page.tsx`**
   - Added payment integration
   - Added order modal
   - Updated header buttons
   - Added validation

2. **`/app/page.tsx`**
   - Added "Try Builder" button in header

3. **`/types/index.ts`**
   - Updated GeneratedAssets interface

## Future Enhancements

### Potential Improvements
- [ ] Save draft cards to localStorage
- [ ] Email draft link to customer
- [ ] Add more design templates
- [ ] Custom color picker
- [ ] Social media links
- [ ] Company logo upload
- [ ] Bulk order discounts
- [ ] Referral program

## Support

### Customer Questions
**Q: Can I edit my card after ordering?**
A: Currently, each order is final. You can create a new card anytime.

**Q: How long until I receive my files?**
A: Within 24 hours via email.

**Q: What files do I receive?**
A: Interactive PDF, QR Code PNG, and VCF contact file.

**Q: Can I download the preview for free?**
A: Yes! Click "Download Preview" to get a PNG image.

---

**Last Updated:** December 30, 2024
**Version:** 2.0
