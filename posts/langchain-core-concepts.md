---
title: 'LangChain 核心概念深度解析：从入门到实战'
date: '2026-03-15'
excerpt: '全面解析 LangChain 的核心组件：Model I/O、Chains、Agents、Memory，以及实际项目中的应用实践'
tags: ['AI', 'LangChain', 'LLM', '大语言模型']
---

## 前言

LangChain 是构建 LLM 应用的强大框架，本文将深入解析其核心概念，帮助你从入门到精通。

## LangChain 是什么？

LangChain 是一个用于开发由语言模型驱动的应用程序的框架，主要解决：

1. **连接 LLM 与外部数据源**
2. **构建复杂的推理链**
3. **实现工具调用和自动化**
4. **维护对话上下文**

```
┌─────────────────────────────────────────────┐
│              LangChain 架构                  │
├─────────────────────────────────────────────┤
│                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │ Model I/O│  │  Chains  │  │  Agents  │  │
│   └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │ Memory   │  │Retrieval │  │CallBacks │  │
│   └──────────┘  └──────────┘  └──────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## 核心组件

### 1. Model I/O

Model I/O 是 LangChain 与 LLM 交互的核心模块。

#### Prompt Templates

```python
from langchain.prompts import PromptTemplate

# 简单模板
simple_template = PromptTemplate.from_template(
    "Tell me a joke about {topic}"
)

# 带示例的模板
few_shot_template = PromptTemplate.from_template(
    """Question: {question}
Answer: {answer}

Question: Who is the president of the US?
Answer: Joe Biden

Question: {new_question}
Answer:"""
)
```

#### Chat Models

```python
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

# 初始化 ChatGPT
chat = ChatOpenAI(
    model="gpt-4",
    temperature=0.7,
    api_key="your-api-key"
)

# 对话
response = chat.invoke([
    SystemMessage(content="你是一个有用的助手"),
    HumanMessage(content="什么是微服务架构？")
])

print(response.content)
```

#### LLMs（纯文本模型）

```python
from langchain_community.llms import OpenAI

llm = OpenAI(model="gpt-3.5-turbo-instruct")

# 简单调用
result = llm.invoke("Write a Python hello world program")
```

### 2. Chains（链）

Chains 是 LangChain 的核心概念，用于将多个组件串联起来。

#### LLMChain

最简单的链，用于将 Prompt 与 LLM 结合：

```python
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# 创建链
chain = LLMChain(
    llm=chat,
    prompt=PromptTemplate.from_template(
        "请用一句话解释{concept}"
    )
)

# 执行链
result = chain.invoke({"concept": "人工智能"})
print(result['text'])
```

#### Sequential Chains（顺序链）

```python
from langchain.chains import SequentialChain

# 第一个链：翻译
chain1 = LLMChain(
    llm=chat,
    prompt=PromptTemplate.from_template(
        "Translate the following text to French: {text}"
    ),
    output_key="french_text"
)

# 第二个链：总结
chain2 = LLMChain(
    llm=chat,
    prompt=PromptTemplate.from_template(
        "Summarize this French text: {french_text}"
    ),
    output_key="summary"
)

# 组合链
sequential_chain = SequentialChain(
    chains=[chain1, chain2],
    input_variables=["text"],
    output_variables=["french_text", "summary"]
)

result = sequential_chain.invoke({"text": "Artificial intelligence is transforming the world"})
```

#### Router Chains（路由链）

```python
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema

# 定义输出格式
response_schemas = [
    ResponseSchema(name="destination", description="目标链名称"),
    ResponseSchema(name="next_inputs", description="下一个链的输入")
]

output_parser = StructuredOutputParser.from_response_schemas(response_schemas)

# 路由提示
router_template = """Given a user input, decide which chain to use.

Available chains:
- math: For mathematical calculations
- poetry: For creative writing
- general: For general questions

{format_instructions}

User input: {input}
"""

chain = LLMChain(
    llm=chat,
    prompt=PromptTemplate.from_template(
        router_template,
        partial_variables={"format_instructions": output_parser.get_format_instructions()}
    ),
    output_parser=output_parser
)
```

### 3. Agents（智能体）

Agents 是 LangChain 中实现自主决策和工具调用的核心。

#### 基础 Agent

```python
from langchain.agents import Agent, Tool, initialize_agent
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import SerpAPIWrapper

# 定义工具
tools = [
    Tool(
        name="Search",
        func=SerpAPIWrapper().run,
        description="用于搜索最新信息"
    ),
    Tool(
        name="Wikipedia",
        func=WikipediaQueryRun().run,
        description="用于查询百科知识"
    )
]

# 初始化 Agent
agent = initialize_agent(
    tools,
    chat,
    agent="zero-shot-react-description",
    verbose=True
)

# 执行
result = agent.invoke("谁获得了2024年诺贝尔物理学奖？")
```

#### 自定义工具

```python
from langchain.tools import tool

@tool
def calculate_factorial(n: int) -> int:
    """计算一个数的阶乘"""
    if n < 0:
        return "负数没有阶乘"
    if n == 0 or n == 1:
        return 1
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

@tool
def get_current_weather(location: str) -> str:
    """获取指定位置的天气信息"""
    # 实际应用中会调用天气 API
    return f"{location} 今天天气晴朗，25度"

# 使用自定义工具
tools = [calculate_factorial, get_current_weather]
agent = initialize_agent(tools, chat, agent="zero-shot-react-description")

result = agent.invoke("帮我计算5的阶乘，并查询北京今天的天气")
```

### 4. Memory（记忆）

Memory 模块让 LLM 能够记住对话历史。

#### ConversationBufferMemory

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# 创建记忆
memory = ConversationBufferMemory()

# 创建对话链
conversation = ConversationChain(
    llm=chat,
    memory=memory,
    verbose=True
)

# 对话
conversation.invoke("我叫张三")
conversation.invoke("我叫什么呢？")  # 能记住我叫张三
```

#### ConversationSummaryMemory

```python
from langchain.memory import ConversationSummaryMemory

memory = ConversationSummaryMemory(llm=chat)

conversation = ConversationChain(
    llm=chat,
    memory=memory
)

# 长期对话，摘要式记忆节省 token
conversation.invoke("今天的天气真好")
conversation.invoke("我想去公园散步")
conversation.invoke("你觉得我应该带什么？")
```

### 5. Retrieval（检索增强）

RAG（Retrieval Augmented Generation）是 LLM 应用的核心模式。

#### 向量存储

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 文档分割
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

texts = text_splitter.split_documents(documents)

# 创建向量存储
vectorstore = Chroma.from_documents(
    documents=texts,
    embedding=OpenAIEmbeddings()
)

# 创建检索器
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 3}
)
```

#### RAG 链

```python
from langchain.chains import RetrievalQA

# 创建 QA 链
qa_chain = RetrievalQA.from_chain_type(
    llm=chat,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# 查询
result = qa_chain.invoke({"query": "文档中关于什么内容？"})
```

## 实战：构建客服机器人

```python
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from langchain.agents import initialize_agent, Tool

# 初始化
chat = ChatOpenAI(temperature=0.7)

# 工具
tools = [
    Tool(
        name="SearchFAQ",
        func=search_faq,  # 你的 FAQ 检索函数
        description="搜索常见问题答案"
    ),
    Tool(
        name="CreateTicket",
        func=create_support_ticket,  # 创建工单函数
        description="创建客户支持工单"
    )
]

# 记忆
memory = ConversationBufferWindowMemory(
    k=5,  # 记住最近5轮对话
    memory_key="chat_history",
    return_messages=True
)

# 提示模板
CUSTOMER_SERVICE_PROMPT = """你是一个专业的客服助手，名字叫小智。

你的职责：
1. 礼貌、专业的回答客户问题
2. 如果无法回答，引导客户创建工单
3. 记住对话上下文

历史对话：
{chat_history}

客户问题：{input}

回复："""

# 创建 Agent
agent = initialize_agent(
    tools,
    chat,
    agent="conversational-react-description",
    memory=memory,
    prompt=CUSTOMER_SERVICE_PROMPT,
    verbose=True
)

# 运行
while True:
    user_input = input("你: ")
    if user_input.lower() in ["退出", "exit", "quit"]:
        break
    response = agent.invoke({"input": user_input})
    print(f"小智: {response['output']}")
```

## 最佳实践

### 1. Prompt 工程

```python
# ✅ 好的 Prompt
good_prompt = PromptTemplate.from_template("""
你是一个专业的{domain}专家。
请根据以下信息回答用户的问题。

背景信息：
{context}

问题：
{question}

请用专业的语言回答，如果不确定，请明确说明。
""")

# ❌ 不好的 Prompt
bad_prompt = PromptTemplate.from_template("回答：{question}")
```

### 2. 错误处理

```python
from langchain.callbacks.base import BaseCallbackHandler

class SafeAgentCallback(BaseCallbackHandler):
    def on_chain_error(self, error, **kwargs):
        print(f"链执行出错: {error}")
        return "抱歉，服务暂时不可用，请稍后再试。"
```

### 3. 性能优化

```python
# 1. 批量处理
batch_results = chat.batch([
    [HumanMessage(content="问题1")],
    [HumanMessage(content="问题2")],
])

# 2. 缓存结果
from langchain.cache import InMemoryCache
import langchain
langchain.llm_cache = InMemoryCache()

# 3. 异步调用
async def async_query(question: str):
    response = await chat.agenerate([[HumanMessage(content=question)]])
    return response
```

## 总结

1. **Model I/O**：LangChain 与 LLM 交互的基础
2. **Chains**：串联组件，构建复杂流程
3. **Agents**：实现自主决策和工具调用
4. **Memory**：维护对话上下文
5. **Retrieval**：RAG 模式，结合外部知识

LangChain 仍在快速发展中，建议持续关注官方文档和社区动态。希望这篇解析对你有帮助！
