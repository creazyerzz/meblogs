---
title: "Java 后端面试题精选：高频问题汇总"
date: "2026-03-20"
tags: ["Java", "面试", "后端"]
excerpt: "整理 Java 后端开发面试中的高频问题，涵盖 Java 基础、并发编程、Spring 框架、JVM 等核心知识点。"
---

## 一、Java 基础

### 1.1 Java 和 C++ 的区别？

**核心区别：**
- **内存管理**：Java 有自动垃圾回收机制，C++ 需要手动管理内存
- **指针**：Java 没有指针概念，C++ 支持指针操作
- **多重继承**：Java 不支持多重继承（但支持接口），C++ 支持
- **平台无关性**：Java 通过 JVM 实现一次编写，到处运行；C++ 需要针对不同平台编译

### 1.2 == 和 equals() 的区别？

```java
// 基本类型比较
int a = 10;
int b = 10;
a == b  // true，比较值

// 引用类型比较
String s1 = new String("hello");
String s2 = new String("hello");
s1 == s2      // false，比较地址
s1.equals(s2) // true，比较内容
```

**重要结论：**
- `==`：比较引用地址（基本类型比较值）
- `equals()`：默认比较地址，可被重写比较内容
- String 类重写了 equals()，比较字符串内容

### 1.3 final、finally、finalize 的区别？

- **final**：修饰类、方法和变量，表示不可改变
- **finally**：try-catch 块的一部分，无论是否异常都会执行
- **finalize()**：Object 类的方法，垃圾回收前调用，不推荐使用

---

## 二、并发编程

### 2.1 线程和进程的区别？

| 维度 | 进程 | 线程 |
|------|------|------|
| 定义 | 程序的一次执行 | CPU 调度的基本单位 |
| 资源 | 独立的内存空间 | 共享进程资源 |
| 开销 | 大（独立地址空间） | 小（共享堆内存） |
| 通信 | 复杂（管道、消息队列等） | 简单（共享内存） |
| 独立性 | 独立，一个崩溃不影响其他 | 共享资源，一个崩溃可能导致进程崩溃 |

### 2.2 创建线程的方式？

1. **继承 Thread 类**
```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("继承 Thread");
    }
}
```

2. **实现 Runnable 接口**
```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("实现 Runnable");
    }
}
```

3. **实现 Callable 接口（带返回值）**
```java
class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "实现 Callable";
    }
}
```

4. **线程池创建**
```java
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.execute(() -> System.out.println("线程池"));
```

### 2.3 synchronized 和 ReentrantLock 的区别？

| 特性 | synchronized | ReentrantLock |
|------|-------------|---------------|
| 锁类型 | 隐式锁 | 显式锁 |
| 等待可中断 | 不可 | 可中断（tryLock） |
| 公平锁 | 非公平 | 可选公平/非公平 |
| 锁绑定条件 | 不支持 | 支持多个条件（Condition） |
| 可重入 | 支持 | 支持 |

```java
// ReentrantLock 示例
ReentrantLock lock = new ReentrantLock(true); // true 表示公平锁
try {
    lock.lock();
    // 业务逻辑
} finally {
    lock.unlock();
}
```

### 2.4 线程池的核心参数？

```java
public ThreadPoolExecutor(
    int corePoolSize,        // 核心线程数
    int maximumPoolSize,     // 最大线程数
    long keepAliveTime,      // 空闲线程存活时间
    TimeUnit unit,           // 时间单位
    BlockingQueue<Runnable> workQueue,  // 任务队列
    ThreadFactory threadFactory,          // 线程工厂
    RejectedExecutionHandler handler     // 拒绝策略
)
```

**工作流程：**
1. 线程数 < corePoolSize → 创建核心线程
2. 线程数 >= corePoolSize → 放入队列
3. 队列满且线程数 < maximumPoolSize → 创建临时线程
4. 队列满且线程数 = maximumPoolSize → 执行拒绝策略

---

## 三、Spring 框架

### 3.1 Spring Bean 的生命周期？

```
实例化 → 属性填充 → BeanNameAware → BeanFactoryAware 
→ ApplicationContextAware → BeanPostProcessor(前置)
→ InitializingBean/自定义init → BeanPostProcessor(后置)
→ 使用 → DisposableBean/自定义destroy → 销毁
```

**关键回调方法：**
- `@PostConstruct`：构造后初始化
- `@PreDestroy`：销毁前清理
- `InitializingBean.afterPropertiesSet()`
- `DisposableBean.destroy()`

### 3.2 Spring Bean 的作用域？

| 作用域 | 说明 |
|--------|------|
| singleton | 单例（默认） |
| prototype | 每次请求创建新实例 |
| request | HTTP 请求作用域（Web） |
| session | HTTP 会话作用域（Web） |
| application | ServletContext 作用域（Web） |

### 3.3 Spring 事务传播行为？

```java
// 7 种传播行为
REQUIRED      // 支持当前事务，不存在则创建新事务（默认）
SUPPORTS      // 支持当前事务，不存在则以非事务执行
MANDATORY     // 必须有事务，否则抛异常
REQUIRES_NEW  // 挂起当前事务，创建新事务
NOT_SUPPORTED // 以非事务执行，挂起当前事务
NEVER         // 必须没有事务，否则抛异常
NESTED        // 嵌套事务（Savepoint）
```

### 3.4 @Autowired 和 @Resource 的区别？

| 特性 | @Autowired | @Resource |
|------|-----------|----------|
| 来源 | Spring 特有 | Java 标准（JSR-250） |
| 注入方式 | 按类型 | 按名称（默认） |
| required 属性 | 支持 | 不支持 |
| 匹配失败 | 抛异常 | 回退到按类型 |

---

## 四、JVM

### 4.1 JVM 内存区域？

```
堆（Heap）
├── 新生代（Eden + Survivor0 + Survivor1）
└── 老年代（Old Generation）

虚拟机栈（VM Stack）
└── 栈帧（Stack Frame）
    ├── 局部变量表
    ├── 操作数栈
    ├── 动态链接
    └── 方法返回地址

本地方法栈（Native Method Stack）
程序计数器（Program Counter Register）
方法区（Method Area）- 1.8 后改为元空间
└── 运行时常量池
```

### 4.2 什么情况下会触发 Full GC？

1. **老年代空间不足**
2. **System.gc()** 调用（不一定立即执行）
3. **MetaSpace 空间不足**
4. **CMS GC 时 Survivor 区放不下对象**
5. **对象分配担保失败**

### 4.3 常见垃圾回收器？

| 回收器 | 区域 | 算法 | 特点 |
|--------|------|------|------|
| Serial | 新生代 | 复制 | 单线程，简单高效 |
| ParNew | 新生代 | 复制 | 多线程版本 |
| Parallel Scavenge | 新生代 | 复制 | 吞吐量优先 |
| Serial Old | 老年代 | 标记-整理 | 单线程 |
| Parallel Old | 老年代 | 标记-整理 | 多线程，吞吐量优先 |
| CMS | 老年代 | 标记-清除 | 并发收集，低停顿 |
| G1 | 新生代+老年代 | 标记-整理+复制 | 可预测停顿 |
| ZGC | 新生代+老年代 | 标记-整理 | 低停顿（<1ms） |

---

## 五、设计模式

### 5.1 单例模式的实现？

**饿汉式（线程安全）**
```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() {}
    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

**懒汉式（双重检查锁）**
```java
public class Singleton {
    private static volatile Singleton INSTANCE;
    private Singleton() {}
    public static Singleton getInstance() {
        if (INSTANCE == null) {
            synchronized (Singleton.class) {
                if (INSTANCE == null) {
                    INSTANCE = new Singleton();
                }
            }
        }
        return INSTANCE;
    }
}
```

### 5.2 Spring 中用到的设计模式？

- **单例模式**：Spring Bean 默认单例
- **工厂模式**：BeanFactory
- **代理模式**：AOP
- **观察者模式**：ApplicationEvent
- **模板方法模式**：JdbcTemplate
- **策略模式**：Resource 接口实现

---

## 总结

以上是 Java 后端面试中最常被问到的问题。建议：
1. **理解原理**：不仅要知道是什么，还要知道为什么
2. **动手实践**：用代码验证每个知识点
3. **形成体系**：将知识点串联成知识网络
4. **持续更新**：技术不断迭代，保持学习

祝面试顺利！🍀
