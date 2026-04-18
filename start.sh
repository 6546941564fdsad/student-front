#!/bin/bash

# 学生教务管理系统 - 快速启动脚本
# 使用方法: ./start.sh

echo "======================================"
echo "  学生教务管理系统 - Docker 快速启动"
echo "======================================"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker compose &> /dev/null; then
    echo "❌ 错误: Docker Compose 未安装"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker 版本: $(docker --version)"
echo "✅ Docker Compose 版本: $(docker compose version)"
echo ""

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，从模板创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件"
    echo "⚠️  请编辑 .env 文件修改配置（特别是密码）"
    echo ""
    read -p "按回车键继续..."
fi

# 停止并清理旧容器
echo "🔄 停止旧容器..."
docker compose down 2>/dev/null

# 构建镜像
echo ""
echo "🔨 构建 Docker 镜像..."
docker compose build

# 启动服务
echo ""
echo "🚀 启动服务..."
docker compose up -d

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker compose ps

echo ""
echo "======================================"
echo "  ✅ 系统启动成功！"
echo "======================================"
echo ""
echo "🌐 访问地址:"
echo "   前端: http://localhost"
echo "   后端API: http://localhost:8080/api"
echo "   数据库: localhost:5432"
echo ""
echo "👤 测试账号:"
echo "   管理员: admin / 123456"
echo "   学生1: trump / 123456"
echo "   学生2: roosevelt / 123456"
echo ""
echo "📝 常用命令:"
echo "   查看日志: docker compose logs -f"
echo "   停止服务: docker compose down"
echo "   重启服务: docker compose restart"
echo ""
echo "📖 详细文档: 查看 DEPLOYMENT.md"
echo ""
