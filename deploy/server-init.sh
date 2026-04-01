#!/bin/bash
# =============================================================
# 阿里云 ECS 服务器初始化脚本
# 适用：Ubuntu 22.04 LTS
# 用法：sudo bash server-init.sh
# =============================================================

set -e

# ---- 颜色输出 ----
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓] $1${NC}"; }
warn()  { echo -e "${YELLOW}[!] $1${NC}"; }
error() { echo -e "${RED}[✗] $1${NC}"; exit 1; }

# ---- 检查 root ----
[ "$EUID" -ne 0 ] && error "请使用 sudo 运行此脚本"

log "开始初始化服务器环境..."

# ============================
# 1. 系统更新
# ============================
log "更新系统包..."
apt-get update -y && apt-get upgrade -y

# ============================
# 2. 安装基础工具
# ============================
log "安装基础工具..."
apt-get install -y curl wget git unzip build-essential ca-certificates gnupg

# ============================
# 3. 安装 Node.js (via nvm)
# ============================
log "安装 Node.js 20 (via nvm)..."
export NVM_DIR="/root/.nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
log "Node.js 版本: $(node -v)"
log "npm 版本: $(npm -v)"

# 全局环境变量
echo 'export NVM_DIR="/root/.nvm"' >> /etc/profile.d/nvm.sh
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /etc/profile.d/nvm.sh
chmod +x /etc/profile.d/nvm.sh

# ============================
# 4. 安装 PM2
# ============================
log "安装 PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root
log "PM2 版本: $(pm2 -v)"

# ============================
# 5. 安装 Nginx
# ============================
log "安装 Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
log "Nginx 版本: $(nginx -v 2>&1)"

# ============================
# 6. 安装 Certbot (Let's Encrypt)
# ============================
log "安装 Certbot..."
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# ============================
# 7. 配置防火墙
# ============================
log "配置 UFW 防火墙..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
log "防火墙状态:"
ufw status

# ============================
# 8. 创建应用目录
# ============================
log "创建应用目录..."
mkdir -p /var/www/my-blog
chown -R $SUDO_USER:$SUDO_USER /var/www/my-blog 2>/dev/null || true

log "✅ 服务器初始化完成！"
echo ""
echo "下一步："
echo "  1. 将代码部署到 /var/www/my-blog/"
echo "  2. 运行 nginx-setup.sh 配置 Nginx"
echo "  3. 运行 ssl-setup.sh 申请 SSL 证书"
