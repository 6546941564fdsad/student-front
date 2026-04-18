@echo off
chcp 65001 >nul

REM 学生教务管理系统 - Windows 快速启动脚本
REM 使用方法: start.bat

echo ======================================
echo   学生教务管理系统 - Docker 快速启动
echo ======================================
echo.

REM 检查 Docker 是否安装
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: Docker 未安装
    echo 请先安装 Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM 检查 Docker Compose 是否安装
docker compose version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: Docker Compose 未安装
    pause
    exit /b 1
)

echo ✅ Docker 已安装
echo ✅ Docker Compose 已安装
echo.

REM 检查 .env 文件是否存在
if not exist .env (
    echo ⚠️  未找到 .env 文件，从模板创建...
    copy .env.example .env
    echo ✅ 已创建 .env 文件
    echo ⚠️  请编辑 .env 文件修改配置（特别是密码）
    echo.
    pause
)

REM 停止并清理旧容器
echo 🔄 停止旧容器...
docker compose down 2>nul

REM 构建镜像
echo.
echo 🔨 构建 Docker 镜像...
docker compose build

REM 启动服务
echo.
echo 🚀 启动服务...
docker compose up -d

REM 等待服务启动
echo.
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo.
echo 📊 服务状态:
docker compose ps

echo.
echo ======================================
echo   ✅ 系统启动成功！
echo ======================================
echo.
echo 🌐 访问地址:
echo    前端: http://localhost
echo    后端API: http://localhost:8080/api
echo    数据库: localhost:5432
echo.
echo 👤 测试账号:
echo    管理员: admin / 123456
echo    学生1: trump / 123456
echo    学生2: roosevelt / 123456
echo.
echo 📝 常用命令:
echo    查看日志: docker compose logs -f
echo    停止服务: docker compose down
echo    重启服务: docker compose restart
echo.
echo 📖 详细文档: 查看 DEPLOYMENT.md
echo.
pause
