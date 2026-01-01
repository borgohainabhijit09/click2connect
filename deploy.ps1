# Quick Deploy Script
# Run this to deploy to Vercel

Write-Host "🚀 Click2Connect - Vercel Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
}
else {
    Write-Host "✅ Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Building project locally first..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Follow the prompts:" -ForegroundColor Cyan
    Write-Host "  1. Set up and deploy? → Yes" -ForegroundColor White
    Write-Host "  2. Which scope? → Your account" -ForegroundColor White
    Write-Host "  3. Link to existing project? → No" -ForegroundColor White
    Write-Host "  4. Project name? → click2connect" -ForegroundColor White
    Write-Host "  5. Directory? → ./ (press Enter)" -ForegroundColor White
    Write-Host "  6. Override settings? → No" -ForegroundColor White
    Write-Host ""
    
    vercel
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
        Write-Host "  1. Add environment variables in Vercel dashboard" -ForegroundColor White
        Write-Host "  2. Run: vercel --prod" -ForegroundColor White
        Write-Host "  3. Add custom domain: click2connect.digital" -ForegroundColor White
        Write-Host "  4. Update DNS in Hostinger" -ForegroundColor White
        Write-Host ""
        Write-Host "📖 See VERCEL_DEPLOYMENT_COMPLETE.md for details" -ForegroundColor Yellow
    }
    else {
        Write-Host ""
        Write-Host "❌ Deployment failed. Check errors above." -ForegroundColor Red
    }
}
else {
    Write-Host ""
    Write-Host "❌ Build failed. Fix errors and try again." -ForegroundColor Red
}
