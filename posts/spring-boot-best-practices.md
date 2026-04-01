---
title: 'Spring Boot 最佳实践：从入门到精通'
date: '2026-03-25'
excerpt: '总结 Spring Boot 开发中的最佳实践，包括配置管理、异常处理、性能优化等方面'
tags: ['Java', 'Spring Boot', '后端开发', '最佳实践']
---

## 前言

Spring Boot 已成为 Java 后端开发的事实标准。本文总结了在实际项目中积累的 Spring Boot 最佳实践，帮助你写出更优雅、更高效的代码。

## 1. 项目结构最佳实践

### 推荐的项目结构

```
src/main/java/com/example/myapp/
├── MyApplication.java
├── config/           # 配置类
├── controller/       # 控制层
├── service/          # 业务层
├── repository/       # 数据访问层
├── entity/           # 实体类
├── dto/              # 数据传输对象
├── exception/        # 异常处理
└── util/             # 工具类
```

### 分层职责

- **Controller**：处理请求参数校验、调用 Service、返回响应
- **Service**：处理业务逻辑、事务管理
- **Repository**：数据访问、数据库操作

## 2. 配置管理

### 多环境配置

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db
  redis:
    host: localhost

# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/prod_db
  redis:
    host: prod-redis
```

### 配置属性类

```java
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private Integer maxCacheSize;
    
    // getters and setters
}
```

## 3. 统一异常处理

### 全局异常处理器

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        return Result.error(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<?> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldError()
            .getDefaultMessage();
        return Result.error(400, message);
    }
    
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error(500, "系统繁忙，请稍后重试");
    }
}
```

### 自定义业务异常

```java
public class BusinessException extends RuntimeException {
    private final int code;
    
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}
```

## 4. API 统一响应格式

```java
@Data
public class Result<T> {
    private int code;
    private String message;
    private T data;
    private long timestamp;
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
    
    public static <T> Result<T> error(int code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }
}
```

## 5. 数据库最佳实践

### MyBatis-Plus 实战

```java
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public Page<User> queryUsers(int page, int size) {
        return userMapper.selectPage(
            new Page<>(page, size),
            new LambdaQueryWrapper<User>()
                .eq(User::getStatus, 1)
                .orderByDesc(User::getCreateTime)
        );
    }
    
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void createUser(UserDTO dto) {
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        userMapper.insert(user);
    }
}
```

## 6. 性能优化

### 数据库连接池配置

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

### 使用缓存

```java
@Service
public class UserService {
    
    @Cacheable(value = "user", key = "#id")
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
    
    @CacheEvict(value = "user", key = "#id")
    public void updateUser(Long id, UserDTO dto) {
        // 更新逻辑
    }
}
```

## 7. 日志管理

### 推荐使用 SLF4J + Logback

```xml
<!-- logback-spring.xml -->
<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/application.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>logs/application.%d{yyyy-MM-dd}.log</fileNamePattern>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
</appender>
```

### 统一日志格式

```yaml
logging:
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

## 8. 安全建议

### 防止 SQL 注入

```java
// 使用参数化查询（MyBatis 默认支持）
@Select("SELECT * FROM user WHERE username = #{username}")
User findByUsername(String username);
```

### 输入校验

```java
@PostMapping("/create")
public Result<?> createUser(@Valid @RequestBody UserDTO dto) {
    // 处理逻辑
}
```

## 总结

1. **结构清晰**：遵循标准分层架构
2. **配置分离**：多环境配置管理
3. **异常统一**：全局异常处理
4. **响应统一**：标准化 API 响应格式
5. **性能优化**：合理使用缓存、连接池
6. **日志规范**：统一日志格式，便于排查问题
7. **安全第一**：防止注入攻击，做好输入校验

希望这些最佳实践能帮助你构建更优质的 Spring Boot 应用！
