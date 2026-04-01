#!/bin/bash
# =============================================================
# SSL 证书申请脚本（Let's Encrypt）
# 用法：sudo bash ssl-setup.sh yourdomain.com your@email.com
# =============================================================

set -e

DOMAIN=${1}
EMAIL=${2}

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()   { echo -e "${GREEN}[✓] $1${NC}"; }
error() { echo -e "${RED}[✗] $1${NC}"; exit 1; }

[ "$EUID" -ne 0 ] && error "请使用 sudo 运行"
[ -z "$DOMAIN" ] || [ -z "$EMAIL" ] && {
  echo -e "${YELLOW}用法: sudo bash ssl-setup.sh yourdomain.com your@email.com${NC}"
  exit 1
}

log "申请 SSL 证书，域名: ${DOMAIN}"

# 使用临时 HTTP 配置（避免 HTTPS 证书不存在时报错）
TEMP_CONF="/etc/nginx/sites-available/${DOMAIN}-temp"
MAIN_CONF="/etc/nginx/sites-available/${DOMAIN}"

if [ -f "$TEMP_CONF" ]; then
  ln -sf "$TEMP_CONF" "/etc/nginx/sites-enabled/${DOMAIN}"
  rm -f "/etc/nginx/sites-enabled/${DOMAIN}-temp"
  nginx -t && systemctl reload nginx
fi

# 申请证书
certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos \
  --no-eff-email \
  -d "${DOMAIN}" \
  -d "www.${DOMAIN}"

log "SSL 证书申请成功！"

# 切换到完整 HTTPS 配置
ln -sf "$MAIN_CONF" "/etc/nginx/sites-enabled/${DOMAIN}"
rm -f "/etc/nginx/sites-enabled/${DOMAIN}-temp" 2>/dev/null || true
rm -f "$TEMP_CONF" 2>/dev/null || true
nginx -t && systemctl reload nginx

log "HTTPS 已启用！"

# 自动续期测试
certbot renew --dry-run && log "证书自动续期测试通过"

log "✅ SSL 配置完成！访问 https://${DOMAIN} 查看博客"
