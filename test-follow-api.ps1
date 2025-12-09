# 关注系统 API 测试脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  关注/粉丝系统 API 测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8081/api"

# 测试1: 获取用户1的关注统计
Write-Host "[测试1] 获取用户1的关注统计..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/follow/stats/1" -Method Get
    Write-Host "✓ 关注数: $($stats.followingCount)" -ForegroundColor Green
    Write-Host "✓ 粉丝数: $($stats.followersCount)" -ForegroundColor Green
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试2: 用户1关注用户2
Write-Host "[测试2] 用户1关注用户2..." -ForegroundColor Yellow
try {
    $body = @{ followingId = 2 } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "$baseUrl/follow?followerId=1" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ $($result.message)" -ForegroundColor Green
    Write-Host "✓ 用户2的粉丝数: $($result.followersCount)" -ForegroundColor Green
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试3: 检查关注状态
Write-Host "[测试3] 检查用户1是否关注用户2..." -ForegroundColor Yellow
try {
    $check = Invoke-RestMethod -Uri "$baseUrl/follow/check?followerId=1&followingId=2" -Method Get
    if ($check.isFollowing) {
        Write-Host "✓ 已关注" -ForegroundColor Green
    } else {
        Write-Host "✗ 未关注" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试4: 获取用户1的关注列表
Write-Host "[测试4] 获取用户1的关注列表..." -ForegroundColor Yellow
try {
    $following = Invoke-RestMethod -Uri "$baseUrl/follow/following/1" -Method Get
    Write-Host "✓ 关注了 $($following.Count) 个用户" -ForegroundColor Green
    foreach ($user in $following) {
        Write-Host "  - $($user.username) ($($user.displayName))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试5: 获取用户2的粉丝列表
Write-Host "[测试5] 获取用户2的粉丝列表..." -ForegroundColor Yellow
try {
    $followers = Invoke-RestMethod -Uri "$baseUrl/follow/followers/2" -Method Get
    Write-Host "✓ 有 $($followers.Count) 个粉丝" -ForegroundColor Green
    foreach ($user in $followers) {
        Write-Host "  - $($user.username) ($($user.displayName))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试6: 取消关注
Write-Host "[测试6] 用户1取消关注用户2..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/follow?followerId=1&followingId=2" -Method Delete
    Write-Host "✓ $($result.message)" -ForegroundColor Green
    Write-Host "✓ 用户2的粉丝数: $($result.followersCount)" -ForegroundColor Green
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试7: 再次检查关注状态
Write-Host "[测试7] 再次检查用户1是否关注用户2..." -ForegroundColor Yellow
try {
    $check = Invoke-RestMethod -Uri "$baseUrl/follow/check?followerId=1&followingId=2" -Method Get
    if ($check.isFollowing) {
        Write-Host "✗ 仍然关注(应该已取消)" -ForegroundColor Red
    } else {
        Write-Host "✓ 已取消关注" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ 失败: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  测试完成!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
