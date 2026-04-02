---
title: "分布式系统面试题精选：从 CAP 到 Raft 算法"
date: "2026-03-19"
tags: ["分布式", "面试", "系统设计"]
excerpt: "深入解析分布式系统核心面试题，涵盖 CAP 理论、BASE 理论、一致性协议、Raft 算法等高频考点。"
---

## 一、CAP 理论

### 1.1 什么是 CAP 理论？

CAP 理论是分布式系统领域的核心理论，由 Eric Brewer 教授在 2000 年提出：

```
CAP = Consistency + Availability + Partition Tolerance
```

**三个核心特性：**

- **C (Consistency) 一致性**：所有节点在同一时间看到相同的数据
- **A (Availability) 可用性**：每个请求都能在有限时间内得到响应
- **P (Partition Tolerance) 分区容错性**：系统在网络分区时仍能运行

### 1.2 CAP 的核心结论

> **分布式系统只能满足 CAP 中的两个，无法同时满足三个。**

**为什么？**

网络分区（P）是必然发生的，因此必须在 C 和 A 之间权衡：

| 组合 | 说明 | 典型系统 |
|------|------|----------|
| **CP** | 保证一致性和分区容错，牺牲可用性 | Zookeeper、HBase |
| **AP** | 保证可用性和分区容错，允许短暂不一致 | Eureka、Cassandra |

### 1.3 CAP 的常见误解

**误解 1：CAP 是三选二**

实际上，分区容错（P）是分布式系统必须满足的，所以本质上是：**在一致性和可用性之间做权衡**。

**误解 2：CAP 意味着非此即彼**

现代系统通常采用**渐近式一致性**策略，在不同场景下动态调整一致性级别。

### 1.4 实际应用举例

**电商库存系统（CP）：**
```sql
-- 库存扣减必须强一致
BEGIN TRANSACTION;
SELECT stock FROM products WHERE id = 1 FOR UPDATE;
UPDATE products SET stock = stock - 1 WHERE id = 1;
COMMIT;
```

**商品展示系统（AP）：**
```python
# 使用本地缓存，允许短暂不一致
def get_product_info(product_id):
    cache = redis.get(f"product:{product_id}")
    if cache:
        return cache  # 返回可能稍旧的数据
    # 降级到默认展示
    return default_product
```

---

## 二、BASE 理论

### 2.1 BASE 理论是什么？

BASE 理论是对大规模互联网分布式系统实践的总结：

```
BASE = Basically Available + Soft State + Eventually Consistent
```

### 2.2 BASE 三要素

| 要素 | 含义 |
|------|------|
| **Basically Available** | 基本可用 | 系统在故障时保证核心功能可用 |
| **Soft State** | 软状态 | 允许数据在不同节点间存在中间状态 |
| **Eventually Consistent** | 最终一致性 | 系统在一定时间后达到一致状态 |

### 2.3 BASE vs ACID

| 特性 | ACID (传统数据库) | BASE (分布式系统) |
|------|-----------------|------------------|
| 一致性 | 强一致性 | 弱一致性 |
| 可用性 | 低 | 高 |
| 性能 | 相对较低 | 高 |
| 适用场景 | 金融、订单 | 互联网应用 |

### 2.4 实际应用：分布式事务

**Seata AT 模式：**
```yaml
# 全局事务配置
seata:
  tx-service-group: my_tx_group
  service:
    vgroup-mapping:
      my_tx_group: default
```

```java
@GlobalTransactional
public void placeOrder(Long userId, List<OrderItem> items) {
    // 1. 创建订单（本地事务）
    orderService.createOrder(items);
    
    // 2. 扣减库存（全局事务）
    inventoryService.decreaseStock(items);
    
    // 3. 扣减余额（全局事务）
    accountService.decreaseBalance(userId, totalAmount);
}
```

---

## 三、一致性协议

### 3.1 2PC（两阶段提交）

**阶段一：提交请求阶段**
```
协调者向所有参与者发送 Prepare 请求
参与者执行事务（不提交），记录 undo/redo 日志
参与者向协调者发送 Yes/No
```

**阶段二：提交执行阶段**
```
情况1（所有参与者都发送 Yes）：
  协调者发送 Commit 请求
  参与者提交事务，释放锁
  参与者发送 Ack
  协调者完成事务

情况2（任一参与者发送 No）：
  协调者发送 Rollback 请求
  参与者回滚事务
  参与者发送 Ack
  协调者完成回滚
```

**2PC 的问题：**
- ❌ 同步阻塞：参与者等待协调者消息期间锁定资源
- ❌ 单点故障：协调者崩溃会导致资源永久锁定
- ❌ 数据不一致：部分节点 Commit 后协调者崩溃

### 3.2 3PC（三阶段提交）

**改进点：引入超时机制和预提交阶段**

```
┌─────────────────────────────────────────────────────┐
│  CanCommit  →  PreCommit  →  DoCommit              │
│      ↓            ↓             ↓                   │
│  检查是否可以   发送预提交    执行提交或           │
│  执行事务       请求          回滚                 │
└─────────────────────────────────────────────────────┘
```

**解决的问题：**
- ✅ 减少阻塞时间
- ✅ 协调者崩溃后可自动提交或回滚

### 3.3 TCC（Try-Confirm-Cancel）

```java
@LocalTCC
public interface InventoryService {
    
    @Try(query = "SELECT stock FROM inventory WHERE product_id = ?")
    int checkStock(@BusinessContext Long productId);
    
    @Confirm(method = "confirmDecrease")
    boolean decreaseStock(@BusinessContext Long productId, int count);
    
    @Cancel(method = "cancelDecrease")
    boolean cancelDecrease(@BusinessContext Long productId, int count);
}
```

**TCC 的三个阶段：**
1. **Try**：预留资源（冻结库存）
2. **Confirm**：确认执行（真正扣减）
3. **Cancel**：取消执行（回滚冻结）

---

## 四、Raft 算法

### 4.1 Raft 是什么？

Raft 是一种易于理解的一致性算法，用于管理复制日志和选举领导者。

**Raft 的核心特性：**
- ✅ 强领导者（Strong Leader）
- ✅ 领导选举（Leader Election）
- ✅ 日志复制（Log Replication）

### 4.2 三种角色

```
┌──────────┐
│  Leader  │  ← 接受客户端请求，负责日志复制
└──────────┘
      ↓
┌──────────┐     ┌──────────┐
│ Follower │ ←→  │ Follower │  ← 接收领导者日志，保持一致
└──────────┘     └──────────┘
      ↑
┌──────────┐
│ Candidate│  ← 选举时的临时角色
└──────────┘
```

### 4.3 领导者选举

**选举触发条件：**
- Follower 在 `election timeout`（150~300ms）内未收到 Leader 心跳

**选举流程：**
```python
def start_election(self):
    # 1. 成为 Candidate
    self.state = 'candidate'
    self.current_term += 1
    self.voted_for = self.node_id
    
    # 2. 重置选举超时器
    self.reset_election_timer()
    
    # 3. 发送投票请求给其他节点
    for peer in self.peers:
        send_request_vote(peer, {
            'term': self.current_term,
            'last_log_index': self.last_log_index(),
            'last_log_term': self.last_log_term()
        })
```

**投票规则：**
- 每个 follower 只能投一票
- 优先投给日志比自己新的 candidate
- 获得多数票的 candidate 成为 leader

### 4.4 日志复制

**日志结构：**
```python
log_entry = {
    'term': 3,           # 日志项的任期号
    'index': 100,        # 日志索引
    'command': 'SET x=10' # 要执行的命令
}
```

**复制流程：**
```
Client          Leader          Follower1       Follower2
  │                │                │               │
  │──SET x=10────> │                │               │
  │                │──AppendEntries─┼─────────────>│
  │                │                │               │
  │                │<───Success─────┼──────────────│
  │                │                │               │
  │<───OK─────────│                │               │
  │                │                │               │
```

**一致性保证：**
- Raft 保证日志的连续性
- Leader 必须等待多数节点确认后才提交
- 被提交的日志不会被覆盖

### 4.5 常见面试题

**Q1：Raft 如何保证数据一致性？**

A：通过日志复制机制和领导者权威。
1. 所有写请求必须经过 Leader
2. Leader 先写本地日志，然后复制给 Followers
3. 必须多数节点写入成功才算提交
4. 新 Leader 必须包含所有已提交的日志

**Q2：Raft 如何处理网络分区？**

A：采用多数派投票机制。
- 5 节点集群：需要 3 票才能成为 Leader
- 网络分区后，只有包含多数节点的分区能选出 Leader
- 其他分区自动降级为 Follower，不接受写请求

**Q3：Raft 和 Paxos 的区别？**

| 维度 | Raft | Paxos |
|------|------|-------|
| 可理解性 | 易理解 | 难理解 |
| 领导者 | 强领导者 | 无固定领导者 |
| 实现难度 | 相对简单 | 复杂 |
| 应用 | etcd, Consul | Chubby |

---

## 五、分布式锁

### 5.1 为什么要分布式锁？

单机的 `synchronized` 无法跨 JVM 协调，需要分布式锁。

### 5.2 Redis 分布式锁

**基本实现：**
```python
def acquire_lock(lock_name, timeout=10):
    """获取锁"""
    result = redis.setnx(f"lock:{lock_name}", "1")
    if result:
        redis.expire(lock_name, timeout)
        return True
    return False

def release_lock(lock_name):
    """释放锁"""
    redis.delete(f"lock:{lock_name}")
```

**改进：防止误删他人锁**
```python
def acquire_lock(lock_name, timeout=10):
    """获取锁 - 原子操作"""
    result = redis.set(
        f"lock:{lock_name}", 
        str(uuid.uuid4()),  # 锁的值
        nx=True,            # 不存在才设置
        ex=timeout          # 自动过期
    )
    return result

def release_lock(lock_name, value):
    """释放锁 - Lua 脚本保证原子性"""
    lua_script = """
    if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
    else
        return 0
    end
    """
    redis.eval(lua_script, 1, lock_name, value)
```

### 5.3 Redisson 分布式锁

```java
@Configuration
public class RedissonConfig {
    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
              .setAddress("redis://127.0.0.1:6379");
        return Redisson.create(config);
    }
}

// 使用分布式锁
@Service
public class OrderService {
    @Autowired
    private RedissonClient redisson;
    
    public void createOrder(Long productId) {
        RLock lock = redisson.getLock("order:lock:" + productId);
        try {
            // 尝试获取锁，等待10秒，锁定30秒
            lock.lock(30, TimeUnit.SECONDS);
            
            // 业务逻辑
            // ...
            
        } finally {
            lock.unlock();
        }
    }
}
```

---

## 六、总结

### 核心知识点回顾

| 模块 | 核心概念 | 面试重点 |
|------|----------|----------|
| CAP 理论 | C/A/P 三选二 | CP vs AP 权衡 |
| BASE 理论 | 弱一致性换取可用性 | 实际应用场景 |
| 2PC/3PC | 两阶段/三阶段提交 | 优缺点对比 |
| TCC | 预留-确认-取消 | 与 2PC 的区别 |
| Raft | 领导者选举+日志复制 | 选举流程、日志一致性 |
| 分布式锁 | Redis/Redisson | 原子性、续期、死锁 |

### 面试技巧

1. **结合项目经验**：描述实际使用场景，比背概念更有效
2. **对比方案优缺点**：不仅要知其然，还要知其所以然
3. **画图辅助说明**：复杂协议用图示更清晰
4. **关注最新发展**：如 Raft 的优化变体、共识协议新趋势

祝面试顺利！🍀
