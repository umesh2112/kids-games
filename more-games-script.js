// Global variables
let currentGame = 'home';
let trafficScore = 0;
let reactionTimes = [];
let bestTime = Infinity;
let dualNBackLevel = 1;
let positionHits = 0;
let soundHits = 0;
let rubiksMoves = 0;

// Three.js variables for Rubik's cube
let scene, camera, renderer, cube;
let rubiksCube = null;

// DOM elements
const navBtns = document.querySelectorAll('.nav-btn');
const gameSections = document.querySelectorAll('.game-section');
const gameCards = document.querySelectorAll('.game-card');

// Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const game = btn.dataset.game;
        if (game) {
            switchGame(game);
        }
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
    
    // Initialize specific game if needed
    if (game === 'rubiks') {
        initRubiksCube();
    }
}

// Traffic Signal Game Logic
const trafficQuestions = [
    { question: "What should you do when you see a RED light?", answer: "Stop", options: ["Stop", "Go", "Speed up", "Turn"] },
    { question: "What does a YELLOW light mean?", answer: "Slow down", options: ["Go fast", "Slow down", "Turn left", "Stop"] },
    { question: "When can you go at a GREEN light?", answer: "When safe", options: ["Always", "When safe", "Never", "Only at night"] },
    { question: "What should you do at a RED light with a green arrow?", answer: "Turn in arrow direction", options: ["Go straight", "Turn in arrow direction", "Stop", "Speed up"] },
    { question: "What does a flashing YELLOW light mean?", answer: "Proceed with caution", options: ["Stop", "Proceed with caution", "Speed up", "Turn around"] }
];

let currentTrafficQuestion = 0;
let activeLight = null;

document.getElementById('startTraffic').addEventListener('click', startTrafficGame);
document.getElementById('resetTraffic').addEventListener('click', resetTrafficGame);

function startTrafficGame() {
    currentTrafficQuestion = 0;
    trafficScore = 0;
    updateTrafficScore();
    showTrafficQuestion();
}

function resetTrafficGame() {
    currentTrafficQuestion = 0;
    trafficScore = 0;
    updateTrafficScore();
    document.getElementById('trafficQuestion').textContent = 'Click Start Game to begin!';
    document.getElementById('trafficOptions').innerHTML = '';
    document.getElementById('trafficFeedback').innerHTML = '';
    resetLights();
}

function showTrafficQuestion() {
    if (currentTrafficQuestion >= trafficQuestions.length) {
        document.getElementById('trafficQuestion').textContent = 'Game Complete!';
        document.getElementById('trafficOptions').innerHTML = `<p>Final Score: ${trafficScore}/${trafficQuestions.length}</p>`;
        return;
    }

    const question = trafficQuestions[currentTrafficQuestion];
    document.getElementById('trafficQuestion').textContent = question.question;
    
    // Show random traffic light
    showRandomLight();
    
    const optionsHtml = question.options
        .sort(() => Math.random() - 0.5)
        .map(option => `<button class="option-btn" onclick="checkTrafficAnswer('${option}')">${option}</button>`)
        .join('');
    
    document.getElementById('trafficOptions').innerHTML = optionsHtml;
}

function showRandomLight() {
    resetLights();
    const lights = ['red', 'yellow', 'green'];
    const randomLight = lights[Math.floor(Math.random() * lights.length)];
    document.getElementById(randomLight + 'Light').classList.add('active');
    activeLight = randomLight;
}

function resetLights() {
    document.querySelectorAll('.light').forEach(light => {
        light.classList.remove('active');
    });
    activeLight = null;
}

function checkTrafficAnswer(selectedAnswer) {
    const question = trafficQuestions[currentTrafficQuestion];
    const isCorrect = selectedAnswer === question.answer;
    
    if (isCorrect) {
        trafficScore++;
        updateTrafficScore();
        showFeedback('trafficFeedback', 'Correct! Great traffic knowledge! 🚦', 'correct');
    } else {
        showFeedback('trafficFeedback', `Incorrect! The answer was "${question.answer}".`, 'incorrect');
    }
    
    currentTrafficQuestion++;
    
    setTimeout(() => {
        showTrafficQuestion();
    }, 2000);
}

function updateTrafficScore() {
    document.getElementById('trafficScore').textContent = trafficScore;
}

// Reaction Speed Game Logic
let reactionStartTime = 0;
let isReactionTestActive = false;

document.getElementById('startReaction').addEventListener('click', startReactionTest);
document.getElementById('resetReaction').addEventListener('click', resetReactionTest);
document.getElementById('reactionTarget').addEventListener('click', handleReactionClick);

function startReactionTest() {
    isReactionTestActive = true;
    document.getElementById('reactionTarget').classList.remove('active');
    document.querySelector('.target-text').textContent = 'Wait for the target...';
    
    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000;
    setTimeout(() => {
        if (isReactionTestActive) {
            showReactionTarget();
        }
    }, delay);
}

function resetReactionTest() {
    isReactionTestActive = false;
    reactionTimes = [];
    bestTime = Infinity;
    updateReactionStats();
    document.getElementById('reactionTarget').classList.remove('active');
    document.querySelector('.target-text').textContent = 'Click when you see the target!';
    document.getElementById('reactionFeedback').innerHTML = '';
}

function showReactionTarget() {
    if (!isReactionTestActive) return;
    
    reactionStartTime = Date.now();
    document.getElementById('reactionTarget').classList.add('active');
    document.querySelector('.target-text').textContent = 'CLICK NOW!';
}

function handleReactionClick() {
    if (!isReactionTestActive || !document.getElementById('reactionTarget').classList.contains('active')) {
        return;
    }
    
    const reactionTime = Date.now() - reactionStartTime;
    reactionTimes.push(reactionTime);
    
    if (reactionTime < bestTime) {
        bestTime = reactionTime;
        document.getElementById('bestTime').textContent = bestTime;
    }
    
    updateReactionStats();
    
    document.getElementById('reactionTarget').classList.remove('active');
    document.querySelector('.target-text').textContent = `Your time: ${reactionTime}ms`;
    
    showFeedback('reactionFeedback', `Great reaction! Time: ${reactionTime}ms`, 'correct');
    
    // Auto-start next test after 2 seconds
    setTimeout(() => {
        if (isReactionTestActive) {
            startReactionTest();
        }
    }, 2000);
}

function updateReactionStats() {
    const avgTime = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length) : '--';
    document.getElementById('avgTime').textContent = avgTime;
    document.getElementById('testCount').textContent = reactionTimes.length;
}

// Dual N-Back Memory Game Logic
let dualNBackSequence = [];
let currentStep = 0;
let isDualNBackActive = false;

document.getElementById('startDualNBack').addEventListener('click', startDualNBackGame);
document.getElementById('resetDualNBack').addEventListener('click', resetDualNBackGame);

function startDualNBackGame() {
    isDualNBackActive = true;
    positionHits = 0;
    soundHits = 0;
    currentStep = 0;
    dualNBackSequence = [];
    updateDualNBackStats();
    createPositionGrid();
    nextDualNBackStep();
}

function resetDualNBackGame() {
    isDualNBackActive = false;
    positionHits = 0;
    soundHits = 0;
    currentStep = 0;
    dualNBackSequence = [];
    updateDualNBackStats();
    document.getElementById('positionGrid').innerHTML = '';
    document.getElementById('soundIndicator').innerHTML = '';
    document.getElementById('dualNBackFeedback').innerHTML = '';
}

function createPositionGrid() {
    const grid = document.getElementById('positionGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        grid.appendChild(cell);
    }
}

function nextDualNBackStep() {
    if (!isDualNBackActive) return;
    
    // Generate random position and sound
    const position = Math.floor(Math.random() * 9);
    const sound = Math.random() > 0.5 ? '🔊' : '🔇';
    
    dualNBackSequence.push({ position, sound });
    
    // Show current step
    showDualNBackStep(position, sound);
    
    // Check for matches after N steps
    if (currentStep >= dualNBackLevel) {
        const nStepsAgo = dualNBackSequence[currentStep - dualNBackLevel];
        const positionMatch = nStepsAgo.position === position;
        const soundMatch = nStepsAgo.sound === sound;
        
        // Store expected matches for keyboard input
        window.expectedPositionMatch = positionMatch;
        window.expectedSoundMatch = soundMatch;
    }
    
    currentStep++;
    
    // Continue to next step after 2 seconds
    setTimeout(() => {
        if (isDualNBackActive) {
            nextDualNBackStep();
        }
    }, 2000);
}

function showDualNBackStep(position, sound) {
    // Reset all cells
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('active');
        cell.innerHTML = '';
    });
    
    // Activate position
    document.querySelector(`[data-index="${position}"]`).classList.add('active');
    document.querySelector(`[data-index="${position}"]`).innerHTML = '🎯';
    
    // Show sound
    const soundIndicator = document.getElementById('soundIndicator');
    soundIndicator.innerHTML = sound;
    soundIndicator.classList.add('active');
    
    // Reset after 1 second
    setTimeout(() => {
        soundIndicator.classList.remove('active');
    }, 1000);
}

// Keyboard controls for Dual N-Back
document.addEventListener('keydown', (e) => {
    if (!isDualNBackActive) return;
    
    if (e.code === 'Space') {
        e.preventDefault();
        checkPositionMatch();
    } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        checkSoundMatch();
    }
});

function checkPositionMatch() {
    if (window.expectedPositionMatch) {
        positionHits++;
        showFeedback('dualNBackFeedback', 'Position match correct! 🎯', 'correct');
    } else {
        showFeedback('dualNBackFeedback', 'Position match incorrect!', 'incorrect');
    }
    updateDualNBackStats();
}

function checkSoundMatch() {
    if (window.expectedSoundMatch) {
        soundHits++;
        showFeedback('dualNBackFeedback', 'Sound match correct! 🔊', 'correct');
    } else {
        showFeedback('dualNBackFeedback', 'Sound match incorrect!', 'incorrect');
    }
    updateDualNBackStats();
}

function updateDualNBackStats() {
    document.getElementById('positionHits').textContent = positionHits;
    document.getElementById('soundHits').textContent = soundHits;
    document.getElementById('totalHits').textContent = positionHits + soundHits;
}

// 3D Rubik's Cube Game Logic
document.getElementById('startRubiks').addEventListener('click', startRubiksGame);
document.getElementById('resetRubiks').addEventListener('click', resetRubiksGame);
document.getElementById('scrambleRubiks').addEventListener('click', scrambleRubiksCube);

// Cube control buttons
document.querySelectorAll('.cube-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const face = btn.dataset.face;
        const rotation = btn.dataset.rotation;
        
        if (face) {
            rotateFace(face);
        } else if (rotation) {
            rotateCube(rotation);
        }
    });
});

function initRubiksCube() {
    const container = document.getElementById('rubiksContainer');
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 1.2rem; text-align: center;"><div><i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i><br>3D graphics not available.<br>Please check your internet connection.</div></div>';
        return;
    }
    
    // Clear any existing content
    container.innerHTML = '';
    
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        
        // Create camera with better positioning
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(4, 4, 4);
        camera.lookAt(0, 0, 0);
        
        // Create renderer with better settings
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Add enhanced lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);
        
        // Create Rubik's cube with better materials
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 100 }), // Red
            new THREE.MeshPhongMaterial({ color: 0xff8c00, shininess: 100 }), // Orange
            new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 }), // Yellow
            new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100 }), // Green
            new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 }), // Blue
            new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 })  // White
        ];
        
        cube = new THREE.Mesh(geometry, materials);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
        
        // Add a subtle rotation animation
        cube.rotation.x = 0.3;
        cube.rotation.y = 0.5;
        
        // Start animation loop
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Add some initial feedback
        showFeedback('rubiksFeedback', '3D Rubik\'s Cube loaded! Use the controls to rotate it! 🎯', 'correct');
        
    } catch (error) {
        console.error('Error initializing Rubik\'s cube:', error);
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 1.2rem; text-align: center;"><div><i class="fas fa-cube" style="font-size: 3rem; margin-bottom: 1rem;"></i><br>3D Cube<br>Click controls to interact!</div></div>';
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (cube) {
        // Slower, more visible rotation
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('rubiksContainer');
    if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

function startRubiksGame() {
    rubiksMoves = 0;
    updateRubiksMoves();
    showFeedback('rubiksFeedback', 'Rubik\'s Cube game started! Try to solve it! 🎯', 'correct');
}

function resetRubiksGame() {
    rubiksMoves = 0;
    updateRubiksMoves();
    if (cube) {
        cube.rotation.set(0, 0, 0);
    }
    showFeedback('rubiksFeedback', 'Cube reset to solved state!', 'correct');
}

function scrambleRubiksCube() {
    if (cube) {
        cube.rotation.x = Math.random() * Math.PI * 2;
        cube.rotation.y = Math.random() * Math.PI * 2;
        cube.rotation.z = Math.random() * Math.PI * 2;
        rubiksMoves = 0;
        updateRubiksMoves();
        showFeedback('rubiksFeedback', 'Cube scrambled! Good luck solving it! 🎲', 'correct');
    }
}

function rotateFace(face) {
    if (cube) {
        rubiksMoves++;
        updateRubiksMoves();
        
        switch(face) {
            case 'F':
                cube.rotation.y += Math.PI / 2;
                break;
            case 'B':
                cube.rotation.y -= Math.PI / 2;
                break;
            case 'L':
                cube.rotation.x -= Math.PI / 2;
                break;
            case 'R':
                cube.rotation.x += Math.PI / 2;
                break;
            case 'U':
                cube.rotation.z += Math.PI / 2;
                break;
            case 'D':
                cube.rotation.z -= Math.PI / 2;
                break;
        }
        
        showFeedback('rubiksFeedback', `${face} face rotated!`, 'correct');
    }
}

function rotateCube(axis) {
    if (cube) {
        rubiksMoves++;
        updateRubiksMoves();
        
        switch(axis) {
            case 'X':
                cube.rotation.x += Math.PI / 2;
                break;
            case 'Y':
                cube.rotation.y += Math.PI / 2;
                break;
            case 'Z':
                cube.rotation.z += Math.PI / 2;
                break;
        }
        
        showFeedback('rubiksFeedback', `Cube rotated around ${axis} axis!`, 'correct');
    }
}

function updateRubiksMoves() {
    document.getElementById('rubiksMoves').textContent = rubiksMoves;
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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add some initial animations
    setTimeout(() => {
        document.querySelector('.logo i').style.animation = 'rocket 3s ease-in-out infinite';
    }, 1000);
}); 