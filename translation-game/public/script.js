// Game state
let currentQuestion = null;
let correctAnswers = 0;
let wrongAnswers = 0;
let gameActive = true;

// DOM Elements
const bgWordEl = document.getElementById('bgWord');
const option0El = document.getElementById('option0');
const option1El = document.getElementById('option1');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const correctCountEl = document.getElementById('correctCount');
const wrongCountEl = document.getElementById('wrongCount');
const accuracyEl = document.getElementById('accuracy');
const wordCountEl = document.getElementById('wordCount');

// Load a new question from the server
async function loadQuestion() {
    try {
        const response = await fetch('/question');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        currentQuestion = data;
        
        // Update UI with new question
        bgWordEl.textContent = data.bgWord;
        option0El.textContent = `A) ${data.options[0]}`;
        option1El.textContent = `B) ${data.options[1]}`;
        
        // Reset UI state
        option0El.classList.remove('correct', 'wrong');
        option1El.classList.remove('correct', 'wrong');
        option0El.disabled = false;
        option1El.disabled = false;
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        nextBtn.disabled = true;
        gameActive = true;
        
    } catch (error) {
        console.error('Error loading question:', error);
        feedbackEl.textContent = 'Error loading question. Please try again.';
        feedbackEl.className = 'feedback error';
    }
}

// Handle option selection
function selectOption(selectedIndex) {
    if (!gameActive || !currentQuestion) return;
    
    gameActive = false;
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    
    // Update score
    if (isCorrect) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }
    
    // Update UI
    const correctBtn = currentQuestion.correctIndex === 0 ? option0El : option1El;
    const wrongBtn = currentQuestion.correctIndex === 0 ? option1El : option0El;
    
    correctBtn.classList.add('correct');
    if (!isCorrect) {
        wrongBtn.classList.add('wrong');
    }
    
    // Disable buttons
    option0El.disabled = true;
    option1El.disabled = true;
    
    // Show feedback
    if (isCorrect) {
        feedbackEl.textContent = '✓ Correct! Well done!';
        feedbackEl.className = 'feedback correct';
    } else {
        feedbackEl.textContent = `✗ Wrong. The correct answer is: "${currentQuestion.options[currentQuestion.correctIndex]}"`;
        feedbackEl.className = 'feedback wrong';
    }
    
    // Update stats
    updateStats();
    
    // Enable next button
    nextBtn.disabled = false;
}

// Move to next question
function nextQuestion() {
    loadQuestion();
}

// Update statistics display
function updateStats() {
    correctCountEl.textContent = correctAnswers;
    wrongCountEl.textContent = wrongAnswers;
    
    const total = correctAnswers + wrongAnswers;
    const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    accuracyEl.textContent = `${accuracy}%`;
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    wordCountEl.textContent = '20'; // Update this with actual word count
});
