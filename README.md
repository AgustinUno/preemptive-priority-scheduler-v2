<div align="center">

# ⚙️ Preemptive Priority CPU Scheduler v2

<p>
  A web-based simulator for the <strong>Preemptive Priority</strong> CPU scheduling algorithm — featuring a Gantt chart, dark mode, and live deployment on GitHub Pages.
</p>

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)

### 🔗 [View Live Demo](https://agustinuno.github.io/PREEMPTIVE-PRIORITY-/)

</div>

---

## 📋 Overview

An interactive browser-based simulator that visualizes the **Preemptive Priority scheduling algorithm** — a core concept in Operating Systems. Input processes with arrival times, burst times, and priorities, and the simulator computes the execution order, renders a Gantt chart, and displays performance metrics in real time.

This is the **v2 / latest release**, continuing from the [v1 final project](https://github.com/AgustinUno/OS-PP-FINAL-PROJECT--v1) with additional features and refinements.

---

## ✨ Features

- ⚙️ &nbsp;**Preemptive Priority Scheduling** — Full algorithm implementation with priority-based preemption
- 📊 &nbsp;**Gantt Chart** — Visual timeline showing which process ran at each time unit
- 📈 &nbsp;**Performance Metrics** — Waiting time, turnaround time, and averages per process
- 🌙 &nbsp;**Dark Mode** — Toggle between light and dark themes
- 📱 &nbsp;**Partial Mobile Responsiveness** — Works on smaller screens
- ✅ &nbsp;**Input Validation** — NULL checking for incomplete or non-numeric inputs
- 🧪 &nbsp;**Test Cases** — Included sample inputs for cross-checking correctness

---

## 🧠 Algorithm Logic

1. Start with the process with the lowest arrival time
2. When a new process arrives, compare its priority with the currently running process
3. The process with the **lower priority number** (higher priority) runs first
4. On equal priority, the process that was on hold runs first
5. Repeat until all processes complete

---

## 🛠️ Tech Stack

| Layer    | Technology    |
|----------|---------------|
| Language | JavaScript    |
| Markup   | HTML5         |
| Styling  | CSS3          |
| Hosting  | GitHub Pages  |
| IDE      | VS Code       |

---

## 🖼️ Screenshots

> 📸 _UI screenshots coming soon._

<!-- Uncomment and replace with actual screenshots once available:
<div align="center">
  <img src="Assets/screenshot-main.png" width="700" alt="Main Interface" />
  <br/><br/>
  <img src="Assets/screenshot-gantt.png" width="700" alt="Gantt Chart Output" />
  <br/><br/>
  <img src="Assets/screenshot-dark.png" width="700" alt="Dark Mode" />
</div>
-->

---

## 🚀 Getting Started

### Option 1 — Live Demo

Just visit the live site: **[https://agustinuno.github.io/PREEMPTIVE-PRIORITY-/](https://agustinuno.github.io/PREEMPTIVE-PRIORITY-/)**

### Option 2 — Run Locally

```bash
git clone https://github.com/AgustinUno/PREEMPTIVE-PRIORITY-.git
cd PREEMPTIVE-PRIORITY-
open index.html
```

---

## 📁 Project Structure

```
PREEMPTIVE-PRIORITY-/
├── index.html      # Main application
├── script.js       # Scheduling algorithm and UI logic
├── styles.css      # Styling and dark mode
├── Assets/         # Images and visual assets
├── test-cases/     # Sample input test cases
└── README.md
```

---

## 👥 Contributors

- **Justine Bautista** — [@AgustinUno](https://github.com/AgustinUno)
- **Mark Fulguerinas**

---

## 🎓 Academic Context

> **Institution:** Polytechnic University of the Philippines – San Juan (PUP-SJ)
> **Subject:** Operating Systems
> **Type:** Project — v2 / Latest Release
> **Languages:** JavaScript, HTML, CSS

---

<div align="center">
  <sub>Made with ⚙️ and a deep appreciation for process scheduling</sub>
</div>
