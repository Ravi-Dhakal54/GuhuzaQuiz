const quizContainer = document.getElementById("quiz-container");
const levelHeader = document.getElementById("level");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const checkAnswerButton = document.getElementById("check-answer");
const resultContainer = document.getElementById("result-container");
const multiplierDisplay = document.getElementById("multiplier-display");
const scoreDisplay = document.getElementById("score-display");
const streakFeedbackElement = document.getElementById("streakFeedback");

let currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let questions = [];
let selectedAnswerIndex = null;
let streakCount = 0;
let multiplier = 1;
let score = 0;

async function fetchQuizData(level) {
    try {
        const response = await fetch(
            `https://corsproxy.io/?https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=${level}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        questions = data.test.question;
        loadQuestion();
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        quizContainer.innerHTML = `<p class="error">Failed to load quiz data. Please try again later.</p>`;
    }
}

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = `Q.${currentQuestionIndex + 1}) ${currentQuestion.question}`;
    
    answersContainer.innerHTML = "";
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.className = "answer";
        button.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(button);
    });

    checkAnswerButton.disabled = true;
    selectedAnswerIndex = null;
}

function selectAnswer(index) {
    const buttons = document.querySelectorAll(".answer");
    buttons.forEach((button, i) => {
        button.classList.toggle("selected", i === index);
    });
    selectedAnswerIndex = index;
    checkAnswerButton.disabled = false;
}

function updateStreakFeedback() {
    if (streakCount >= 5) {
        streakFeedbackElement.textContent = `🔥 Streak ${streakCount}! 2x Multiplier Active!`;
        streakFeedbackElement.style.display = "block";
        streakFeedbackElement.classList.add("multiplier-active");
    } else {
        streakFeedbackElement.style.display = "none";
        streakFeedbackElement.classList.remove("multiplier-active");
    }
}

function updateScore(isCorrect) {
    if (isCorrect) {
        correctAnswers++;
        streakCount++;
        score += 1 * multiplier;
        
        if (streakCount >= 5) {
            multiplier = 2;
        }
    } else {
        streakCount = 0;
        multiplier = 1;
    }

    multiplierDisplay.textContent = `Multiplier: ${multiplier}x`;
    scoreDisplay.textContent = `Score: ${score}`;
    updateStreakFeedback();
}

checkAnswerButton.addEventListener("click", () => {
    if (selectedAnswerIndex === null) return;

    const correctIndex = questions[currentQuestionIndex].test_answer;
    const buttons = document.querySelectorAll(".answer");
    
    // Show correct/incorrect states
    buttons.forEach((button, index) => {
        if (index === correctIndex) button.classList.add("correct");
        if (index === selectedAnswerIndex && index !== correctIndex) {
            button.classList.add("incorrect");
        }
    });

    // Update score and disable buttons
    const isCorrect = selectedAnswerIndex === correctIndex;
    updateScore(isCorrect);
    buttons.forEach(button => button.disabled = true);

    // Proceed after 1.5 seconds
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            displayResult();
        }
    }, 300);
});

function displayResult() {
    const percentage = (correctAnswers / questions.length) * 100;
    let insightMessage = "";
    
    if (percentage < 44) insightMessage = "Keep practicing! 💪";
    else if (percentage < 77) insightMessage = "Good job! 🚀";
    else insightMessage = "Perfect! 🎉";

    quizContainer.innerHTML = `
        <h1>${insightMessage}</h1>
        <p style="margin: 20px 0">You got ${correctAnswers} out of ${questions.length} correct!</p>
        <p style="color: ${streakCount >= 5 ? '#FF9800' : '#4CAF50'}; font-weight: bold">
            ${streakCount >= 5 ? '2x Multiplier Applied! ' : ''}Final Score: ${score}
        </p>
        <div style="margin-top: 30px">
            <button onclick="window.location.href='levelSection.html'" class="btn">Home</button>
            <button onclick="nextLevel()" class="btn">Next Level</button>
        </div>
    `;

    // Save best score
    const level = new URLSearchParams(window.location.search).get('level');
    const previousScore = parseInt(localStorage.getItem(`level_${level}_score`)) || 0;
    if (correctAnswers > previousScore) {
        localStorage.setItem(`level_${level}_score`, correctAnswers);
    }
}

function nextLevel() {
    currentLevel++;
    localStorage.setItem("currentLevel", currentLevel);
    window.location.href = `quiz.html?level=${currentLevel}`;
}

// Initialize quiz
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get('level');
if (level) {
    levelHeader.textContent = `Level ${level}`;
    currentLevel = parseInt(level);
    fetchQuizData(level);
} else {
    quizContainer.innerHTML = `<p class="error">No level specified.</p>`;
}