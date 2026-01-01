# Card Builder Field Update Summary

## ✅ Changes Completed

### 1. Updated State Structure
Changed from:
```tsx
{
  fullName: '',
  jobTitle: '',
  companyName: '',
  tagline: '',
  // ...
}
```

To:
```tsx
{
  fullName: '',
  businessName: '', // Combined jobTitle + companyName
  instagram: '', // New field
  facebook: '', // New field
  // Removed: jobTitle, companyName, tagline
}
```

### 2. Updated Form Fields
- ✅ Full Name (required)
- ✅ Business Name / Profession (required) - replaces Job Title + Company Name
- ✅ Phone Number (required)
- ✅ Email Address (required)
- ✅ Address (required)
- ✅ Website (optional)
- ✅ Instagram (optional)
- ✅ Facebook (optional)
- ✅ Profile Photo (optional)

## ⚠️ Remaining Tasks

### Update Card Design Templates

All 5 card designs need to be updated to use the new field structure:

1. **Design 1 (Minimalist)** - Line ~420
2. **Design 2 (Sleek)** - Line ~480
3. **Design 3 (Bold)** - Line ~550
4. **Design 4 (Luxury)** - Line ~610
5. **Design 5 (Tech)** - Line ~680

### Changes Needed in Each Design:

Replace:
```tsx
{cardData.jobTitle}
{cardData.companyName}
{cardData.tagline}
```

With:
```tsx
{cardData.businessName}
// Remove tagline references
```

### Add Social Media Links

Add Instagram and Facebook links where appropriate:
```tsx
{cardData.instagram && (
  <a href={`https://instagram.com/${cardData.instagram}`}>
    Instagram: @{cardData.instagram}
  </a>
)}

{cardData.facebook && (
  <a href={`https://facebook.com/${cardData.facebook}`}>
    Facebook: {cardData.facebook}
  </a>
)}
```

## 📝 Notes

- The `businessName` field now serves as a combined field for both job title and company name
- Users can enter either "Marketing Manager" or "Acme Corp" or "Marketing Manager at Acme Corp"
- Social media links are optional and users can choose one or both
- All required fields are marked with a red asterisk (*)

