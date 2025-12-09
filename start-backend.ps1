# 微说后端启动脚本
Write-Host "正在启动微说后端服务..." -ForegroundColor Green

# 检查端口占用
$port8081 = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if ($port8081) {
    Write-Host "警告: 端口 8081 已被占用" -ForegroundColor Yellow
    $pid = (Get-Process -Id $port8081.OwningProcess).Id
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

# 进入后端目录
Set-Location -Path "$PSScriptRoot\backend"

# 启动后端 (使用 H2 数据库)
Write-Host "使用 H2 内存数据库启动..." -ForegroundColor Cyan
.\mvnw.cmd spring-boot:run

# 如果想使用 MySQL,请使用以下命令:
# .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=mysql"
