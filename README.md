# CPU Performance Calculator

> **Computer Organization and Architecture (COA) Mini Project**  
> A simple, clean, and interactive educational tool to calculate and understand CPU performance metrics.

---

## 1. Project Overview

The **CPU Performance Calculator** is an interactive single-page web application designed for students and educators in Computer Organization and Architecture (COA). It demonstrates how program instruction count, microarchitectural CPI, and processor clock frequency interact according to the fundamental **CPU Performance Equation**.

### Key Educational Takeaways
- **Instruction Count ($I$):** Determined by the software algorithm, high-level code, compiler efficiency, and Instruction Set Architecture (ISA).
- **Cycles Per Instruction ($\text{CPI}$):** Determined by CPU microarchitecture (pipelining, cache hit rates, branch prediction, and instruction mix).
- **Clock Rate ($f$):** Determined by processor hardware design, semiconductor fabrication technology, and electrical/thermal limits.

---

## 2. Mathematical Foundation & Formulas

### 1. Total CPU Clock Cycles
$$\text{Total Clock Cycles} = \text{Instruction Count } (I) \times \text{CPI}$$

### 2. CPU Execution Time
$$\text{CPU Execution Time } (T) = \frac{\text{Instruction Count } (I) \times \text{CPI}}{\text{Clock Rate in Hz } (f)} = \frac{\text{Total Clock Cycles}}{\text{Clock Rate in Hz}}$$

* **Clock Rate Unit Conversions:**
  - $\text{GHz} = \text{Value} \times 10^9\text{ Hz}$
  - $\text{MHz} = \text{Value} \times 10^6\text{ Hz}$
  - $\text{kHz} = \text{Value} \times 10^3\text{ Hz}$
  - $\text{Hz} = \text{Value} \times 1\text{ Hz}$

### 3. CPU Performance (Workload Execution Rate)
$$\text{Execution Rate} = \frac{1}{\text{CPU Execution Time}}$$
*Represents program throughput (workload executions per second) for the given workload.*

---

## 3. Reference Example Test Case

Clicking the **Try Example** button populates the calculator with the following benchmark inputs:

| Parameter | Value | Unit |
| :--- | :--- | :--- |
| **Instruction Count ($I$)** | `1,000,000` | instructions |
| **CPI** | `2` | cycles/instruction |
| **Clock Rate ($f$)** | `2` | GHz ($2 \times 10^9\text{ Hz}$) |

### Calculated Results:
* **Total Clock Cycles:** $1,000,000 \times 2 = \mathbf{2,000,000\text{ cycles}}$
* **CPU Execution Time:** $\frac{2,000,000}{2,000,000,000\text{ Hz}} = \mathbf{0.001\text{ seconds}}$
* **Equivalent Execution Time:** $\mathbf{1\text{ millisecond (1 ms)}}$
* **Workload Throughput / Performance:** $\frac{1}{0.001\text{ s}} = \mathbf{1,000\text{ programs/sec}}$

---

## 4. UI/UX Features

- **Minimalist & Clean Theme:** Light theme using slate tones, crisp rounded cards, subtle shadows, and a modern blue accent (`#2563eb`).
- **Interactive Validation:** Inline validation warnings for negative numbers, zeros, or empty inputs without disruptive browser alert popups.
- **Dynamic Unit Scaling:** Automatically scales CPU execution time into seconds ($s$), milliseconds ($ms$), microseconds ($\mu s$), or nanoseconds ($ns$) depending on the magnitude.
- **Step-by-Step Substitution Walkthrough:** Shows the arithmetic steps and value substitutions to help students verify their manual assignments.
- **Responsive Layout:** Optimized for desktop, tablet, and mobile screens.
- **No External Dependencies:** Built with 100% standard HTML5, CSS3, and Vanilla JavaScript.

---

## 5. File Structure

```text
COA mini project/
├── index.html       # Semantic HTML5 layout and accessibility attributes
├── style.css        # Clean, modern design system, responsive styles, and animations
├── script.js        # Form validation, calculation logic, and DOM rendering
└── README.md        # Project documentation and theoretical background
```

---

## 6. How to Run Locally

You can run this project instantly using any standard web browser:

### Option A: Direct Browser Launch (Simplest)
1. Navigate to the project directory: `COA mini project/`
2. Double-click [index.html](file:///c:/Users/sriha/OneDrive/Desktop/COA%20mini%20project/index.html) (or right-click $\rightarrow$ **Open With** $\rightarrow$ Chrome, Edge, Firefox, or Safari).

### Option B: Local Development Server (Optional)
If you prefer running via a local server:
```bash
# Using Python
python -m http.server 3000

# Open in browser:
http://localhost:3000
```
