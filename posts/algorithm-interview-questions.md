---
title: "算法与数据结构面试题精选：LeetCode 高频题型总结"
date: "2026-03-18"
tags: ["算法", "数据结构", "面试", "LeetCode"]
excerpt: "总结算法面试中的高频题型，涵盖数组、链表、树、动态规划、回溯等核心知识点，配有详细思路分析和代码实现。"
---

## 一、数组与字符串

### 1.1 两数之和（LeetCode 1）

**题目：** 给定一个整数数组 nums 和一个目标值 target，找出和为目标值的两个数的下标。

**思路：** 使用哈希表 O(n) 解决

```python
def two_sum(nums, target):
    """
    时间复杂度: O(n)
    空间复杂度: O(n)
    """
    seen = {}  # 值 -> 下标
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []
```

**变体题：**
- 三数之和（LeetCode 15）
- 最接近的三数之和（LeetCode 16）

### 1.2 滑动窗口最大值（LeetCode 239）

**题目：** 给定数组 nums 和窗口大小 k，返回每个滑动窗口的最大值。

**思路：** 使用单调递减队列

```python
from collections import deque

def maxSlidingWindow(nums, k):
    """
    单调队列 - 队首永远是当前窗口最大值的下标
    时间复杂度: O(n)
    空间复杂度: O(k)
    """
    if not nums:
        return []
    
    result = []
    window = deque()  # 存储下标，保持递减
    
    for i in range(len(nums)):
        # 移除窗口外的元素
        while window and window[0] <= i - k:
            window.popleft()
        
        # 保持队列递减（新元素比队列中的都大就移除）
        while window and nums[window[-1]] <= nums[i]:
            window.pop()
        
        window.append(i)
        
        # 记录结果
        if i >= k - 1:
            result.append(nums[window[0]])
    
    return result
```

### 1.3 无重复字符的最长子串（LeetCode 3）

**题目：** 给定一个字符串，找出无重复字符的最长子串长度。

**思路：** 滑动窗口 + 哈希表

```python
def length_of_longest_substring(s):
    """
    双指针 + 哈希表
    时间复杂度: O(n)
    空间复杂度: O(min(m, n)) m为字符集大小
    """
    if not s:
        return 0
    
    char_index = {}  # 字符 -> 最新出现位置
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        # 如果字符在窗口内，左指针右移
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

---

## 二、链表

### 2.1 反转链表（LeetCode 206）

**题目：** 反转一个单链表。

**迭代解法：**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    """
    迭代法 - 三指针
    时间复杂度: O(n)
    空间复杂度: O(1)
    """
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next  # 保存下一个节点
        curr.next = prev       # 反转指针
        prev = curr           # prev 前移
        curr = next_temp      # curr 前移
    
    return prev
```

**递归解法：**
```python
def reverse_list_recursive(head):
    """
    递归法
    时间复杂度: O(n)
    空间复杂度: O(n) 调用栈深度
    """
    if not head or not head.next:
        return head
    
    new_head = reverse_list_recursive(head.next)
    head.next.next = head
    head.next = None
    
    return new_head
```

### 2.2 合并两个有序链表（LeetCode 21）

**题目：** 将两个有序链表合并为一个新的有序链表。

```python
def merge_two_lists(l1, l2):
    """
    虚拟头节点 + 双指针
    时间复杂度: O(n + m)
    空间复杂度: O(1)
    """
    dummy = ListNode(0)
    curr = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    
    curr.next = l1 or l2
    
    return dummy.next
```

### 2.3 环形链表检测（LeetCode 141）

**题目：** 判断链表中是否有环。

**快慢指针解法：**
```python
def has_cycle(head):
    """
    Floyd's Cycle Detection Algorithm
    快指针一次走两步，慢指针一次走一步
    如果有环，它们一定会相遇
    时间复杂度: O(n)
    空间复杂度: O(1)
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False
```

---

## 三、二叉树

### 3.1 二叉树的中序遍历（LeetCode 94）

**递归解法：**
```python
def inorder_traversal(root):
    """
    左 -> 根 -> 右
    时间复杂度: O(n)
    空间复杂度: O(n) 最坏情况（树呈链状）
    """
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    
    dfs(root)
    return result
```

**迭代解法：**
```python
def inorder_iterative(root):
    """
    使用栈模拟递归
    时间复杂度: O(n)
    空间复杂度: O(n)
    """
    result = []
    stack = []
    curr = root
    
    while curr or stack:
        # 一路左子树入栈
        while curr:
            stack.append(curr)
            curr = curr.left
        
        # 弹出栈顶，访问根
        curr = stack.pop()
        result.append(curr.val)
        
        # 切换到右子树
        curr = curr.right
    
    return result
```

### 3.2 二叉树的最大深度（LeetCode 104）

**DFS 解法：**
```python
def max_depth(root):
    """
    深度优先搜索
    时间复杂度: O(n)
    空间复杂度: O(n) 最坏情况（链状）
    """
    if not root:
        return 0
    
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

**BFS 解法：**
```python
from collections import deque

def max_depth_bfs(root):
    """
    广度优先搜索 - 层序遍历
    时间复杂度: O(n)
    空间复杂度: O(n) 队列
    """
    if not root:
        return 0
    
    depth = 0
    queue = deque([root])
    
    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return depth
```

### 3.3 验证二叉搜索树（LeetCode 98）

```python
def is_valid_bst(root):
    """
    利用 BST 的性质：左子树 < 根 < 右子树
    使用边界值进行验证
    时间复杂度: O(n)
    空间复杂度: O(n)
    """
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        
        if node.val <= low or node.val >= high:
            return False
        
        # 左子树的节点值必须小于当前节点
        # 右子树的节点值必须大于当前节点
        return (validate(node.left, low, node.val) and 
                validate(node.right, node.val, high))
    
    return validate(root)
```

---

## 四、动态规划

### 4.1 爬楼梯（LeetCode 70）

**题目：** 假设你正在爬楼梯，每次可以爬 1 或 2 个台阶，有多少种不同的方法爬到楼顶？

**状态转移方程：**
```
dp[i] = dp[i-1] + dp[i-2]
dp[1] = 1
dp[2] = 2
```

```python
def climb_stairs(n):
    """
    动态规划 - 空间优化
    时间复杂度: O(n)
    空间复杂度: O(1)
    """
    if n <= 2:
        return n
    
    prev1 = 1  # dp[i-1]
    prev2 = 2  # dp[i-2]
    
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev1 = prev2
        prev2 = curr
    
    return prev2
```

### 4.2 最长递增子序列（LeetCode 300）

**题目：** 找出数组中最长递增子序列的长度。

```python
def length_of_lis(nums):
    """
    动态规划 + 二分优化
    方法1: O(n²) - 纯 DP
    方法2: O(nlogn) - 二分查找
    
    这里使用二分查找优化版本
    """
    if not nums:
        return 0
    
    import bisect
    
    tails = []  # tails[i] 表示长度为 i+1 的递增子序列的最小结尾
    
    for num in nums:
        # 找到第一个 >= num 的位置
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```

**二分查找详解：**
```python
# tails 数组的特性
# 对于每个长度 len，tails[len-1] 存储的是该长度下最小的结尾值
# 例如：nums = [10, 9, 2, 5, 3, 7, 101, 18]
# 遍历过程：
# num=10: tails=[10]
# num=9:  tails=[9]      (替换10)
# num=2:  tails=[2]      (替换9)
# num=5:  tails=[2,5]    (新增)
# num=3:  tails=[2,3]    (替换5)
# num=7:  tails=[2,3,7]  (新增)
# num=101:tails=[2,3,7,101] (新增)
# num=18: tails=[2,3,7,18] (替换101)
# 结果: len(tails) = 4
```

### 4.3 背包问题

**0-1 背包：**
```python
def knapsack_01(weights, values, capacity):
    """
    0-1 背包问题
    每个物品只能选一次
    
    weights: 物品重量列表
    values:  物品价值列表
    capacity: 背包容量
    """
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                # 不选 or 选（取较大值）
                dp[i][w] = max(
                    dp[i-1][w],                           # 不选
                    dp[i-1][w-weights[i-1]] + values[i-1]  # 选
                )
            else:
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]
```

**空间优化版本：**
```python
def knapsack_01_optimized(weights, values, capacity):
    """
    空间优化：从后往前遍历，避免覆盖
    """
    n = len(weights)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

---

## 五、回溯算法

### 5.1 全排列（LeetCode 46）

```python
def permute(nums):
    """
    回溯算法 - 典型模板
    时间复杂度: O(n! * n)
    """
    result = []
    
    def backtrack(path, used):
        # 终止条件
        if len(path) == len(nums):
            result.append(path[:])  # 拷贝
            return
        
        # 选择列表
        for i in range(len(nums)):
            if used[i]:  # 已使用，跳过
                continue
            
            # 做选择
            used[i] = True
            path.append(nums[i])
            
            # 递归
            backtrack(path, used)
            
            # 撤销选择
            path.pop()
            used[i] = False
    
    backtrack([], [False] * len(nums))
    return result
```

### 5.2 组合总和（LeetCode 39）

**题目：** 给定一个无重复元素的数组 candidates 和一个目标数 target，找出所有和为 target 的组合。

```python
def combination_sum(candidates, target):
    """
    回溯 + 剪枝
    关键点：数组无重复，元素可以重复使用
    """
    result = []
    
    def backtrack(start, target, path):
        if target == 0:
            result.append(path[:])
            return
        
        if target < 0:
            return
        
        for i in range(start, len(candidates)):
            # 剪枝：跳过导致 target < 0 的元素
            if candidates[i] > target:
                continue
            
            path.append(candidates[i])
            # 关键：可以从同一位置继续选择（元素可重复）
            backtrack(i, target - candidates[i], path)
            path.pop()
    
    candidates.sort()  # 排序以便剪枝
    backtrack(0, target, [])
    return result
```

### 5.3 子集（LeetCode 78）

```python
def subsets(nums):
    """
    回溯求子集
    时间复杂度: O(2^n)
    """
    result = []
    
    def backtrack(start, path):
        # 每个节点都是一个子集
        result.append(path[:])
        
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

---

## 六、常见排序算法

### 6.1 快速排序

```python
import random

def quick_sort(arr):
    """
    快速排序
    平均时间复杂度: O(n log n)
    最坏时间复杂度: O(n²) - 数组基本有序时
    空间复杂度: O(log n)
    """
    def partition(low, high):
        # 随机选择 pivot，避免最坏情况
        pivot_idx = random.randint(low, high)
        arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]
        pivot = arr[high]
        
        i = low - 1
        
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    def sort(low, high):
        if low < high:
            pi = partition(low, high)
            sort(low, pi - 1)
            sort(pi + 1, high)
    
    if arr:
        sort(0, len(arr) - 1)
    
    return arr
```

### 6.2 归并排序

```python
def merge_sort(arr):
    """
    归并排序
    时间复杂度: O(n log n) 稳定
    空间复杂度: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

---

## 七、算法面试技巧

### 7.1 时间复杂度判定

| 常见情况 | 复杂度 | 示例 |
|---------|--------|------|
| 二分查找 | O(log n) | 二分搜索 |
| 遍历树/图 | O(n) | BST 遍历 |
| 双重循环 | O(n²) | 冒泡排序 |
| 排序+遍历 | O(n log n) | 归并排序 |
| 所有子集 | O(2^n) | 全排列 |
| 排列 n 个元素 | O(n!) | 旅行商问题 |

### 7.2 空间复杂度优化技巧

**从 O(n²) 优化到 O(n)：**
```python
# 不用额外数组
for i in range(n):
    dp[i] = dp[i-1] + dp[i-2]

# 替代
prev1, prev2 = 1, 2
for i in range(3, n+1):
    curr = prev1 + prev2
    prev1, prev2 = prev2, curr
```

### 7.3 面试四步法

1. **Clarify（明确问题）**
   - 数组是否有序？
   - 是否有重复元素？
   - 返回所有解还是最优解？

2. **Think Aloud（边想边说）**
   - 描述解题思路
   - 分析时间/空间复杂度
   - 讨论不同方案的权衡

3. **Code（写代码）**
   - 先写核心逻辑
   - 注意边界条件
   - 变量命名清晰

4. **Test（测试）**
   - 正常用例
   - 边界用例（空数组、单元素）
   - 极端用例（最大/最小值）

祝算法面试顺利！🍀
