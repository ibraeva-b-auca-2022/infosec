# Interactive Linux Quiz Game — Info-Sec Final Project
Made by: Amin Kubanychbekov (ka12363)

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

Includes:
```
15 easy questions

19 medium questions

28 hard questions

Difficulty Modes

Users choose one mode:

Easy — 15 questions

Medium — 19 questions

Hard — 28 questions

Difficulty level determines which JSON entries are selected.

Final Results Summary

At the end of the quiz, the system displays:

Total questions

Number of correct answers

Number of incorrect answers

This keeps the output simple and learning-focused.

Security Relevance

Medium and hard question sets include real commands used in cybersecurity operations:

Permissions: chmod, chown, chgrp

Processes: ps, top, kill, killall

Networking: ping, ifconfig, ssh, wget, curl

Log and search tools: grep, grep -r

System services: systemctl

Filesystems: mount, umount, fsck, mkfs.ext4

These commands reflect practical tasks in system administration, incident response, pentesting, and digital forensics.

Project Structure
final_project/
│
├── screenshots/               # Project images
│
├── site/                      # Web version
│   ├── static/
│   │   ├── quiz.json          # Question dataset
│   │   ├── script.js          # Frontend logic
│   │   └── style.css          # Web UI styling
│   │
│   ├── templates/
│   │   └── index.html         # Web quiz interface
│   │
│   └── app.py                 # Flask backend
│
└── terminal/                  # Terminal version
    ├── quiz.json              # Question dataset
    └── test.py                # CLI quiz script

Architecture Overview
Backend

Flask application serving HTML and static files

Loads JSON dataset

Manages quiz flow for the web version

Frontend (Web)

index.html provides the user interface

script.js loads questions, shows options, evaluates answers

style.css defines the visual layout

Terminal Version

Python script (test.py)

Reads JSON directly

Prints questions and checks input

Running the Project
1. Create a virtual environment
python -m venv .venv
source .venv/bin/activate       # macOS / Linux
.venv\Scripts\activate.bat      # Windows

2. Install dependencies

Required only for Flask version:

pip install flask

3. Run the Web Quiz

Inside the site folder:

python app.py


Then open:

http://localhost:8000

4. Run the Terminal Quiz

Inside the terminal folder:

python test.py

Screenshots

Screenshots are provided in the screenshots directory.
They demonstrate:

Directory structure

Web interface

Terminal interface

Final results

Video Showcase

Add your video link here: https://vimeo.com/1144902055/6eb1ebce22?share=copy&fl=sv&fe=ci

Conclusion

This project provides a functional, easy-to-use Linux command quiz with both terminal and web interfaces.
It uses a unified JSON dataset, focuses on commands relevant to information security, and is structured to be easy to maintain and extend.
The tool is effective for practicing Linux fundamentals and preparing for hands-on cybersecurity work.
