# **Concurrency in Java**

Concurrency is one of the most important and tricky topics in Java.
It allows programs to perform multiple tasks at the same time, but introduces problems like **race conditions**, **visibility issues**, and **deadlocks** if not handled carefully.

---

## 1. Processes, Threads, and the JVM

- **Process** = an instance of a running program.
- **Thread** = a lightweight unit of execution inside a process.
- Every Java program **starts with the main thread**.
- JVM also runs background threads (like garbage collector).

👉 To create new threads in Java:

```java
Thread t = new Thread(() -> {
    System.out.println("Hello from a new thread!");
});
t.start();
```

---

## 2. Thread Lifecycle and APIs

Important methods:

- `start()` → begins execution in a new thread.
- `sleep(ms)` → pauses **current thread**.
- `join()` → waits for another thread to finish.
- `interrupt()` + `isInterrupted()` → cooperative thread termination.
- `setDaemon(true)` → makes a background thread (JVM won’t wait for it).

### Example:

```java
Thread worker = new Thread(() -> {
    try {
        Thread.sleep(3000);
        System.out.println("Work done!");
    } catch (InterruptedException e) {
        System.out.println("Interrupted!");
    }
});

// Non-daemon (JVM waits)
worker.start();

// Main waits explicitly
worker.join();
```

---

## 3. JVM Exit Behavior

- JVM **keeps running** if there’s any **non-daemon thread** alive.
- JVM **can exit immediately** if only **daemon threads** remain.
- Use `join()` when you want explicit waiting.

| Feature    | Non-Daemon (default) | Daemon      |
| ---------- | -------------------- | ----------- |
| JVM waits? | ✅ Yes               | ❌ No       |
| Example    | Worker threads       | Logging, GC |

---

## 4. Concurrency Problems

### 4.1 Race Conditions

A **race condition** happens when multiple threads access and modify shared data simultaneously.

Example:

```java
class Counter {
    int count = 0;
    public void increment() { count++; }
}
```

If multiple threads call `increment()`, final result is unpredictable.

---

### 4.2 Fixing Race Conditions

**Techniques:**

1. **Confinement** → keep data thread-local.
2. **Synchronization** → locks, `synchronized`.
3. **Atomic classes** → `AtomicInteger`, `AtomicBoolean`, etc.
4. **Immutable objects** → safe by design.

---

## 5. Locks and Synchronization

### 5.1 Using `synchronized`

```java
class Counter {
    private int count = 0;
    public synchronized void increment() {
        count++;
    }
}
```

### 5.2 Using Explicit Locks

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class Counter {
    private int count = 0;
    private Lock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try { count++; }
        finally { lock.unlock(); }
    }
}
```

---

## 6. Volatile and Visibility

Threads can cache variables locally, leading to **visibility issues**.

- Without `volatile`, one thread may not see another’s changes.
- With `volatile`, all reads/writes go to **main memory**.

Example:

```java
class Flag {
    private volatile boolean done = false;

    public void work() {
        while (!done) { } // busy wait
    }

    public void stop() {
        done = true;
    }
}
```

⚠️ Note: `volatile` ensures **visibility**, but not **atomicity**.
`x++` is still unsafe, even if `x` is volatile.

---

## 7. Atomic Classes

Java provides classes in `java.util.concurrent.atomic` that ensure atomic updates:

```java
import java.util.concurrent.atomic.AtomicInteger;

class AtomicCounter {
    private AtomicInteger count = new AtomicInteger();

    public void increment() {
        count.incrementAndGet();
    }

    public int get() {
        return count.get();
    }
}
```

✔ Uses CPU-level instructions (`Compare-And-Swap`) to guarantee atomicity without locks.

---

## 8. Thread Communication: `wait()` and `notify()`

Sometimes threads need to communicate.

- `wait()` → makes a thread pause until notified.
- `notify()` → wakes one waiting thread.
- `notifyAll()` → wakes all waiting threads.

⚠️ Must be used inside a `synchronized` block.

Example:

```java
class DownloadStatus {
    private boolean done = false;

    public synchronized void waitUntilDone() throws InterruptedException {
        while (!done) {
            wait(); // releases lock, waits
        }
    }

    public synchronized void markDone() {
        done = true;
        notifyAll(); // wakes waiting threads
    }
}
```

---

## 9. Collections in Concurrency

- `Collections.synchronizedList()` → wraps a list with locks.
- `ConcurrentHashMap`, `CopyOnWriteArrayList` → designed for concurrency, faster than synchronized wrappers.

Example:

```java
var list = Collections.synchronizedList(new ArrayList<>());
list.add(1);
```

---

## 10. Executor Framework (Modern Approach)

Instead of managing threads manually:

```java
import java.util.concurrent.*;

ExecutorService executor = Executors.newFixedThreadPool(4);

executor.submit(() -> {
    System.out.println("Task running");
});

executor.shutdown();
```

---

# ✅ Key Takeaways

1. **Thread basics**: `start()`, `sleep()`, `join()`, `interrupt()`.
2. **Daemon vs non-daemon**: JVM exit depends on them.
3. **Concurrency problems**: Race conditions, visibility.
4. **Solutions**:
   - Confinement
   - Synchronization
   - Locks
   - Atomic classes
   - Immutability

5. **Visibility problem** solved by `volatile`.
6. **Thread coordination**: `wait()` / `notify()`.
7. **Use concurrent collections** instead of manual sync.
8. For real apps → prefer **Executors** over manual `Thread`.

<!-- # **Executors, Thread Pools, and Futures in Java** -->
<!---->
<!-- ## 1. Why Executors? -->
<!---->
<!-- Working directly with threads (`new Thread(...)`) is: -->
<!---->
<!-- - **Error-prone** (manual start/stop, synchronization issues). -->
<!-- - **Expensive** (creating a new thread for every task costs memory and CPU). -->
<!-- - **Hard to scale** (what if you need to run hundreds of small tasks?). -->
<!---->
<!-- 👉 To solve this, Java 5 introduced the **Executor Framework** to manage threads for us. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 2. Thread Pools -->
<!---->
<!-- Instead of creating threads manually, we can use a **pool**: -->
<!---->
<!-- - A pool is a group of worker threads. -->
<!-- - When a task finishes, the thread returns to the pool and can be reused. -->
<!-- - Benefits: efficiency + no resource exhaustion. -->
<!---->
<!-- In Java, thread pools are represented by **`ExecutorService`**, with common implementations like: -->
<!---->
<!-- - `ThreadPoolExecutor` -->
<!-- - `ScheduledThreadPoolExecutor` -->
<!-- - `ForkJoinPool` -->
<!---->
<!-- --- -->
<!---->
<!-- ## 3. Example: Using Executors -->
<!---->
<!-- ### Blocking version (with try-with-resources) -->
<!---->
<!-- ```java -->
<!-- public static void show() { -->
<!--     // Java 21+: ExecutorService implements AutoCloseable -->
<!--     try (var pool = Executors.newFixedThreadPool(2)) { -->
<!--         pool.submit(() -> { -->
<!--             delay(); -->
<!--             System.out.println(Thread.currentThread().getName()); -->
<!--         }); -->
<!--         System.out.println("hello"); -->
<!--     } // <-- pool.close() waits for tasks to finish -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- 🔎 **What happens here?** -->
<!---->
<!-- - `"hello"` prints immediately. -->
<!-- - The submitted task runs on a worker thread. -->
<!-- - When the `try` block ends, `pool.close()` is called, which **blocks** until tasks finish. -->
<!---->
<!-- That’s why `"this is blocking"` only shows _after_ the task completes. -->
<!---->
<!-- --- -->
<!---->
<!-- ### Non-blocking version (manual shutdown) -->
<!---->
<!-- ```java -->
<!-- public static ExecutorService show2() { -->
<!--     var pool = Executors.newFixedThreadPool(2); -->
<!--     pool.submit(() -> { -->
<!--         delay(); -->
<!--         System.out.println(Thread.currentThread().getName()); -->
<!--     }); -->
<!--     System.out.println("hello"); -->
<!--     return pool; // caller can decide when to shut it down -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Here: -->
<!---->
<!-- - `"hello"` prints immediately. -->
<!-- - Program doesn’t block unless you later call `pool.shutdown()`. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 4. Callable and Future -->
<!---->
<!-- Sometimes, we don’t just want to run tasks—we want a **result**. -->
<!---->
<!-- - `Runnable`: no result, just side effects. -->
<!-- - `Callable<T>`: returns a value of type `T`. -->
<!---->
<!-- When we submit a `Callable`, we get back a **`Future<T>`** object. -->
<!---->
<!-- ```java -->
<!-- public static Future<Integer> show3() { -->
<!--     try (var pool = Executors.newFixedThreadPool(2)) { -->
<!--         return pool.submit(() -> { -->
<!--             delay(); -->
<!--             return 25; -->
<!--         }); -->
<!--     } -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- ### Getting the result -->
<!---->
<!-- ```java -->
<!-- var result = show3(); -->
<!-- try { -->
<!--     var value = result.get(); // blocks until task is finished -->
<!--     System.out.println(value); -->
<!-- } catch (InterruptedException | ExecutionException e) { -->
<!--     throw new RuntimeException(e); -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- ⚠️ `.get()` **blocks** the main thread until the task finishes. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 5. Asynchronous Programming with `CompletableFuture` -->
<!---->
<!-- Futures are powerful but clunky (they only give you `.get()`). -->
<!-- Java 8 introduced **`CompletableFuture`**, which lets you: -->
<!---->
<!-- - Run async tasks without blocking. -->
<!-- - Chain multiple tasks (`thenApply`, `thenAccept`). -->
<!-- - Handle errors. -->
<!---->
<!-- Example: -->
<!---->
<!-- ```java -->
<!-- CompletableFuture.runAsync(() -> { -->
<!--     delay(); -->
<!--     System.out.println(Thread.currentThread().getName()); -->
<!-- }); -->
<!-- System.out.println("hello"); // prints immediately -->
<!-- ``` -->
<!---->
<!-- --- -->
<!---->
<!-- ## 6. Summary -->
<!---->
<!-- - **Executors** = abstraction over threads. -->
<!-- - **Thread pools** = efficient reuse of threads. -->
<!-- - **Runnable** = no result, **Callable** = returns result. -->
<!-- - **Future** = placeholder for a result (but blocks). -->
<!-- - **CompletableFuture** = modern async style with chaining. -->
<!---->
<!-- --- -->
<!---->
<!-- ## ✅ Takeaway for students -->
<!---->
<!-- 1. Use **Executors** instead of raw threads. -->
<!-- 2. Use **Callable + Future** when you need results. -->
<!-- 3. Use **CompletableFuture** for non-blocking async programming. -->
<!-- 4. Remember: -->
<!--    - `ExecutorService.close()` blocks until tasks finish (Java 21+). -->
<!--    - `.get()` on a `Future` blocks too. -->
<!---->

# **ExecutorService**

<!-- ## Table of Contents -->
<!---->
<!-- 1. [Introduction](#introduction) -->
<!-- 2. [Thread Pools and ExecutorService](#thread-pools-and-executorservice) -->
<!-- 3. [Callable and Future Interfaces](#callable-and-future-interfaces) -->
<!-- 4. [Understanding Concurrency vs Parallelism vs Asynchronous](#understanding-concurrency-vs-parallelism-vs-asynchronous) -->
<!-- 5. [CompletableFuture: Modern Asynchronous Programming](#completablefuture-modern-asynchronous-programming) -->
<!-- 6. [Chaining Operations](#chaining-operations) -->
<!-- 7. [Combining Futures](#combining-futures) -->
<!-- 8. [Error Handling](#error-handling) -->
<!-- 9. [Advanced Patterns](#advanced-patterns) -->
<!-- 10. [Best Practices](#best-practices) -->

## Introduction

Working with threads directly in Java is difficult and error-prone. Java 5 introduced the **Executor Framework** to abstract away the complexity of thread management. This lesson covers:

- Thread pools and ExecutorService
- Callable and Future interfaces
- Asynchronous programming with CompletableFuture
- Modern patterns for concurrent programming

## Thread Pools and ExecutorService

### The Problem with Direct Thread Usage

Creating threads directly has two major issues:

1. **Cost**: Creating and destroying threads is expensive
2. **Availability**: System resources are limited

### Solution: Thread Pools

A thread pool is a collection of worker threads. When a worker thread finishes its task, it returns to the pool to execute other tasks instead of being destroyed.

### ExecutorService Basics

```java
public class ExecutorDemo {
    public static void main(String[] args) {
        // Basic executor usage
        show();

        // Non-blocking example
        var exec = show2();
        System.out.println("this runs immediately");
        exec.shutdown();

        // Working with return values
        var result = show3();
        try {
            var value = result.get();
            System.out.println(value);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    // Blocking example with try-with-resources
    public static void show() {
        try (var pool = Executors.newFixedThreadPool(2)) {
            pool.submit(() -> {
                delay();
                System.out.println(Thread.currentThread().getName());
            });
            System.out.println("hello");
        } // pool.close() blocks until all tasks complete
    }

    // Non-blocking example
    public static ExecutorService show2() {
        var pool = Executors.newFixedThreadPool(2);
        pool.submit(() -> {
            delay();
            System.out.println(Thread.currentThread().getName());
        });
        System.out.println("hello"); // Prints immediately
        return pool; // Must manually shutdown later
    }

    // Returning values with Future
    public static Future<Integer> show3() {
        try (var pool = Executors.newFixedThreadPool(2)) {
            return pool.submit(() -> {
                delay();
                return 25;
            });
        }
    }

    public static void delay() {
        try {
            Thread.sleep(Duration.ofSeconds(2));
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### Key ExecutorService Implementations

1. **ThreadPoolExecutor**: General-purpose thread pool
2. **ScheduledThreadPoolExecutor**: For scheduled tasks
3. **ForkJoinPool**: For divide-and-conquer algorithms

### Important Note About try-with-resources

When using `try-with-resources` with ExecutorService:

- The `close()` method calls `shutdown()` and **blocks** until all submitted tasks finish
- This can make your code appear synchronous even though tasks run on separate threads
- For truly non-blocking behavior, manage the executor lifecycle manually

## Callable and Future Interfaces

### Moving Beyond Runnable

While `Runnable` is great for fire-and-forget tasks, often you need to:

- Return a value from your task
- Handle exceptions properly
- Check if the task is complete

### Callable Interface

```java
public class ThreadPoolExample {
    public static void main(String[] args) {
        try (var exec = Executors.newFixedThreadPool(2)) {
            // Submit a Callable that returns a value
            var result = exec.submit(() -> {
                System.out.println(Thread.currentThread().getName());
                LongTask.simulate();
                return 1; // Return value
            });

            try {
                // get() is a BLOCKING call
                var res = result.get();
                System.out.println(res);
            } catch (InterruptedException | ExecutionException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```
