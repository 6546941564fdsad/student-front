# 学生教务管理系统 - Docker 部署指南

## 📋 前置要求

- Docker Engine 20.10+
- Docker Compose 2.0+
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

## 🚀 快速开始

### 1. 环境变量配置

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=student_management

# JWT配置
JWT_SECRET=your-jwt-secret-key-change-in-production-min-32-chars

# 服务器配置
SERVER_PORT=8080
ALLOWED_ORIGINS=http://localhost,https://yourdomain.com
```

### 2. 构建并启动服务

```bash
# 构建所有镜像
docker compose build

# 启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f
```

### 3. 访问系统

- 前端: http://localhost
- 后端API: http://localhost:8080/api
- 数据库: localhost:5432

### 4. 停止服务

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（谨慎使用！）
docker compose down -v
```

## 📁 项目结构

```
student-system/
├── student-backend/          # 后端服务
│   ├── Dockerfile
│   ├── src/
│   └── pom.xml
├── student-front/            # 前端服务
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── src/
│   └── package.json
├── docker-compose.yml        # Docker Compose 配置
├── .env                      # 环境变量
├── .env.example              # 环境变量模板
├── init.sql                  # 数据库初始化脚本
└── README.md                 # 本文件
```

## 🔧 配置说明

### 后端配置

后端服务暴露以下端口和配置：

- **端口**: 8080
- **健康检查**: /api/health
- **数据库连接**: 通过 Docker 网络自动连接 PostgreSQL

### 前端配置

前端使用 Nginx 提供静态文件服务：

- **端口**: 80
- **反向代理**: /api/* → http://backend:8080/api/*
- **SPA路由支持**: 所有路由重定向到 index.html

### 数据库配置

PostgreSQL 配置：

- **版本**: 16-alpine
- **端口**: 5432（仅内部网络）
- **数据持久化**: Docker Volume `postgres_data`
- **自动初始化**: 首次启动时执行 init.sql

## 🛠️ 常用命令

### 查看服务状态

```bash
docker compose ps
```

### 查看日志

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### 重启服务

```bash
# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart backend
```

### 进入容器

```bash
# 进入后端容器
docker compose exec backend sh

# 进入数据库容器
docker compose exec postgres psql -U postgres -d student_management
```

### 数据库备份

```bash
# 备份数据库
docker compose exec postgres pg_dump -U postgres student_management > backup_$(date +%Y%m%d).sql

# 恢复数据库
cat backup_20260418.sql | docker compose exec -T postgres psql -U postgres -d student_management
```

## 🔒 安全建议

### 生产环境部署

1. **修改默认密码**
   - 更改 `.env` 中的 `DB_PASSWORD`
   - 更改 `JWT_SECRET` 为强随机字符串

2. **启用 HTTPS**
   - 使用 Let's Encrypt 获取 SSL 证书
   - 配置 Nginx SSL

3. **限制访问**
   - 配置防火墙只开放必要端口
   - 使用 VPN 或内网访问数据库

4. **定期备份**
   - 设置定时任务自动备份数据库
   - 备份文件存储到远程位置

### Docker 安全

```yaml
# docker-compose.yml 中添加安全配置
services:
  backend:
    read_only: true  # 只读文件系统
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
```

## 🐛 故障排查

### 服务无法启动

```bash
# 查看详细日志
docker compose logs backend

# 检查端口占用
netstat -tulpn | grep 8080
```

### 数据库连接失败

```bash
# 检查数据库是否运行
docker compose ps postgres

# 测试数据库连接
docker compose exec backend ping postgres
```

### 前端无法访问后端

```bash
# 检查 Nginx 配置
docker compose exec frontend nginx -t

# 查看 Nginx 日志
docker compose logs frontend
```

### 数据丢失

```bash
# 检查数据卷
docker volume ls | grep postgres_data

# 重新初始化数据库
docker compose down -v
docker compose up -d
```

## 📊 监控和维护

### 资源使用监控

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df
```

### 清理无用资源

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的卷
docker volume prune

# 清理所有未使用资源
docker system prune -a --volumes
```

### 更新应用

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker compose up -d --build

# 清理旧镜像
docker image prune -f
```

## 📝 数据库管理

### 连接数据库

```bash
# 使用 psql 连接
docker compose exec postgres psql -U postgres -d student_management

# 列出所有表
\dt

# 查看表结构
\d users
```

### 常用 SQL 操作

```sql
-- 查看所有用户
SELECT * FROM users;

-- 重置管理员密码
UPDATE users SET password = '123456' WHERE username = 'admin';

-- 查看数据统计
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM grades;
```

## 🎯 性能优化

### 后端优化

1. **JVM 参数调优**
   ```dockerfile
   # Dockerfile 中添加
   ENTRYPOINT ["java", "-Xms512m", "-Xmx1024m", "-jar", "app.jar"]
   ```

2. **数据库连接池**
   ```properties
   # application.properties
   spring.datasource.hikari.maximum-pool-size=20
   spring.datasource.hikari.minimum-idle=5
   ```

### 前端优化

1. **Nginx 缓存**
   ```nginx
   # nginx.conf
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

2. **Gzip 压缩**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

## 📞 技术支持

如遇到问题，请检查：

1. Docker 版本是否符合要求
2. 端口是否被占用
3. 环境变量是否正确配置
4. 日志中是否有错误信息

---

**最后更新**: 2026-04-18  
**维护者**: 开发团队
