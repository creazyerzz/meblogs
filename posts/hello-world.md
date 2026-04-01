---
title: "用 Next.js 搭建个人博客：从零到部署"
date: "2026-04-01"
excerpt: "本文记录了我用 Next.js 14 + Tailwind CSS 搭建个人博客的完整过程，包括项目初始化、Markdown 支持、样式设计和部署到阿里云。"
tags: ["Next.js", "博客", "部署"]
---

## 为什么选择 Next.js？

在技术选型时，我考虑过 Hugo、Hexo 等静态博客框架，最终选择了 Next.js，原因如下：

1. **完全自定义**：不受主题限制，CSS 完全由自己掌控
2. **React 生态**：未来可以轻松添加交互功能
3. **SSG + SSR 兼容**：文章页面完全静态化，性能极佳
4. **TypeScript 原生支持**：类型安全，开发体验好

## 项目结构

```
my-blog/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 首页（文章列表）
│   ├── blog/[slug]/page.tsx # 文章详情
│   └── layout.tsx          # 全局布局
├── components/             # 公共组件
├── lib/posts.ts            # 读取 Markdown 工具
└── posts/                  # Markdown 文章目录
```

## Markdown 解析

使用 `gray-matter` 解析 frontmatter，`remark` + `remark-html` 将 Markdown 转换为 HTML：

```typescript
const { data, content } = matter(fileContents)
const processedContent = await remark()
  .use(remarkGfm)
  .use(remarkHtml)
  .process(content)
```

## 部署到阿里云

博客使用 PM2 进程管理 + Nginx 反向代理部署在阿里云 ECS 上。

详细部署步骤见[服务器配置脚本](#)。

---

> 这是一篇示例文章，欢迎替换为你自己的内容！
