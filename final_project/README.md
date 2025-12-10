# Interactive Linux Quiz Game
Made by: Bermet Ibraeva 11358

This project is an interactive Linux command quiz designed for the AUCA Information Security course.  
It includes both a terminal-based quiz and a web-based quiz built with Flask.

Users can choose between three difficulty levels (Easy / Medium / Hard), and the system loads questions dynamically from a unified JSON dataset.  
At the end of each quiz, the program displays correct and incorrect answer counts.

The project focuses on Linux fundamentals and security-relevant commands, making it useful for both beginners and advanced InfoSec learners.

---

## Features

### Dual Interface

#### 1. Terminal Version
- Pure Python  
- Reads questions from `quiz.json`  
- Multiple-choice questions  
- Displays final correct/incorrect summary  

#### 2. Web Version (Flask + JS)
- Flask backend (`app.py`)  
- HTML/CSS/JS frontend  
- Loads JSON questions dynamically  
- Clean UI with clickable answer buttons  

---

## Question Bank (JSON)

All questions are stored in JSON format and shared by both versions.

Example structure:

```json
{
  "question": "Which command prints the current working directory?",
  "options": ["pwd", "ls", "cd", "mkdir"],
  "answer": "pwd",
  "level": "easy"
}

```
# Difficulty Modes

## Question Counts
Includes:  
- **15 easy questions**  
- **19 medium questions**  
- **28 hard questions**

### User Difficulty Selection
Users choose one mode:

- *Easy* — 15 questions  
- *Medium* — 19 questions  
- *Hard* — 28 questions  

Difficulty level determines which `"level"` entries are selected from the JSON file.

---

# Final Results Summary

## What the Quiz Displays
At the end of the quiz, the system shows:

- **Total questions answered**  
- **Number of correct answers**  
- **Number of incorrect answers**

### Purpose
This keeps the output simple, readable, and learning-focused.

---

## Security Relevance

## Commands Used in Medium and Hard Levels
These are real commands used in cybersecurity operations:

```text
Permissions: chmod, chown, chgrp  
Processes: ps, top, kill, killall  
Networking: ping, ifconfig, ssh, wget, curl  
Log and search tools: grep, grep -r  
System services: systemctl  
Filesystems: mount, umount, fsck, mkfs.ext4
```

### Directory Layout

```text
final_project/
│
├── screenshots/               → Project images
│
├── site/                      → Web version
│   ├── static/
│   │   ├── quiz.json          → Question dataset
│   │   ├── script.js          → Frontend logic
│   │   └── style.css          → Web UI styling
│   │
│   ├── templates/
│   │   └── index.html         → Web quiz interface
│   │
│   └── app.py                 → Flask backend
│
└── terminal/                  → Terminal version
    ├── quiz.json              → Question dataset
    └── test.py                → CLI quiz script
```
## Running the Project
### 1. Create a virtual environment
```
python -m venv .venv
source .venv/bin/activate       # macOS / Linux
.venv\Scripts\activate.bat      # Windows
```
### 2. Install dependencies (Flask only)
```
pip install Flask
```
### 3. Run the Web Quiz
```
cd site
python app.py
```

### Open in browser:
```
http://localhost:8000
```
4. Run the Terminal Quiz
```
cd terminal
python test.py
```
## Video Showcase

```
https://vimeo.com/1144902055/6eb1ebce22?share=copy&fl=sv&fe=ci
```
## Conclusion

This project provides a simple but effective Linux training tool.
The dual interface (terminal + web) makes it accessible for different learning styles.
The JSON-based question bank keeps the system easy to maintain and extend.
Its focus on real Linux and InfoSec commands makes it practical for hands-on cybersecurity training.
