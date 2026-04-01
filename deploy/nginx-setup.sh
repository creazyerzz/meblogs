#!/bin/bash
# =============================================================
# Nginx 配置脚本
# 用法：sudo bash nginx-setup.sh yourdomain.com
# =============================================================

set -e

DOMAIN=${1:-"yourdomain.com"}
APP_PORT=3000
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()   { echo -e "${GREEN}[✓] $1${NC}"; }
error() { echo -e "${RED}[✗] $1${NC}"; exit 1; }

[ "$EUID" -ne 0 ] && error "请使用 sudo 运行"
[ -z "$1" ] && echo -e "${YELLOW}用法: sudo bash nginx-setup.sh yourdomain.com${NC}" && exit 1

log "配置 Nginx，域名: ${DOMAIN}"

# ---- 写入 Nginx 配置 ----
cat > "${NGINX_CONF}" << EOF
# HTTP → HTTPS 重定向（SSL 配置后生效）
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    # SSL 证书（由 Certbot 自动填充）
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # SSL 安全配置
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # 静态资源缓存（Next.js _next/static 目录）
    location /_next/static/ {
        proxy_pass http://127.0.0.1:${APP_PORT};
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 反向代理到 Next.js
    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # 日志
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
}
EOF

# ---- 启用配置 ----
ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/${DOMAIN}"

# 禁用默认配置
[ -f "/etc/nginx/sites-enabled/default" ] && rm -f "/etc/nginx/sites-enabled/default"

# ---- 测试配置 ----
nginx -t && log "Nginx 配置语法检查通过"

# ---- 创建 certbot 验证目录 ----
mkdir -p /var/www/certbot

# ---- 临时启用 HTTP（首次 SSL 申请前） ----
# 创建一个只有 HTTP 的临时配置
cat > "/etc/nginx/sites-available/${DOMAIN}-temp" << TEMPEOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
TEMPEOF

log "Nginx 配置完成！"
echo ""
echo "下一步运行 SSL 证书申请："
echo "  sudo bash ssl-setup.sh ${DOMAIN}"
