$token = "oIGQJeU9lAs7kYddhguyrdXSMBF7nyKQgwXarQw3"
$headers = @{ Authorization = "Bearer $token" }

function pf($path) {
    return (Invoke-RestMethod -Uri ("https://api.printful.com" + $path) -Headers $headers -Method GET)
}

$stores = pf("/stores")

foreach ($s in $stores.result) {
    Write-Host "`n========================================" -ForegroundColor Magenta
    Write-Host "STORE: $($s.name) [$($s.id)] — $($s.type)" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta

    $url = "https://api.printful.com/store/products?limit=100&store_id=" + $s.id
    $products = Invoke-RestMethod -Uri $url -Headers $headers
    Write-Host "Total products: $($products.paging.total)`n" -ForegroundColor Yellow

    foreach ($p in $products.result) {
        $durl = "https://api.printful.com/store/products/" + $p.id + "?store_id=" + $s.id
        $detail = Invoke-RestMethod -Uri $durl -Headers $headers
        $prod = $detail.result.sync_product
        $variants = $detail.result.sync_variants

        $issues = @()

        $unsynced = @($variants | Where-Object { $_.is_synced -eq $false })
        if ($unsynced.Count -gt 0) { $issues += "UNSYNCED variants: $($unsynced.Count)" }

        $noPrice = @($variants | Where-Object { -not $_.retail_price -or $_.retail_price -eq "0.00" })
        if ($noPrice.Count -gt 0) { $issues += "MISSING retail price on $($noPrice.Count) variant(s)" }

        if (-not $prod.thumbnail_url) { $issues += "NO thumbnail/mockup image" }

        if (-not $prod.name -or $prod.name.Trim() -eq "") { $issues += "MISSING product name" }

        $noVariantId = @($variants | Where-Object { -not $_.product -or -not $_.product.product_id })
        if ($noVariantId.Count -gt 0) { $issues += "UNMAPPED variants (no Printful base product): $($noVariantId.Count)" }

        $oos = @($variants | Where-Object { $_.availability_status -eq "discontinued" -or $_.availability_status -eq "out_of_stock" })
        if ($oos.Count -gt 0) { $issues += "DISCONTINUED/OUT-OF-STOCK variants: $($oos.Count)" }

        if ($prod.variants -ne $prod.synced) {
            $issues += "SYNC MISMATCH: only $($prod.synced) of $($prod.variants) variants synced"
        }

        if ($issues.Count -gt 0) {
            Write-Host "  [!] $($prod.name) (id: $($prod.id))" -ForegroundColor Red
            foreach ($issue in $issues) {
                Write-Host "       - $issue" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  [OK] $($prod.name) — $($prod.variants) variants all good" -ForegroundColor Green
        }
    }
}

Write-Host "`n=== SCAN COMPLETE ===" -ForegroundColor Cyan
