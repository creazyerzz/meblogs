---
title: '分布式系统唯一ID生成方案深度对比'
date: '2026-03-20'
excerpt: '全面解析 UUID、雪花算法、Leaf、ULID 等分布式 ID 生成方案的原理、优缺点及适用场景'
tags: ['分布式', 'ID生成', '雪花算法', '系统设计']
---

## 前言

在分布式系统中，生成全局唯一 ID 是一个基础但重要的问题。不同的业务场景对 ID 有不同的要求：有的需要趋势递增，有的需要包含时间信息，有的需要可排序。本文将全面对比主流的分布式 ID 生成方案。

## 为什么需要分布式 ID？

### 传统方案的局限

- **数据库自增 ID**：单库没问题，多库无法保证唯一性
- **UUID**：无序、占用空间大、可读性差
- **本地时间戳**：多节点冲突、并发不安全

### 分布式 ID 的要求

1. **全局唯一**：跨机器、跨库必须唯一
2. **趋势递增**：适合 MySQL B+Tree 索引优化
3. **信息安全**：避免ID被猜测
4. **高性能**：QPS 要达到百万级别
5. **可用性**：服务挂掉不能影响业务

## 主流方案对比

| 方案 | 唯一性 | 有序性 | 性能 | 存储 | 依赖 |
|------|--------|--------|------|------|------|
| UUID | ✅ | ❌ | 高 | 36字节 | 无 |
| 雪花算法 | ✅ | ✅ | 高 | 8字节 | 无 |
| 数据库号段 | ✅ | ✅ | 高 | 8字节 | 数据库 |
| Redis INCR | ✅ | ✅ | 高 | 8字节 | Redis |
| Leaf | ✅ | ✅ | 高 | 8字节 | ZK/MySQL |

## 1. UUID

### 原理

```java
import java.util.UUID;

public class UUIDGenerator {
    public static String generate() {
        return UUID.randomUUID().toString();
    }
    
    // 示例：550e8400-e29b-41d4-a716-446655440000
}
```

### 变体

```java
// 无横杠版本（22字节，Base64编码）
public static String generateCompactUUID() {
    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(UUID.randomUUID().toString().getBytes());
}

// 转为 long（仅适用于 UUID v1）
public static long uuidToLong(UUID uuid) {
    return uuid.getMostSignificantBits();
}
```

### 优缺点

**优点**：
- ✅ 实现简单，无依赖
- ✅ 全球唯一性保证

**缺点**：
- ❌ 无序，插入 InnoDB 会导致页分裂
- ❌ 存储空间大（MySQL 用 VARCHAR(36) 或 CHAR(36)）
- ❌ 可读性差，调试困难
- ❌ 随机 I/O，范围查询性能差

### 适用场景

- ✅ 日志追踪 ID
- ✅ 临时文件名
- ❌ 数据库主键（性能差）
- ❌ 订单号（可被猜测）

## 2. 雪花算法（Snowflake）

### 原理

```
┌──────────────┬──────────────┬────────────┬───────────┬──────────┐
│   符号位      │    时间戳     │   机器ID   │  序列号    │  总位数   │
│   1 bit      │   41 bits    │  10 bits   │  12 bits  │  64 bits │
└──────────────┴──────────────┴────────────┴───────────┴──────────┘
```

### Java 实现

```java
public class SnowflakeIdGenerator {
    private final long twepoch = 1609459200000L; // 2021-01-01
    private final long workerIdBits = 10L;
    private final long sequenceBits = 12L;
    
    private final long maxWorkerId = ~(-1L << workerIdBits);
    private final long workerId;
    private final long sequenceMask = ~(-1L << sequenceBits);
    
    private long lastTimestamp = -1L;
    private long sequence = 0L;
    
    public SnowflakeIdGenerator(long workerId) {
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException("workerId 超出范围");
        }
        this.workerId = workerId;
    }
    
    public synchronized long nextId() {
        long timestamp = timeGen();
        
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("时钟回拨");
        }
        
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & sequenceMask;
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0L;
        }
        
        lastTimestamp = timestamp;
        
        return ((timestamp - twepoch) << 22) 
             | (workerId << 12) 
             | sequence;
    }
    
    private long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }
    
    private long timeGen() {
        return System.currentTimeMillis();
    }
}
```

### 时钟回拨处理

```java
// 方案1：等待恢复
public synchronized long nextId() {
    long timestamp = timeGen();
    if (timestamp < lastTimestamp) {
        try {
            Thread.sleep(lastTimestamp - timestamp);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        timestamp = timeGen();
    }
    // ... 继续生成
}

// 方案2：兜底序列号
public synchronized long nextId() {
    long timestamp = timeGen();
    if (timestamp < lastTimestamp) {
        // 使用兜底序列号，允许短暂重复
        return lastTimestamp + 1;
    }
    // ... 继续生成
}
```

### 优缺点

**优点**：
- ✅ 有序递增，适合数据库索引
- ✅ 64位整数，存储高效
- ✅ 性能高，本地生成无网络开销
- ✅ 可包含时间戳和机器 ID

**缺点**：
- ❌ 强依赖服务器时钟
- ❌ 时钟回拨会导致问题
- ❌ 跨机房部署需要协调

### 适用场景

- ✅ 数据库主键
- ✅ 订单号（需加密）
- ✅ 分布式任务 ID

## 3. 数据库号段模式

### 原理

```
┌─────────┐      ┌─────────────┐      ┌────────────┐
│  Client │ ──── │  ID Gen     │ ──── │  Database  │
│         │ 拿号段 │  Service    │ 更新号段 │            │
│         │ ◄──── │             │ ◄──── │            │
└─────────┘      └─────────────┘      └────────────┘
```

### 数据库设计

```sql
CREATE TABLE id_generator (
    biz_tag VARCHAR(64) PRIMARY KEY,  -- 业务标识
    max_id BIGINT NOT NULL,           -- 当前最大ID
    step INT NOT NULL,                 -- 号段步长
    version INT NOT NULL DEFAULT 0,   -- 乐观锁版本
    gmt_modified TIMESTAMP NOT NULL
);

-- 初始化
INSERT INTO id_generator (biz_tag, max_id, step, version)
VALUES ('order', 0, 1000, 0);
```

### Java 实现

```java
@Service
public class SegmentIdGenerator {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // 本地缓存的号段
    private final Map<String, Segment> segments = new ConcurrentHashMap<>();
    
    public long getNextId(String bizTag) {
        Segment segment = segments.computeIfAbsent(bizTag, this::loadSegment);
        
        if (segment.getCurrent() >= segment.getMax()) {
            segment = loadSegment(bizTag); // 双检锁更新
        }
        
        return segment.getAndIncrement();
    }
    
    private Segment loadSegment(String bizTag) {
        synchronized (Segment.class) {
            Segment current = segments.get(bizTag);
            if (current != null && current.getCurrent() < current.getMax()) {
                return current;
            }
            
            // 更新数据库号段
            long newMax = updateAndGetMaxId(bizTag);
            Segment newSegment = new Segment(
                bizTag, 
                newMax - 1000 + 1,  // 新号段起始值
                newMax              // 新号段结束值
            );
            segments.put(bizTag, newSegment);
            return newSegment;
        }
    }
    
    private long updateAndGetMaxId(String bizTag) {
        return jdbcTemplate.execute((Connection conn) -> {
            conn.setAutoCommit(false);
            
            // 获取当前值
            PreparedStatement ps = conn.prepareStatement(
                "SELECT max_id, step FROM id_generator WHERE biz_tag = ? FOR UPDATE"
            );
            ps.setString(1, bizTag);
            ResultSet rs = ps.executeQuery();
            rs.next();
            long currentMax = rs.getLong("max_id");
            long step = rs.getLong("step");
            
            // 更新为新值
            PreparedStatement update = conn.prepareStatement(
                "UPDATE id_generator SET max_id = ? WHERE biz_tag = ?"
            );
            update.setLong(1, currentMax + step);
            update.setString(2, bizTag);
            update.executeUpdate();
            
            conn.commit();
            return currentMax + step;
        });
    }
    
    @Data
    private static class Segment {
        private String bizTag;
        private AtomicLong current;
        private long max;
        
        public long getAndIncrement() {
            return current.getAndIncrement();
        }
    }
}
```

### 优缺点

**优点**：
- ✅ 数据库简单，运维成本低
- ✅ 性能好，每次批量获取 ID
- ✅ 支持多业务线（不同 biz_tag）

**缺点**：
- ❌ 依赖数据库
- ❌ 数据库故障影响 ID 生成
- ❌ 号段用完前需要更新

### 适用场景

- ✅ 多业务线 ID 生成
- ✅ ID 包含业务含义
- ✅ 需要严格递增

## 4. Redis INCR

### 原理

```java
@Service
public class RedisIdGenerator {
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    public long getNextId(String key) {
        return redisTemplate.opsForValue().increment(key);
    }
    
    // 支持设置起始值和步长
    public long getNextIdWithStep(String key, long step) {
        return redisTemplate.opsForValue().increment(key, step);
    }
}
```

### 结合雪花算法

```java
public class RedisSnowflakeIdGenerator {
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    private final long workerId;
    
    public RedisSnowflakeIdGenerator(long workerId) {
        this.workerId = workerId;
    }
    
    public long getNextId() {
        long timestamp = System.currentTimeMillis() - TW_EPOCH;
        long sequence = redisTemplate.opsForValue().increment("snowflake:sequence");
        
        return (timestamp << 22) | (workerId << 12) | (sequence & 0xfff);
    }
}
```

### 优缺点

**优点**：
- ✅ Redis 性能高
- ✅ 支持集群
- ✅ 可设置过期时间自动清理

**缺点**：
- ❌ 依赖 Redis
- ❌ 需要注意 Redis 主从切换

## 5. ULID

### 原理

```
┌────────────────────────────────────────┐
│         ULID (26字符)                    │
├────────────────────────────────────────┤
│ Timestamp (48bits)  Random (80bits)    │
│ 01ARZ3NDEKTSV4RRFFQ69G5FAV              │
└────────────────────────────────────────┘
```

### 优势

```java
import com.github.f4b6a3.ulid2.UlidCreator;

// 生成 ULID
String ulid = UlidCreator.getUlid(); // 01ARZ3NDEKTSV4RRFFQ69G5FAV

// 获取时间戳
Instant instant = Ulid.from(ulid).getInstant();

// 优势：可排序、UUID 替代方案
```

**优点**：
- ✅ 可排序（时间戳在前）
- ✅ 128位，兼容 UUID
- ✅ 更短（26字符 vs 36字符）
- ✅ 时间戳毫秒精度

## 方案选型建议

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 简单独立服务 | UUID | 无依赖，实现简单 |
| 数据库主键 | Snowflake | 有序、紧凑、高性能 |
| 多业务线 | 数据库号段 | 统一管理、可追溯 |
| 需要可排序 | ULID | 时间在前、兼容 UUID |
| 高可用要求 | Redis + Snowflake | 抗单点、灵活 |

## 实践总结

1. **小项目**：直接使用雪花算法，简单有效
2. **大项目**：考虑 Leaf 等成熟方案，支持集群和监控
3. **订单号**：雪花算法 + 加密，防泄漏
4. **日志追踪**：UUID，简单直接
5. **多业务**：数据库号段，统一管理

希望这篇对比分析能帮助你在实际项目中做出正确的选择！
