# Interactive Linux Quiz Game
Made by: Bermet Ibraeva 11358

This project is an interactive Linux command quiz designed for the AUCA Information Security course.  
It includes both a terminal-based quiz and a web-based quiz built with Flask.

Users can choose between three difficulty levels (Easy / Medium / Hard), and the system loads questions dynamically from a unified JSON dataset.
Questions are loaded dynamically from a unified JSON-based question bank, while all validation and scoring are performed server-side.

The project focuses on Linux fundamentals and security-relevant commands, making it suitable for both beginners and advanced InfoSec learners.
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
- Server-side answer validation and scoring

---

## Question Bank (JSON)

All questions are stored in JSON format and shared by both versions.

Example structure:

```json
{
  "id": "easy-001",
  "question": "Which command prints the current working directory?",
  "options": ["pwd", "ls", "cd", "mkdir"],
  "answer": "pwd",
  "level": "easy"
}

```
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
This keeps the output simple, readable, and focused on learning.

---
## Security Improvements 

The web version applies basic information security principles:
- The question bank is stored server-side and is not publicly accessible
- Correct answers are never sent to the client
- All answer validation and scoring are handled on the server
- Each quiz session uses a unique attempt_id
- One-time submission prevents replay or score manipulation
- Quiz attempts automatically expire after a fixed time (TTL)

### Data Integrity Protection
- A SHA-256 integrity check is used to detect unauthorized or accidental modification of quiz.json
- The server compares the computed hash with a stored reference hash before loading questions
- The application refuses to operate if integrity verification fails

### JSON Schema Validation
- The structure of quiz.json is validated on load
- Required fields, data types, unique IDs, valid difficulty levels, and answer correctness are enforced
- Prevents corrupted or malformed data from breaking the application
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
├── data/                      → Server-side data (protected)
│   ├── quiz.json              → Question bank
│   └── quiz.sha256            → SHA-256 integrity hash
│
├── site/                      → Web version
│   ├── static/
│   │   ├── script.js          → Frontend logic
│   │   └── style.css          → Web UI styling
│   │
│   ├── templates/
│   │   └── index.html         → Web quiz interface
│   │
│   └── app.py                 → Flask backend
│
├── terminal/                  → Terminal version
│   ├── quiz.json              → Question dataset
│   └── test.py                → CLI quiz script
│
└── make_hash.py               → Utility to regenerate quiz.sha256

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

### Updating the Question Bank

After modifying quiz.json, regenerate the integrity hash:
```
python make_hash.py
```

This ensures the server will accept the updated file.
## Video Showcase

```
https://vimeo.com/1144902055/6eb1ebce22?share=copy&fl=sv&fe=ci
```
## Conclusion

This project provides a simple yet secure Linux training tool.
The dual interface (terminal + web) supports different learning styles, while server-side validation and integrity checks demonstrate practical information security concepts.
By focusing on real Linux and cybersecurity commands, the project serves as a hands-on educational resource.
