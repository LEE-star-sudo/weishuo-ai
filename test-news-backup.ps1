# 测试新闻备用机制

Write-Host "=== 测试新闻备用系统 ===" -ForegroundColor Cyan
Write-Host ""

# 1. 测试正常获取新闻（如果API可用）
Write-Host "1. 测试获取新闻 (hot频道):" -ForegroundColor Yellow
try {
    $news = Invoke-RestMethod -Uri "http://localhost:8081/api/news/hot" -Method GET
    Write-Host "✓ 成功获取 $($news.Count) 条新闻" -ForegroundColor Green
    if ($news.Count -gt 0) {
        Write-Host "  第一条: $($news[0].content.Substring(0, [Math]::Min(50, $news[0].content.Length)))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ 获取新闻失败: $_" -ForegroundColor Red
}

Write-Host ""

# 2. 测试其他频道
$channels = @("tech", "society", "video", "headline")
foreach ($channel in $channels) {
    Write-Host "2. 测试 $channel 频道:" -ForegroundColor Yellow
    try {
        $news = Invoke-RestMethod -Uri "http://localhost:8081/api/news/$channel" -Method GET
        Write-Host "✓ 成功获取 $($news.Count) 条新闻" -ForegroundColor Green
    } catch {
        Write-Host "✗ 失败: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== 备用机制说明 ===" -ForegroundColor Cyan
Write-Host "当远程新闻API不可用时，系统会自动从数据库读取备用新闻" -ForegroundColor White
Write-Host "• 首次启动时会自动在数据库中创建20条备用新闻" -ForegroundColor White
Write-Host "• API成功获取的新闻会自动保存到数据库作为缓存" -ForegroundColor White
Write-Host "• API失败时自动切换到数据库缓存" -ForegroundColor White
Write-Host ""

# 3. 查看数据库中的备用新闻数量（需要直接查询数据库）
Write-Host "提示: 可以通过以下SQL查看数据库中的备用新闻:" -ForegroundColor Cyan
Write-Host "SELECT COUNT(*) FROM news_backup;" -ForegroundColor Gray
