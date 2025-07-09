document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const gameContainer = document.getElementById('game-container');
    const playBtn = document.getElementById('play-btn');
    const freestyleBtn = document.getElementById('freestyle-btn');
    const memoryBtn = document.getElementById('memory-btn');
    const backBtn = document.getElementById('back-btn');
    const memoryOptionsContainer = document.getElementById('memory-options-container');
    const sequenceLengthInput = document.getElementById('sequence-length');
    const startMemoryBtn = document.getElementById('start-memory-btn');
    const backToMenuFromMemoryOptionsBtn = document.getElementById('back-to-menu-from-memory-options-btn');

    const coachInstructions = document.getElementById('coach-instructions');
    const playerCat = document.getElementById('player-cat');
    const scoreDisplay = document.getElementById('score');

    const correctSound = new Audio('correct.mp3');
    const incorrectSound = new Audio('incorrect.mp3');

    const moves = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const imagePaths = [
        'cat.png',
        'cat_up.png',
        'cat_down.png',
        'cat_left.png',
        'cat_right.png'
    ];

    // Preload images to prevent flickering
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });

    let currentMove = '';
    let score = 0;
    let gameMode = 'normal'; // 'normal', 'freestyle', or 'memory'
    let isActionInProgress = false;
    let memorySequence = [];
    let playerSequence = [];
    let memorySequenceLength = 3;

    function goBackToMenu() {
        gameContainer.classList.add('hidden');
        memoryOptionsContainer.classList.add('hidden');
        menuContainer.classList.remove('hidden');
        document.removeEventListener('keydown', handleKeyPress);
        playerCat.style.backgroundImage = "url('cat.png')";
        playerCat.style.animation = '';
        isActionInProgress = false;
        memorySequence = [];
        playerSequence = [];
    }

    function startGame(mode) {
        score = 0;
        gameMode = mode;
        menuContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        memoryOptionsContainer.classList.add('hidden');

        if (gameMode === 'normal') {
            displayInstruction();
        } else if (gameMode === 'freestyle') {
            coachInstructions.textContent = "Freestyle Mode!";
        } else if (gameMode === 'memory') {
            memorySequenceLength = parseInt(sequenceLengthInput.value, 10);
            startMemoryRound();
        }
        updateScore();
        document.addEventListener('keydown', handleKeyPress);
    }

    playBtn.addEventListener('click', () => startGame('normal'));
    freestyleBtn.addEventListener('click', () => startGame('freestyle'));
    memoryBtn.addEventListener('click', () => {
        menuContainer.classList.add('hidden');
        memoryOptionsContainer.classList.remove('hidden');
    });
    backBtn.addEventListener('click', goBackToMenu);
    startMemoryBtn.addEventListener('click', () => startGame('memory'));
    backToMenuFromMemoryOptionsBtn.addEventListener('click', goBackToMenu);

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function getNextMove() {
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }

    function displayInstruction() {
        currentMove = getNextMove();
        coachInstructions.textContent = `Coach: ${currentMove.replace('Arrow', '')}!`;
    }

    function startMemoryRound() {
        isActionInProgress = true;
        coachInstructions.textContent = 'Watch carefully...';
        memorySequence = [];
        for (let i = 0; i < memorySequenceLength; i++) {
            memorySequence.push(getNextMove());
        }
        playerSequence = [];

        setTimeout(() => {
            displayMemorySequence(0);
        }, 1000);
    }

    function displayMemorySequence(index) {
        if (index < memorySequence.length) {
            const move = memorySequence[index];
            coachInstructions.textContent = move.replace('Arrow', '');
            const moveDirection = move.replace('Arrow', '').toLowerCase();
            playerCat.style.backgroundImage = `url('cat_${moveDirection}.png')`;
            setTimeout(() => {
                playerCat.style.backgroundImage = "url('cat.png')";
                setTimeout(() => {
                    displayMemorySequence(index + 1);
                }, 200); // Brief pause between moves
            }, 1000);
        } else {
            coachInstructions.textContent = 'Your turn!';
            isActionInProgress = false;
        }
    }

    function handleKeyPress(event) {
        if (!moves.includes(event.key) || isActionInProgress) {
            return; // Ignore non-arrow key presses or if an action is in progress
        }
        
        if (gameMode === 'normal') {
            isActionInProgress = true;
            if (event.key === currentMove) {
                score++;
                updateScore();
                correctSound.play();
                // Add a visual cue for success
                const moveDirection = currentMove.replace('Arrow', '').toLowerCase();
                playerCat.style.backgroundImage = `url('cat_${moveDirection}.png')`;
                setTimeout(() => {
                    playerCat.style.backgroundImage = "url('cat.png')";
                    displayInstruction();
                    isActionInProgress = false;
                }, 700); // Increased delay to allow reset
            } else {
                incorrectSound.play();
                // Add a visual cue for failure
                playerCat.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    playerCat.style.animation = '';
                    displayInstruction();
                    isActionInProgress = false;
                }, 700); // Increased delay to allow reset
            }
        } else if (gameMode === 'freestyle') { // Freestyle mode
            isActionInProgress = true;
            const moveDirection = event.key.replace('Arrow', '').toLowerCase();
            playerCat.style.backgroundImage = `url('cat_${moveDirection}.png')`;
            setTimeout(() => {
                playerCat.style.backgroundImage = "url('cat.png')";
                isActionInProgress = false;
            }, 500);
        } else if (gameMode === 'memory') {
            const moveDirection = event.key.replace('Arrow', '').toLowerCase();
            playerCat.style.backgroundImage = `url('cat_${moveDirection}.png')`;
            setTimeout(() => {
                playerCat.style.backgroundImage = "url('cat.png')";
            }, 200);

            const currentMoveIndex = playerSequence.length;
            if (event.key === memorySequence[currentMoveIndex]) {
                playerSequence.push(event.key);

                if (playerSequence.length === memorySequence.length) {
                    // Sequence correct
                    isActionInProgress = true;
                    score++;
                    updateScore();
                    correctSound.play();
                    coachInstructions.textContent = 'Correct!';
                    setTimeout(startMemoryRound, 2000);
                }
            } else {
                // Incorrect move
                isActionInProgress = true;
                incorrectSound.play();
                coachInstructions.textContent = 'Wrong move!';
                playerCat.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    playerCat.style.animation = '';
                    startMemoryRound();
                }, 2000);
            }
        }
    }
});

// Add a shake animation for incorrect moves
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(-50%) translate(1px, 1px) rotate(0deg); }
  10% { transform: translateX(-50%) translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translateX(-50%) translate(-3px, 0px) rotate(1deg); }
  30% { transform: translateX(-50%) translate(3px, 2px) rotate(0deg); }
  40% { transform: translateX(-50%) translate(1px, -1px) rotate(1deg); }
  50% { transform: translateX(-50%) translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translateX(-50%) translate(-3px, 1px) rotate(0deg); }
  70% { transform: translateX(-50%) translate(3px, 1px) rotate(-1deg); }
  80% { transform: translateX(-50%) translate(-1px, -1px) rotate(1deg); }
  90% { transform: translateX(-50%) translate(1px, 2px) rotate(0deg); }
  100% { transform: translateX(-50%) translate(1px, -2px) rotate(-1deg); }
}
`;
document.head.appendChild(style);
