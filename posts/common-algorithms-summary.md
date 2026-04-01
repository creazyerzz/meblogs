---
title: '算法工程师必备：十大经典排序算法总结'
date: '2026-03-18'
excerpt: '全面总结冒泡排序、插入排序、归并排序、快速排序等经典排序算法，包含原理、代码实现和时间复杂度分析'
tags: ['算法', '排序', '数据结构', '面试']
---

## 前言

排序算法是计算机科学中最基础也是最重要的算法之一。无论是面试还是实际开发中，排序算法都是必备知识。本文将全面介绍十大经典排序算法。

## 算法分类

```
┌─────────────────────────────────────────────────┐
│                 排序算法分类                     │
├─────────────────────────────────────────────────┤
│  比较排序：                                       │
│  ├─ O(n²)：冒泡、选择、插入                       │
│  ├─ O(n log n)：归并、快速、堆排序                │
│  └─ 希尔排序（O(n^1.3)）                          │
│                                                 │
│  非比较排序：                                     │
│  ├─ 计数排序 O(n + k)                            │
│  ├─ 桶排序 O(n + k)                             │
│  └─ 基数排序 O(nk)                               │
└─────────────────────────────────────────────────┘
```

## 1. 冒泡排序（Bubble Sort）

### 原理

相邻元素两两比较，大的元素逐步"冒泡"到数组末端。

### 代码实现

```java
public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        // 优化：如果没有交换，说明已经有序
        if (!swapped) break;
    }
}
```

### 特点

- **时间复杂度**：O(n²)，最好 O(n)
- **空间复杂度**：O(1)
- **稳定性**：✅ 稳定
- **适用场景**：教学、基本理解

## 2. 选择排序（Selection Sort）

### 原理

从未排序部分选择最小（或最大）元素，放到已排序部分末尾。

### 代码实现

```java
public void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        // 交换
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}
```

### 特点

- **时间复杂度**：O(n²)
- **空间复杂度**：O(1)
- **稳定性**：❌ 不稳定（如 5,5,3 会改变相同值的相对位置）
- **特点**：交换次数最少

## 3. 插入排序（Insertion Sort）

### 原理

将元素逐个插入到已排序部分的合适位置。

### 代码实现

```java
public void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // 将比 key 大的元素向后移动
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

### 特点

- **时间复杂度**：O(n²)，最好 O(n)
- **空间复杂度**：O(1)
- **稳定性**：✅ 稳定
- **特点**：对近乎有序的数据性能好

## 4. 希尔排序（Shell Sort）

### 原理

是插入排序的改进版，通过设置步长来减少元素移动次数。

### 代码实现

```java
public void shellSort(int[] arr) {
    int n = arr.length;
    
    // 初始步长
    for (int gap = n / 2; gap > 0; gap /= 2) {
        // 对每个步长进行插入排序
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}
```

### 特点

- **时间复杂度**：O(n^1.3)
- **空间复杂度**：O(1)
- **稳定性**：❌ 不稳定

## 5. 归并排序（Merge Sort）

### 原理

分治法，将数组分成两半，分别排序后合并。

### 代码实现

```java
public void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
        
        // 分治
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // 合并
        merge(arr, left, mid, right);
    }
}

private void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    
    // 合并两个有序数组
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }
    
    // 处理剩余元素
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    // 复制回原数组
    System.arraycopy(temp, 0, arr, left, temp.length);
}
```

### 特点

- **时间复杂度**：O(n log n)
- **空间复杂度**：O(n)
- **稳定性**：✅ 稳定
- **特点**：适合链表、外部排序

## 6. 快速排序（Quick Sort）

### 原理

选择基准元素，将数组分为两部分，递归排序。

### 代码实现

```java
public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

private void swap(int[] arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

### 优化版本

```java
// 三数取中优化
private int partition(int[] arr, int low, int high) {
    int mid = low + (high - low) / 2;
    
    // 三数取中
    if (arr[low] > arr[high]) swap(arr, low, high);
    if (arr[mid] > arr[high]) swap(arr, mid, high);
    if (arr[mid] > arr[low]) swap(arr, mid, low);
    
    int pivot = arr[low];
    
    // 双指针
    int i = low, j = high;
    while (i < j) {
        while (i < j && arr[--j] >= pivot);
        if (i < j) arr[i] = arr[j];
        while (i < j && arr[++i] <= pivot);
        if (i < j) arr[j] = arr[i];
    }
    arr[i] = pivot;
    return i;
}
```

### 特点

- **时间复杂度**：O(n log n)，最坏 O(n²)
- **空间复杂度**：O(log n)
- **稳定性**：❌ 不稳定
- **特点**：实际应用中速度最快

## 7. 堆排序（Heap Sort）

### 原理

利用堆这种数据结构进行排序。

### 代码实现

```java
public void heapSort(int[] arr) {
    int n = arr.length;
    
    // 构建最大堆
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // 逐个提取元素
    for (int i = n - 1; i > 0; i--) {
        // 将堆顶移到末尾
        swap(arr, 0, i);
        // 调整堆
        heapify(arr, i, 0);
    }
}

private void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr, i, largest);
        heapify(arr, n, largest);
    }
}
```

### 特点

- **时间复杂度**：O(n log n)
- **空间复杂度**：O(1)
- **稳定性**：❌ 不稳定

## 8. 计数排序（Counting Sort）

### 原理

统计每个元素出现次数，根据计数数组确定位置。

### 代码实现

```java
public void countingSort(int[] arr) {
    // 找到最大值和最小值
    int max = Arrays.stream(arr).max().getAsInt();
    int min = Arrays.stream(arr).min().getAsInt();
    
    int range = max - min + 1;
    int[] count = new int[range];
    int[] output = new int[arr.length];
    
    // 统计频率
    for (int value : arr) {
        count[value - min]++;
    }
    
    // 计算前缀和（确定位置）
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // 构建输出数组（倒序保证稳定性）
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    
    System.arraycopy(output, 0, arr, 0, arr.length);
}
```

### 特点

- **时间复杂度**：O(n + k)
- **空间复杂度**：O(k)
- **稳定性**：✅ 稳定
- **限制**：需要知道数据范围

## 9. 桶排序（Bucket Sort）

### 原理

将数据分配到有限数量的桶中，对每个桶内部排序。

### 代码实现

```java
public void bucketSort(int[] arr, int bucketSize) {
    int max = Arrays.stream(arr).max().getAsInt();
    int min = Arrays.stream(arr).min().getAsInt();
    
    int bucketCount = (max - min) / bucketSize + 1;
    List<List<Integer>> buckets = new ArrayList<>(bucketCount);
    
    // 初始化桶
    for (int i = 0; i < bucketCount; i++) {
        buckets.add(new ArrayList<>());
    }
    
    // 分配元素到桶
    for (int value : arr) {
        int bucketIndex = (value - min) / bucketSize;
        buckets.get(bucketIndex).add(value);
    }
    
    // 对每个桶排序并合并
    int index = 0;
    for (List<Integer> bucket : buckets) {
        Collections.sort(bucket);
        for (int value : bucket) {
            arr[index++] = value;
        }
    }
}
```

### 特点

- **时间复杂度**：O(n + k)
- **空间复杂度**：O(n + k)
- **特点**：适合均匀分布的数据

## 10. 基数排序（Radix Sort）

### 原理

按位数逐个排序，从低位到高位。

### 代码实现

```java
public void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    
    // 从个位开始，逐位排序
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

private void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n];
    int[] count = new int[10];
    
    // 统计频率
    for (int i = 0; i < n; i++) {
        int digit = (arr[i] / exp) % 10;
        count[digit]++;
    }
    
    // 前缀和
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // 构建输出（倒序保证稳定性）
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    
    System.arraycopy(output, 0, arr, 0, n);
}
```

### 特点

- **时间复杂度**：O(nk)
- **空间复杂度**：O(n + k)
- **稳定性**：✅ 稳定

## 算法对比总结

| 算法 | 时间复杂度 | 空间复杂度 | 稳定性 |
|------|-----------|-----------|--------|
| 冒泡排序 | O(n²) | O(1) | ✅ |
| 选择排序 | O(n²) | O(1) | ❌ |
| 插入排序 | O(n²) | O(1) | ✅ |
| 希尔排序 | O(n^1.3) | O(1) | ❌ |
| 归并排序 | O(n log n) | O(n) | ✅ |
| 快速排序 | O(n log n) | O(log n) | ❌ |
| 堆排序 | O(n log n) | O(1) | ❌ |
| 计数排序 | O(n + k) | O(k) | ✅ |
| 桶排序 | O(n + k) | O(n + k) | ✅ |
| 基数排序 | O(nk) | O(n + k) | ✅ |

## 面试常问问题

### Q1: 什么情况下快速排序比归并排序快？

- 快速排序的内部循环效率高
- 缓存命中率高（数据局部性）
- 最坏情况少见

### Q2: 为什么 JDK 的 Arrays.sort() 采用归并排序？

- JDK 对小数组（<47）使用插入排序
- 对大数组使用归并排序的改进版（TimSort）
- 保证最坏情况下的 O(n log n)

### Q3: 如何选择排序算法？

```java
public void chooseSort(int[] arr) {
    if (arr.length <= 47) {
        // 插入排序（小数组最优）
        insertionSort(arr);
    } else if (/* 数据近乎有序 */) {
        // 插入排序
        insertionSort(arr);
    } else if (/* 需要稳定性 */) {
        // 归并排序
        mergeSort(arr, 0, arr.length - 1);
    } else {
        // 快速排序
        quickSort(arr, 0, arr.length - 1);
    }
}
```

## 总结

1. **实际应用**：Java 使用 TimSort（C + 插入排序的混合）
2. **面试必备**：快速排序、归并排序必会
3. **非比较排序**：适合特定场景（范围小、分布均匀）
4. **稳定性**：归并排序适合需要稳定性的场景

希望这篇总结对你的学习和面试有所帮助！
