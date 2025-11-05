let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;

async function loadQuestions() {
    try {
        const response = await fetch("/static/quiz.json");
        questions = await response.json();
    } catch (err) {
        console.error("Failed to load questions:", err);
    }
}

function startQuiz(level) {
    currentQuestion = 0;
    score = 0;
    questions = questions.filter(q => q.level === level);
    document.getElementById("level-selection").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }

    const q = questions[currentQuestion];
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");

    questionText.textContent = q.question;
    optionsContainer.innerHTML = "";

    q.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "px-4 py-2 rounded border text-left transition hover:bg-gray-100";
        btn.onclick = () => selectOption(btn, opt);
        optionsContainer.appendChild(btn);
    });

    // Добавим кнопки управления прямо во время вопроса
    const controlDiv = document.createElement("div");
    controlDiv.className = "flex justify-between mt-4 gap-4";

    const playAgainBtn = document.createElement("button");
    playAgainBtn.textContent = "Play Again";
    playAgainBtn.className = "flex-1 bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition";
    playAgainBtn.onclick = restartQuiz;

    const exitBtn = document.createElement("button");
    exitBtn.textContent = "Exit";
    exitBtn.className = "flex-1 bg-gray-400 text-white rounded px-4 py-2 hover:bg-gray-500 transition";
    exitBtn.onclick = exitQuiz;

    controlDiv.appendChild(playAgainBtn);
    controlDiv.appendChild(exitBtn);
    optionsContainer.appendChild(controlDiv);
}

function selectOption(button, selected) {
    const correctAnswer = questions[currentQuestion].answer;

    // Подсветка правильного и выбранного неправильного
    Array.from(button.parentNode.children).forEach(el => {
        if (el.tagName === "BUTTON") {
            if (el.textContent === correctAnswer) el.classList.add("bg-green-500", "text-white");
            else el.classList.add("bg-red-500", "text-white");
            el.disabled = true;
        }
    });

    if (selected === correctAnswer) score++;

    // Через 1.5 секунды идём к следующему вопросу
    timer = setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

function finishQuiz() {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("score").textContent = `Your score: ${score} / ${questions.length}`;
}

function restartQuiz() {
    clearTimeout(timer);
    document.getElementById("results").style.display = "none";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("level-selection").style.display = "block";
}

function exitQuiz() {
    clearTimeout(timer);
    document.getElementById("quiz").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("level-selection").style.display = "block";
    alert("You exited the quiz.");
}

window.onload = loadQuestions;

