---
title: 'LangGraph 实战：构建复杂 AI 工作流'
date: '2026-03-12'
excerpt: '深入探讨 LangGraph 的状态机设计、节点路由、条件分支，以及在实际项目中构建复杂 AI 工作流的最佳实践'
tags: ['AI', 'LangGraph', '工作流', '状态机']
---

## 前言

LangGraph 是 LangChain 生态系统中用于构建复杂、有状态的 LLM 工作流的库。本文将深入探讨如何用 LangGraph 构建企业级的 AI 应用。

## 为什么需要 LangGraph？

### 传统方法的局限

```python
# ❌ 简单的链式调用无法处理复杂逻辑
chain = LLMChain(llm=chat, prompt=prompt)
result = chain.invoke({"input": "帮我分析销售数据"})
# 无法处理：
# - 需要多次调用和判断
# - 需要根据结果决定下一步
# - 需要在执行过程中维护状态
```

### LangGraph 的优势

```
┌─────────────────────────────────────────┐
│          LangGraph 工作流示例             │
├─────────────────────────────────────────┤
│                                         │
│    ┌─────────┐                          │
│    │  Start  │                          │
│    └────┬────┘                          │
│         │                               │
│         ▼                               │
│    ┌─────────┐                          │
│    │ Analyze │ ──► [需要更多信息？]       │
│    └────┬────┘          │               │
│         │              Yes              │
│         │               │               │
│         ▼               ▼               │
│    ┌─────────┐    ┌──────────┐          │
│    │ Process │ ◄──│ Ask User │          │
│    └────┬────┘    └──────────┘          │
│         │                               │
│         ▼                               │
│    ┌─────────┐                          │
│    │ Response│                          │
│    └────┬────┘                          │
│         │                               │
│         ▼                               │
│    ┌─────────┐                          │
│    │  End    │                          │
│    └─────────┘                          │
└─────────────────────────────────────────┘
```

## 核心概念

### 1. Graph（图）

```python
from langgraph.graph import StateGraph, END

# 定义状态
class AgentState(TypedDict):
    messages: list
    current_step: str
    extracted_data: dict
    needs_more_info: bool

# 创建图
graph = StateGraph(AgentState)

# 添加节点
graph.add_node("analyze", analyze_node)
graph.add_node("process", process_node)
graph.add_node("respond", respond_node)

# 添加边
graph.add_edge("analyze", "process")
graph.add_edge("process", "respond")
graph.add_edge("respond", END)

# 编译
app = graph.compile()
```

### 2. Node（节点）

节点是执行特定任务的函数：

```python
from langchain_core.messages import HumanMessage, AIMessage

def analyze_node(state: AgentState):
    """分析用户输入"""
    messages = state["messages"]
    last_message = messages[-1]
    
    # LLM 分析
    response = chat.invoke([
        SystemMessage(content="分析用户意图"),
        last_message
    ])
    
    # 更新状态
    return {
        "messages": messages + [response],
        "current_step": "analyze",
        "extracted_data": extract_data(response.content)
    }

def process_node(state: AgentState):
    """处理数据"""
    extracted = state["extracted_data"]
    
    # 根据数据进行处理
    result = process(extracted)
    
    return {
        "needs_more_info": result.need_more_info
    }
```

### 3. Edge（边）

边连接节点，决定流程：

```python
from langgraph.graph import END

# 简单边：固定流程
graph.add_edge("start", "process")
graph.add_edge("process", END)

# 条件边：根据状态决定
def should_continue(state: AgentState):
    """决定是否继续"""
    if state["needs_more_info"]:
        return "ask_user"
    return END

graph.add_conditional_edges(
    "process",
    should_continue,
    {
        "ask_user": "ask_user",
        END: END
    }
)

# ask_user 节点
graph.add_edge("ask_user", "process")
```

## 实战：客服对话系统

### 完整实现

```python
from langgraph.graph import StateGraph, END, START
from langgraph.prebuilt import ToolNode
from typing import TypedDict, Annotated
import operator

# ============ 1. 定义状态 ============
class CustomerServiceState(TypedDict):
    messages: Annotated[list, operator.add]
    intent: str
    extracted_entities: dict
    conversation_stage: str
    ticket_id: str | None

# ============ 2. 定义工具 ============
@tool
def create_ticket(customer_name: str, issue: str, priority: str) -> str:
    """创建客户工单"""
    ticket_id = f"TICKET-{random.randint(1000, 9999)}"
    return f"工单已创建，编号: {ticket_id}"

@tool
def search_knowledge_base(query: str) -> str:
    """搜索知识库"""
    # 实际应用中调用知识库
    return "根据您的描述，这可能是..."

search_tools = [create_ticket, search_knowledge_base]

# ============ 3. 定义节点 ============
def classify_intent(state: CustomerServiceState) -> CustomerServiceState:
    """意图分类"""
    messages = state["messages"]
    last_msg = messages[-1].content
    
    response = chat.invoke([
        SystemMessage(content="""你是一个客服意图分类器。
        分析用户消息，分类为以下意图之一：
        - product_inquiry: 产品咨询
        - technical_support: 技术支持
        - complaint: 投诉
        - refund: 退款
        - other: 其他
        
        只回复意图分类，不要其他内容。"""),
        HumanMessage(content=last_msg)
    ])
    
    return {"intent": response.content.strip()}

def extract_entities(state: CustomerServiceState) -> CustomerServiceState:
    """实体提取"""
    messages = state["messages"]
    
    response = chat.invoke([
        SystemMessage(content="""从对话中提取关键实体。
        以 JSON 格式返回，如：
        {"name": "张三", "phone": "138xxx", "product": "产品A"}"""),
        HumanMessage(content=str(messages))
    ])
    
    entities = json.loads(response.content)
    return {"extracted_entities": entities}

def search_knowledge(state: CustomerServiceState) -> CustomerServiceState:
    """知识库检索"""
    intent = state["intent"]
    entities = state["extracted_entities"]
    
    query = f"{intent} - {entities}"
    result = search_knowledge_base.invoke(query)
    
    return {"messages": [AIMessage(content=result)]}

def create_support_ticket(state: CustomerServiceState) -> CustomerServiceState:
    """创建工单"""
    entities = state["extracted_entities"]
    
    ticket = create_ticket.invoke({
        "customer_name": entities.get("name", "未知"),
        "issue": state["intent"],
        "priority": "normal"
    })
    
    return {
        "messages": [AIMessage(content=f"好的，我已为您创建工单: {ticket}")],
        "ticket_id": ticket.split(":")[-1].strip()
    }

def generate_response(state: CustomerServiceState) -> CustomerServiceState:
    """生成回复"""
    messages = state["messages"]
    
    response = chat.invoke([
        SystemMessage(content="""你是一个专业客服，根据上下文生成回复。
        回复要：
        1. 礼貌、专业
        2. 解决用户问题
        3. 适时引导下一步操作"""),
        *messages
    ])
    
    return {"messages": [response]}

# ============ 4. 定义路由函数 ============
def route_after_classify(state: CustomerServiceState) -> str:
    """分类后的路由"""
    intent = state["intent"]
    
    if intent in ["complaint", "refund", "technical_support"]:
        return "extract_entities"
    elif intent == "product_inquiry":
        return "search_knowledge"
    else:
        return "generate_response"

def route_after_process(state: CustomerServiceState) -> str:
    """处理后的路由"""
    if state["intent"] in ["complaint", "refund"]:
        return "create_ticket"
    return "generate_response"

# ============ 5. 构建图 ============
workflow = StateGraph(CustomerServiceState)

# 添加节点
workflow.add_node("classify_intent", classify_intent)
workflow.add_node("extract_entities", extract_entities)
workflow.add_node("search_knowledge", search_knowledge)
workflow.add_node("create_ticket", create_support_ticket)
workflow.add_node("generate_response", generate_response)

# 添加边
workflow.add_edge(START, "classify_intent")

# 条件边
workflow.add_conditional_edges(
    "classify_intent",
    route_after_classify
)

workflow.add_conditional_edges(
    "extract_entities",
    route_after_process
)

workflow.add_edge("search_knowledge", "generate_response")
workflow.add_edge("create_ticket", "generate_response")
workflow.add_edge("generate_response", END)

# 编译
app = workflow.compile()
```

### 运行示例

```python
# 初始化状态
initial_state = {
    "messages": [HumanMessage(content="我买的笔记本坏了，想退货")],
    "intent": "",
    "extracted_entities": {},
    "conversation_stage": "start",
    "ticket_id": None
}

# 运行
result = app.invoke(initial_state)

# 查看结果
for message in result["messages"]:
    print(f"{message.__class__.__name__}: {message.content}")
```

## 实战：数据分析代理

### 架构设计

```
┌──────────────────────────────────────────────┐
│            数据分析代理架构                    │
├──────────────────────────────────────────────┤
│                                              │
│  START ──► Understand Query                  │
│              │                               │
│              ▼                               │
│         Plan Analysis ──► [需要澄清？]        │
│              │                    │          │
│              │                   Yes          │
│              │                    │          │
│              ▼                    ▼          │
│         Execute Code ──► Ask Clarification   │
│              │                    ▲          │
│              ▼                    │          │
│         Validate Results ──┐    No           │
│              │             │                │
│              ▼             │                │
│         Generate Report ───┘                │
│              │                               │
│              ▼                               │
│            END                               │
└──────────────────────────────────────────────┘
```

### 实现

```python
from langgraph.checkpoint.memory import MemorySaver

class DataAnalysisState(TypedDict):
    query: str
    analysis_plan: list[str] | None
    intermediate_results: dict
    final_result: str | None
    clarifications: list[str] | None

def understand_query(state: DataAnalysisState) -> DataAnalysisState:
    """理解用户查询"""
    query = state["query"]
    
    response = chat.invoke([
        SystemMessage(content="""分析用户的数据分析需求：
        1. 用户想分析什么？
        2. 需要哪些数据指标？
        3. 输出什么格式？
        
        以 JSON 格式返回。"""),
        HumanMessage(content=query)
    ])
    
    plan = json.loads(response.content)
    return {"analysis_plan": plan.get("steps", [])}

def plan_analysis(state: DataAnalysisState) -> DataAnalysisState:
    """规划分析步骤"""
    plan = state["analysis_plan"]
    
    if not plan:
        return {"clarifications": ["需要更多信息来规划分析"]}
    
    return {}

def execute_analysis_step(state: DataAnalysisState) -> DataAnalysisState:
    """执行分析步骤"""
    plan = state["analysis_plan"]
    results = state["intermediate_results"]
    
    for step in plan:
        # 执行每个步骤
        result = execute_step(step, results)
        results[step["name"]] = result
    
    return {"intermediate_results": results}

def validate_results(state: DataAnalysisState) -> DataAnalysisState:
    """验证结果"""
    results = state["intermediate_results"]
    
    # LLM 验证
    response = chat.invoke([
        SystemMessage(content="验证分析结果的准确性和完整性"),
        HumanMessage(content=str(results))
    ])
    
    if "不准确" in response.content:
        return {"analysis_plan": ["需要重新分析"]}
    
    return {}

def generate_report(state: DataAnalysisState) -> DataAnalysisState:
    """生成报告"""
    results = state["intermediate_results"]
    
    response = chat.invoke([
        SystemMessage(content="""基于分析结果，生成一份清晰的数据分析报告。
        报告应包含：
        1. 关键发现
        2. 数据可视化建议
        3. 业务建议"""),
        HumanMessage(content=str(results))
    ])
    
    return {"final_result": response.content}

# 创建带检查点的图（支持中断和恢复）
checkpointer = MemorySaver()
graph = StateGraph(DataAnalysisState)

# ... 添加节点和边 ...

app = graph.compile(checkpointer=checkpointer)

# 运行并支持中断
config = {"configurable": {"thread_id": "user-123"}}
for event in app.stream({"query": "分析销售数据"}, config):
    print(event)
```

## 最佳实践

### 1. 使用检查点

```python
from langgraph.checkpoint.postgres import PostgresSaver

# 生产环境使用 PostgreSQL
checkpointer = PostgresSaver.from_conn_string("postgresql://...")

# 支持：
# - 多轮对话
# - 任务中断和恢复
# - 并发执行
```

### 2. 错误处理和重试

```python
from langgraph.graph import add_messages

def robust_node(state: AgentState):
    """带重试的节点"""
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            result = risky_operation()
            return {"result": result}
        except Exception as e:
            if attempt == max_retries - 1:
                return {"error": str(e)}
            continue
    
    return {"error": "Max retries exceeded"}
```

### 3. 流式输出

```python
# 流式执行
for event in app.stream(initial_state, stream_mode="updates"):
    print(event)

# 特定节点的流式输出
async for event in app.astream(initial_state, stream_mode="messages"):
    print(event)
```

## 性能优化

### 1. 并行执行

```python
# 并行节点
graph.add_node("task1", task1_node)
graph.add_node("task2", task2_node)

# 添加并行边
graph.add_edge(START, "task1")
graph.add_edge(START, "task2")
graph.add_edge("task1", END)
graph.add_edge("task2", END)
```

### 2. 缓存结果

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_search(query: str):
    return search_knowledge_base.invoke(query)
```

## 总结

LangGraph 提供了构建复杂 LLM 工作流的能力：

1. **状态机设计**：维护复杂流程的状态
2. **条件路由**：根据状态动态决定下一步
3. **工具集成**：调用外部系统
4. **检查点**：支持中断和恢复
5. **流式输出**：实时反馈执行过程

通过合理设计，LangGraph 可以帮助你构建真正智能、可控的 AI 应用！

希望这篇实战指南对你有帮助！
