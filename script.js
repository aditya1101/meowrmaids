document.addEventListener('DOMContentLoaded', () => {
    const coachInstructions = document.getElementById('coach-instructions');
    const playerCat = document.getElementById('player-cat');
    const scoreDisplay = document.getElementById('score');

    const moves = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
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
        if (event.key === currentMove) {
            score++;
            updateScore();
            // Add a visual cue for success
            const moveDirection = currentMove.replace('Arrow', '').toLowerCase();
            playerCat.style.backgroundImage = `url('cat_${moveDirection}.png')`;
            playerCat.style.transform = 'scale(1.2)';
            setTimeout(() => {
                playerCat.style.transform = 'scale(1)';
                playerCat.style.backgroundImage = "url('cat.png')";
            }, 500);
        } else {
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
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`;
document.head.appendChild(style);
