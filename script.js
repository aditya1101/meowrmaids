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
    const storyBtn = document.getElementById('story-btn');
    const storyIntroContainer = document.getElementById('story-intro-container');
    const storyText = document.getElementById('story-text');
    const startDayBtn = document.getElementById('start-day-btn');
    const statsContainer = document.getElementById('stats-container');

    const coachInstructions = document.getElementById('coach-instructions');
    const playerCat = document.getElementById('player-cat');
    const scoreDisplay = document.getElementById('score');
    const dayDisplay = document.getElementById('day-display');
    const mistakesDisplay = document.getElementById('mistakes-display');

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
    let currentDay = 1;
    let mistakes = 0;

    const storyTexts = [
        "Day 1: Chicks Malone, a cat with a dream, wants to join the Meowrmaids Synchronized Swimming team. First, he must prove he can follow basic instructions. Let's see if he has what it takes!",
        "Day 2: Impressive! Chicks passed the first day. But the routines are getting harder. Today's sequences are longer. Can he keep up?",
        "Day 3: Chicks is showing real promise! The coaches are watching him closely. The pressure is on to master even more complex moves.",
        "Day 4: Halfway there! Chicks is becoming a local celebrity. But fame brings pressure. The routines are now twice as long as when he started.",
        "Day 5: The Meowrmaids have invited Chicks to a special practice. He needs to be flawless to impress the team captain.",
        "Day 6: The final tryouts are tomorrow. Today is all about endurance and focus. The sequences are long and grueling.",
        "Day 7: This is it! The final day of tryouts. Chicks Malone is on the verge of making his Olympic dream a reality. He has to perform the longest sequence yet. Good luck, Chicks!"
    ];

    function goBackToMenu() {
        gameContainer.classList.add('hidden');
        memoryOptionsContainer.classList.add('hidden');
        storyIntroContainer.classList.add('hidden');
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
        mistakes = 0;
        gameMode = mode;
        menuContainer.classList.add('hidden');
        memoryOptionsContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        if (gameMode === 'normal') {
            displayInstruction();
        } else if (gameMode === 'freestyle') {
            coachInstructions.textContent = "Freestyle Mode!";
        } else if (gameMode === 'memory') {
            memorySequenceLength = parseInt(sequenceLengthInput.value, 10);
            startMemoryRound();
        } else if (gameMode === 'story') {
            currentDay = 1;
            gameContainer.classList.add('hidden');
            showStoryIntro();
        }
        updateStats();
        document.addEventListener('keydown', handleKeyPress);
    }

    playBtn.addEventListener('click', () => startGame('normal'));
    freestyleBtn.addEventListener('click', () => startGame('freestyle'));
    storyBtn.addEventListener('click', () => startGame('story'));
    memoryBtn.addEventListener('click', () => {
        menuContainer.classList.add('hidden');
        memoryOptionsContainer.classList.remove('hidden');
    });
    backBtn.addEventListener('click', goBackToMenu);
    startMemoryBtn.addEventListener('click', () => startGame('memory'));
    backToMenuFromMemoryOptionsBtn.addEventListener('click', goBackToMenu);
    startDayBtn.addEventListener('click', () => {
        storyIntroContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startDay();
    });

    function updateStats() {
        mistakesDisplay.classList.add('hidden');
        dayDisplay.classList.add('hidden');
        scoreDisplay.classList.add('hidden');

        if (gameMode === 'normal') {
            scoreDisplay.classList.remove('hidden');
            mistakesDisplay.classList.remove('hidden');
            scoreDisplay.textContent = `Score: ${score}`;
            mistakesDisplay.textContent = `Mistakes: ${mistakes}`;
        } else if (gameMode === 'freestyle') {
            scoreDisplay.classList.remove('hidden');
            scoreDisplay.textContent = `Score: ${score}`;
        } else if (gameMode === 'memory') {
            scoreDisplay.classList.remove('hidden');
            mistakesDisplay.classList.remove('hidden');
            scoreDisplay.textContent = `Score: ${score}`;
            mistakesDisplay.textContent = `Mistakes: ${mistakes}`;
        } else if (gameMode === 'story') {
            scoreDisplay.classList.remove('hidden');
            mistakesDisplay.classList.remove('hidden');
            dayDisplay.classList.remove('hidden');
            scoreDisplay.textContent = `Score: ${score} / 5`;
            mistakesDisplay.textContent = `Mistakes: ${mistakes} / 3`;
            dayDisplay.textContent = `Day: ${currentDay}`;
        }
    }

    function getNextMove() {
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }

    function displayInstruction() {
        currentMove = getNextMove();
        coachInstructions.textContent = `Coach: ${currentMove.replace('Arrow', '')}!`;
    }

    function showStoryIntro() {
        storyText.textContent = storyTexts[currentDay - 1];
        storyIntroContainer.classList.remove('hidden');
    }

    function startDay() {
        score = 0;
        mistakes = 0;
        updateStats();
        startStoryRound();
    }

    function startStoryRound() {
        isActionInProgress = true;
        coachInstructions.textContent = 'Watch carefully...';
        memorySequence = [];
        const sequenceLength = currentDay + 2;
        for (let i = 0; i < sequenceLength; i++) {
            memorySequence.push(getNextMove());
        }
        playerSequence = [];

        setTimeout(() => {
            displayMemorySequence(0);
        }, 1000);
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
                    if (gameMode === 'story' && index + 1 >= memorySequence.length) {
                        coachInstructions.textContent = 'Your turn!';
                        isActionInProgress = false;
                    } else {
                        displayMemorySequence(index + 1);
                    }
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
                mistakes++;
                incorrectSound.play();
                // Add a visual cue for failure
                playerCat.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    playerCat.style.animation = '';
                    displayInstruction();
                    isActionInProgress = false;
                }, 700); // Increased delay to allow reset
            }
            updateStats();
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
                    correctSound.play();
                    coachInstructions.textContent = 'Correct!';
                    setTimeout(startMemoryRound, 2000);
                }
            } else {
                // Incorrect move
                isActionInProgress = true;
                mistakes++;
                incorrectSound.play();
                coachInstructions.textContent = 'Wrong move!';
                playerCat.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    playerCat.style.animation = '';
                    startMemoryRound();
                }, 2000);
            }
            updateStats();
        } else if (gameMode === 'story') {
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
                    updateStats();
                    correctSound.play();
                    
                    if (score >= 5) {
                        currentDay++;
                        if (currentDay > 7) {
                            coachInstructions.textContent = 'Chicks is a Meowrmaid!';
                            setTimeout(goBackToMenu, 3000);
                        } else {
                            coachInstructions.textContent = 'Day Complete!';
                            setTimeout(() => {
                                gameContainer.classList.add('hidden');
                                showStoryIntro();
                            }, 2000);
                        }
                    } else {
                        coachInstructions.textContent = 'Correct!';
                        setTimeout(startStoryRound, 2000);
                    }
                }
            } else {
                // Incorrect move
                isActionInProgress = true;
                mistakes++;
                updateStats();
                incorrectSound.play();
                
                if (mistakes >= 3) {
                    coachInstructions.textContent = 'Too many mistakes. Try again!';
                    playerCat.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        playerCat.style.animation = '';
                        startDay();
                    }, 2000);
                } else {
                    coachInstructions.textContent = 'Wrong move!';
                    playerCat.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        playerCat.style.animation = '';
                        startStoryRound();
                    }, 2000);
                }
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
