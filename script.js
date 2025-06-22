// Global variables
let currentGame = 'home';
let mathScore = 0;
let spellingScore = 0;
let puzzleScore = 0;
let memoryMoves = 0;
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

// DOM elements
const navBtns = document.querySelectorAll('.nav-btn');
const gameSections = document.querySelectorAll('.game-section');
const gameCards = document.querySelectorAll('.game-card');

// Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const game = btn.dataset.game;
        switchGame(game);
    });
});

gameCards.forEach(card => {
    card.addEventListener('click', () => {
        const game = card.dataset.game;
        switchGame(game);
    });
});

function switchGame(game) {
    // Update navigation
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.game === game) {
            btn.classList.add('active');
        }
    });

    // Update sections
    gameSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === game) {
            section.classList.add('active');
        }
    });

    currentGame = game;
}

// Math Game Logic
const mathQuestions = [
    { question: "What is 5 + 3?", answer: 8, options: [6, 7, 8, 9] },
    { question: "What is 10 - 4?", answer: 6, options: [4, 5, 6, 7] },
    { question: "What is 2 × 6?", answer: 12, options: [10, 11, 12, 13] },
    { question: "What is 15 ÷ 3?", answer: 5, options: [3, 4, 5, 6] },
    { question: "What is 7 + 8?", answer: 15, options: [13, 14, 15, 16] },
    { question: "What is 20 - 7?", answer: 13, options: [11, 12, 13, 14] },
    { question: "What is 3 × 4?", answer: 12, options: [9, 10, 11, 12] },
    { question: "What is 18 ÷ 2?", answer: 9, options: [7, 8, 9, 10] },
    { question: "What is 9 + 6?", answer: 15, options: [13, 14, 15, 16] },
    { question: "What is 25 - 8?", answer: 17, options: [15, 16, 17, 18] }
];

let currentMathQuestion = 0;

document.getElementById('startMath').addEventListener('click', startMathGame);
document.getElementById('resetMath').addEventListener('click', resetMathGame);

function startMathGame() {
    currentMathQuestion = 0;
    mathScore = 0;
    updateMathScore();
    showMathQuestion();
}

function resetMathGame() {
    currentMathQuestion = 0;
    mathScore = 0;
    updateMathScore();
    document.getElementById('mathQuestion').textContent = 'Click Start Game to begin!';
    document.getElementById('mathOptions').innerHTML = '';
    document.getElementById('mathFeedback').innerHTML = '';
}

function showMathQuestion() {
    if (currentMathQuestion >= mathQuestions.length) {
        document.getElementById('mathQuestion').textContent = 'Game Complete!';
        document.getElementById('mathOptions').innerHTML = `<p>Final Score: ${mathScore}/${mathQuestions.length}</p>`;
        return;
    }

    const question = mathQuestions[currentMathQuestion];
    document.getElementById('mathQuestion').textContent = question.question;
    
    const optionsHtml = question.options
        .sort(() => Math.random() - 0.5)
        .map(option => `<button class="option-btn" onclick="checkMathAnswer(${option})">${option}</button>`)
        .join('');
    
    document.getElementById('mathOptions').innerHTML = optionsHtml;
}

function checkMathAnswer(selectedAnswer) {
    const question = mathQuestions[currentMathQuestion];
    const isCorrect = selectedAnswer === question.answer;
    
    if (isCorrect) {
        mathScore++;
        updateMathScore();
        showFeedback('mathFeedback', 'Correct! Well done! 🎉', 'correct');
    } else {
        showFeedback('mathFeedback', `Incorrect! The answer was ${question.answer}.`, 'incorrect');
    }
    
    currentMathQuestion++;
    
    setTimeout(() => {
        showMathQuestion();
    }, 1500);
}

function updateMathScore() {
    document.getElementById('mathScore').textContent = mathScore;
}

// Spelling Game Logic
const spellingWords = [
    { word: "apple", hint: "A red fruit that grows on trees" },
    { word: "house", hint: "A place where people live" },
    { word: "school", hint: "A place where children learn" },
    { word: "friend", hint: "Someone you like to spend time with" },
    { word: "family", hint: "People related to you" },
    { word: "animal", hint: "A living creature like a dog or cat" },
    { word: "teacher", hint: "Someone who helps you learn" },
    { word: "computer", hint: "A machine that helps you work and play" },
    { word: "library", hint: "A place with many books" },
    { word: "birthday", hint: "The day you were born" }
];

let currentSpellingWord = 0;

document.getElementById('startSpelling').addEventListener('click', startSpellingGame);
document.getElementById('resetSpelling').addEventListener('click', resetSpellingGame);
document.getElementById('checkSpelling').addEventListener('click', checkSpellingAnswer);

function startSpellingGame() {
    currentSpellingWord = 0;
    spellingScore = 0;
    updateSpellingScore();
    showSpellingQuestion();
}

function resetSpellingGame() {
    currentSpellingWord = 0;
    spellingScore = 0;
    updateSpellingScore();
    document.getElementById('spellingQuestion').textContent = 'Click Start Game to begin!';
    document.getElementById('spellingAnswer').value = '';
    document.getElementById('spellingFeedback').innerHTML = '';
}

function showSpellingQuestion() {
    if (currentSpellingWord >= spellingWords.length) {
        document.getElementById('spellingQuestion').textContent = 'Game Complete!';
        document.getElementById('spellingAnswer').value = '';
        document.getElementById('spellingFeedback').innerHTML = `<p>Final Score: ${spellingScore}/${spellingWords.length}</p>`;
        return;
    }

    const word = spellingWords[currentSpellingWord];
    document.getElementById('spellingQuestion').textContent = `Hint: ${word.hint}`;
    document.getElementById('spellingAnswer').value = '';
    document.getElementById('spellingAnswer').focus();
}

function checkSpellingAnswer() {
    const userAnswer = document.getElementById('spellingAnswer').value.toLowerCase().trim();
    const correctWord = spellingWords[currentSpellingWord].word;
    
    if (userAnswer === correctWord) {
        spellingScore++;
        updateSpellingScore();
        showFeedback('spellingFeedback', `Correct! "${correctWord}" is spelled correctly! 🎉`, 'correct');
    } else {
        showFeedback('spellingFeedback', `Incorrect! The correct spelling is "${correctWord}".`, 'incorrect');
    }
    
    currentSpellingWord++;
    
    setTimeout(() => {
        showSpellingQuestion();
    }, 2000);
}

function updateSpellingScore() {
    document.getElementById('spellingScore').textContent = spellingScore;
}

// Memory Game Logic
const memoryEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

document.getElementById('startMemory').addEventListener('click', startMemoryGame);
document.getElementById('resetMemory').addEventListener('click', resetMemoryGame);

function startMemoryGame() {
    memoryMoves = 0;
    matchedPairs = 0;
    flippedCards = [];
    updateMemoryMoves();
    createMemoryBoard();
}

function resetMemoryGame() {
    memoryMoves = 0;
    matchedPairs = 0;
    flippedCards = [];
    updateMemoryMoves();
    document.getElementById('memoryBoard').innerHTML = '';
    document.getElementById('memoryFeedback').innerHTML = '';
}

function createMemoryBoard() {
    const board = document.getElementById('memoryBoard');
    const allEmojis = [...memoryEmojis, ...memoryEmojis];
    memoryCards = allEmojis.sort(() => Math.random() - 0.5);
    
    board.innerHTML = memoryCards.map((emoji, index) => 
        `<div class="memory-card" data-index="${index}" data-emoji="${emoji}">?</div>`
    ).join('');
    
    board.addEventListener('click', handleMemoryCardClick);
}

function handleMemoryCardClick(e) {
    if (!e.target.classList.contains('memory-card')) return;
    if (e.target.classList.contains('flipped') || e.target.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;
    
    const card = e.target;
    const index = card.dataset.index;
    const emoji = card.dataset.emoji;
    
    card.textContent = emoji;
    card.classList.add('flipped');
    flippedCards.push({ card, emoji, index });
    
    if (flippedCards.length === 2) {
        memoryMoves++;
        updateMemoryMoves();
        
        setTimeout(() => {
            checkMemoryMatch();
        }, 1000);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.emoji === card2.emoji) {
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === memoryEmojis.length) {
            showFeedback('memoryFeedback', 'Congratulations! You completed the memory game! 🎉', 'correct');
        }
    } else {
        card1.card.textContent = '?';
        card2.card.textContent = '?';
        card1.card.classList.remove('flipped');
        card2.card.classList.remove('flipped');
    }
    
    flippedCards = [];
}

function updateMemoryMoves() {
    document.getElementById('memoryMoves').textContent = memoryMoves;
}

// Word Puzzle Game Logic
const puzzleWords = [
    { word: "happy", hint: "Feeling good and cheerful" },
    { word: "learn", hint: "To gain knowledge" },
    { word: "play", hint: "To have fun and enjoy" },
    { word: "read", hint: "To look at words and understand them" },
    { word: "write", hint: "To put words on paper" },
    { word: "draw", hint: "To make pictures with pencils or crayons" },
    { word: "sing", hint: "To make music with your voice" },
    { word: "dance", hint: "To move your body to music" },
    { word: "sleep", hint: "To rest with your eyes closed" },
    { word: "eat", hint: "To put food in your mouth" }
];

let currentPuzzleWord = 0;

document.getElementById('startPuzzle').addEventListener('click', startPuzzleGame);
document.getElementById('resetPuzzle').addEventListener('click', resetPuzzleGame);
document.getElementById('checkPuzzle').addEventListener('click', checkPuzzleAnswer);

function startPuzzleGame() {
    currentPuzzleWord = 0;
    puzzleScore = 0;
    updatePuzzleScore();
    showPuzzleQuestion();
}

function resetPuzzleGame() {
    currentPuzzleWord = 0;
    puzzleScore = 0;
    updatePuzzleScore();
    document.getElementById('puzzleQuestion').textContent = 'Click Start Game to begin!';
    document.getElementById('puzzleScrambled').textContent = '';
    document.getElementById('puzzleAnswer').value = '';
    document.getElementById('puzzleFeedback').innerHTML = '';
}

function showPuzzleQuestion() {
    if (currentPuzzleWord >= puzzleWords.length) {
        document.getElementById('puzzleQuestion').textContent = 'Game Complete!';
        document.getElementById('puzzleScrambled').textContent = '';
        document.getElementById('puzzleAnswer').value = '';
        document.getElementById('puzzleFeedback').innerHTML = `<p>Final Score: ${puzzleScore}/${puzzleWords.length}</p>`;
        return;
    }

    const word = puzzleWords[currentPuzzleWord];
    document.getElementById('puzzleQuestion').textContent = `Hint: ${word.hint}`;
    document.getElementById('puzzleScrambled').textContent = scrambleWord(word.word);
    document.getElementById('puzzleAnswer').value = '';
    document.getElementById('puzzleAnswer').focus();
}

function scrambleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function checkPuzzleAnswer() {
    const userAnswer = document.getElementById('puzzleAnswer').value.toLowerCase().trim();
    const correctWord = puzzleWords[currentPuzzleWord].word;
    
    if (userAnswer === correctWord) {
        puzzleScore++;
        updatePuzzleScore();
        showFeedback('puzzleFeedback', `Correct! You unscrambled "${correctWord}"! 🎉`, 'correct');
    } else {
        showFeedback('puzzleFeedback', `Incorrect! The correct word is "${correctWord}".`, 'incorrect');
    }
    
    currentPuzzleWord++;
    
    setTimeout(() => {
        showPuzzleQuestion();
    }, 2000);
}

function updatePuzzleScore() {
    document.getElementById('puzzleScore').textContent = puzzleScore;
}

// Utility Functions
function showFeedback(elementId, message, type) {
    const feedback = document.getElementById(elementId);
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    
    setTimeout(() => {
        feedback.innerHTML = '';
        feedback.className = 'feedback';
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (currentGame === 'spelling') {
            checkSpellingAnswer();
        } else if (currentGame === 'puzzle') {
            checkPuzzleAnswer();
        }
    }
});

// Add some fun sound effects (optional)
function playSound(type) {
    // This would require audio files, but we can add visual feedback instead
    console.log(`Playing ${type} sound`);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add some initial animations
    setTimeout(() => {
        document.querySelector('.logo i').style.animation = 'bounce 2s infinite';
    }, 1000);
}); 