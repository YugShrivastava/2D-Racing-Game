const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const carImg = document.getElementById("car");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const spikes = document.getElementById("spikes");
const endScreen = document.getElementById("end-screen");

endScreen.style.display = "none";

let gameMode = 0;
let scoreP1 = 0;
let scoreP2 = 0;
let spawnChance = 0.4;
const maxSpawnChance = 1;
const spawnChanceAddition = 0.1;
let spawnInterval = 1500;
const minSpawnInterval = 300;
const intervalReduction = 50;
let isScorePausedP1 = false;
let isScorePausedP2 = false;

const obstacles = [];

const carP1 = {
    x: centerX + 120,
    y: centerY + 150,
    speedX: 7,
    speedY: 10,
    h: 80,
    w: 50,
    dx: 0,
    dy: 0,
};
const carP2 = {
    x: centerX - 175,
    y: centerY + 150,
    speedX: 7,
    speedY: 10,
    h: 80,
    w: 50,
    dx: 0,
    dy: 0,
};

function drawCarP1() {
    ctx.drawImage(carImg, 5, 0, 210, 450, carP1.x, carP1.y, carP1.w, carP1.h);
}

function drawCarP2() {
    ctx.drawImage(carImg, 395, 0, 210, 450, carP2.x, carP2.y, carP2.w, carP2.h);
}

function moveDown(num) {
    if (num == 1) carP1.dy = carP1.speedY;
    else carP2.dy = carP2.speedY;
}

function moveUp(num) {
    if (num == 1) carP1.dy = -carP1.speedY;
    else carP2.dy = -carP2.speedY;
}

function moveLeft(num) {
    if (num == 1) carP1.dx = -carP1.speedX;
    else carP2.dx = -carP2.speedX;
}

function moveRight(num) {
    if (num == 1) carP1.dx = carP1.speedX;
    else carP2.dx = carP2.speedX;
}

function keyDown(e) {
    if (e.key === "ArrowRight" || e.key === "Right") moveRight(1);
    else if (e.key === "ArrowLeft" || e.key === "Left") moveLeft(1);
    else if ((e.key === "ArrowUp" || e.key === "Up") && carP1.speedY > 0)
        moveUp(1);
    else if (e.key === "ArrowDown" || e.key === "Down") moveDown(1);
    else if (e.key === "d" || e.key === "D") moveRight(2);
    else if (e.key === "a" || e.key === "A") moveLeft(2);
    else if (e.key === "w" || (e.key === "W" && carP2.speedY > 0)) moveUp(2);
    else if (e.key === "s" || e.key === "S") moveDown(2);
}

function keyUp(e) {
    if (
        e.key === "ArrowRight" ||
        e.key === "Right" ||
        e.key === "ArrowLeft" ||
        e.key === "Left" ||
        e.key === "ArrowUp" ||
        e.key === "Up" ||
        e.key === "ArrowDown" ||
        e.key === "Down"
    ) {
        carP1.dx = 0;
        carP1.dy = 0;
    } else if (
        e.key === "D" ||
        e.key === "d" ||
        e.key === "A" ||
        e.key === "a" ||
        e.key === "w" ||
        e.key === "W" ||
        e.key === "s" ||
        e.key === "S"
    ) {
        carP2.dx = 0;
        carP2.dy = 0;
    }
}

function spawnObstacle() {
    const lanes = [
        { xStart: 0, xEnd: 300 },
        { xStart: 300, xEnd: 600 },
        { xStart: 600, xEnd: 900 },
        { xStart: 900, xEnd: 1200 },
    ];

    const excludedLaneIndex = Math.floor(Math.random() * lanes.length);

    for (let i = 0; i < lanes.length; i++) {
        if (i === excludedLaneIndex) continue;

        const randomWidth = Math.floor(Math.random() * (90 - 20 + 1)) + 20;
        const randomHeight = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
        const randomX =
            Math.floor(
                Math.random() * (lanes[i].xEnd - lanes[i].xStart - randomWidth)
            ) + lanes[i].xStart;

        const obstacle = {
            x: randomX,
            y: -randomHeight,
            w: randomWidth,
            h: randomHeight,
            speed: 6,
        };

        obstacles.push(obstacle);
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;

        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
        } else {
            // ctx.fillStyle = "red"; // Obstacle color
            ctx.drawImage(
                spikes,
                obstacles[i].x,
                obstacles[i].y,
                obstacles[i].w,
                obstacles[i].h
            );
        }
    }
}

function playerCollide() {
    if (
        carP1.x < carP2.x + carP2.w &&
        carP1.x + carP1.w > carP2.x &&
        carP1.y < carP2.y + carP2.h &&
        carP1.y + carP1.h > carP2.y
    ) {
        isScorePausedP1 = true;
    }

    if (
        carP2.x < carP1.x + carP1.w &&
        carP2.x + carP2.w > carP1.x &&
        carP2.y < carP1.y + carP1.h &&
        carP2.y + carP2.h > carP1.y
    ) {
        isScorePausedP2 = true;
    }
}

function detectWalls() {
    if (
        carP1.x < 0 ||
        carP1.x + carP1.w > canvas.width ||
        carP1.y < 0 ||
        carP1.y + carP1.h > canvas.height
    ) {
        isScorePausedP1 = true;
    }

    if (
        carP2.x < 0 ||
        carP2.x + carP2.w > canvas.width ||
        carP2.y < 0 ||
        carP2.y + carP2.h > canvas.height
    ) {
        isScorePausedP2 = true;
    }
}

function obstacleCollide() {
    obstacles.forEach((obstacle) => {
        const p1Collide =
            carP1.x < obstacle.x + obstacle.w &&
            carP1.x + carP1.w > obstacle.x &&
            carP1.y < obstacle.y + obstacle.h &&
            carP1.y + carP1.h > obstacle.y;

        if (p1Collide) {
            isScorePausedP1 = true;
        }

        const p2Collide =
            carP2.x < obstacle.x + obstacle.w &&
            carP2.x + carP2.w > obstacle.x &&
            carP2.y < obstacle.y + obstacle.h &&
            carP2.y + carP2.h > obstacle.y;

        if (p2Collide) {
            isScorePausedP2 = true;
        }
    });
}

function p1CarMoved() {
    carP1.x += carP1.dx;
    carP1.y += carP1.dy;

    playerCollide();
    detectWalls();
    obstacleCollide();
}

function p2CarMoved() {
    carP2.x += carP2.dx;
    carP2.y += carP2.dy;

    playerCollide();
    detectWalls();
    obstacleCollide();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function lanes() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(295, 0);
    ctx.lineTo(305, 0);
    ctx.lineTo(305, canvas.height);
    ctx.lineTo(295, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.moveTo(595, 0);
    ctx.lineTo(605, 0);
    ctx.lineTo(605, canvas.height);
    ctx.lineTo(595, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.moveTo(895, 0);
    ctx.lineTo(905, 0);
    ctx.lineTo(905, canvas.height);
    ctx.lineTo(895, canvas.height);
    ctx.closePath();
    ctx.fill();
}

function displayScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player 1: " + scoreP1, 100, 30);
    if (gameMode == 2)
        ctx.fillText("Player 2: " + scoreP2, canvas.width - 100, 30);
}

let endCounter = 5;

// function countToMenu(counter){
//     counter.innerText = endCounter;
//     if(endCounter == 0) location.replace(window.location.href);
//     else {
//         endCounter--;
//         setInterval(countToMenu(counter), 1000);
//     }
// }

function countToMenu(counter) {
    counter.innerText = endCounter;
    if (endCounter > 0) {
        endCounter--;
        setTimeout(() => countToMenu(counter), 1000);
    } else {
        location.replace(window.location.href);
    }
}

function endGame() {
    endScreen.style.display = "flex";
    const won = document.getElementById("player-won");
    if (scoreP1 < scoreP2) won.innerText = "2";
    else if (scoreP2 < scoreP1) won.innerText = "1";
    else won.innerText = "1 and 2";

    const counter = document.getElementById("end-count");
    countToMenu(counter);
}

function moveCar() {
    clear();

    lanes();

    updateObstacles();

    drawCarP1();
    if (gameMode == 2) drawCarP2();

    p1CarMoved();
    if (gameMode == 2) p2CarMoved();

    if (!isScorePausedP1) scoreP1++;
    else {
        carP1.dy = 6;
        carP1.dx = 0;
        carP1.speedY = 0;
        carP1.speedX = 0;
    }
    if (gameMode == 2) {
        if (!isScorePausedP2) scoreP2++;
        else {
            carP2.dy = 6;
            carP2.dx = 0;
            carP2.speedY = 0;
            carP2.speedX = 0;
        }
    }

    displayScore();
    if (!isScorePausedP1 || !isScorePausedP2) requestAnimationFrame(moveCar);
    else endGame();
}

function startSpawningObstacles() {
    if (Math.random() < spawnChance) {
        spawnObstacle();
    }

    if (spawnInterval > minSpawnInterval) {
        spawnInterval -= intervalReduction;
    }
    if (spawnChance < maxSpawnChance) {
        spawnChance += spawnChanceAddition;
    }

    setTimeout(startSpawningObstacles, spawnInterval);
}

// startSpawningObstacles();
// moveCar();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

const startScreen = document.getElementById("start-screen");
const onePlayerBtn = document.getElementById("one-player-btn");
const twoPlayerBtn = document.getElementById("two-player-btn");
const canvasElement = document.getElementById("canvas");

function startCountdown(callback) {
    let countdown = 3;

    function displayCountdown() {
        clear();
        ctx.font = "48px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            `Starting in ${countdown}`,
            canvas.width / 2,
            canvas.height / 2
        );

        if (countdown > 0) {
            countdown--;
            setTimeout(displayCountdown, 1000);
        } else {
            callback();
        }
    }

    displayCountdown();
}

function startGame(mode) {
    gameMode = mode;
    startScreen.style.display = "none";
    canvasElement.style.display = "block";

    if (gameMode === 1) {
        carP2.speedX = 0;
        carP2.speedY = 0;
        carP2.dx = 0;
        carP2.dy = 0;
        carP2.h = 0;
        carP2.w = 0;
        carP2.x = 0;
        carP2.y = 0;
        isScorePausedP2 = true;
    }

    startCountdown(() => {
        startSpawningObstacles();
        moveCar();
    });
}

onePlayerBtn.addEventListener("click", () => startGame(1));
twoPlayerBtn.addEventListener("click", () => startGame(2));
