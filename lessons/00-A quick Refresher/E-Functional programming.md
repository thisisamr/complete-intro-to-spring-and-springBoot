# **Functional Interfaces in Java**

Java 8 introduced **functional programming features** such as lambdas, method references, and the `java.util.function` package. At the heart of this ecosystem are **functional interfaces**.

---

## 1️⃣ What is a Functional Interface?

- A **functional interface** is an interface with exactly **one abstract method**.
- This single method defines the **functional contract**.
- Java provides many built-in functional interfaces in the `java.util.function` package.
- Examples: `Function<T,R>`, `Consumer<T>`, `Supplier<T>`, `Predicate<T>`, `UnaryOperator<T>`, `BinaryOperator<T>`.

⚡ Lambdas and method references can be used wherever a functional interface is expected.

---

## 2️⃣ `Function<T, R>` – Transforming Data

- Represents a function that **takes one argument of type `T` and returns a result of type `R`**.

```java
package thisisamr;

import java.util.function.Function;

public class FunctionInterfaceExample {
    public static void main(String[] args) {
        Function<String, String> modify = (name) -> name + " Modified";

        System.out.println(modify.apply("Amr"));  // Amr Modified

        // Function composition
        var result = modify
                .compose((String p) -> p.toLowerCase()) // runs first
                .apply("AAAAA");

        System.out.println(result); // aaaaa Modified
    }
}
```

### 📝 Key methods

- `apply(T t)` → runs the function.
- `compose(Function before)` → run another function _before_.
- `andThen(Function after)` → run another function _after_.

So you can build **pipelines** of transformations.

---

## 3️⃣ `Consumer<T>` – Consuming Data

- Represents an operation that **takes one argument and returns nothing** (side effects only).
- Typical use: logging, printing, collecting results.

```java
package thisisamr;

import java.util.List;
import java.util.function.Consumer;

public class ConsumerInterfaceExample {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5);

        Consumer<Integer> print = System.out::println;

        // Chaining consumers
        numbers.forEach(print.andThen(i -> System.out.println(i * 2)));
    }
}
```

---

## 4️⃣ `Supplier<T>` – Supplying Values

- Represents a function that **takes no arguments but returns a value**.

```java
package thisisamr;

import java.util.function.DoubleSupplier;
import java.util.function.Supplier;

public class SupplierInterfaceExample {
    public static void main(String[] args) {
        Supplier<Double> randomBoxed = Math::random;
        DoubleSupplier randomPrimitive = Math::random;

        System.out.println(randomBoxed.get());       // Double (boxed)
        System.out.println(randomPrimitive.getAsDouble()); // double (primitive)
    }
}
```

### 🔑 Why `DoubleSupplier`?

- To avoid the **overhead of boxing/unboxing**.
- `Supplier<Double>` works with objects (heap allocated).
- `DoubleSupplier` works directly with `double` (faster, no GC overhead).

👉 Boxing/unboxing exists because Java generics only work with objects, unlike modern languages (Rust, Go, C++).

---

## 5️⃣ `Predicate<T>` – Filtering Data

- Represents a function that **takes one argument and returns a boolean**.
- Often used for filtering and conditional logic.

```java
package thisisamr;

import java.util.List;
import java.util.function.Predicate;

public class PredicateInterfaceExample {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 9);

        Predicate<Integer> divisibleBy3 = i -> i % 3 == 0;

        numbers.stream()
               .filter(divisibleBy3)
               .forEach(System.out::println); // 3, 6, 9

        // Combining predicates
        Predicate<String> hasLeftBrace = str -> str.startsWith("{");
        Predicate<String> hasRightBrace = str -> str.endsWith("}");

        Predicate<String> both = hasLeftBrace.and(hasRightBrace);
        Predicate<String> either = hasLeftBrace.or(hasRightBrace);
        Predicate<String> notLeft = hasLeftBrace.negate();

        System.out.println(both.test("{ASD}"));   // true
        System.out.println(either.test("{ASD"));  // true
        System.out.println(notLeft.test("ASD"));  // true
    }
}
```

---

## 6️⃣ `UnaryOperator<T>` and `BinaryOperator<T>`

- Both are **specializations of `Function`**:
  - `UnaryOperator<T>` → takes one argument and returns the same type.
  - `BinaryOperator<T>` → takes two arguments of the same type and returns the same type.

```java
package thisisamr;

import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.UnaryOperator;

public class OperatorExamples {
    public static void main(String[] args) {
        BinaryOperator<Integer> add = Integer::sum;
        Function<Integer, Integer> square = a -> a * a;

        var result = add.andThen(square).apply(1, 3);
        System.out.println(result); // (1+3)^2 = 16

        UnaryOperator<Integer> increment = a -> a + 1;
        UnaryOperator<Integer> squareOp = a -> a * a;

        System.out.println(increment.andThen(squareOp).apply(1)); // (1+1)^2 = 4
    }
}
```

---

## 🔑 Summary

- **Functional interfaces** allow Java to use **lambdas and method references** elegantly.
- Core built-in interfaces:
  - `Function<T,R>` → transforms data.
  - `Consumer<T>` → consumes data (side effects).
  - `Supplier<T>` → supplies values.
  - `Predicate<T>` → tests conditions.
  - `UnaryOperator<T>` and `BinaryOperator<T>` → operate on same-type inputs.

- They can be **chained, composed, and combined**.
- You’ll use them extensively with **Streams** for mapping, filtering, reducing, and collecting.

---

👉 Next step: apply these in **Streams** (map, filter, reduce, collect) — that’s where the real power shows.

Perfect 👌 what you’ve written is already a nice “playground” for students to see streams in action. Let me turn it into a **structured, refined lecture on Java Streams**, with clearer flow, theory + practical examples.

---

# 🚀 **Java Streams – A Comprehensive Introduction**

---

## 1. What are Streams?

Streams are one of the most powerful features introduced in Java 8.
They allow us to **process data in a declarative, functional style**, instead of writing loops and manual logic.

Think of a stream as:

- A **pipeline** of data flowing through transformations.
- It doesn’t **store** data – it processes data from a source (collection, array, I/O, or infinite generator).

---

## 2. Creating Streams

You can create streams from multiple sources:

### From collections:

```java
List<String> names = List.of("Amr", "Huda", "Salwa");
names.stream().forEach(System.out::println);
```

### From arrays:

```java
int[] nums = {1, 2, 3, 4, 5};
Arrays.stream(nums).forEach(System.out::print);
```

### From infinite generators:

```java
Stream.generate(Math::random).limit(3).forEach(System.out::println);
Stream.iterate(1, n -> n * 2).limit(5).forEach(System.out::println);
```

---

## 3. Intermediate Operations

These **transform streams** but don’t produce a result until a terminal operation is called.

Some common ones:

- **`filter`** → keep only matching elements
- **`map`** → transform each element
- **`distinct`** → remove duplicates
- **`sorted`** → order elements
- **`limit`, `skip`, `takeWhile`, `dropWhile`** → slicing
- **`peek`** → debugging, view without consuming

Example:

```java
movies.stream()
      .filter(m -> m.likes > 20)   // keep movies with likes > 20
      .map(m -> m.title)           // transform to titles
      .distinct()
      .forEach(System.out::println);
```

---

## 4. Terminal Operations

These **end the stream pipeline** and produce a result (number, collection, boolean, etc.).

Examples:

- **Counting**

```java
long count = movies.stream().filter(m -> m.likes > 20).count();
```

- **Matching**

```java
movies.stream().allMatch(m -> m.likes > 10); // true/false
movies.stream().anyMatch(m -> m.genre == Movie.GENRE.ACTION);
```

- **Finding**

```java
movies.stream().findFirst().ifPresent(System.out::println);
movies.stream().findAny().ifPresent(System.out::println);
```

- **Reducing**

```java
int totalLikes = movies.stream()
                       .map(m -> m.likes)
                       .reduce(Integer::sum)
                       .orElse(0);
```

---

## 5. Collecting Results

Streams integrate tightly with the **Collectors** utility class.

- **To List/Set**

```java
List<String> titles = movies.stream()
                            .map(m -> m.title)
                            .toList();
```

- **To Set (unique values)**

```java
Set<Integer> likes = movies.stream()
                           .map(m -> m.likes)
                           .collect(Collectors.toSet());
```

- **Summarizing**

```java
var stats = movies.stream()
                  .collect(Collectors.summarizingInt(m -> m.likes));
System.out.println(stats.getAverage());
```

- **Grouping**

```java
var grouped = movies.stream()
                    .collect(Collectors.groupingBy(m -> m.genre));
```

- **Grouping + Mapping**

```java
var groupedTitles = movies.stream()
    .collect(Collectors.groupingBy(m -> m.genre,
             Collectors.mapping(m -> m.title, Collectors.joining(", "))));
```

- **Partitioning**

```java
var partitioned = movies.stream()
                        .collect(Collectors.partitioningBy(m -> m.likes > 20));
```

---

## 6. Sorting

Streams allow easy sorting:

- With a comparator:

```java
var sorted = movies.stream()
                   .sorted(Comparator.comparingInt(m -> m.likes))
                   .toList();
```

- With a custom comparator:

```java
var sortedDesc = movies.stream()
                       .sorted((m1, m2) -> m2.likes - m1.likes)
                       .toList();
```

---

## 7. Primitive Streams

When working with primitives, Java provides specialized streams:

- **`IntStream`**
- **`LongStream`**
- **`DoubleStream`**

Useful methods:

```java
IntStream.range(1, 5).forEach(System.out::println);      // 1..4
IntStream.rangeClosed(1, 5).forEach(System.out::println); // 1..5
```

This avoids boxing/unboxing overhead.

---

## 8. Example Recap with `Movie` Class

```java
List<Movie> movies = List.of(
    new Movie("A", 12, Movie.GENRE.ACTION),
    new Movie("B", 22, Movie.GENRE.ROMANCE),
    new Movie("C", 32, Movie.GENRE.COMEDY)
);

// Filter + map + collect
List<String> popularMovies = movies.stream()
    .filter(m -> m.likes > 20)
    .map(m -> m.title)
    .toList();

System.out.println(popularMovies); // [B, C]
```

---

## 9. Key Takeaways

- Streams = **pipeline of data** with intermediate + terminal operations.
- Encourages **declarative programming** (what to do, not how).
- Avoids manual loops and state.
- Powerful when combined with **lambdas + functional interfaces**.
- Collectors let you transform results into lists, sets, maps, summaries, or groups.

---
