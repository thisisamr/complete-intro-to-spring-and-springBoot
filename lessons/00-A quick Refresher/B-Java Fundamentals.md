## A-1: Variables in Java

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

## A-2: Primitive Types vs Reference Types

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

## A-3: Strings

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

## A-4: Arrays

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

## A-5: Constants & `final`

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

## A-6: Arithmetic Expressions

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

## A-7: Casting

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

## A-8: Exercise 🏋️ Mortgage Calculator

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
