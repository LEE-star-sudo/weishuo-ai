# 微说 - 一键启动前后端
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  微说 (Weishuo) 启动脚本" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 启动后端
Write-Host "[1/2] 启动后端服务..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-backend.ps1"
Start-Sleep -Seconds 3

# 启动前端
Write-Host "[2/2] 启动前端服务..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-frontend.ps1"

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "启动完成!" -ForegroundColor Green
Write-Host "后端: http://localhost:8081" -ForegroundColor Yellow
Write-Host "前端: http://localhost:5173" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Green
