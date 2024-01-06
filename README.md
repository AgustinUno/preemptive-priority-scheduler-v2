# Preemptive Priority Scheduling Algorithm

**CPU Scheduling Algorithm**  
Operating Systems - Project  
Polytechnic University of the Philippines, San Juan Campus

**Created by:** Justine Bautista | Mark Fulguerinas

[Visit Project Webpage](https://agustinuno.github.io/PREEMPTIVE-PRIORITY-/)

## Documentation

This website is created using common web languages: HTML, CSS, and JavaScript. It is deployed on GitHub Pages and version-controlled within GitHub.

### General Flow of the Algorithm
The program itself is centered around the Preemptive Priority algorithms, which adhere to several rules outlined below:

1. It checks the process with the lowest arrival time (0).
2. It will verify if there is an ongoing process during the recently completed one.
3. If there is (as per point 2), then the priority of both processes will be compared. The lower the number, the higher the priority. Consequently, the process with the highest priority will be executed first, while the other one will be put on hold.
    - During the comparison of priorities, if equality occurs, the process on hold will be executed first, and the other one will be put on hold.
4. Points 1 - 3 will continue to occur until there is no burst time left for all the processes.

### Other Information

Additionally, the program incorporates the following features:

* **NULL Checking Function:** It verifies if the input is incomplete or non-numeric.
* **Dark Mode:** The website offers a dark mode for improved user experience.
* **Basic Information about Preemptive Priority Scheduling Algorithm:** Provides essential details about the Preemptive Priority Scheduling algorithm.
* **Phone Responsiveness (Partially):** The website is designed to be partially responsive to accommodate smaller screens and ensure portability.
* **Gantt Look Table:** A visual representation to explain which process took the most time to be finished.
  
### Language Proficiency
The program is composed of multiple functions, efficiently used structs and objects. We also incorporated console logging output for users and us to cross-check the web outputs for correctness.
