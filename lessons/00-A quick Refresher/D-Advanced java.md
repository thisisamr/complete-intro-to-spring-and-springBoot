# **Java Exception Handling**

## _Learning Objectives_

- Understand what exceptions are and why they're important
- Distinguish between checked and unchecked exceptions
- Use try-catch-finally blocks effectively
- Create custom exceptions
- Apply best practices for exception handling

---

## What is an Exception?

An **exception** is an object that contains information about an error that occurred during program execution. When an error occurs, Java creates an exception object and "throws" it, disrupting the normal flow of the program.

### Why Do We Need Exception Handling?

- **Graceful Error Recovery**: Handle errors without crashing the application
- **User Experience**: Provide meaningful error messages to users
- **Debugging**: Get detailed information about what went wrong
- **Resource Management**: Ensure resources are properly cleaned up

---

## The Exception Hierarchy

Java organizes exceptions in a hierarchy:

```
Throwable
├── Exception (Recoverable errors)
│   ├── IOException (Checked)
│   ├── SQLException (Checked)
│   └── RuntimeException (Unchecked)
│       ├── NullPointerException
│       ├── IndexOutOfBoundsException
│       └── IllegalArgumentException
└── Error (Serious system errors)
    ├── OutOfMemoryError
    └── StackOverflowError
```

### Types of Exceptions

#### 1. Checked Exceptions

- **Must** be handled or declared to be thrown
- Compiler enforces handling
- Examples: `IOException`, `SQLException`, `FileNotFoundException`
- Represent recoverable conditions

#### 2. Unchecked Exceptions (Runtime Exceptions)

- **Optional** to handle
- Occur at runtime due to programming errors
- Examples: `NullPointerException`, `IndexOutOfBoundsException`
- Usually indicate bugs in code

#### 3. Errors

- Serious problems outside application control
- Examples: `OutOfMemoryError`, `StackOverflowError`
- Generally should not be caught

---

## Basic Exception Handling: Try-Catch

### Simple Try-Catch Block

```java
try {
    // Code that might throw an exception
    String result = riskyOperation();
} catch (SpecificException e) {
    // Handle the specific exception
    System.out.println("Error occurred: " + e.getMessage());
}
```

### Multiple Catch Blocks

```java
try {
    processFile("data.txt");
} catch (FileNotFoundException e) {
    System.out.println("File not found: " + e.getMessage());
} catch (IOException e) {
    System.out.println("IO error: " + e.getMessage());
} catch (Exception e) {
    System.out.println("Unexpected error: " + e.getMessage());
}
```

### Multi-Catch (Java 7+)

```java
try {
    performOperation();
} catch (IOException | SQLException e) {
    System.out.println("Database or file error: " + e.getMessage());
}
```

---

## The Finally Block

The `finally` block **always** executes, regardless of whether an exception occurs:

```java
FileReader reader = null;
try {
    reader = new FileReader("important.txt");
    // Process file
} catch (IOException e) {
    System.out.println("File error: " + e.getMessage());
} finally {
    // Cleanup code - ALWAYS runs
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) {
            System.out.println("Error closing file");
        }
    }
    System.out.println("Cleanup completed");
}
```

---

## Try-With-Resources (Automatic Resource Management)

Java 7 introduced try-with-resources for automatic cleanup:

```java
// Old way (manual resource management)
FileReader reader = null;
try {
    reader = new FileReader("data.txt");
    // Use reader
} finally {
    if (reader != null) {
        reader.close();
    }
}

// New way (automatic resource management)
try (FileReader reader = new FileReader("data.txt")) {
    // Use reader - automatically closed
    int character;
    while ((character = reader.read()) != -1) {
        System.out.print((char) character);
    }
}
```

### Multiple Resources

```java
try (FileReader input = new FileReader("input.txt");
     FileWriter output = new FileWriter("output.txt")) {
    // Both resources automatically closed
    // Process files
}
```

---

## Throwing Exceptions

### Using the `throw` Keyword

```java
public void validateAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    if (age > 150) {
        throw new IllegalArgumentException("Age seems unrealistic");
    }
}
```

### Using the `throws` Keyword (Method Declaration)

```java
public void readConfiguration() throws IOException {
    // Method that might throw IOException
    Files.readAllLines(Paths.get("config.properties"));
}

public void processData() {
    try {
        readConfiguration();
    } catch (IOException e) {
        System.out.println("Configuration error: " + e.getMessage());
    }
}
```

---

## Creating Custom Exceptions

### Checked Custom Exception

```java
public class InsufficientFundsException extends Exception {
    private double balance;
    private double withdrawAmount;

    public InsufficientFundsException() {
        super("Insufficient funds in account");
    }

    public InsufficientFundsException(String message) {
        super(message);
    }

    public InsufficientFundsException(double balance, double withdrawAmount) {
        super(String.format("Insufficient funds. Balance: %.2f, Attempted withdrawal: %.2f",
              balance, withdrawAmount));
        this.balance = balance;
        this.withdrawAmount = withdrawAmount;
    }

    // Getters
    public double getBalance() { return balance; }
    public double getWithdrawAmount() { return withdrawAmount; }
}
```

### Unchecked Custom Exception

```java
public class InvalidEmailException extends RuntimeException {
    public InvalidEmailException(String email) {
        super("Invalid email format: " + email);
    }
}
```

### Using Custom Exceptions

```java
public class BankAccount {
    private double balance;

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(balance, amount);
        }
        balance -= amount;
    }

    public void setEmail(String email) {
        if (!email.contains("@")) {
            throw new InvalidEmailException(email);
        }
        // Set email
    }
}
```

---

## Exception Chaining

Sometimes you want to catch one exception and throw another while preserving the original cause:

```java
public class DataProcessor {
    public void processUserData(String filename) throws DataProcessingException {
        try {
            // Attempt to read file
            List<String> lines = Files.readAllLines(Paths.get(filename));
            // Process data...
        } catch (IOException e) {
            // Wrap the IOException in our custom exception
            throw new DataProcessingException("Failed to process user data from " + filename, e);
        }
    }
}

public class DataProcessingException extends Exception {
    public DataProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

---

## Best Practices for Exception Handling

### **DO's**

1. **Be Specific**: Catch specific exceptions rather than generic `Exception`
2. **Fail Fast**: Validate inputs early and throw exceptions immediately
3. **Provide Context**: Include meaningful error messages
4. **Log Appropriately**: Log exceptions at the right level
5. **Clean Up Resources**: Use try-with-resources or finally blocks

```java
// Good: Specific exception handling
public void parseInteger(String input) {
    if (input == null || input.trim().isEmpty()) {
        throw new IllegalArgumentException("Input cannot be null or empty");
    }

    try {
        int result = Integer.parseInt(input.trim());
        // Process result
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid number format: " + input, e);
    }
}
```

### DON'Ts

1. **Don't Swallow Exceptions**: Empty catch blocks hide problems
2. **Don't Catch Exception/Throwable**: Too broad, might hide serious errors
3. **Don't Use Exceptions for Control Flow**: Exceptions should be exceptional
4. **Don't Log and Rethrow**: Causes duplicate log entries

```java
// Bad: Swallowing exceptions
try {
    riskyOperation();
} catch (Exception e) {
    // This hides the problem!
}

// Good: At minimum, log the exception
try {
    riskyOperation();
} catch (Exception e) {
    logger.error("Failed to perform risky operation", e);
    // Decide whether to rethrow, return default, etc.
}
```

---

## Practical Examples

### Example 1: File Processing with Proper Error Handling

```java
public class FileProcessor {
    public String readFileContent(String filename) throws FileProcessingException {
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("Filename cannot be null or empty");
        }

        try (BufferedReader reader = Files.newBufferedReader(Paths.get(filename))) {
            return reader.lines()
                        .collect(Collectors.joining("\n"));
        } catch (NoSuchFileException e) {
            throw new FileProcessingException("File not found: " + filename, e);
        } catch (AccessDeniedException e) {
            throw new FileProcessingException("Access denied to file: " + filename, e);
        } catch (IOException e) {
            throw new FileProcessingException("Error reading file: " + filename, e);
        }
    }
}
```

### Example 2: Database Operations

```java
public class UserService {
    public User findUserById(Long id) throws UserNotFoundException {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("User ID must be positive");
        }

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {

            stmt.setLong(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapToUser(rs);
            } else {
                throw new UserNotFoundException("No user found with ID: " + id);
            }

        } catch (SQLException e) {
            throw new DatabaseException("Database error while finding user", e);
        }
    }
}
```

### Example 3: Input Validation

```java
public class Calculator {
    public double divide(double dividend, double divisor) {
        if (divisor == 0) {
            throw new ArithmeticException("Division by zero is not allowed");
        }

        if (Double.isNaN(dividend) || Double.isNaN(divisor)) {
            throw new IllegalArgumentException("NaN values are not supported");
        }

        return dividend / divisor;
    }

    public int factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Factorial is not defined for negative numbers");
        }

        if (n > 20) {
            throw new ArithmeticException("Factorial too large, would cause overflow");
        }

        int result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}
```

---

## Exception Handling Patterns

### Pattern 1: Translation Pattern

Convert low-level exceptions to high-level, domain-specific exceptions:

```java
public class OrderService {
    public void saveOrder(Order order) throws OrderProcessingException {
        try {
            database.save(order);
        } catch (SQLException e) {
            throw new OrderProcessingException("Failed to save order", e);
        }
    }
}
```

### Pattern 2: Recovery Pattern

Try to recover from the error:

```java
public String loadConfiguration() {
    try {
        return Files.readString(Paths.get("app.config"));
    } catch (IOException e) {
        logger.warn("Could not load configuration file, using defaults", e);
        return getDefaultConfiguration();
    }
}
```

### Pattern 3: Circuit Breaker Pattern

Fail fast when a resource is unavailable:

```java
public class ExternalServiceClient {
    private boolean circuitOpen = false;

    public String callExternalService() throws ServiceUnavailableException {
        if (circuitOpen) {
            throw new ServiceUnavailableException("Circuit breaker is open");
        }

        try {
            return performNetworkCall();
        } catch (NetworkException e) {
            circuitOpen = true;
            throw new ServiceUnavailableException("External service unavailable", e);
        }
    }
}
```

---

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Generic Exception Catching

```java
// Bad
try {
    someOperation();
} catch (Exception e) {
    // Too broad!
}

// Good
try {
    someOperation();
} catch (SpecificException e) {
    // Handle specific case
} catch (AnotherSpecificException e) {
    // Handle another specific case
}
```

### Pitfall 2: Exception Conversion Antipattern

```java
// Bad: Converting checked to unchecked without good reason
try {
    checkedOperation();
} catch (CheckedException e) {
    throw new RuntimeException(e); // Loses important type information
}

// Good: Provide meaningful domain exception
try {
    checkedOperation();
} catch (CheckedException e) {
    throw new BusinessLogicException("Operation failed due to data issue", e);
}
```

### Pitfall 3: Resource Leaks

```java
// Bad: Manual resource management
FileInputStream fis = null;
try {
    fis = new FileInputStream("file.txt");
    // Use stream
} catch (IOException e) {
    // Handle error
} finally {
    if (fis != null) {
        try {
            fis.close(); // Can also throw IOException!
        } catch (IOException e) {
            // What do we do here?
        }
    }
}

// Good: Try-with-resources
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // Use stream - automatically closed
} catch (IOException e) {
    // Handle error - resource still cleaned up
}
```

---

## Advanced Topics on exceptions

### Exception Suppression

When using try-with-resources, if both the try block and the close() method throw exceptions, the close() exception is suppressed:

```java
try (FileReader reader = new FileReader("file.txt")) {
    // If this throws IOException
    throw new IOException("Processing error");
    // And reader.close() also throws IOException
    // The close() exception is suppressed
} catch (IOException e) {
    System.out.println("Main exception: " + e.getMessage());

    // Access suppressed exceptions
    Throwable[] suppressed = e.getSuppressed();
    for (Throwable s : suppressed) {
        System.out.println("Suppressed: " + s.getMessage());
    }
}
```

### Stack Trace Analysis

```java
public void demonstrateStackTrace() {
    try {
        methodA();
    } catch (Exception e) {
        // Print full stack trace
        e.printStackTrace();

        // Get stack trace elements programmatically
        StackTraceElement[] stack = e.getStackTrace();
        for (StackTraceElement element : stack) {
            System.out.println("Method: " + element.getMethodName() +
                             " in " + element.getClassName() +
                             " at line " + element.getLineNumber());
        }
    }
}

private void methodA() {
    methodB();
}

private void methodB() {
    throw new RuntimeException("Something went wrong in methodB");
}
```

---

## Complete Working Example

Let's put it all together with a comprehensive banking system example:

```java
import java.io.*;
import java.util.*;

public class BankingSystem {

    public static void main(String[] args) {
        BankAccount account = new BankAccount("12345", 1000.0);

        // Example 1: Successful withdrawal
        try {
            account.withdraw(200.0);
            System.out.println("Withdrawal successful. New balance: " + account.getBalance());
        } catch (InsufficientFundsException e) {
            System.out.println("Transaction failed: " + e.getMessage());
            System.out.println("Available balance: " + e.getAvailableBalance());
        }

        // Example 2: Failed withdrawal
        try {
            account.withdraw(2000.0);
        } catch (InsufficientFundsException e) {
            System.out.println("Transaction failed: " + e.getMessage());
            handleInsufficientFunds(e);
        }

        // Example 3: File operations with proper error handling
        try {
            account.saveToFile("account.txt");
            System.out.println("Account saved successfully");
        } catch (AccountPersistenceException e) {
            System.out.println("Failed to save account: " + e.getMessage());
            // Log full stack trace for debugging
            e.printStackTrace();
        }

        // Example 4: Invalid operations
        try {
            account.withdraw(-50); // Invalid amount
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid operation: " + e.getMessage());
        } catch (InsufficientFundsException e) {
            System.out.println("Insufficient funds: " + e.getMessage());
        }
    }

    private static void handleInsufficientFunds(InsufficientFundsException e) {
        System.out.println("Suggested actions:");
        System.out.println("1. Deposit additional funds");
        System.out.println("2. Withdraw a smaller amount (max: " + e.getAvailableBalance() + ")");
        System.out.println("3. Contact customer service");
    }
}

class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialBalance) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Account number cannot be null or empty");
        }
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }

        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public void withdraw(double amount) throws InsufficientFundsException {
        validateAmount(amount);

        if (amount > balance) {
            throw new InsufficientFundsException(
                "Insufficient funds for withdrawal of " + amount,
                balance,
                amount
            );
        }

        balance -= amount;
    }

    public void deposit(double amount) {
        validateAmount(amount);
        balance += amount;
    }

    private void validateAmount(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (Double.isNaN(amount) || Double.isInfinite(amount)) {
            throw new IllegalArgumentException("Amount must be a valid number");
        }
    }

    public void saveToFile(String filename) throws AccountPersistenceException {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filename))) {
            writer.println("Account Number: " + accountNumber);
            writer.println("Balance: " + balance);
            writer.println("Last Updated: " + new Date());
        } catch (IOException e) {
            throw new AccountPersistenceException(
                "Failed to save account " + accountNumber + " to file " + filename, e);
        }
    }

    public double getBalance() {
        return balance;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}

// Custom Checked Exception
class InsufficientFundsException extends Exception {
    private final double availableBalance;
    private final double requestedAmount;

    public InsufficientFundsException(String message, double availableBalance, double requestedAmount) {
        super(message);
        this.availableBalance = availableBalance;
        this.requestedAmount = requestedAmount;
    }

    public double getAvailableBalance() {
        return availableBalance;
    }

    public double getRequestedAmount() {
        return requestedAmount;
    }
}

// Custom Checked Exception for Persistence
class AccountPersistenceException extends Exception {
    public AccountPersistenceException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

---

## Summary and Key Takeaways

1. **Exceptions are objects** that represent errors and provide information about what went wrong
2. **Checked exceptions** must be handled or declared, while **unchecked exceptions** are optional to handle
3. **Try-catch-finally** provides structured error handling with guaranteed cleanup
4. **Try-with-resources** automatically manages resource cleanup
5. **Custom exceptions** should provide meaningful context and follow naming conventions
6. **Exception chaining** preserves the original cause while providing domain-specific context
7. **Best practices** include being specific, failing fast, and providing good error messages

## Practice Exercises

1. Create a custom `EmailValidationException` and use it in a user registration system
2. Write a file backup utility that handles various IO exceptions gracefully
3. Implement a retry mechanism for network operations that fail
4. Create a validation framework that throws specific exceptions for different validation failures

Remember: Good exception handling makes your code more robust, easier to debug, and provides better user experience!

---

# Java Generics — Upper Bounds, Lower Bounds, and Type Erasure

---

## Motivation: Why Generics?

- Generics let us **parameterize types**.
- Instead of writing one container for `int`, one for `String`, one for `User`, we write **one generic class** that works with all.

👉 Example:

```java
genericList<Integer> list = new genericList<>();
list.add(12); // Compiler automatically boxes int → Integer
```

---

## Generic Methods

We can also write methods that are **generic**:

```java
public static <T extends Number> T add(T n1, T n2, BinaryOperator<T> adder) {
    return adder.apply(n1, n2);
}
```

- `<T extends Number>` → This restricts `T` to subclasses of `Number`.
- This means you can’t pass a `String`.
- You can also bound to **interfaces** (`Comparable`, `Cloneable`, or multiple using `&`).

---

## Generics and Inheritance

⚠️ Important rule: **Generics are invariant.**

That means:

- `Instructor` is a subclass of `User`.
- But `genericList<Instructor>` is **not** a subclass of `genericList<User>`.

👉 Example:

```java
genericList<User> users = new genericList<>();
genericList<Instructor> instructors = new genericList<>();
// ❌ You cannot assign instructors to users
```

Why? Because it would break type safety — you could try to put a `User` into a `genericList<Instructor>`.

---

## Wildcards to the Rescue

Wildcards let us relax this restriction.

### Upper Bound (`? extends T`)

- `? extends User` means: _“a list of some subtype of User”_.
- You can **read safely**, but **can’t add**, because the compiler doesn’t know the exact subtype.

### Lower Bound (`? super T`)

- `? super User` means: _“a list of some supertype of User”_.
- You can **safely add Users or subclasses (Instructor)**, but reading gives you `Object`.

👉 Example from your code:

```java
public static void printUsers(genericList<? super User> users) {
    users.add(new Instructor(2));  // ✅ Safe
    Object obj = users.get(0);     // ❌ Only Object, not User
}
```

---

## CEPS — The Core Concepts

1. **Compile-time safety**
   Generics catch type errors early. No need for casting.

2. **Erasure**
   - Generics don’t exist at runtime in Java.
   - The compiler erases them and treats them as `Object`.
   - Example: `genericList<Integer>` becomes `genericList<Object>` internally.

3. **Polymorphism**
   Generics allow code reuse for multiple types (e.g., one `genericList` for all).

4. **Subtyping (and why it’s tricky)**
   - Regular inheritance does not apply directly to generics (`List<Cat>` is not a `List<Animal>`).
   - Wildcards help us bridge that gap.

---

## Comparable Example

Your `User` implements `Comparable<User>`:

```java
public static class User implements Comparable<User> {
    int age;

    @Override
    public int compareTo(User other) {
        return this.age - other.age;
    }

    public String toString() { return "user"; }
}
```

- This shows how generics work with **interfaces**.
- We can compare two users safely, because the compiler enforces type matching.

---

## Big Picture

- Use **upper bounds (`extends`)** when you want to **read** from a structure.
- Use **lower bounds (`super`)** when you want to **write** to it.
- Remember **type erasure** → at runtime, all generics become raw `Object` types.
- Generics give us **type safety**, **polymorphism**, and **reusable code** without duplication.

---

# 🎤 Tip

- "`extends` is for producers (they produce values you read)."
- "`super` is for consumers (they consume values you put in)."

👉 This is the **PECS rule** (Producer Extends, Consumer Super).

---

# Java Collections Framework

## Introduction

The **Java Collections Framework (JCF)** provides a set of interfaces and classes to store and manipulate groups of objects. Instead of manually building arrays and data structures, JCF gives us powerful, reusable, and efficient implementations.

Key ideas:

- A **Collection** = a group of objects.
- Interfaces like `List`, `Set`, `Queue`, and `Map` define **different types of collections**.
- Utility classes like `Collections` provide helpful static methods (sorting, searching, adding multiple items, etc.).

---

## The `Collection` Interface

The `Collection` interface is the **root** of the collection hierarchy (except for maps). It provides basic operations such as:

- `add(E element)`
- `remove(Object element)`
- `contains(Object element)`
- `clear()`
- `equals(Object other)`
- Iteration (with for-each or an iterator).

### Example: Using a `Collection`

```java
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

public class Coll {
    public static void show() {
        Collection<String> col = new ArrayList<>();

        col.add("a");
        col.add("b");
        col.add("c");
        col.add("d");
        Collections.addAll(col, "s", "dd"); // bulk add
        col.remove("dd"); // remove element

        System.out.println(col);               // [a, b, c, d, s]
        System.out.println(col.contains("a")); // true

        var res = new ArrayList<String>();
        Collections.addAll(res, "a", "b", "c", "d");

        System.out.println(col.equals(res)); // compares content, not reference
        col.clear();
        System.out.println(col);             // []
    }
}
```

---

## Iteration and `Iterable<T>`

Collections support iteration using the **`Iterable<T>`** interface.

### Key concepts:

- `Iterable<T>` requires `iterator()`.
- `Iterator<T>` provides:
  - `hasNext()`
  - `next()`

### Example: Custom Generic List

```java
import java.util.Iterator;

public class GenericList<T> implements Iterable<T> {
    private int count = 0;
    private T[] data;

    @SuppressWarnings("unchecked")
    public GenericList(int cap) {
        this.data = (T[]) new Object[cap];
    }

    public void add(T item) {
        if (count < data.length)
            data[count++] = item;
    }

    @Override
    public Iterator<T> iterator() {
        return new GenericListIterator<>(this);
    }

    // Inner iterator class
    private static class GenericListIterator<T> implements Iterator<T> {
        private GenericList<T> gl;
        private int index = 0;

        GenericListIterator(GenericList<T> list) {
            this.gl = list; // reference, not a copy
        }

        @Override
        public boolean hasNext() {
            return index < gl.count;
        }

        @Override
        public T next() {
            return gl.data[index++];
        }
    }
}
```

✅ Each call to `iterator()` returns a **new iterator** object, so multiple loops can iterate independently.

---

## The `List` Interface

A `List`:

- Represents an **ordered sequence**.
- Supports index-based access.
- Allows duplicates.

### Example

```java
import java.util.ArrayList;
import java.util.List;

public class Lists {
    public static void show() {
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");

        List<Integer> ints = List.of(1, 2, 3, 4); // immutable list
        System.out.println(ints);                 // [1, 2, 3, 4]
        System.out.println(names);                // [Alice, Bob]
        System.out.println(ints.subList(0, 2));   // [1, 2]
    }
}
```

---

## Sorting: `Comparable` and `Comparator`

Sorting requires either:

- `Comparable<T>` → defines a **natural order**.
- `Comparator<T>` → provides a **custom order**.

### Example

```java
import java.util.*;

public class Sorting {
    public static void main(String[] args) {
        var cus = new ArrayList<Customer>();
        cus.add(new Customer("Amr", 100));
        cus.add(new Customer("zzz", 11));
        cus.add(new Customer("huda", 90));
        cus.add(new Customer("salwa", 1000));

        Collections.sort(cus); // natural order: by name
        cus.sort(new CustomerComparator()); // custom: by invoice
        System.out.println(cus);
    }

    static class Customer implements Comparable<Customer> {
        String name;
        private int invoice;

        Customer(String name, int in) {
            this.name = name;
            this.invoice = in;
        }

        @Override
        public int compareTo(Customer c) {
            return this.name.compareTo(c.name); // alphabetical
        }

        public int getInvoice() {
            return invoice;
        }

        @Override
        public String toString() {
            return name + " (" + invoice + ")";
        }
    }

    static class CustomerComparator implements Comparator<Customer> {
        @Override
        public int compare(Customer o1, Customer o2) {
            return o2.getInvoice() - o1.getInvoice(); // descending invoices
        }
    }
}
```

---

## The `Queue` Interface

A `Queue`:

- Models jobs to be processed in order.
- Methods:
  - `add()` / `offer()`
  - `remove()` / `poll()`
  - `peek()`

### Example

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueInterface {
    public static void main(String[] args) {
        Queue<String> ppl = new ArrayDeque<>();

        ppl.add("amr");
        ppl.add("ola");
        ppl.add("soliman");

        System.out.println(ppl.peek());   // look at front
        System.out.println(ppl.remove()); // remove front
        System.out.println(ppl.poll());   // remove or return null if empty
    }
}
```

---

## 7. The `Set` Interface

A `Set`:

- Stores **unique values**.
- No duplicates.
- Useful for unions, intersections, and difference.

### Example

```java
import java.util.*;

public class SetDemo {
    public static void main(String[] args) {
        Set<Integer> ids = new HashSet<>(List.of(1, 2, 3, 4, 5, 5, 2));
        Set<Integer> ids2 = new HashSet<>(List.of(3, 4, 7, 8, 9));

        ids.retainAll(ids2); // intersection
        System.out.println(ids); // [3, 4]
    }
}
```

---

## 8. The `Map` Interface

A `Map<K, V>`:

- Stores key-value pairs.
- Keys are unique, values can repeat.
- Fast lookups.

### Example

```java
import java.util.*;

public class HashTables {
    public static void main(String[] args) {
        Map<Integer, String> users = new HashMap<>();
        users.put(1, "amr");
        users.put(2, "ola");
        users.put(3, "rawia");

        System.out.println(users.get(1)); // lookup by key
        users.replace(1, "Aaaa");
        System.out.println(users);

        for (var entry : users.entrySet())
            System.out.println(entry.getKey() + " -> " + entry.getValue());
    }
}
```

---

## 9. Recap

- **Collection**: root interface (add/remove/contains).
- **List**: ordered, indexable, duplicates allowed.
- **Set**: unique values.
- **Queue**: process elements in order.
- **Map**: key-value pairs (not a Collection but part of JCF).
- Sorting:
  - `Comparable`: natural order.
  - `Comparator`: custom order.

---
