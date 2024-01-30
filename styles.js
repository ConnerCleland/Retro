const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
let score = 0;
class Boundary {
    static width = 40;
    static height = 40;

    constructor({ position }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }

    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
class Ghost {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'cyan';
        c.fill();
        c.closePath();
    }

    update() {
        if (!gameOver) {
            // Calculate direction towards Pac-Man
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const angle = Math.atan2(dy, dx);

            // Adjust velocity based on the calculated direction
            this.velocity.x = Math.cos(angle) * 2;
            this.velocity.y = Math.sin(angle) * 2;

            // Update position
            const newX = this.position.x + this.velocity.x;
            const newY = this.position.y + this.velocity.y;

            // Ensure the ghost stays within the boundaries
            if (newX - this.radius >= Boundary.width && newX + this.radius <= canvas.width - Boundary.width) {
                this.position.x = newX;
            }

            if (newY - this.radius >= Boundary.height && newY + this.radius <= canvas.height - Boundary.height) {
                this.position.y = newY;
            }
        }
    }
}
let gameOver = false;
let inputEnabled = true; 


const ghosts = []
ghosts.push(new Ghost({
    position: {
        x: getRandomInt(Boundary.width, canvas.width - Boundary.width),
        y: getRandomInt(Boundary.height, canvas.height - Boundary.height),
    },
    velocity: {
        x: 0,
        y: 0,
    },
}));
function updateGhosts() {
    ghosts.forEach((ghost) => {
        ghost.update();
    });
}
function checkCherryCollision() {
    if (!gameOver) {
        cherries.forEach((cherry, index) => {
            const dx = player.position.x - cherry.position.x;
            const dy = player.position.y - cherry.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < player.radius + cherry.radius) {
                // Pac-Man ate the cherry
                cherries.splice(index, 1);

                // Increment the score by 10
                score += 10;

                // Update the score display on the screen
                scoreDisplay.textContent = `Score: ${score}`;

                // Spawn a new cherry at a random location
                let randomRow = getRandomInt(1, map.length - 2);
                let randomCol = getRandomInt(1, map[0].length - 2);

                while (map[randomRow][randomCol] !== ' ') {
                    randomRow = getRandomInt(1, map.length - 2);
                    randomCol = getRandomInt(1, map[0].length - 2);
                }

                cherries.push(
                    new Cherry({
                        position: {
                            x: Boundary.width * randomCol + Boundary.width / 2,
                            y: Boundary.height * randomRow + Boundary.height / 2,
                        },
                    })
                );
            }
        });
    }
}


function resetGame() {
    // Reset player position
    player.position.x = Boundary.width + Boundary.width / 2;
    player.position.y = Boundary.height + Boundary.height / 2;

    // Reset ghost position
    ghosts[0].position.x = getRandomInt(Boundary.width, canvas.width - Boundary.width);
    ghosts[0].position.y = getRandomInt(Boundary.height, canvas.height - Boundary.height);

    // Reset cherries
    cherries.length = 0;
    placeRandomCherriesOnMap(map, numberOfCherries);

    // Reset score
    score = 0;
}
function showGameOverScreen() {
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'block';
    inputEnabled = false; // Disable input when game over
}
function hideGameOverScreen() {
    gameOverScreen.style.display = 'none';
}
restartButton.addEventListener('click', () => {
    hideGameOverScreen();
    resetGame();
    gameLoop();
    inputEnabled = true; // Enable input when restarting the game
});




function drawGhosts() {
    ghosts.forEach((ghost) => {
        ghost.draw();
    });
}
class PacMan {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
    }
}

class Cherry {
    constructor({ position }) {
        this.position = position;
        this.radius = 5;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    }
}

const map = [
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ','-','-',' ',' ','-',' ','-','-',' ',' ','-',' ','-','-',' ','-',' ','-'],
    ['-',' ','-',' ',' ','-','-',' ','-','-',' ','-','-',' ','-',' ',' ','-',' ','-'],
    ['-',' ',' ','-',' ',' ',' ',' ',' ',' ',' ',' ','-',' ','-','-',' ',' ',' ','-'],
    ['-',' ','-','-','-',' ','-','-',' ','-',' ','-','-','-','-',' ',' ','-',' ','-'],
    ['-',' ','-','-',' ',' ','-','-',' ','-',' ','-',' ',' ','-','-',' ','-',' ','-'],
    ['-',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-']
];

const boundaries = [];
const cherries = [];
const player = new PacMan({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
        x: 0,
        y: 0,
    }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeRandomCherriesOnMap(map, numberOfCherries) {
    for (let i = 0; i < numberOfCherries; i++) {
        let randomRow = getRandomInt(1, map.length - 2);
        let randomCol = getRandomInt(1, map[0].length - 2);

        while (map[randomRow][randomCol] !== ' ') {
            randomRow = getRandomInt(1, map.length - 2);
            randomCol = getRandomInt(1, map[0].length - 2);
        }

        cherries.push(
            new Cherry({
                position: {
                    x: Boundary.width * randomCol + Boundary.width / 2,
                    y: Boundary.height * randomRow + Boundary.height / 2,
                },
            })
        );
    }
}

map.forEach((row, rowIndex) => {
    row.forEach((symbol, colIndex) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * colIndex,
                            y: Boundary.height * rowIndex,
                        },
                    })
                );
                break;
        }
    });
});

// Number of cherries to place on the map
const numberOfCherries = 70;

// Place cherries on the map
placeRandomCherriesOnMap(map, numberOfCherries);

window.addEventListener('keydown', (event) => {
    if (!gameOver && inputEnabled) { // Check if input is enabled
        switch (event.key) {
            case 'ArrowLeft':
                player.velocity.x = -5;
                break;
            case 'ArrowRight':
                player.velocity.x = 5;
                break;
            case 'ArrowUp':
                player.velocity.y = -5;
                break;
            case 'ArrowDown':
                player.velocity.y = 5;
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (!gameOver && inputEnabled) { // Check if input is enabled
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                player.velocity.x = 0;
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                player.velocity.y = 0;
                break;
        }
    }
});





function checkBoundaryCollision() {
    boundaries.forEach((boundary) => {
        const dx = player.position.x - Math.max(boundary.position.x, Math.min(player.position.x, boundary.position.x + boundary.width));
        const dy = player.position.y - Math.max(boundary.position.y, Math.min(player.position.y, boundary.position.y + boundary.height));
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });
}
function checkCherryCollision() {
    cherries.forEach((cherry, index) => {
        const dx = player.position.x - cherry.position.x;
        const dy = player.position.y - cherry.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + cherry.radius) {
            // Pac-Man ate the cherry
            cherries.splice(index, 1);

            // Increment the score by 10
            score += 10;

            // Update the score display on the screen
            scoreDisplay.textContent = `Score: ${score}`;

            // Spawn a new cherry at a random location
            let randomRow = getRandomInt(1, map.length - 2);
            let randomCol = getRandomInt(1, map[0].length - 2);

            while (map[randomRow][randomCol] !== ' ') {
                randomRow = getRandomInt(1, map.length - 2);
                randomCol = getRandomInt(1, map[0].length - 2);
            }

            cherries.push(
                new Cherry({
                    position: {
                        x: Boundary.width * randomCol + Boundary.width / 2,
                        y: Boundary.height * randomRow + Boundary.height / 2,
                    },
                })
            );
        }
    });
}


function updatePlayer() {
    if (!gameOver) {
        const newX = player.position.x + player.velocity.x;
        const newY = player.position.y + player.velocity.y;

        let canMoveX = true;
        let canMoveY = true;

        boundaries.forEach((boundary) => {
            const dx = newX - Math.max(boundary.position.x, Math.min(newX, boundary.position.x + boundary.width));
            const dy = newY - Math.max(boundary.position.y, Math.min(newY, boundary.position.y + boundary.height));
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < player.radius) {
                canMoveX = false;
                canMoveY = false;
            }
        });

        if (canMoveX) {
            player.position.x = newX;
        }

        if (canMoveY) {
            player.position.y = newY;
        }
    }
}





function draw() {
    boundaries.forEach((boundary) => {
        boundary.draw();
    });

    cherries.forEach((cherry) => {
        cherry.draw();
    });

    player.draw();
    drawScore();  // Add this line to draw the score
}

function drawScore() {
    c.fillStyle = 'white';
    c.font = '20px Arial';
    c.textAlign = 'center';
    c.fillText(`Score: ${score}`, canvas.width / 2, canvas.height - 60);
}


function gameLoop() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updatePlayer();
        updateGhosts();
        checkBoundaryCollision();
        checkCherryCollision();
        checkGhostCollision();
        draw();
        drawGhosts();
        requestAnimationFrame(gameLoop);
    } else {
        // Draw the game over screen here
        showGameOverScreen();
    }
}


gameLoop();
