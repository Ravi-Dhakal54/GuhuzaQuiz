  // Get references to DOM elements
  const quizContainer = document.getElementById("quiz-container");
  const levelHeader = document.getElementById("level");
  const questionText = document.getElementById("question-text");
  const answersContainer = document.getElementById("answers-container");
  const checkAnswerButton = document.getElementById("check-answer");
  const resultContainer = document.getElementById("result-container");

  // Initialize quiz state variables
  let currentLevel = 1; // Current level of the quiz
  let currentQuestionIndex = 0; // Index of the current question
  let correctAnswers = 0; // Number of correct answers
  let questions = []; // Array to store quiz questions
  let selectedAnswerIndex = null; // Index of the selected answer

  // Fetch quiz data from API using a CORS proxy
  async function fetchQuizData(level) {
      try {
          // Fetch quiz data from the API
          const response = await fetch(`https://corsproxy.io/?https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level= 2`);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Parse the response data as JSON
          const data = await response.json();
          // Store questions in the questions array
          questions = data.test.question;
          // Load the first question
          loadQuestion();
      } catch (error) {
          // Handle errors during fetch
          console.error("Error fetching quiz data:", error);
          quizContainer.innerHTML = `<p>Failed to load quiz data. Please try again later.</p>`;
      }
  }

  // Load the current question
  function loadQuestion() {
      // Get the current question from the questions array
      const currentQuestion = questions[currentQuestionIndex];
      // Update the level and question header
      levelHeader.textContent = `Demo Quiz`;
    Question.textContent = `Q.${currentQuestionIndex + 1}) `;
      // Update the question text
      questionText.textContent = currentQuestion.question;

      // Clear previous answers
      answersContainer.innerHTML = "";
      // Create buttons for each answer
      currentQuestion.answers.forEach((answer, index) => {
          const button = document.createElement("button");
          button.textContent = answer;
          button.className = "answer";
          button.dataset.index = index;
          button.setAttribute("tabindex", "0"); // Make button focusable
          // Add click event listener to select the answer
          button.addEventListener("click", () => selectAnswer(index));
          // Add keydown event listener for accessibility
          button.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                  selectAnswer(index);
              }
          });
          // Append the button to the answers container
          answersContainer.appendChild(button);
      });
      // Disable the "Check Answer" button initially
      checkAnswerButton.disabled = true;
      // Reset the selected answer index
      selectedAnswerIndex = null;
  }

  // Handle answer selection
  function selectAnswer(index) {
      // Get all answer buttons
      const buttons = document.querySelectorAll(".answer");
      // Remove the "selected" class from all buttons
      buttons.forEach((button, i) => {
          if (i === index) {
              button.classList.add("selected"); // Highlight the selected answer
          } else {
              button.classList.remove("selected"); // Remove highlight from other answers
          }
      });
      // Update the selected answer index
      selectedAnswerIndex = index;
      // Enable the "Check Answer" button
      checkAnswerButton.disabled = false;
  }

  // Check the selected answer
  checkAnswerButton.addEventListener("click", () => {
      // If no answer is selected, return
      if (selectedAnswerIndex === null) return;

      // Get the index of the correct answer
      const correctIndex = questions[currentQuestionIndex].test_answer;
      // Get all answer buttons
      const buttons = document.querySelectorAll(".answer");

      // Check if the selected answer is correct
      if (selectedAnswerIndex === correctIndex) {
          // Highlight the selected answer as correct
          buttons[selectedAnswerIndex].classList.add("correct");
          // Increment the correct answers count
          correctAnswers++;
      } else {
          // Highlight the selected answer as incorrect
          buttons[selectedAnswerIndex].classList.add("incorrect");
          // Highlight the correct answer
          buttons[correctIndex].classList.add("correct");
      }

      // Disable all answer buttons after checking the answer
      buttons.forEach(button => {
          button.disabled = true;
      });

      // Move to the next question
      currentQuestionIndex++;

      // If there are more questions, load the next question after a delay
      if (currentQuestionIndex < questions.length) {
          setTimeout(() => loadQuestion(), 300);
      } else {
          // If all questions are answered, display the result
          displayResult();
      }
  });

  // Display the quiz result with a popup
  function displayResult() {
      // Update the quiz container with the result message
      quizContainer.innerHTML = `
          <h2>Sign up now to see your score and track your progress.</h2>
          <p style="font-size:22px; margin: 85px;">Unlock your full potential! 🚀 Don't miss out on exclusive insights and rewards!</p>
          
          <label><button id="signup" class="btn">Sign Up</button></label>
      `;
      // Add event listener to the "Sign Up" button
      document.getElementById("signup").addEventListener("click", SignUp);

      // Create the popup overlay and card
      const popupOverlay = document.createElement("div");
      popupOverlay.className = "popup-overlay";

      const popupCard = document.createElement("div");
      popupCard.className = "popup-card";
      popupCard.innerHTML = `
          
          <p id="result">You got <span class="blurred">${correctAnswers}</span> out of ${questions.length} correct answers.</p>
          <button id="close-popup">Close</button>
      `;

      // Append the popup card to the overlay
      popupOverlay.appendChild(popupCard);
      // Append the overlay to the body
      document.body.appendChild(popupOverlay);

      // Close the popup when the close button is clicked
      document.getElementById("close-popup").addEventListener("click", () => {
          document.body.removeChild(popupOverlay);
      });
  }

  // Signing the user up (redirect to signup page)
  function SignUp() {
      window.location.href = "signup.html";
  }

  // Initialize the quiz by fetching data for the current level
  fetchQuizData(currentLevel);