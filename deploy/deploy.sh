#!/bin/bash
# =============================================================
# 应用部署脚本（手动部署时使用）
# 在服务器上运行：bash deploy.sh
# =============================================================

set -e

APP_DIR="/var/www/my-blog"
APP_NAME="my-blog"
PORT=3000

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()   { echo -e "${GREEN}[✓] $1${NC}"; }
warn()  { echo -e "${YELLOW}[!] $1${NC}"; }

cd "$APP_DIR"

log "开始部署 ${APP_NAME}..."

# 加载 nvm
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
nvm use 20

# 安装依赖
log "安装依赖..."
npm ci --production=false

# 构建
log "构建项目..."
npm run build

# PM2 重启或首次启动
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  log "重启 PM2 进程..."
  pm2 restart "$APP_NAME"
else
  log "启动 PM2 进程..."
  pm2 start npm --name "$APP_NAME" -- start -- --port $PORT
  pm2 save
fi

log "✅ 部署完成！"
pm2 status
