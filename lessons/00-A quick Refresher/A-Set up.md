# **Introduction to Java Programming 🚀**

Welcome to the world of Java!
In this lesson, you’ll set up your development environment, learn the basic structure of a Java program, and write your very first **"Hello, World!"** application.
We’ll also explore how Java code runs behind the scenes and share a few fun facts about the language.
This course will be using **Java 24**.

---

## 1. Setting Up Your Development Environment

To write and run Java code, you need two main components:

1. **Java Development Kit (JDK)** – contains the compiler, Java Virtual Machine (JVM), and essential tools.
2. **Integrated Development Environment (IDE)** – software that makes coding easier with features like autocomplete, debugging, and project management.

---

### **A. Installing the JDK**

1. Download a **Java 24-compatible JDK** from:
   [OpenJdk](https://openjdk.org/) for OpenJDK.

2. Choose the correct installer for your operating system (Windows, macOS, Linux).
   3.Follow the setup instructions.

---

### **B. Installing IntelliJ IDEA**

We’ll use **IntelliJ IDEA Community Edition** (free) for this course.

1. Download from the [JetBrains website](https://www.jetbrains.com/idea/download/).
2. Install it using the provided installer.
3. On first launch, configure IntelliJ to use the JDK you installed.

---

## 2. Anatomy of a Java Program

A simple Java program has a specific structure. Here’s an example:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### **Breaking it down:**

- **`public class HelloWorld`**
  Declares a class named `HelloWorld`.
  - In Java, all code lives inside a class.
  - The file name **must** match the class name (e.g., `HelloWorld.java`).
  - `public` means the class is accessible from anywhere.

- **`public static void main(String[] args)`**
  The **entry point** of a Java program.
  - `public` → accessible from anywhere.
  - `static` → belongs to the class, not an instance which allows the method to be called without creating an object of the class (the JVM needs to call it directly).
  - `void` → doesn’t return a value.
  - `main` → special method name that JVM looks for.
  - `(String[] args)` → accepts command-line arguments as an array of strings.

- **`System.out.println("Hello, World!");`**
  Prints text to the console.

---

## 3. Writing Your First Program

1. Open IntelliJ IDEA and create a **new project**.
2. Create a new Java class named `HelloWorld`.
3. Type in the following code:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

4. Click the green **Run** button next to `main`.
   You should see:

```
Hello, World!
```

🎉 Congratulations — you’ve just written your first Java program!

---

## 4. How Java Code Runs

Java is **both compiled and interpreted**:

1. **Compilation**
   - The Java compiler (`javac`) translates `.java` source files into **bytecode** (`.class` files).
   - Bytecode is platform-independent.

2. **Execution**
   - The JVM reads the bytecode and translates it into machine code for your operating system (using an interpreter or Just-In-Time compiler).
   - This is why Java follows the **"Write Once, Run Anywhere"** principle.

---

## 5. Fun Facts About Java

- **Creator:** James Gosling at Sun Microsystems, mid-1990s.
- **Original Name:** _Oak_ (after a tree outside Gosling’s office).
- **Why "Java"?** Named after Java coffee from Indonesia.
- **Platform-Independent:** Runs on Windows, macOS, Linux, and more — no code changes needed.
- **Everywhere:** Powers Android apps, enterprise systems, big data tools, and even embedded devices.

---

## 6. Course Structure

This course will take you from **beginner** to **intermediate** Java developer in three parts:

### Part 1: Fundamentals

- The Java Type System
- Building a Small Project
- Control Flow (Conditionals & Loops)
- Clean Coding Techniques
- Debugging
- Packaging Your Code

### Part 2: Object-Oriented Programming (OOP)

- Classes & Objects
- Inheritance
- Polymorphism
- Abstraction
- Encapsulation

### Part 3: Advanced Concepts

- Functional Programming in Java
- Multithreading
- ExecutorService

### Part 4: Async java

- CompletableFuture

✅ By the end of this course, you’ll be confident in writing Java programs, understanding how they work, and applying best practices.
