# _Variables in Java_

Variables are containers for storing data. In Java, you must **declare** a variable with a type before using it.

```java
package thisisamr.services;

public class Variables {
    public static void main(String[] args) {
        // declare and initialize
        int age = 23;

        // concatenation
        System.out.println("This is the age: " + age);

        // printf with format specifiers
        System.out.printf("This is the age: %d%n", age);

        // multiple arguments
        String name = "Amr";
        System.out.printf("The name is %2$s and the age is %1$d%n", age, name);
    }
}
```

✅ **Notes**

- Always initialize variables before use.
- `%d` → integer, `%s` → string, `%f` → floating-point.

---

## Primitive Types vs Reference Types

Java variables fall into **two categories**:

1. **Primitive types** (store raw values).
2. **Reference types** (store the _address_ of an object in memory).

```java
public class PrimitiveTypes {
    public static void main(String[] args) {
        // Primitives
        byte small = 100;        // 1 byte
        short shortNum = 32000;  // 2 bytes
        int views = 1000000;     // 4 bytes
        long bigNum = 10000000000L; // 8 bytes

        float price = 5.99f;     // 4 bytes
        double pi = 3.14159;     // 8 bytes

        char letter = 'A';       // 2 bytes (Unicode)
        boolean isActive = true; // 1 byte

        // Reference type
        String message = "Hello!";
    }
}
```

✅ **Notes**

- Numbers with decimals are `double` by default → add `f` for `float`.
- Large integers require `L` suffix for `long`.

---

## Strings

Strings are **reference types** and **immutable**. Reassigning creates a new object.

```java
package thisisamr.services;

public class Strings {
    public static void main(String[] args) {
        String message = "Hello World!";
        String copy = message;

        message = "New text";

        // Original copy remains unchanged
        System.out.println(copy); // "Hello World!"

        // Useful methods
        System.out.println(copy.startsWith("Hello")); // true
        System.out.println(copy.length());            // 12
        System.out.println(copy.indexOf("W"));        // 6
        System.out.println(copy.replace('H', 'J'));   // "Jello World!"

        // Trimming
        String messy = "   they said: \"hi\"   ";
        System.out.println(messy.trim());
    }
}
```

✅ **Notes**

- Strings behave like objects with methods (`length`, `replace`, `trim`, etc.).
- Immutable: changing a string doesn’t modify the original.

---

## Arrays

Arrays store multiple values of the same type.

```java
import java.util.Arrays;

public class ArraysDemo {
    public static void main(String[] args) {
        int[] numbers = new int[5];  // fixed size
        int[] values = {1, 2, 3, 4, 5};

        // 2D arrays
        int[][] matrix = {{1, 2}, {3, 4}};
        System.out.println(Arrays.deepToString(matrix));

        // Printing arrays
        System.out.println(Arrays.toString(values));

        // Handling errors
        try {
            numbers[10] = 100; // out of bounds
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Index out of range!");
        }
    }
}
```

✅ **Notes**

- Arrays have a **fixed length**.
- Use `Arrays.toString()` or `Arrays.deepToString()` for printing.

---

## Constants & `final`

Use `final` to declare **constants** that cannot change.

```java
public class Constants {
    public static void main(String[] args) {
        final double PI = 3.14159;
        final int MAX_USERS = 100;

        System.out.println("PI: " + PI);
        // PI = 3; // ❌ error: cannot assign a value to final variable
    }
}
```

✅ **Notes**

- By convention, constants are written in **UPPERCASE_WITH_UNDERSCORES**.

---

## Arithmetic Expressions

```java
public class Arithmetic {
    public static void main(String[] args) {
        int result = 10 + 3;
        System.out.println(result); // 13

        System.out.println((double) 2 / 3); // casting for precision

        int x = 5;
        System.out.println(++x); // pre-increment: 6
        System.out.println(x++); // post-increment: prints 6, then x=7

        int remainder = 9 % 4;
        System.out.println(remainder); // 1
    }
}
```

✅ **Notes**

- `%` is the modulo operator (remainder).
- Prefix `++x` vs postfix `x++` matter in evaluation.

---

## Casting

Java performs **implicit** and **explicit** type conversions.

```java
import java.text.NumberFormat;
import java.util.Currency;

public class Casting {
    public static void main(String[] args) {
        // Implicit casting
        short a = 1;
        int b = a + 2; // short → int automatically

        // Explicit casting
        double pi = 3.99;
        int intPi = (int) pi; // lose decimal
        System.out.println(intPi); // 3

        // char to number
        char letter = 'A';
        System.out.println((int) letter); // 65

        // Formatting currency
        double amount = 12345.67;
        NumberFormat formatter = NumberFormat.getCurrencyInstance();
        formatter.setCurrency(Currency.getInstance("USD"));
        System.out.println(formatter.format(amount));
    }
}
```

✅ **Notes**

- Widening conversions happen automatically (`short → int → long`).
- Narrowing (e.g., `double → int`) must be **explicit**.

---

## Exercise 🏋️ Mortgage Calculator

Design a **mortgage calculator** using variables, arithmetic, and casting.

**Formula:**

$$
M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}
$$

Where:

- `M` = monthly payment
- `P` = loan principal
- `r` = monthly interest rate (annual rate ÷ 12 ÷ 100)
- `n` = total number of payments (years × 12)

```java
import java.util.Scanner;

public class MortgageCalculator {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Principal: ");
        double principal = input.nextDouble();

        System.out.print("Annual Interest Rate (%): ");
        double annualRate = input.nextDouble();

        System.out.print("Years: ");
        int years = input.nextInt();

        double monthlyRate = annualRate / 100 / 12;
        int n = years * 12;

        double mortgage = principal *
                (monthlyRate * Math.pow(1 + monthlyRate, n)) /
                (Math.pow(1 + monthlyRate, n) - 1);

        System.out.printf("Monthly Payment: %.2f%n", mortgage);
    }
}
```

---

## Comparison & Logical Operators

Java supports:

- Equality: `==`, `!=`
- Greater/less than: `<`, `>`, `<=`, `>=`
- Logical AND: `&&`
- Logical OR: `||`
- Negation: `!`

👉 Example:

```java
int age = 20;
double temp = 36.5;

boolean isOk = temp > 20 && temp < 40; // true
boolean isHot = temp > 40 || age < 18; // false
```

These are building blocks for **conditions and control flow**.

---

## If Statements & Ternary Operators

We often decide program flow based on conditions.

```java
public static String advice(double temp) {
    if (temp > 30) return "It's hot today!";
    if (temp >= 15) return "The weather is fine.";
    return "It's too cold!";
}
```

The same logic with a **ternary operator** (short form):

```java
public static String advice(float temp) {
    return (temp > 30 ? "Hot" : (temp < 15 ? "Freezing" : "Fine"));
}
```

---

## Loops

Loops repeat code until a condition is met.

### For Loop

```java
for (int i = 0; i < 5; i++) {
    System.out.println("Hello!");
}
```

### While Loop

```java
int i = 3;
while (i > 0) {
    System.out.println(i);
    i--;
}
```

### Do-While Loop

Runs at least once:

```java
int i = 0;
do {
    System.out.println("Runs once even if false");
} while (i > 0);
```

---

## Switch Statements

Switches are good for **multi-branch decisions**.

⚠️ **Important**: In Java, `switch` falls through unless you add `break`.

```java
String[] roles = {"admin","guest","owner"};
for (String r : roles) {
    switch (r) {
        case "admin":
            System.out.println("You are an admin.");
            break;
        case "guest":
            System.out.println("Don't touch my stuff.");
            break;
        default:
            System.out.println("Welcome, owner!");
            break;
    }
}
```

---

## User Input

We can read input from the console with `Scanner`.

```java
Scanner scanner = new Scanner(System.in);
String input;
while (true) {
    System.out.print("Enter something (quit to stop): ");
    input = scanner.next().toLowerCase();

    if (input.equals("pass")) continue;
    if (input.equals("quit")) break;

    System.out.println("You typed: " + input);
}
```

---

## 🏋️ <span style="color:blue;">Exercise</span>: FizzBuzz

Write a method:

- If divisible by 3 → print `"Fizz"`
- If divisible by 5 → print `"Buzz"`
- If divisible by both → print `"FizzBuzz"`
- Otherwise → print the number

---

## 💰 <span style="color:blue;">Project</span>: Mortgage Calculator

lets add some error handeling to the mortgage calculator
the principal should be between 1k and 1 million $ if the user enter an invalid number
keep asking him to enter a valid amount.

Formula:

$$
M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}
$$

Where:

- `M` = monthly payment
- `P` = loan principal
- `r` = monthly interest rate (annual ÷ 12 ÷ 100)
- `n` = total months (years × 12)

With validation (loop until valid input):

```java
Scanner input = new Scanner(System.in);
double principal;
while (true) {
    System.out.print("Principal (1000 - 1,000,000): ");
    principal = input.nextDouble();
    if (principal >= 1000 && principal <= 1_000_000) break;
    System.out.println("Invalid principal. Try again.");
}
```

Then calculate & print the monthly payment. ✅

---

# 📝 Wrap-up

- Use **operators** for conditions
- Control flow with `if/else`, `switch`, `ternary`
- Repeat with `for`, `while`, `do-while`
- Gather **user input** with validation
- Apply it in a **mini project (Mortgage Calculator)**

---
