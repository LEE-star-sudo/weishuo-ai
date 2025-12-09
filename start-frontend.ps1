# 微说前端启动脚本
Write-Host "正在启动微说前端服务..." -ForegroundColor Green

# 检查端口占用
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host "警告: 端口 5173 已被占用" -ForegroundColor Yellow
    $pid = (Get-Process -Id $port5173.OwningProcess).Id
    Write-Host "占用进程 PID: $pid" -ForegroundColor Yellow
    $confirm = Read-Host "是否终止该进程? (y/n)"
    if ($confirm -eq 'y') {
        Stop-Process -Id $pid -Force
        Write-Host "进程已终止" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "取消启动" -ForegroundColor Red
        exit
    }
}

# 进入前端目录
Set-Location -Path "$PSScriptRoot\frontend"

# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "首次运行,正在安装依赖..." -ForegroundColor Yellow
    npm install
}

# 启动前端
Write-Host "启动 Vite 开发服务器..." -ForegroundColor Cyan
npm run dev
