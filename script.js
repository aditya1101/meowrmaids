document.addEventListener('DOMContentLoaded', () => {
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

    function handleKeyPress(event) {
        if (!moves.includes(event.key)) {
            return; // Ignore non-arrow key presses
        }
        
        if (event.key === currentMove) {
            score++;
            updateScore();
            correctSound.play();
            // Add a visual cue for success
            const moveDirection = currentMove.replace('Arrow', '').toLowerCase();
            playerCat.style.backgroundImage = `url('cat_${moveDirection}.png')`;
            playerCat.style.transform = 'translateX(-50%) scale(1)';
            setTimeout(() => {
                playerCat.style.transform = 'translateX(-50%) scale(1)';
                playerCat.style.backgroundImage = "url('cat.png')";
            }, 500);
        } else {
            incorrectSound.play();
            // Add a visual cue for failure
            playerCat.style.animation = 'shake 0.5s';
            setTimeout(() => {
                playerCat.style.animation = '';
            }, 500);
        }
        displayInstruction();
    }

    document.addEventListener('keydown', handleKeyPress);

    displayInstruction();
    updateScore();
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
