$token = "sbp_ee454b9a2296c5c82b8151e1299bdba1646939e3"
$url = "https://api.supabase.com/v1/projects"

Write-Host "Testing Token: $token"
Write-Host "Connecting to: $url"

try {
    $response = Invoke-RestMethod -Uri $url -Headers @{ Authorization = "Bearer $token" } -Method Get
    Write-Host "SUCCESS! Token is valid." -ForegroundColor Green
    Write-Host "Projects found: $($response.Count)"
} catch {
    Write-Host "FAILED! Token was rejected." -ForegroundColor Red
    Write-Host "Error Details: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "Server Response: $body" -ForegroundColor Yellow
    }
}
