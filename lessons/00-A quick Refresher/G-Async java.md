# Async Java

Asynchronous programming is a style of writing code where a long-running operation
is started, and the main program continues its work **without waiting**
for that operation to finish. In Java, this is often managed using the `Future` interface.

## The `Future` Interface: A Placeholder for Results

The **`Future<T>`** interface is a core component of Java's concurrency utilities.
It represents the **result of an asynchronous computation** that may not have completed yet.
When you start a task on a background thread (e.g., using an `ExecutorService`), the method returns a `Future` object immediately. This object is essentially a **placeholder** for the eventual result (of type `T`).

#### **How to Get a Future**

You typically obtain a `Future` by submitting a task (a `Callable`) to an `ExecutorService`:

```java
import java.util.concurrent.*;

// 1. Create a service to run background threads
ExecutorService executor = Executors.newSingleThreadExecutor();

// 2. Submit a long-running task that returns a value (Callable)
Future<Integer> futureResult = executor.submit(() -> {
    System.out.println("...Starting background task (simulating 3 seconds)...");
    Thread.sleep(3000);
    return 42; // The final result
});

// The main thread continues running immediately.
System.out.println("Main thread is not blocked yet, doing other work...");
```

### Future Interface Methods

| Method                     | Purpose                                 | Key Behavior and Limitation                                                                                                                                    |
| :------------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`get()`**                | Retrieves the result.                   | **BLOCKS** the calling thread indefinitely until the result is available or an exception is thrown. **This is usually what asynchronous code tries to avoid.** |
| **`get(timeout, unit)`**   | Retrieves the result with a time limit. | **BLOCKS** the calling thread. Throws a `TimeoutException` if the result isn't ready in time.                                                                  |
| **`isDone()`**             | Check if task completed.                | Returns `true` if the task has finished, whether normally, by cancellation, or with an error.                                                                  |
| **`cancel(mayInterrupt)`** | Attempt to cancel the task.             | Attempts to stop the running task. Returns `true` if the cancellation was successful.                                                                          |

**_The main limitation of the original `Future` is that retrieving the result via `get()` requires the calling thread to stop and wait. For modern, non-blocking asynchronous programming, Java developers prefer the_** **`CompletableFuture`** **_class (introduced in Java 8), which allows you to chain tasks and react to completion without blocking._**

---

## Understanding Concurrency vs. Parallelism vs. Asynchronous

These three terms are often confused. Here’s how they differ:

| Term             | Meaning                                                                                                                                        | Requires Multiple Cores?                 | Practical Analogy                                                                                                                           |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| **Concurrent**   | Many tasks making **progress** over overlapping time periods by rapidly switching between them.                                                | ❌ Not necessarily (can run on one core) | **One Chef** juggling three orders: they chop for a minute, stir for a minute, then check the oven. All tasks are _progressing_ over time.  |
| **Parallel**     | Tasks running **literally at the same instant** (simultaneously) on different CPU cores.                                                       | ✅ Yes                                   | **Three Chefs** working on three different orders **at the exact same time** on three different stations.                                   |
| **Asynchronous** | A **programming style** where the caller initiates a task and continues its own work, using a `Future` or callback to handle the result later. | ❌ No (It's a coding approach)           | **Placing a take-out order** by phone: You hang up and drive to the restaurant. You don't stay on hold the whole time waiting for the food. |

### Future Interface Methods

- `get()`: Blocks until result is available (throws checked exceptions)
- `get(timeout, unit)`: Blocks with timeout
- `isDone()`: Check if task completed
- `cancel(mayInterrupt)`: Attempt to cancel the task

## Understanding Concurrency vs Parallelism vs Asynchronous

### Definitions

| Term             | Meaning                                      | Needs Multiple Cores? | Typical Use                             |
| ---------------- | -------------------------------------------- | --------------------- | --------------------------------------- |
| **Parallel**     | Tasks run literally at the same time         | ✅ Yes                | CPU-bound work (math, image processing) |
| **Concurrent**   | Many tasks progressing in overlapping time   | ❌ Not necessarily    | Task scheduling, multitasking           |
| **Asynchronous** | Task runs in background, caller doesn't wait | ❌ No                 | I/O-bound work (network, DB, files)     |

### Examples

**Parallel Processing:**

```java
IntStream.range(0, 10)
    .parallel()
    .forEach(i -> System.out.println(i + " " + Thread.currentThread()));
```

**Concurrent Processing:**

```java
ExecutorService pool = Executors.newFixedThreadPool(2);
pool.submit(() -> doWork("A"));
pool.submit(() -> doWork("B"));
// Tasks overlap in time, may or may not run simultaneously
```

**Asynchronous Processing:**

```java
CompletableFuture.runAsync(() -> {
    delay();
    System.out.println("hello");
});
System.out.println("I don't block!"); // Runs immediately
```

### What Does "Asynchronous" Really Mean?

Asynchronous programming is about **non-blocking execution**:

- You start a task
- Your thread continues with other work
- The task completes later and notifies you (via callback, promise, etc.)

Think of it like ordering coffee:

- **Synchronous**: Order coffee → wait → receive coffee → continue
- **Asynchronous**: Order coffee → do other things → get notified when ready

## CompletableFuture: Modern Asynchronous Programming

### Introduction

`CompletableFuture` is Java's equivalent to JavaScript Promises. It has three states:

- **Pending**: Task is running
- **Resolved**: Task completed successfully
- **Rejected**: Task failed with an exception

### Basic Usage

```java
public class AsyncExample {
    public static void main(String[] args) {
        // Fire and forget
        show().join(); // join() blocks until completion

        // With return value
        try {
            String value = show2().get();
            System.out.println("Returned: " + value);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    // CompletableFuture.runAsync for void tasks
    public static CompletableFuture<Void> show() {
        return CompletableFuture.runAsync(() -> {
            delay();
            System.out.println("hello");
        });
    }

    // CompletableFuture.supplyAsync for tasks with return values
    public static CompletableFuture<String> show2() {
        return CompletableFuture.supplyAsync(() -> {
            delay();
            return "hello";
        });
    }
}
```

### Building Async APIs

```java
class MailSender {
    // Synchronous method
    public void sendMail() {
        delay();
        System.out.println("mail sent !!!!");
    }

    // Asynchronous wrapper
    public CompletableFuture<Void> sendMailAsync() {
        return CompletableFuture.runAsync(() -> sendMail());
    }
}

// Usage
var mailService = new MailSender();
var future = mailService.sendMailAsync();
System.out.println("This runs immediately");
future.join(); // Wait for completion
```

## Chaining Operations

### CompletableFuture Chaining Methods

| Method                      | Input Lambda                | Returns                   | Use Case                  |
| --------------------------- | --------------------------- | ------------------------- | ------------------------- |
| `thenApply(fn)`             | `T -> U`                    | `CompletableFuture<U>`    | Transform result (sync)   |
| `thenApplyAsync(fn)`        | `T -> U`                    | `CompletableFuture<U>`    | Transform result (async)  |
| `thenAccept(consumer)`      | `T -> void`                 | `CompletableFuture<Void>` | Consume result, no return |
| `thenAcceptAsync(consumer)` | `T -> void`                 | `CompletableFuture<Void>` | Consume result (async)    |
| `thenRun(runnable)`         | `() -> void`                | `CompletableFuture<Void>` | Run after completion      |
| `thenCompose(fn)`           | `T -> CompletableFuture<U>` | `CompletableFuture<U>`    | Chain async operations    |

### Practical Examples

```java
public class CompletableFutureChaining {
    public static void main(String[] args) {
        // Transform and consume
        var future = CompletableFuture.supplyAsync(() -> 12)
            .thenApplyAsync(v -> v * 2) // Transform: 12 -> 24
            .thenAcceptAsync(v -> {
                delay();
                System.out.println("Thread: " + Thread.currentThread().getName());
                System.out.println("Value: " + v);
            });

        future.join();
    }
}
```

### thenApply vs thenCompose

**Key Difference:**

- `thenApply`: Use when your function returns a **plain value** (`T -> U`)
- `thenCompose`: Use when your function returns a **CompletableFuture** (`T -> CompletableFuture<U>`)

```java
// thenApply - transforms value
CompletableFuture.supplyAsync(() -> "User123")
    .thenApply(id -> fetchProfileSync(id)) // Returns Profile
    .thenAccept(System.out::println);

// thenCompose - chains futures (avoids nesting)
CompletableFuture.supplyAsync(() -> "User123")
    .thenCompose(id -> fetchProfileAsync(id)) // Returns CompletableFuture<Profile>
    .thenAccept(System.out::println);
```

Without `thenCompose`, you'd get `CompletableFuture<CompletableFuture<Profile>>` (nested futures).

## Combining Futures

### Combining Two Futures

```java
public class CombiningFutures {
    public static void main(String[] args) {
        // Get price in USD
        var priceInUSD = CompletableFuture.supplyAsync(() -> 39);

        // Get exchange rate USD -> EGP
        var exchangeRate = CompletableFuture.supplyAsync(() -> 50);

        // Combine results
        var finalPrice = priceInUSD.thenCombine(exchangeRate,
            (price, rate) -> price * rate);

        System.out.println("Final price: " + finalPrice.join());

        // More complex example with string parsing
        var priceString = CompletableFuture.supplyAsync(() -> "39usd");
        var rate = CompletableFuture.supplyAsync(() -> 50);

        var result = priceString
            .thenApply(price -> {
                var cleanPrice = price.replace("usd", "");
                return Integer.parseInt(cleanPrice);
            })
            .thenCombine(rate, (price, exchangeRate) -> price * exchangeRate);

        System.out.println("Parsed result: " + result.join());
    }
}
```

### Working with Multiple Futures

```java
public class MultipleFutures {
    public static void main(String[] args) {
        var f1 = CompletableFuture.supplyAsync(() -> { delay(); return 1; });
        var f2 = CompletableFuture.supplyAsync(() -> { delay(); return 2; });
        var f3 = CompletableFuture.supplyAsync(() -> { delay(); return 3; });
        var f4 = CompletableFuture.supplyAsync(() -> { delay(); return 4; });

        // Wait for ALL to complete
        CompletableFuture.allOf(f1, f2, f3, f4).join();
        System.out.println("All completed: " + f1.join());

        // Wait for ANY to complete (first wins)
        var slow = CompletableFuture.supplyAsync(() -> {
            delay(6); return "slow";
        });
        var fast = CompletableFuture.supplyAsync(() -> {
            delay(1); return "fast";
        });

        CompletableFuture.anyOf(slow, fast)
            .thenAccept(System.out::println) // Prints "fast"
            .join();
    }
}
```

## Error Handling

### Exception Handling Patterns

```java
public class ErrorHandling {
    public static void main(String[] args) {
        // Using exceptionally for error recovery
        var future = CompletableFuture.supplyAsync(() -> {
            throw new IllegalStateException("Something went wrong!");
        });

        try {
            var result = future.exceptionally(throwable -> {
                System.out.println("Error: " + throwable.getMessage());
                return "default_value"; // Fallback value
            }).get();

            System.out.println("Result: " + result); // Prints "default_value"
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("Unexpected error: " + e.getMessage());
        }

        // Using handle for both success and failure
        var result2 = CompletableFuture.supplyAsync(() -> {
            // This might succeed or fail
            if (Math.random() > 0.5) {
                return "Success!";
            } else {
                throw new RuntimeException("Failed!");
            }
        }).handle((value, throwable) -> {
            if (throwable != null) {
                return "Error: " + throwable.getMessage();
            }
            return "Success: " + value;
        });

        System.out.println(result2.join());
    }
}
```

### Timeouts

```java
public class TimeoutHandling {
    public static void main(String[] args) {
        var slowTask = CompletableFuture.supplyAsync(() -> {
            delay(6); // 6 seconds
            return "slow result";
        });

        // This will throw TimeoutException
        // slowTask.orTimeout(2, TimeUnit.SECONDS).join();

        // Better: provide default value on timeout
        var result = slowTask.completeOnTimeout("timeout_value", 1, TimeUnit.SECONDS);
        System.out.println(result.join()); // Prints "timeout_value"
    }
}
```

## Advanced Patterns

### Custom Thread Pools

```java
// CompletableFuture uses ForkJoinPool.commonPool() by default
// You can provide custom executor:
var customPool = Executors.newFixedThreadPool(4);
var future = CompletableFuture.supplyAsync(() -> "result", customPool);
```

### Async Method Composition

```java
public CompletableFuture<String> processUser(String userId) {
    return CompletableFuture.supplyAsync(() -> userId)
        .thenCompose(this::fetchUser)           // CompletableFuture<User>
        .thenCompose(this::enrichUserProfile)   // CompletableFuture<User>
        .thenApply(User::getName);              // CompletableFuture<String>
}

private CompletableFuture<User> fetchUser(String id) {
    return CompletableFuture.supplyAsync(() -> {
        // Simulate database call
        delay();
        return new User(id);
    });
}

private CompletableFuture<User> enrichUserProfile(User user) {
    return CompletableFuture.supplyAsync(() -> {
        // Simulate external API call
        delay();
        user.setProfile(new Profile());
        return user;
    });
}
```

## Best Practices

### 1. Resource Management

```java
// Always shutdown executors
ExecutorService executor = Executors.newFixedThreadPool(4);
try {
    // Use executor
} finally {
    executor.shutdown();
}

// Or use try-with-resources (but remember it blocks!)
try (var executor = Executors.newFixedThreadPool(4)) {
    // Use executor
} // Automatically shuts down and waits
```

### 2. Exception Handling

```java
// Always handle exceptions in async chains
CompletableFuture.supplyAsync(() -> riskyOperation())
    .exceptionally(throwable -> {
        log.error("Operation failed", throwable);
        return defaultValue;
    })
    .thenAccept(this::processResult);
```

### 3. Avoid Blocking in Async Code

```java
// BAD: Blocking in async context
CompletableFuture.runAsync(() -> {
    var result = anotherFuture.join(); // Blocking!
    process(result);
});

// GOOD: Chain properly
CompletableFuture.runAsync(() -> setupWork())
    .thenCompose(x -> anotherFuture)  // Non-blocking composition
    .thenAccept(this::process);
```

### 4. Memory and Context Management

```java
// Be careful with shared state in lambdas
// Prefer passing data through the pipeline rather than capturing
```

### 5. Testing Async Code

```java
@Test
public void testAsync() {
    var future = myAsyncMethod();

    // Don't forget to wait in tests!
    var result = future.join();
    assertEquals("expected", result);
}
```

## Summary

CompletableFuture provide powerful tools for asynchronous programming:

1. **Future/Callable** interfaces allow returning values from background tasks
2. **CompletableFuture** enables modern, composable asynchronous programming
3. **Proper error handling** and **resource management** are crucial
4. **Understanding the difference** between blocking and non-blocking operations is key

### Key Takeaways

- Use CompletableFuture for new async code
- Chain operations with `thenApply`, `thenCompose`, `thenCombine`
- Handle errors with `exceptionally` or `handle`
- Always consider resource cleanup
- Test your async code properly

### get() vs join()

- `get()`: Throws checked exceptions (`InterruptedException`, `ExecutionException`)
- `join()`: Throws unchecked `CompletionException`, more convenient for most use cases
