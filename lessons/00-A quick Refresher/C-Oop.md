# **Introduction to Object-Oriented Programming (OOP) in Java**

Welcome to the second part of our Java refresher course.
In this section, we’ll start exploring **Object-Oriented Programming (OOP)** — the most widely used programming paradigm in Java.

---

## What is OOP?

OOP (Object-Oriented Programming) is just a **programming paradigm** — a style of writing code.
It’s not the only one:

- **Procedural** (C, early Java)
- **Functional** (Java Streams, Haskell, Scala)
- **Event-driven** (GUIs, message-based systems)
- **Object-oriented** (Java, C++, C#)

👉 In OOP, we **combine data and behavior into a single unit called an object**.

This differs from functional programming, which separates data and behavior.

⚡ Important:

- Don’t get stuck on paradigms. Each has its strengths.
- Java is classically OOP-focused, but modern approaches (like Go or Rust) use different models.
- Use the style that best **solves your problem**.

---

## The Four Pillars of OOP

In this section of the course, we’ll cover:

- **Encapsulation** – bundling data + methods, controlling access
- **Abstraction** – hiding details, showing only essentials
- **Inheritance** – reusing existing code by extending classes
- **Polymorphism** – objects behaving differently under the same interface

Additionally, we’ll learn about:

- **Classes** (the building blocks of OOP)
- **Constructors**
- **Getters & Setters**
- **Method Overloading**
- **Interfaces**
- **Coupling & Dependency** between classes

---

## Classes and Objects

A **class** is like a **blueprint** or **type**.

Example:

```java
class Car {
    String model;
    int year;
}
```

When we create something from this class, we get an **object (or instance)**:

```java
Car myCar = new Car();
```

---

## Memory Model in Java

Java memory is divided into:

- **Stack** – stores **primitive values** and **object references** (addresses).
- **Heap** – stores the actual **objects** (created with `new`).

🔑 Key points:

- When a method ends, stack variables are removed.
- If no references point to an object in the heap, the **Garbage Collector** will eventually clean it up.

---

## Example: Our First Class

Here’s a small example:

```java
public class Main {
    public static void main(String[] args) {
        // Create an instance of TextBox
        TextBox tb = new TextBox("BOX1");

        // Print text in lowercase
        System.out.println(tb.text.toLowerCase());
    }

    static class TextBox {
        // Field
        public String text;

        // Constructor
        public TextBox(String value) {
            this.text = value;
        }

        // Setter method
        public void setText(String text) {
            this.text = text;
        }

        // Clear method
        public void clear() {
            this.text = "";
        }
    }
}
```

---

### Explanation:

- `TextBox` is a **class** (blueprint).
- `text` is a **field** (data stored in the object).
- The **constructor** initializes the object.
- `setText` and `clear` are **methods** that define behavior.
- In `main`, we create an **object** (`tb`) using `new TextBox("BOX1")`.

---

# From Procedural to Object-Oriented Programming

In the last lesson, we introduced **classes** and saw how objects bundle **data + behavior**.

Now, let’s take a simple example — calculating an employee’s wage — and see how it looks:

1. First, in a **procedural style** (functions + variables, separate).
2. Then, in **OOP style** (using a class that encapsulates data + behavior).

---

## Procedural Approach

In a procedural style, we might write something like this:

```java
public class ProceduralDemo {
    public static void main(String[] args) {
        int baseSalary = 5000;
        int hourlyRate = 50;
        int extraHours = 10;

        int wage = calculateWage(baseSalary, hourlyRate, extraHours);
        System.out.println(wage);
    }

    public static int calculateWage(int base, int hourlyRate, int extraHours) {
        return base + extraHours * hourlyRate;
    }
}
```

👉 Here, we:

- Store data (`baseSalary`, `hourlyRate`, `extraHours`) in **separate variables**.
- Write a **standalone function** (`calculateWage`) to compute the result.

This works, but as the program grows, managing all these **loose variables** gets messy.

---

## OOP Approach

In OOP, we bundle the **data** (like salary and hourly rate) and the **functionality** (like calculating wage) inside a single **class**.

```java
public class Procedural {
    public static void main(String[] args) {
        Employee e = new Employee();
        int wage = e.calculateWage(12);

        e.setBaseSalary(6000); // using setter
        System.out.println(wage);
    }

    static class Employee {
        private int baseSalary = 5000;
        public int hourlyRate = 50;

        public int getBaseSalary() {
            return baseSalary;
        }

        public void setBaseSalary(int baseSalary) {
            if (baseSalary <= 0) {
                throw new IllegalArgumentException("Base salary cannot be negative or zero");
            }
            this.baseSalary = baseSalary;
        }

        public int calculateWage(int extraHours) {
            return this.baseSalary + this.hourlyRate * extraHours;
        }
    }
}
```

---

### What Changed?

1. **Encapsulation**:
   - We made `baseSalary` **private** so it cannot be modified directly.
   - We control changes using **getters and setters**.
   - This allows us to enforce rules (e.g., salary cannot be `0` or negative).

2. **Methods inside the class**:
   - Instead of writing a separate `calculateWage` function, it is now part of `Employee`.
   - This makes sense because "wage calculation" is **behavior** of an Employee.

---

## Why Encapsulation Matters

Let’s say we didn’t hide `baseSalary` and left it public:

```java
e.baseSalary = -1000;  // valid in procedural style, but meaningless!
```

That would allow invalid states.
By making it **private** and controlling it with a setter, we ensure data integrity:

```java
public void setBaseSalary(int baseSalary) {
    if (baseSalary <= 0) {
        throw new IllegalArgumentException("Base salary cannot be negative or zero");
    }
    this.baseSalary = baseSalary;
}
```

---

✅ With this, we’ve transitioned from procedural code → OOP design.
Next, we’ll look at **constructors, overloading, and further encapsulation improvements**.

---

# **Abstraction, Coupling, Constructors, and Static Members**

## Abstraction

- **Definition:** Abstraction is simply reducing complexity by hiding unnecessary details.
- Instead of exposing raw class members (fields) to the outside world, we expose **methods** that control how other code interacts with the class.
- This hides implementation details and protects the integrity of the class.

---

## Coupling

- **Coupling** happens when classes depend on each other.
- Coupling is not always bad, but if classes are **tightly coupled**, then changing one class may force you to change many others.
- By reducing coupling, we make our code more **maintainable** and **flexible**.

---

## Example: Employee Class

Instead of exposing fields directly, we use **getters and setters** with validation.

```java
public class Employee {

    private int hourlyRate = 50;
    private int baseSalary = 5000;

    public int getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(int baseSalary) {
        if (baseSalary <= 0) {
            throw new IllegalArgumentException("Base salary cannot be negative or zero");
        }
        this.baseSalary = baseSalary;
    }

    public int calculateWage(int extraHours) {
        return this.baseSalary + this.hourlyRate * extraHours;
    }
}
```

### Key points:

- We made `baseSalary` **private** to prevent direct modification.
- We added a **setter method** with validation to avoid putting the class into a “bad state.”
- We exposed a **method** (`calculateWage`) to perform work instead of letting the outside code do the calculation.

---

## Constructors

Constructors are special methods that initialize objects when they are created.
They help us avoid forgetting to initialize important values.

```java
class Employee {
    private int baseSalary;
    private int hourlyRate;

    // Constructor with parameters
    public Employee(int baseSalary, int hourlyRate) {
        this.baseSalary = baseSalary;
        this.hourlyRate = hourlyRate;
    }

    // Overloaded constructor with default values
    public Employee() {
        this.baseSalary = 5000;
        this.hourlyRate = 10;
    }
}
```

### Notes:

- By providing multiple constructors (**constructor overloading**), we can simulate “default parameters” in Java.
- Unlike languages like C#, C++, Go, or JavaScript, Java does not support default parameter values directly. Overloading is the workaround.

---

## Static Members

- A class can have **instance members** (belong to an object) or **static members** (belong to the class itself).
- **Static methods** are useful when we don’t need an object, for example the `main` method:

```java
public class Program {
    public static void main(String[] args) {
        // no object needed because main is static
        System.out.println("Hello OOP");
    }
}
```

### When to use static:

- When a value or behavior should be **shared across all objects**.
- When you want to provide **utility functions** (e.g., `Math.sqrt()`).

---

## Transition

We’ve now seen:

- How abstraction helps hide details.
- How to reduce coupling between classes.
- How constructors and method overloading make our classes safer and more flexible.
- The difference between instance and static members.

👉 **Next time, we’ll look at _inheritance_** — how one class can derive from another and reuse its code.

---

# **Inheritance, Casting, Abstract Classes, and Polymorphism**

In the previous section, we talked about the **basics of OOP** – classes, objects, encapsulation, abstraction, and methods.
Now we’re going to push further into **how objects relate to each other** through inheritance, casting, abstract classes, and polymorphism.

---

## Upcasting and Downcasting

In Java, when you have a class hierarchy:

```java
class UiControl { ... }
class TextBox extends UiControl { ... }
```

- **Upcasting** → assigning a subclass (`TextBox`) to a superclass (`UiControl`) reference.
  ✅ Always safe.
- **Downcasting** → forcing a superclass reference back into a subclass.
  ⚠️ Dangerous, only works if the object is _actually_ that subclass at runtime.

```java
UiControl control = new TextBox(true); // upcasting, safe
TextBox tb = (TextBox) control;        // downcasting, works

UiControl control2 = new UiControl(true);
TextBox tb2 = (TextBox) control2;      // ❌ runtime error
```

👉 Always check with `instanceof` or `getClass()` before downcasting.

---

## Abstract Classes

Sometimes, we want to define a **general concept** without being able to create it directly.

For example, `UiControl` is an abstract idea – we don’t really have a generic "control" in a UI, but we do have specific controls like `TextBox` or `CheckBox`.

```java
abstract class UiControl {
    private boolean isEnabled = true;

    public UiControl(boolean flag) {
        this.isEnabled = flag;
    }

    public boolean isEnabled() { return isEnabled; }
    public void setEnabled(boolean enabled) { this.isEnabled = enabled; }

    public abstract void draw(); // forces subclasses to implement
}
```

- You **cannot instantiate** an abstract class.
- Subclasses **must** implement the abstract methods.

---

## Final Classes and Methods

- A **final class** cannot be extended.
- A **final method** cannot be overridden.

Rarely used, but important for ensuring immutability and security.

---

## Polymorphism

Polymorphism means **“many forms.”**

When you call a method on a superclass reference, the JVM will run the **actual subclass implementation** at runtime.

```java
interface GeometricShape {
    void draw();
}

class Circle implements GeometricShape {
    public void draw() { System.out.println("This is a circle"); }
}

class Square implements GeometricShape {
    public void draw() { System.out.println("This is a square"); }
}
```

Now if we write:

```java
GeometricShape[] shapes = { new Circle(), new Square() };

for (GeometricShape s : shapes) {
    s.draw(); // Polymorphism in action
}
```

Each object runs its own implementation, even though the reference type is the interface.

---

## Comparing Objects (`equals`)

By default, the `equals` method compares object **references**, not actual content.

Example:

```java
class Point {
    private int x, y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;                // same reference
        if (obj == null || getClass() != obj.getClass()) return false;

        Point other = (Point) obj;                   // safe cast
        return this.x == other.x && this.y == other.y;
    }
}
```

Now:

```java
Point p1 = new Point(1, 2);
Point p2 = new Point(1, 2);

System.out.println(p1.equals(p2)); // true ✅ (compares content)
System.out.println(p1 == p2);      // false ❌ (different references)
```

---

## Putting It All Together

Here’s a summary of what we covered with live code:

```java
public class UpCastingDowncasting {
    public static void main(String[] args) {
        GeometricShape[] shapes = { new Circle(), new Square() };
        for (GeometricShape sh : shapes) sh.draw();
    }
}
```

- `UiControl` → base (abstract) concept.
- `TextBox` → subclass (concrete).
- Upcasting allows `TextBox` to be treated as `UiControl`.
- Downcasting requires checks.
- Interfaces allow polymorphism across unrelated classes.
- Override `equals` to compare **contents**, not references.

---

✅ Next lesson: **Interfaces and Dependency Injection**

---

<!---->
<!-- # C-9 📘 Lecture: Interfaces and Dependency Injection in Java -->
<!---->
<!-- Today, we’re going to dive into **interfaces** in Java, understand **why they exist**, and learn how they help us build **loosely coupled, extensible, and testable applications**. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 1. Why Interfaces? (The Restaurant Analogy) -->
<!---->
<!-- Imagine you own a restaurant. You hire a chef named John. John is great, but one day John gets sick. If your restaurant only works because *John* is there, your business is in trouble. -->
<!---->
<!-- But what if instead, you said: -->
<!---->
<!-- > “I don’t care who the chef is, as long as they can cook.” -->
<!---->
<!-- That’s exactly what interfaces are about. We don’t tie ourselves to a **specific person (class)** — we depend on a **contract (interface)**. -->
<!---->
<!-- This way, our application can keep running no matter who is “in the kitchen.” -->
<!---->
<!-- --- -->
<!---->
<!-- ## 2. The Problem of Tight Coupling -->
<!---->
<!-- Let’s look at some code that is **tightly coupled**: -->
<!---->
<!-- ```java -->
<!-- static class TaxReport { -->
<!--     private TaxCal taxCal; -->
<!---->
<!--     public TaxReport() { -->
<!--         taxCal = new TaxCal(1000); -->
<!--     } -->
<!-- } -->
<!---->
<!-- static class TaxCal { -->
<!--     private double taxableIncome; -->
<!---->
<!--     public TaxCal(double taxableIncome) { -->
<!--         this.taxableIncome = taxableIncome; -->
<!--     } -->
<!---->
<!--     public double calculateTax() { -->
<!--         return taxableIncome * 0.3; -->
<!--     } -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Here’s the issue: -->
<!---->
<!-- * `TaxReport` directly depends on `TaxCal`. -->
<!-- * If we change the `TaxCal` implementation, we might break `TaxReport`. -->
<!-- * If we want to introduce a new tax rule (e.g., 2020 tax laws), we’d have to rewrite parts of `TaxReport`. -->
<!---->
<!-- This is **tight coupling**, and it makes code brittle and hard to maintain. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 3. Breaking the Coupling with Interfaces -->
<!---->
<!-- Now let’s introduce an **interface** to reduce coupling: -->
<!---->
<!-- ```java -->
<!-- interface TaxCalculator { -->
<!--     double calculateTax(); -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Instead of depending on a *concrete class*, `TaxReport` now depends on this *contract*: -->
<!---->
<!-- ```java -->
<!-- static class TaxReport { -->
<!--     private TaxCalculator taxCal; -->
<!---->
<!--     // Constructor Injection -->
<!--     public TaxReport(TaxCalculator tc) { -->
<!--         taxCal = tc; -->
<!--     } -->
<!---->
<!--     public void printReport() { -->
<!--         System.out.println(taxCal.calculateTax()); -->
<!--     } -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Notice: -->
<!---->
<!-- * `TaxReport` doesn’t care *which* `TaxCalculator` it’s given. -->
<!-- * As long as the class implements `TaxCalculator`, `TaxReport` is happy. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 4. Multiple Implementations -->
<!---->
<!-- Now we can write different tax calculators without breaking `TaxReport`: -->
<!---->
<!-- ```java -->
<!-- static class TaxCal implements TaxCalculator { -->
<!--     private double taxableIncome; -->
<!---->
<!--     public TaxCal(double taxableIncome) { -->
<!--         this.taxableIncome = taxableIncome; -->
<!--     } -->
<!---->
<!--     @Override -->
<!--     public double calculateTax() { -->
<!--         return taxableIncome * 0.3; -->
<!--     } -->
<!-- } -->
<!---->
<!-- static class TaxCal2020 implements TaxCalculator { -->
<!--     private double taxableIncome; -->
<!---->
<!--     public TaxCal2020(double taxableIncome) { -->
<!--         this.taxableIncome = taxableIncome; -->
<!--     } -->
<!---->
<!--     @Override -->
<!--     public double calculateTax() { -->
<!--         return taxableIncome * 0.25;  // new rules for 2020 -->
<!--     } -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- Now `TaxReport` can work with **any** tax calculator: -->
<!---->
<!-- ```java -->
<!-- public static void main(String[] args) { -->
<!--     TaxCalculator calc = new TaxCal(1000); -->
<!--     TaxReport tr = new TaxReport(calc); -->
<!--     tr.printReport(); -->
<!---->
<!--     TaxCalculator calc2020 = new TaxCal2020(1000); -->
<!--     TaxReport tr2020 = new TaxReport(calc2020); -->
<!--     tr2020.printReport(); -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- --- -->
<!---->
<!-- ## 5. Dependency Injection -->
<!---->
<!-- What we just did is called **Dependency Injection (DI)**. -->
<!---->
<!-- Instead of `TaxReport` creating its own dependencies, we **inject** them from outside. -->
<!-- There are three main ways to inject dependencies: -->
<!---->
<!-- 1. **Constructor Injection** (most common, what we used) -->
<!-- 2. **Setter Injection** (pass a dependency via a setter method) -->
<!-- 3. **Method Injection** (pass a dependency as a parameter to a method call) -->
<!---->
<!-- In real projects, you won’t manually manage all dependencies. -->
<!-- Instead, you’ll often use a **DI Framework** like **Spring** to do this for you automatically. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 6. Interface Segregation -->
<!---->
<!-- One last point: -->
<!---->
<!-- If you create a huge “god interface” with too many methods, every implementing class is forced to implement things it doesn’t care about. -->
<!---->
<!-- That’s bad design. -->
<!---->
<!-- Instead, follow the **Interface Segregation Principle (ISP)**: -->
<!---->
<!-- > Split large interfaces into smaller, more focused ones. -->
<!---->
<!-- For example: -->
<!---->
<!-- ```java -->
<!-- interface Drivable { -->
<!--     void drive(); -->
<!-- } -->
<!---->
<!-- interface Flyable { -->
<!--     void fly(); -->
<!-- } -->
<!---->
<!-- class Car implements Drivable { -->
<!--     public void drive() { System.out.println("Car is driving"); } -->
<!-- } -->
<!---->
<!-- class Plane implements Drivable, Flyable { -->
<!--     public void drive() { System.out.println("Plane is taxiing"); } -->
<!--     public void fly() { System.out.println("Plane is flying"); } -->
<!-- } -->
<!-- ``` -->
<!---->
<!-- This way, classes only implement what they actually need. -->
<!---->
<!-- --- -->
<!---->
<!-- ## 7. A Note on Default, Private, and Static Methods in Interfaces -->
<!---->
<!-- Since Java 8, interfaces can have `default` and `static` methods. -->
<!-- Since Java 9, they can even have `private` methods. -->
<!---->
<!-- Personally, I recommend being cautious here. Why? -->
<!---->
<!-- * An interface’s purpose is to define a **contract**. -->
<!-- * Putting too much code inside an interface can blur the line between **contracts** and **implementations**. -->
<!-- * If you need to share common logic between multiple classes, an **abstract class** that implements the interface is often a cleaner design. -->
<!---->
<!-- --- -->
<!---->
<!-- ## ✅ Summary -->
<!---->
<!-- * **Interfaces** define *what* a class can do, not *how*. -->
<!-- * They help us build **loosely coupled, extensible, and testable applications**. -->
<!-- * **Dependency Injection** means passing dependencies instead of creating them internally. -->
<!-- * Use frameworks like **Spring** for large-scale projects. -->
<!-- * Apply the **Interface Segregation Principle** to avoid “fat” interfaces. -->
<!-- * Be careful with `default`, `static`, and `private` methods inside interfaces — prefer abstract classes for shared logic. -->
<!---->
<!-- --- -->
<!---->
<!-- 👉 And that’s interfaces in Java. -->
<!-- Next time, we’ll look at how interfaces and **abstract classes** work together to design even more flexible systems. -->
<!---->
<!-- --- -->
<!---->

# Java Interfaces and Inheritance Guide

## Why interfaces exists ?- THE BIG PICTURE

### The Restaurant Analogy

Imagine you own a restaurant and hire a chef named John. John is great, but what happens when John gets sick? If your restaurant only works because _John_ is there, your business is in trouble.

But what if instead, you said: _"I don't care who the chef is, as long as they can cook."_

That's exactly what interfaces are about. We don't tie ourselves to a **specific person (class)** — we depend on a **contract (interface)**. This way, our application can keep running no matter who is "in the kitchen."

### The Problem: **Tight Coupling**

Let's look at code that is **tightly coupled**:

```java
static class TaxReport {
    private TaxCal taxCal;

    public TaxReport() {
        taxCal = new TaxCal(1000); // Directly creates dependency
    }
}

static class TaxCal {
    private double taxableIncome;

    public TaxCal(double taxableIncome) {
        this.taxableIncome = taxableIncome;
    }

    public double calculateTax() {
        return taxableIncome * 0.3;
    }
}
```

Problems with this approach:

- `TaxReport` directly depends on `TaxCal`
- Changing `TaxCal` might break `TaxReport`
- Adding new tax rules requires rewriting `TaxReport`
- Hard to test in isolation

### The Solution: Programming Against Interfaces

```java
interface TaxCalculator {
    double calculateTax();
}

static class TaxReport {
    private TaxCalculator taxCal;

    // Constructor Injection - depends on contract, not implementation
    public TaxReport(TaxCalculator tc) {
        taxCal = tc;
    }

    public void printReport() {
        System.out.println(taxCal.calculateTax());
    }
}
```

Now `TaxReport` doesn't care _which_ `TaxCalculator` it receives - it just needs something that fulfills the contract.

## Multiple Inher rules

### Classes: Single Inheritance Only

**Java classes cannot extend multiple classes**. Java only allows **single inheritance**:

```java
class A { }
class B { }
// ❌ Not allowed - will cause compile error
class C extends A, B { }
```

### Interfaces: Multiple Inheritance Allowed

Unlike classes, an **interface can extend multiple interfaces**:

```java
interface A { void foo(); }
interface B { void bar(); }

// ✅ Perfectly valid
interface C extends A, B {
    void baz();
}
```

So `C` inherits `foo()` from `A` and `bar()` from `B`.

## Hndeling method coflicts

### Same Method Signature = No Conflict

When interfaces have methods with identical signatures, there's no problem:

```java
interface A { void doSomething(); }
interface B { void doSomething(); }
interface C extends A, B { } // No conflict

class MyClass implements C {
    public void doSomething() {
        System.out.println("Single implementation satisfies both");
    }
}
```

The compiler sees them as **one method contract**.

### Different Signatures = Method Overloading

```java
interface A { void doSomething(); }
interface B { void doSomething(String msg); }
interface C extends A, B { }

class MyClass implements C {
    public void doSomething() { System.out.println("No args"); }
    public void doSomething(String msg) { System.out.println(msg); }
}
```

### Default Method Conflicts (Java 8+)

When interfaces have conflicting default methods, you **must** resolve the conflict:

```java
interface A {
    default void hello() { System.out.println("Hello from A"); }
}

interface B {
    default void hello() { System.out.println("Hello from B"); }
}

interface C extends A, B {
    @Override
    default void hello() {
        A.super.hello(); // Choose A's, B's, or write custom implementation
    }
}
```

## Interface evolution through java versions

### Pre-Java 8: Pure Contracts

- Only abstract methods (implicitly `public abstract`)
- Only `public static final` constants
- No implemented methods allowed

### Java 8: Default and Static Methods

Interfaces can now have:

- **Default methods**: Provide fallback implementations
- **Static methods**: Utility methods belonging to the interface

```java
interface Vehicle {
    void move(); // abstract method

    default void honk() {  // default method
        System.out.println("Beep!");
    }

    static void serviceInfo() { // static method
        System.out.println("Service required every 6 months");
    }
}
```

### Java 9+: Private Methods

Added **private methods** for organizing code within interfaces:

```java
interface Calculator {
    default int addAndLog(int a, int b) {
        logOperation("Addition");
        return a + b;
    }

    default int subtractAndLog(int a, int b) {
        logOperation("Subtraction");
        return a - b;
    }

    private void logOperation(String operation) { // Helper method
        System.out.println("Performing: " + operation);
    }
}
```

## Dependency injection patterns

### Three Types of Dependency Injection

1. **Constructor Injection** (recommended):

```java
class TaxReport {
    private final TaxCalculator calculator;

    public TaxReport(TaxCalculator calculator) {
        this.calculator = calculator;
    }
}
```

2. Setter Injection:

```java
class TaxReport {
    private TaxCalculator calculator;

    public void setTaxCalculator(TaxCalculator calculator) {
        this.calculator = calculator;
    }
}
```

3. Method Injection:

```java
class TaxReport {
    public void generateReport(TaxCalculator calculator) {
        // Use calculator for this specific operation
    }
}
```

### Benefits of Dependency Injection

- **Flexibility**: Easy to swap implementations
- **Testability**: Can inject mock objects for testing
- **Extensibility**: Add new implementations without changing existing code
- **Loose Coupling**: Classes depend on abstractions, not concrete implementations

## Desig principles and best practices

### Interface Segregation Principle (ISP)

Avoid creating "god interfaces" with too many methods. Split large interfaces into smaller, focused ones:

```java
// ❌ Bad: Fat interface
interface VehicleOperations {
    void drive();
    void fly();
    void swim();
    void refuel();
    void recharge();
}

// ✅ Good: Segregated interfaces
interface Drivable { void drive(); }
interface Flyable { void fly(); }
interface Rechargeable { void recharge(); }

class Car implements Drivable, Rechargeable {
    public void drive() { System.out.println("Car is driving"); }
    public void recharge() { System.out.println("Car is charging"); }
    // No need to implement fly() or swim()
}
```

### When to Use Abstract Classes vs Interfaces

Use Abstract Classes When:

- You need to share code between related classes
- You have common state (fields) to share
- Classes have a clear "is-a" relationship
- You want to provide partial implementations

Use Interfaces When:

- You need multiple inheritance
- Defining contracts for unrelated classes
- You want loose coupling and flexibility
- Building for testability

### Modern Interface Design Guidelines

Static Methods in Interfaces:

- Belong to the interface namespace, not implementing classes
- Called via `InterfaceName.methodName()`
- Consider if utility classes might be cleaner

Default Methods:

- Use sparingly to avoid blurring interface purpose
- Good for interface evolution without breaking existing code
- Don't overuse - interfaces should primarily define contracts

Private Methods:

- Useful for organizing code within the interface
- Help reduce duplication in default methods
- Only visible within the same interface

## Practical example : Multiple implementations

Here's how you can create multiple implementations and swap them easily:

```java
// Different tax calculation strategies
static class TaxCal implements TaxCalculator {
    private double taxableIncome;

    public TaxCal(double taxableIncome) {
        this.taxableIncome = taxableIncome;
    }

    @Override
    public double calculateTax() {
        return taxableIncome * 0.3; // Standard rate
    }
}

static class TaxCal2020 implements TaxCalculator {
    private double taxableIncome;

    public TaxCal2020(double taxableIncome) {
        this.taxableIncome = taxableIncome;
    }

    @Override
    public double calculateTax() {
        return taxableIncome * 0.25; // 2020 tax rules
    }
}

// Usage - easy to swap implementations
public static void main(String[] args) {
    TaxCalculator calc = new TaxCal(1000);
    TaxReport tr = new TaxReport(calc);
    tr.printReport(); // Uses standard calculation

    TaxCalculator calc2020 = new TaxCal2020(1000);
    TaxReport tr2020 = new TaxReport(calc2020);
    tr2020.printReport(); // Uses 2020 rules
}
```

## Important interview insights

### The Classic "Interface vs Abstract Class" Question

This is often considered an **outdated interview question** for several reasons:

**Why it's problematic:**

- Shows lack of modern interviewing experience
- Focuses on memorization rather than practical problem-solving
- Doesn't reflect real-world development challenges
- Many modern languages don't even have these concepts

**What matters more in 2025:**

- Understanding appropriate design patterns
- Building maintainable, testable applications
- Knowing when to use loose coupling
- Practical problem-solving skills

**The Real Answer:**

- **Interfaces** = contracts for loose coupling and flexibility
- **Abstract classes** = partially implemented classes for sharing code between related classes
- **Focus on** = choosing the right tool for the design problem, not memorizing differences

## KEY TAKEAWAYS

### Core Principles

1. **Program against interfaces, not implementations** - enables flexibility and testability
2. **Use dependency injection** to reduce coupling and improve testability
3. **Keep interfaces focused** - follow Interface Segregation Principle
4. **Interfaces define contracts** - what classes can do, not how they do it

### Design Recommendations

1. **Keep interfaces clean** - primarily for defining contracts
2. **Use abstract classes for shared code** between related classes
3. **Prefer composition over inheritance** when possible
4. **Avoid overusing default methods** - they can blur interface purpose
5. **Use DI frameworks** (like Spring) for complex applications

### Benefits of This Approach

- **Loose Coupling**: Components depend on abstractions, not concrete classes
- **Extensibility**: Easy to add new implementations without changing existing code
- **Testability**: Can inject mock objects for unit testing
- **Maintainability**: Changes in one implementation don't affect others
- **Flexibility**: Can swap implementations at runtime

Remember: Good design is about **clarity of responsibility**. Interfaces should define contracts, abstract classes should share code, and utility classes should contain common helpers. Don't mix these roles unnecessarily.
