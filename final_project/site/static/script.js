document.addEventListener("DOMContentLoaded", () => {
  const configPopup = document.querySelector(".config-popup");
  const quizPopup = document.querySelector(".quiz-popup");
  const resultPopup = document.querySelector(".result-popup");

  const startBtn = document.querySelector(".start-quiz-btn");
  const levelButtons = document.querySelectorAll(".level-option");

  const questionText = document.querySelector(".question-text");
  const answerOptions = document.querySelector(".answer-options");
  const questionStatus = document.querySelector(".question-status");
  const nextBtn = document.querySelector(".next-question-btn");
  const exitBtn = document.querySelector(".exit-quiz-btn");

  const timerDisplay = document.querySelector(".timer-duration");
  const resultMessage = document.querySelector(".result-message");
  const tryAgainBtn = document.querySelector(".try-again-btn");

  let selectedQuestions = [];
  let currentIndex = 0;

  let attemptId = null;
  let userAnswers = {};

  let timer = null;
  let currentTime = 15;

  const resetTimer = () => {
    clearInterval(timer);
    currentTime = 15;
    timerDisplay.textContent = currentTime + "s";
  };

  const showNextBtn = () => {
    nextBtn.style.display = "inline-flex";
  };

  const startTimer = () => {
    timer = setInterval(() => {
      currentTime--;
      timerDisplay.textContent = currentTime + "s";

      if (currentTime <= 0) {
        clearInterval(timer);

        const allOptions = answerOptions.querySelectorAll(".answer-option");
        allOptions.forEach(o => {
          o.style.pointerEvents = "none";
          o.classList.add("disabled");
        });

        showNextBtn();
      }
    }, 1000);
  };

  const renderQuestion = () => {
    if (currentIndex >= selectedQuestions.length) {
      showResult();
      return;
    }

    const q = selectedQuestions[currentIndex];
    questionText.textContent = q.question;
    answerOptions.innerHTML = "";

    q.options.forEach(opt => {
      const li = document.createElement("li");
      li.classList.add("answer-option");

      const span = document.createElement("span");
      span.textContent = opt;
      li.appendChild(span);

      li.addEventListener("click", () => {
        clearInterval(timer);

        const allOptions = answerOptions.querySelectorAll(".answer-option");
        allOptions.forEach(o => (o.style.pointerEvents = "none"));

        li.classList.add("selected");
        userAnswers[q.id] = opt;

        showNextBtn();
      });

      answerOptions.appendChild(li);
    });

    questionStatus.textContent = `${currentIndex + 1} of ${selectedQuestions.length}`;
    resetTimer();
    startTimer();
    nextBtn.style.display = "none";
  };

  const showResult = async () => {
    clearInterval(timer);

    quizPopup.classList.remove("active");
    resultPopup.classList.add("active");

    if (!attemptId) {
      resultMessage.innerHTML = `No active attempt.`;
      return;
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attempt_id: attemptId,
          answers: userAnswers
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        resultMessage.innerHTML = `Submit failed.<br><small>${txt}</small>`;
        return;
      }

      const r = await res.json();
      resultMessage.innerHTML =
      `Correct: <b>${r.correct}</b> out of <b>${r.total}</b><br>`;
    } catch (e) {
      console.error(e);
      resultMessage.innerHTML = `Network error.`;
    } finally {
      attemptId = null;
    }
  };

  startBtn.addEventListener("click", async () => {
    const activeBtn = document.querySelector(".level-option.active");
    if (!activeBtn) {
      alert("Please select a difficulty level.");
      return;
    }

    const level = activeBtn.textContent.toLowerCase();

    try {
      const res = await fetch(`/api/start?level=${encodeURIComponent(level)}`);
      if (!res.ok) {
        const txt = await res.text();
        alert("Failed to start the quiz.\n" + txt);
        return;
      }

      const data = await res.json();
      attemptId = data.attempt_id;
      selectedQuestions = data.questions || [];
      userAnswers = {};
      currentIndex = 0;

      if (!selectedQuestions.length) {
        alert("No questions returned by the server.");
        return;
      }

      configPopup.classList.remove("active");
      quizPopup.classList.add("active");

      renderQuestion();
    } catch (e) {
      console.error(e);
      alert("Network error while starting the quiz.");
    }
  });

  nextBtn.addEventListener("click", () => {
    currentIndex++;
    renderQuestion();
  });

  exitBtn.addEventListener("click", () => {
    showResult();
  });

  tryAgainBtn.addEventListener("click", () => {
    clearInterval(timer);

    resultPopup.classList.remove("active");
    configPopup.classList.add("active");

    selectedQuestions = [];
    currentIndex = 0;
    attemptId = null;
    userAnswers = {};
    resetTimer();
  });

  if (!document.querySelector(".level-option.active") && levelButtons.length) {
    levelButtons[0].classList.add("active");
  }

  timerDisplay.textContent = currentTime + "s";
});