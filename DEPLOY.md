# 个人博客部署全流程手册

> **技术栈**：Next.js 14 + Tailwind CSS + Nginx + PM2 + Let's Encrypt  
> **目标平台**：阿里云 ECS（Ubuntu 22.04）  
> **预计耗时**：2-4 小时（不含备案）

---

## 目录

1. [购买阿里云资源](#1-购买阿里云资源)
2. [购买并配置域名](#2-购买并配置域名)
3. [域名备案](#3-域名备案)
4. [本地开发与调试](#4-本地开发与调试)
5. [推送代码到 GitHub](#5-推送代码到-github)
6. [服务器环境初始化](#6-服务器环境初始化)
7. [首次部署应用](#7-首次部署应用)
8. [配置 Nginx 与 HTTPS](#8-配置-nginx-与-https)
9. [配置 GitHub Actions 自动部署](#9-配置-github-actions-自动部署)
10. [日常维护](#10-日常维护)
11. [常见问题](#11-常见问题)

---

## 1. 购买阿里云资源

### 1.1 购买轻量应用服务器（推荐）

> 轻量应用服务器比 ECS 更简单，适合个人博客。费用约 **99元/年（2核2G）**。

1. 登录 [阿里云控制台](https://console.aliyun.com)
2. 搜索「**轻量应用服务器**」→ 立即购买
3. 配置选择：
   - **地域**：华东（上海）或 华北（北京）—— 选离用户近的
   - **镜像**：Ubuntu 22.04 LTS
   - **套餐**：2核2G（博客够用）
   - **带宽**：6Mbps（默认即可）
4. 购买后记下**公网 IP 地址**

### 1.2 配置安全组（防火墙）

在控制台 → 轻量应用服务器 → 防火墙，添加规则：

| 端口 | 协议 | 用途 |
|------|------|------|
| 22   | TCP  | SSH 登录 |
| 80   | TCP  | HTTP |
| 443  | TCP  | HTTPS |

---

## 2. 购买并配置域名

### 2.1 购买域名

1. 阿里云控制台 → 搜索「**域名注册**」
2. 搜索想要的域名（推荐 `.com` 或 `.cn`）
3. 加入购物车 → 填写域名持有人信息（需实名认证）→ 支付

### 2.2 域名解析

1. 控制台 → 云解析 DNS → 选择你的域名
2. 添加解析记录：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A       | @       | 服务器公网 IP |
| A       | www     | 服务器公网 IP |

3. TTL 默认 10 分钟即可
4. 解析生效通常需要 **5-30 分钟**

---

## 3. 域名备案

> ⚠️ **国内服务器强制要求备案**，香港节点可跳过此步骤。

### 备案流程

1. 阿里云控制台 → 搜索「**ICP 备案**」
2. 首次备案流程：
   - 验证服务器（需要主机服务号）
   - 填写网站信息（网站名称、网站域名）
   - 填写主体信息（个人：身份证）
   - 上传证件照
   - 等待管局审核

**预计时间**：15-20 个工作日

**备案期间**：网站可以在本地开发调试，等备案通过后再上线。

---

## 4. 本地开发与调试

```bash
# 进入项目目录
cd my-blog

# 安装依赖（首次）
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 写新文章

在 `posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2026-04-01"
excerpt: "文章摘要，显示在列表页"
tags: ["标签1", "标签2"]
---

## 正文从这里开始

用标准 Markdown 写作...
```

### 修改博客信息

- **站点名称**：`app/layout.tsx` → `metadata.title`
- **个人介绍**：`app/page.tsx` → Hero 区域
- **关于我**：`app/about/page.tsx`
- **导航链接**：`components/Header.tsx`

---

## 5. 推送代码到 GitHub

```bash
cd my-blog

# 初始化 Git
git init
git add .
git commit -m "feat: 初始化博客项目"

# 在 GitHub 创建新仓库（my-blog），然后：
git remote add origin git@github.com:your-username/my-blog.git
git branch -M main
git push -u origin main
```

---

## 6. 服务器环境初始化

### 6.1 SSH 登录服务器

```bash
# 方式一：密码登录
ssh root@你的服务器IP

# 方式二：密钥登录（更安全，推荐）
ssh -i ~/.ssh/your-key.pem root@你的服务器IP
```

### 6.2 运行初始化脚本

将 `deploy/server-init.sh` 上传到服务器并运行：

```bash
# 本地上传脚本
scp deploy/server-init.sh root@你的服务器IP:/root/

# 在服务器上运行
ssh root@你的服务器IP
sudo bash /root/server-init.sh
```

脚本会自动安装：Node.js 20、PM2、Nginx、Certbot、UFW 防火墙

---

## 7. 首次部署应用

在服务器上执行：

```bash
# 进入应用目录
cd /var/www/my-blog

# 克隆代码
git clone git@github.com:your-username/my-blog.git .

# 安装依赖 & 构建
npm ci
npm run build

# 用 PM2 启动
pm2 start ecosystem.config.json
pm2 save
pm2 startup  # 设置开机自启

# 查看运行状态
pm2 status
pm2 logs my-blog
```

---

## 8. 配置 Nginx 与 HTTPS

### 8.1 配置 Nginx

```bash
# 上传脚本
scp deploy/nginx-setup.sh root@你的服务器IP:/root/
scp deploy/ssl-setup.sh root@你的服务器IP:/root/

# 在服务器运行 Nginx 配置（替换为你的域名）
sudo bash /root/nginx-setup.sh yourdomain.com
sudo systemctl reload nginx
```

### 8.2 验证 HTTP 可访问

```bash
curl http://yourdomain.com
# 应返回博客页面 HTML
```

### 8.3 申请 SSL 证书

```bash
# 替换为你的域名和邮箱
sudo bash /root/ssl-setup.sh yourdomain.com your@email.com
```

成功后访问 `https://yourdomain.com` 即可看到博客 🎉

---

## 9. 配置 GitHub Actions 自动部署

### 9.1 生成 SSH 密钥对（专用于 CI/CD）

```bash
# 在本地生成
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key -N ""

# 查看公钥（添加到服务器）
cat ~/.ssh/deploy_key.pub

# 查看私钥（添加到 GitHub Secrets）
cat ~/.ssh/deploy_key
```

### 9.2 将公钥添加到服务器

```bash
# 在服务器上
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 9.3 在 GitHub 添加 Secrets

GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

| Secret 名称 | 值 |
|------------|---|
| `ECS_HOST` | 服务器公网 IP |
| `ECS_USER` | `root`（或你创建的用户名）|
| `ECS_SSH_KEY` | 私钥文件内容（deploy_key 全部内容）|
| `ECS_PORT` | `22` |
| `DOMAIN` | `yourdomain.com` |

### 9.4 测试自动部署

```bash
# 本地修改任意文件，推送到 main 分支
git add .
git commit -m "test: 测试自动部署"
git push origin main

# 去 GitHub → Actions 查看部署进度
```

---

## 10. 日常维护

### 写新文章

```bash
# 1. 在 posts/ 下创建 .md 文件
# 2. 推送到 GitHub → 自动部署
git add posts/new-post.md
git commit -m "post: 新文章标题"
git push origin main
```

### 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs my-blog

# 查看 Nginx 日志
tail -f /var/log/nginx/yourdomain.com.error.log

# 手动重启应用
pm2 restart my-blog

# 重新加载 Nginx
sudo nginx -t && sudo systemctl reload nginx

# 检查 SSL 证书到期时间
sudo certbot certificates
```

### 磁盘空间维护

```bash
# 清理 PM2 日志
pm2 flush

# 清理 npm 缓存
npm cache clean --force
```

---

## 11. 常见问题

**Q: 访问域名显示 502 Bad Gateway**  
A: Next.js 未启动。运行 `pm2 status` 检查，若状态为 errored，运行 `pm2 logs my-blog` 查看错误。

**Q: HTTPS 证书申请失败**  
A: 确保域名 A 记录已正确解析到服务器 IP，且 80 端口已开放。

**Q: GitHub Actions 部署失败（Permission denied）**  
A: 检查服务器上 `~/.ssh/authorized_keys` 是否包含正确的公钥，权限是否为 600。

**Q: 文章不显示**  
A: 确保 Markdown 文件的 frontmatter 格式正确，`date` 字段为 `YYYY-MM-DD` 格式。

**Q: 备案期间想临时访问**  
A: 可以直接用 `http://服务器IP:3000` 访问（Nginx 未绑定域名时）。

---

> 🎉 恭喜！按照以上步骤，你的个人博客已成功上线。  
> 有问题随时可以回来查阅这份手册。
