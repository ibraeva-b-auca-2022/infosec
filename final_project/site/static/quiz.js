let questions = [];
let currentQuestion = 0;
let score = 0;

async function loadQuestions() {
    try {
        const response = await fetch("/static/quiz.json"); // Flask static path
        questions = await response.json();
    } catch (err) {
        console.error("Failed to load questions:", err);
    }
}

function startQuiz(level) {
    currentQuestion = 0;
    score = 0;
    questions = questions.filter(q => q.level === level); // filter by difficulty
    document.getElementById("level-selection").style.display = "none";  
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

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "option-btn px-4 py-2 border rounded mb-2 w-full text-left";
        btn.disabled = false;

        btn.onclick = () => {
            // Подсветка
            Array.from(optionsContainer.children).forEach((b, i) => {
                b.disabled = true;
                if (i === q.answer) b.classList.add("bg-green-500", "text-white");
                else if (b.textContent === opt) b.classList.add("bg-red-500", "text-white");
            });

            if (opt === q.answer) score++;
        };

        optionsContainer.appendChild(btn);
    });
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function finishQuiz() {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("score").textContent = `Your score: ${score} / ${questions.length}`;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById("results").style.display = "none";
    document.getElementById("level-selection").style.display = "block";
}

window.onload = loadQuestions;

