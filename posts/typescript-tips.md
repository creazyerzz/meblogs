---
title: "TypeScript 实用技巧：让代码更安全"
date: "2026-03-20"
excerpt: "总结了一些日常开发中最实用的 TypeScript 技巧，包括类型守卫、工具类型、模板字面量类型等，帮助你写出更健壮的代码。"
tags: ["TypeScript", "前端"]
---

## 1. 类型守卫

类型守卫让你在条件分支中收窄类型：

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: string | number) {
  if (isString(value)) {
    // 这里 value 是 string
    console.log(value.toUpperCase())
  }
}
```

## 2. 工具类型

TypeScript 内置了很多实用的工具类型：

| 工具类型 | 作用 |
|---------|------|
| `Partial<T>` | 所有属性变为可选 |
| `Required<T>` | 所有属性变为必填 |
| `Pick<T, K>` | 选取部分属性 |
| `Omit<T, K>` | 排除部分属性 |
| `Record<K, V>` | 创建键值类型 |

## 3. 模板字面量类型

```typescript
type EventName = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<EventName>}`
// 结果: "onClick" | "onFocus" | "onBlur"
```

## 4. satisfies 运算符

`satisfies` 在保持类型推断的同时进行类型检查：

```typescript
const config = {
  port: 3000,
  host: 'localhost',
} satisfies Record<string, string | number>

// config.port 的类型仍然是 number，而不是 string | number
```

---

养成良好的 TypeScript 习惯，能大幅减少运行时错误。
