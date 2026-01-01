# Razorpay Production Mode Setup Script
# This script helps you switch to production mode

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAZORPAY PRODUCTION MODE SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
$envFile = ".env.local"
if (-Not (Test-Path $envFile)) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Creating .env.local from env.example..." -ForegroundColor Yellow
    Copy-Item "env.example" $envFile
    Write-Host "✅ Created .env.local" -ForegroundColor Green
}

Write-Host "📋 STEP 1: Get Your Production Keys" -ForegroundColor Yellow
Write-Host "   1. Login to: https://dashboard.razorpay.com/" -ForegroundColor White
Write-Host "   2. Go to: Settings → API Keys" -ForegroundColor White
Write-Host "   3. Click: Generate Live Keys" -ForegroundColor White
Write-Host ""

# Prompt for Key ID
Write-Host "🔑 Enter your LIVE Key ID (starts with rzp_live_):" -ForegroundColor Yellow
$keyId = Read-Host "Key ID"

if ($keyId -notmatch "^rzp_live_") {
    Write-Host "⚠️  Warning: Key ID should start with 'rzp_live_'" -ForegroundColor Red
    Write-Host "   You entered a TEST key. Continue anyway? (y/n)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne "y") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Prompt for Key Secret
Write-Host ""
Write-Host "🔐 Enter your Key Secret:" -ForegroundColor Yellow
$keySecret = Read-Host "Key Secret" -AsSecureString
$keySecretPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($keySecret)
)

# Prompt for Webhook Secret (optional)
Write-Host ""
Write-Host "🔗 Enter your Webhook Secret (optional, press Enter to skip):" -ForegroundColor Yellow
Write-Host "   Get this from: Razorpay Dashboard → Webhooks" -ForegroundColor Gray
$webhookSecret = Read-Host "Webhook Secret"

# Update .env.local
Write-Host ""
Write-Host "📝 Updating .env.local..." -ForegroundColor Yellow

$content = Get-Content $envFile -Raw

# Replace Razorpay keys
$content = $content -replace "NEXT_PUBLIC_RAZORPAY_KEY_ID=.*", "NEXT_PUBLIC_RAZORPAY_KEY_ID=$keyId"
$content = $content -replace "RAZORPAY_KEY_SECRET=.*", "RAZORPAY_KEY_SECRET=$keySecretPlain"

if ($webhookSecret) {
    if ($content -match "RAZORPAY_WEBHOOK_SECRET=") {
        $content = $content -replace "RAZORPAY_WEBHOOK_SECRET=.*", "RAZORPAY_WEBHOOK_SECRET=$webhookSecret"
    } else {
        $content = $content -replace "(RAZORPAY_KEY_SECRET=.*)", "`$1`r`nRAZORPAY_WEBHOOK_SECRET=$webhookSecret"
    }
}

# Save updated content
Set-Content $envFile $content

Write-Host "✅ Configuration updated successfully!" -ForegroundColor Green
Write-Host ""

# Show summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Key ID: $keyId" -ForegroundColor White
Write-Host "Key Secret: ********** (hidden)" -ForegroundColor White
if ($webhookSecret) {
    Write-Host "Webhook Secret: ********** (configured)" -ForegroundColor White
} else {
    Write-Host "Webhook Secret: (not configured)" -ForegroundColor Yellow
}
Write-Host ""

# Next steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Configure webhook in Razorpay Dashboard" -ForegroundColor White
Write-Host "   URL: https://yourdomain.com/api/razorpay-webhook" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test the configuration:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test with a small payment (₹1)" -ForegroundColor White
Write-Host ""
Write-Host "4. Deploy to production when ready:" -ForegroundColor White
Write-Host "   npm run build && npm start" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Setup complete! You're now in PRODUCTION mode." -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit .env.local to Git!" -ForegroundColor Red
Write-Host ""

# Offer to open Razorpay dashboard
Write-Host "Open Razorpay Dashboard to configure webhook? (y/n)" -ForegroundColor Yellow
$openDashboard = Read-Host
if ($openDashboard -eq "y") {
    Start-Process "https://dashboard.razorpay.com/app/webhooks"
}

Write-Host ""
Write-Host "For detailed instructions, see: SWITCH_TO_PRODUCTION.md" -ForegroundColor Cyan
Write-Host ""
