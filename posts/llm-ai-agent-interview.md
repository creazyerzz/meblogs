---
title: "LLM 与 AI Agent 面试题精选：Prompt 工程、RAG、Agent 架构"
date: "2026-03-17"
tags: ["AI", "LLM", "Agent", "面试", "LangChain"]
excerpt: "深入解析大语言模型与 AI Agent 面试高频题，涵盖 Prompt 工程、RAG 知识库、Agent 系统设计等核心知识点。"
---

## 一、Prompt Engineering（提示词工程）

### 1.1 什么是 Prompt Engineering？

Prompt Engineering 是通过设计输入内容，引导 LLM 产生高质量输出的技术与艺术。

**Prompt 的基本结构：**
```
Prompt = 指令 + 背景 + 输入 + 输出要求
```

**示例：**
```
【角色】你是一位资深 Java 后端工程师

【背景】我正在准备阿里的 Java 面试，需要复习多线程和并发编程

【任务】请总结 Java 并发编程的三大核心概念

【输出格式】用 Markdown 列表形式输出，每个概念用一句话解释
```

### 1.2 常见的 Prompt 技巧

#### Zero-shot Prompting（零样本提示）

直接给出任务，不提供示例。

```python
prompt = """
将以下中文翻译成英文：
今天天气真好
"""

# 直接输出翻译结果
```

#### Few-shot Prompting（少样本提示）

提供几个示例帮助模型理解任务。

```python
prompt = """
将中文翻译成英文：

例1:
输入：我爱编程
输出：I love programming

例2:
输入：AI 是未来
输出：AI is the future

现在请翻译：
输入：Prompt 工程很重要
输出：
"""
```

#### Chain-of-Thought (CoT)（思维链）

引导模型输出推理步骤。

```python
prompt = """
问题：小明有 10 个苹果，送给小红 3 个，又收到 5 个，现在有多少个苹果？

解题步骤：
1. 初始有 10 个苹果
2. 送出 3 个：10 - 3 = 7
3. 收到 5 个：7 + 5 = 12

答案：12 个苹果
"""
```

### 1.3 Prompt 优化原则

| 原则 | 说明 | 示例 |
|------|------|------|
| **清晰明确** | 避免歧义，给出具体指令 | "总结" vs "用 3 点总结" |
| **提供上下文** | 增加背景信息 | "作为后端工程师..." |
| **角色扮演** | 指定专业角色 | "你是一位资深架构师" |
| **分隔符** | 区分不同部分 | 用 ``` 或 ### |
| **逐步引导** | 复杂任务分步 | 分成多个简单问题 |
| **指定输出格式** | 明确期望格式 | "用 JSON 格式输出" |

---

## 二、大语言模型基础

### 2.1 Transformer 架构

**核心组件：**
```
Transformer
├── 编码器（Encoder）
│   ├── 位置编码（Positional Encoding）
│   ├── 多头自注意力（Multi-Head Attention）
│   └── 前馈神经网络（FFN）
└── 解码器（Decoder）
    ├── 位置编码
    ├── 掩码多头注意力（Masked MHA）
    ├── 编码器-解码器注意力
    └── FFN
```

**自注意力机制：**
```python
import numpy as np

def self_attention(Q, K, V):
    """
    Q: Query 查询 - 我要找什么
    K: Key   键   - 我有什么特征
    V: Value 值   - 实际内容
    
    Attention = softmax(QK^T / √d_k) × V
    """
    d_k = Q.shape[-1]
    
    # 计算注意力分数
    scores = np.dot(Q, K.T) / np.sqrt(d_k)
    
    # softmax 归一化
    attention_weights = softmax(scores, axis=-1)
    
    # 加权求和
    output = np.dot(attention_weights, V)
    
    return output, attention_weights
```

### 2.2 GPT vs BERT

| 特性 | GPT | BERT |
|------|-----|------|
| 架构 | Decoder-only | Encoder-only |
| 训练方式 | 自回归 | 掩码语言模型 (MLM) |
| 任务类型 | 生成式 | 理解式 |
| 代表模型 | GPT-3/4 | BERT, RoBERTa |
| 适用场景 | 对话、写作、代码 | 分类、NER、问答 |

### 2.3 常见面试题

**Q1: Transformer 为什么要用多头注意力？**

A：多个头可以学习不同类型的依赖关系：
- 有的头关注语法结构
- 有的头关注语义关系
- 有的头关注位置信息

**Q2: Positional Encoding 为什么用正弦余弦？**

A：
- 可以表示相对位置
- 任意位置的编码可以通过线性变换得到
- 无需学习，适应任意长度序列

---

## 三、RAG（检索增强生成）

### 3.1 什么是 RAG？

RAG = Retrieval Augmented Generation（检索增强生成）

```
┌─────────────────────────────────────────────────────────┐
│                    RAG 系统架构                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  用户问题 ──→ 检索 ──→ 获取相关文档 ──→ 上下文拼接到     │
│                              Prompt ──→ LLM 生成答案    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**为什么需要 RAG？**
- ✅ 解决知识截止问题（LLM 训练数据有截止日期）
- ✅ 减少幻觉（Hallucination）
- ✅ 提供可溯源的答案
- ✅ 支持实时/私有知识库

### 3.2 RAG 实现流程

```python
# 简化版 RAG 实现
class SimpleRAG:
    def __init__(self, documents, embeddings, llm):
        self.documents = documents
        self.embeddings = embeddings
        self.llm = llm
        
        # 构建向量索引
        self.vector_store = self._build_index()
    
    def query(self, question, top_k=3):
        # 1. 将问题向量化
        question_embedding = self.embeddings.encode(question)
        
        # 2. 检索相关文档
        relevant_docs = self.vector_store.search(
            question_embedding, top_k=top_k
        )
        
        # 3. 构建 Prompt
        context = "\n".join([doc.content for doc in relevant_docs])
        prompt = f"""
根据以下上下文回答问题：

上下文：
{context}

问题：{question}

答案（引用相关上下文）：
"""
        
        # 4. LLM 生成答案
        answer = self.llm.generate(prompt)
        
        return {
            "answer": answer,
            "sources": relevant_docs
        }
```

### 3.3 向量数据库

**常见向量数据库对比：**

| 数据库 | 特点 | 适用场景 |
|--------|------|----------|
| **Pinecone** | 云原生托管、简单易用 | 快速上线 |
| **Milvus** | 开源、可私有部署 | 企业级应用 |
| **Weaviate** | 原生支持混合搜索 | 需要向量+标量搜索 |
| **Chroma** | 轻量级、易上手 | 原型开发 |
| **FAISS** | Facebook 开源、高效 | 需要自定义优化 |

**向量检索原理：**
```python
# 余弦相似度
def cosine_similarity(a, b):
    """
    cosine = (A · B) / (||A|| × ||B||)
    值越接近 1，相似度越高
    """
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot_product / (norm_a * norm_b)
```

---

## 四、AI Agent（智能体）

### 4.1 什么是 AI Agent？

**Agent 的定义：**
AI Agent 是能够自主感知环境、做出决策并执行动作的智能系统。

**Agent vs LLM：**

| 特性 | LLM | Agent |
|------|-----|-------|
| 主动性 | 被动响应 | 主动执行 |
| 记忆 | 无状态（需 Context） | 可持久化 |
| 工具调用 | 不可 | 可调用工具 |
| 自我规划 | 有限 | 完整规划能力 |
| 执行环境 | 仅文本 | 可操作外部系统 |

### 4.2 Agent 的核心组件

```
┌─────────────────────────────────────────────┐
│              AI Agent                       │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐    ┌─────────────┐       │
│  │   感知      │───→│   规划      │       │
│  │ (Perception)│    │ (Planning) │       │
│  └─────────────┘    └─────────────┘       │
│         ↑                  ↓              │
│         │                  ↓              │
│  ┌─────────────┐    ┌─────────────┐       │
│  │   记忆      │←───│   执行      │       │
│  │ (Memory)    │    │ (Action)   │       │
│  └─────────────┘    └─────────────┘       │
│                              ↓              │
│                     ┌─────────────┐       │
│                     │   工具      │       │
│                     │ (Tools)     │       │
│                     └─────────────┘       │
└─────────────────────────────────────────────┘
```

### 4.3 Agent 实现示例

**使用 LangChain 实现 ReAct Agent：**

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from langchain import hub

# 定义工具
def search_code(query: str) -> str:
    """搜索代码示例"""
    return "代码搜索结果..."

def run_command(cmd: str) -> str:
    """执行命令"""
    return "命令执行结果..."

tools = [
    Tool(
        name="SearchCode",
        func=search_code,
        description="搜索代码示例，回答编程问题"
    ),
    Tool(
        name="RunCommand",
        func=run_command,
        description="执行系统命令"
    )
]

# 创建 Agent
llm = ChatOpenAI(model="gpt-4", temperature=0)
prompt = hub.pull("hwchase17/react")
agent = create_react_agent(llm, tools, prompt)

# 执行
agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent,
    tools=tools,
    verbose=True
)

result = agent_executor.invoke({
    "input": "帮我搜索 Python 异步编程的示例代码"
})
```

### 4.4 ReAct 模式

**ReAct = Reasoning + Acting**

```python
def react_agent(question, tools, llm):
    """
    ReAct 循环
    Thought → Action → Observation → ... → Final Answer
    """
    memory = []
    
    while True:
        # 1. Thought - 思考下一步
        thought_prompt = f"""
问题：{question}
历史：{memory}

思考：你需要做什么？
"""
        thought = llm.generate(thought_prompt)
        
        # 2. 决定是否结束
        if "final_answer" in thought.lower():
            return extract_answer(thought)
        
        # 3. Action - 执行动作
        action = parse_action(thought)
        observation = execute_action(action, tools)
        
        # 4. 记录观察
        memory.append(f"Thought: {thought}")
        memory.append(f"Action: {action}")
        memory.append(f"Observation: {observation}")
```

---

## 五、LangChain 与 LangGraph

### 5.1 LangChain 核心概念

```python
from langchain.schema import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# 1. Chat Model
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 2. Prompt Template
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的{role}。"),
    ("human", "请解释以下概念：{concept}")
])

# 3. Chain
chain = prompt | llm

# 4. 执行
result = chain.invoke({
    "role": "Java 架构师",
    "concept": "什么是微服务架构"
})
```

### 5.2 LangGraph（复杂工作流）

```python
from langgraph.graph import StateGraph, END

# 定义状态
class AgentState(TypedDict):
    messages: List[BaseMessage]
    next_action: str

# 定义节点
def research_node(state):
    """研究阶段"""
    return {"messages": [search_web(state["messages"][-1].content)]}

def code_node(state):
    """编码阶段"""
    return {"messages": [generate_code(state["messages"][-1].content)]}

def review_node(state):
    """审查阶段"""
    return {"messages": [review_code(state["messages"][-1].content)]}

# 构建图
workflow = StateGraph(AgentState)
workflow.add_node("research", research_node)
workflow.add_node("code", code_node)
workflow.add_node("review", review_node)

workflow.set_entry_point("research")
workflow.add_edge("research", "code")
workflow.add_edge("code", "review")
workflow.add_edge("review", END)

app = workflow.compile()
```

---

## 六、常见面试题

### 6.1 LLM 相关

**Q1: 如何减少 LLM 的幻觉？**
- 使用 RAG 提供外部知识
- 提示词中要求"只根据提供的信息回答"
- 模型微调（Fine-tuning）
- CoT 提示增加推理过程
- 设置 lower temperature

**Q2: 什么是上下文窗口？**
- LLM 能处理的最大 token 数量
- 超过会截断或报错
- 需要对长文本进行分块处理

**Q3: Temperature 和 Top-p 的区别？**
- Temperature：控制随机性，高 = 更随机
- Top-p：核采样，控制词汇范围

### 6.2 RAG 相关

**Q1: 如何优化 RAG 的检索效果？**
- 改进分块策略（大小、重叠）
- 使用更好的 Embedding 模型
- 混合搜索（向量+关键词）
- 重排序（Reranker）
- 查询改写

**Q2: 如何处理多跳问答？**
- 多次检索，逐步深入
- 使用 Agent 进行迭代推理
- 构建知识图谱

### 6.3 Agent 相关

**Q1: Agent 如何实现长期记忆？**
- 向量数据库存储
- 摘要机制压缩历史
- 外部知识库

**Q2: 如何防止 Agent 陷入死循环？**
- 设置最大迭代次数
- 记录访问状态
- 检查重复模式

**Q3: Tool Calling 的实现原理？**
1. LLM 输出 JSON 格式的工具调用
2. 解析函数名和参数
3. 执行工具
4. 将结果加入 Context
5. 继续推理或返回结果

---

## 七、实战项目建议

### 7.1 推荐项目

1. **RAG 知识库问答系统**
   - 使用 LangChain + Milvus
   - 支持 PDF/Word 文档解析
   - 实现对话记忆

2. **AI 编程助手**
   - 代码搜索 + 生成
   - 自动化测试生成
   - 代码审查

3. **多 Agent 协作系统**
   - 规划 Agent + 执行 Agent
   - 代码生成 + 代码审查
   - 自动化部署

### 7.2 面试加分项

- ✅ 有实际部署的 Agent 系统
- ✅ 能讲解系统的局限性及改进方案
- ✅ 了解最新论文（Llama, GPT-5 等）
- ✅ 有性能优化经验（延迟、成本）

祝 AI 面试顺利！🍀
