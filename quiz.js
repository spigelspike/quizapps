// Constants
const QUESTION_TIME = 15;

// Variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;

// DOM Elements
const timerElement = document.getElementById("timer");
const progressBarElement = document.getElementById("progress-bar");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const imageElement = document.getElementById("question-image");
const submitButton = document.getElementById("submit-btn");

// Initialize Quiz
function initializeQuiz() {
    console.log("Initializing quiz..."); // Debugging log

    const userData = JSON.parse(sessionStorage.getItem('quizUserData'));
    console.log("User Data:", userData); // Debugging log

    if (!userData) {
        console.log("No user data found. Redirecting to login..."); // Debugging log
        window.location.href = 'index.html'; // Redirect to login if no user data
        return;
    }

    // Select questions based on age
    currentQuestions = userData.age < 17 ? [...juniorQuestions] : [...seniorQuestions];
    renderQuestion();
    startTimer();
}

// Render Question
function renderQuestion() {
    const questionData = currentQuestions[currentQuestionIndex];
    questionElement.textContent = questionData.question;
    optionsElement.innerHTML = "";

    // Handle Image
    if (questionData.image) {
        imageElement.src = questionData.image;
        imageElement.classList.remove("hidden");

        imageElement.onerror = function() {
            console.error(`Failed to load image: ${questionData.image}`);
            this.classList.add("hidden");
        };
    } else {
        imageElement.classList.add("hidden");
    }

    // Display Options
    questionData.options.forEach((option) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="radio" id="${option}" name="answer" value="${option}">
            <label for="${option}">${option}</label>
        `;
        optionsElement.appendChild(li);
    });

    // Reset submit button state
    submitButton.disabled = true;
}

// Handle Option Selection
optionsElement.addEventListener("change", function(e) {
    submitButton.disabled = false;
});

// Start Timer
function startTimer() {
    let timeLeft = QUESTION_TIME;
    timerElement.textContent = timeLeft;
    progressBarElement.style.width = "100%";

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        progressBarElement.style.width = `${(timeLeft / QUESTION_TIME) * 100}%`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleSubmit();
        }
    }, 1000);
}

// Handle Submit
function handleSubmit() {
    clearInterval(timer);
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (selectedOption && selectedOption.value === currentQuestions[currentQuestionIndex].answer) {
        score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        renderQuestion();
        startTimer();
    } else {
        endQuiz();
    }
}

// End Quiz
function endQuiz() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="end-quiz">
            <h2>Quiz Completed!</h2>
            <p>Your score: ${score}/${currentQuestions.length}</p>
            <button onclick="location.href='index.html'" class="submit-btn">Try Again</button>
        </div>
    `;
}

// Event Listeners
submitButton.addEventListener("click", handleSubmit);

// Initialize quiz only once
if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeQuiz();
} else {
    document.addEventListener("DOMContentLoaded", initializeQuiz);
}