# GA4 Webhook Test Script (PowerShell)
# Usage: .\test-ga4-webhook.ps1 [-Env local|production]

param(
    [string]$Env = "local"
)

# Configuration
$WEBHOOK_SECRET = "your-webhook-secret-here"  # Replace with actual secret

if ($Env -eq "local") {
    $URL = "http://localhost:8888/.netlify/functions/ga4-webhook"
} else {
    $URL = "https://colorcocktailfactory.com/.netlify/functions/ga4-webhook"
}

Write-Host "Testing GA4 Webhook: $URL" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Gray

# Test 1: Purchase Event
Write-Host "`nTest 1: Valid Purchase Event" -ForegroundColor Yellow
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$body1 = @{
    event_name = "purchase"
    transaction_id = "test-$timestamp"
    value = 95.00
    currency = "USD"
    city = "Chicago"
    class_name = "Date Night Pottery on the Wheel"
    class_id = "date-night-wheel"
    class_category = "pottery"
    booking_provider = "rezclick"
    link_url = "https://rezclick.com/booking/test"
} | ConvertTo-Json

$response1 = Invoke-RestMethod -Uri $URL -Method Post `
    -Headers @{
        "Content-Type" = "application/json"
        "X-Webhook-Secret" = $WEBHOOK_SECRET
    } -Body $body1

$response1 | ConvertTo-Json -Depth 10
Write-Host "-----------------------------------" -ForegroundColor Gray

# Test 2: Generate Lead Event
Write-Host "`nTest 2: Valid Generate Lead Event" -ForegroundColor Yellow
$body2 = @{
    event_name = "generate_lead"
    city = "Eugene"
    class_name = "Beginner Wheel Throwing"
    class_id = "beginner-wheel"
    booking_provider = "eventbrite"
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri $URL -Method Post `
    -Headers @{
        "Content-Type" = "application/json"
        "X-Webhook-Secret" = $WEBHOOK_SECRET
    } -Body $body2

$response2 | ConvertTo-Json -Depth 10
Write-Host "-----------------------------------" -ForegroundColor Gray

# Test 3: Missing transaction_id (should fail)
Write-Host "`nTest 3: Invalid Purchase (missing transaction_id - should return 400)" -ForegroundColor Yellow
$body3 = @{
    event_name = "purchase"
    value = 95.00
    currency = "USD"
    city = "Chicago"
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri $URL -Method Post `
        -Headers @{
            "Content-Type" = "application/json"
            "X-Webhook-Secret" = $WEBHOOK_SECRET
        } -Body $body3
    $response3 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Expected error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
}
Write-Host "-----------------------------------" -ForegroundColor Gray

# Test 4: Invalid secret (should fail)
Write-Host "`nTest 4: Invalid Webhook Secret (should return 401)" -ForegroundColor Yellow
$body4 = @{
    event_name = "purchase"
    transaction_id = "test-123"
    value = 95.00
    currency = "USD"
} | ConvertTo-Json

try {
    $response4 = Invoke-RestMethod -Uri $URL -Method Post `
        -Headers @{
            "Content-Type" = "application/json"
            "X-Webhook-Secret" = "wrong-secret"
        } -Body $body4
    $response4 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Expected error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
}
Write-Host "-----------------------------------" -ForegroundColor Gray

Write-Host "`n✅ Tests complete! Check GA4 Realtime reports to verify events." -ForegroundColor Green
Write-Host "   GA4 → Realtime → Event count by Event name" -ForegroundColor White
