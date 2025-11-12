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

  let questions = [];
  let selectedQuestions = [];
  let currentIndex = 0;
  let correctAnswersCount = 0;
  let timer = null;
  let currentTime = 15;

  // Load quiz.json from Flask static folder
  fetch(quizDataUrl)
    .then(res => res.json())
    .then(data => {
      questions = data;
      console.log("Questions loaded:", questions);
    })
    .catch(err => console.error("Error loading quiz.json:", err));

  // Level selection
  levelButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      levelButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Timer functions
  const resetTimer = () => {
    clearInterval(timer);
    currentTime = 15;
    timerDisplay.textContent = currentTime + "s";
  };

  const startTimer = () => {
    timer = setInterval(() => {
      currentTime--;
      timerDisplay.textContent = currentTime + "s";
      if (currentTime <= 0) {
        clearInterval(timer);
        // Auto-show correct answer if time runs out
        const allOptions = answerOptions.querySelectorAll(".answer-option");
        allOptions.forEach(o => {
          if (o.querySelector("span").textContent === selectedQuestions[currentIndex].answer) {
            o.classList.add("correct");
          }
          o.style.pointerEvents = "none";
        });
        showNextBtn();
      }
    }, 1000);
  };

  const showNextBtn = () => {
    nextBtn.style.display = "inline-flex";
  };

  // Render a question
  const renderQuestion = () => {
    if (currentIndex >= selectedQuestions.length) return showResult();

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

        // Disable all options
        const allOptions = answerOptions.querySelectorAll(".answer-option");
        allOptions.forEach(o => o.style.pointerEvents = "none");

        // Mark selection
        if (opt === q.answer) {
          li.classList.add("correct");
          correctAnswersCount++;
        } else {
          li.classList.add("incorrect");
          // Highlight correct answer
          allOptions.forEach(o => {
            if (o.querySelector("span").textContent === q.answer) {
              o.classList.add("correct");
            }
          });
        }

        showNextBtn();
      });

      answerOptions.appendChild(li);
    });

    questionStatus.textContent = `${currentIndex + 1} of ${selectedQuestions.length}`;
    resetTimer();
    startTimer();
    nextBtn.style.display = "none";
  };

  // Show result
  const showResult = () => {
    quizPopup.classList.remove("active");
    resultPopup.classList.add("active");
    resultMessage.innerHTML = `You answered <b>${correctAnswersCount}</b> out of <b>${selectedQuestions.length}</b> correctly.`;
  };

  // Start quiz button
  startBtn.addEventListener("click", () => {
    const activeLevel = document.querySelector(".level-option.active").textContent.toLowerCase();
    selectedQuestions = questions.filter(q => q.level.toLowerCase() === activeLevel);

    if (!selectedQuestions.length) return alert("No questions for this level!");

    configPopup.classList.remove("active");
    quizPopup.classList.add("active");

    currentIndex = 0;
    correctAnswersCount = 0;
    renderQuestion();
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    renderQuestion();
  });

  // Exit quiz button
  exitBtn.addEventListener("click", () => {
    clearInterval(timer);
    showResult()
  });


  // Try again button
  tryAgainBtn.addEventListener("click", () => {
    resultPopup.classList.remove("active");
    configPopup.classList.add("active");
  });
});

