# 初始化话题数据的测试脚本

Write-Host "=== 初始化热门话题数据 ===" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/topics/initialize" -Method POST -ContentType "application/json"
    Write-Host "✓ 成功: $response" -ForegroundColor Green
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 获取热门话题列表 ===" -ForegroundColor Cyan

try {
    $topics = Invoke-RestMethod -Uri "http://localhost:8081/api/topics/hot" -Method GET
    Write-Host "✓ 成功获取 $($topics.Count) 个热门话题" -ForegroundColor Green
    $topics | ForEach-Object {
        Write-Host "  - $($_.title) [$($_.category)] - $($_.postCount) 推文" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 测试搜索功能 ===" -ForegroundColor Cyan

try {
    $searchResult = Invoke-RestMethod -Uri "http://localhost:8081/api/topics/search?keyword=AI" -Method GET
    Write-Host "✓ 搜索 'AI' 找到 $($searchResult.Count) 个结果" -ForegroundColor Green
    $searchResult | ForEach-Object {
        Write-Host "  - $($_.title)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 测试完成 ===" -ForegroundColor Cyan
Write-Host "现在可以在前端页面查看话题了: http://localhost:5173/explore" -ForegroundColor Green
