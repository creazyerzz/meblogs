# 我的技术博客

一个现代化的个人技术博客，基于 Next.js 14 + Tailwind CSS 构建。

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **部署**: PM2 + Nginx

## 📝 博客内容

### 面试题系列
- [Java 后端面试题精选](posts/java-backend-interview.md)
- [分布式系统面试题精选](posts/distributed-system-interview.md)
- [算法与数据结构面试题精选](posts/algorithm-interview-questions.md)
- [LLM 与 AI Agent 面试题精选](posts/llm-ai-agent-interview.md)
- [MySQL 数据库面试题精选](posts/mysql-interview-questions.md)

### 技术文章
- [LangChain 核心概念](posts/langchain-core-concepts.md)
- [LangGraph 实战](posts/langgraph-advanced-workflows.md)
- [分布式 ID 生成器](posts/distributed-id-generator.md)
- [分布式系统 CAP 定理](posts/distributed-system-cap-theorem.md)
- [Java 并发编程](posts/java-concurrent-programming.md)
- [Spring Boot 最佳实践](posts/spring-boot-best-practices.md)
- [十大排序算法总结](posts/common-algorithms-summary.md)

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📦 部署

博客已部署在阿里云服务器，使用 PM2 + Nginx 管理。

### 手动部署

```bash
# 构建
npm run build

# 启动
pm2 start ecosystem.config.json
```

### 目录结构

```
├── app/                    # Next.js App Router
│   ├── about/            # 关于页面
│   ├── blog/             # 博客文章
│   └── tags/             # 标签页
├── components/            # React 组件
├── posts/                # Markdown 博客文章
├── lib/                  # 工具函数
└── public/               # 静态资源
```

## 🎯 关于我

**周广晨** - AI全栈工程师 · AI Agent工程师

- 🔭 专注于 AI 全栈开发与 Agent 系统构建
- 📚 对大语言模型应用、RAG 知识库有深入研究
- 🚀 热爱技术分享，记录成长历程

GitHub: [github.com/creazyerzz](https://github.com/creazyerzz)

## 📄 License

MIT License
