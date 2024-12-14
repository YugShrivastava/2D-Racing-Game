const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const carImg = document.getElementById('car');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const spikes = document.getElementById('spikes')

let scoreP1 = 0;  // Player 1's score
let scoreP2 = 0;  // Player 2's score
let spawnChance = 0.4; // 40% initial chance of spawning obstacles
const maxSpawnChance = 1; // Maximum spawn chance (100%)
const spawnChanceAddition = 0.1; // How much the chance decreases each time
let spawnInterval = 1500; // Initial spawn interval in milliseconds
const minSpawnInterval = 300; // Minimum interval
const intervalReduction = 50; // How much to reduce the interval
let isScorePausedP1 = false;  // Flag to pause Player 1's score
let isScorePausedP2 = false;  // Flag to pause Player 2's score


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
}
const carP2 = {
    x: centerX - 175,
    y: centerY + 150,
    speedX: 7,
    speedY: 10,
    h: 80,
    w: 50,
    dx: 0,
    dy: 0,
}

function drawCarP1(){
    ctx.drawImage(carImg, 5, 0, 210, 450,carP1.x, carP1.y, carP1.w, carP1.h);
}

function drawCarP2(){
    ctx.drawImage(carImg, 395, 0, 210, 450,carP2.x, carP2.y, carP2.w, carP2.h);
}

function moveDown(num){
    if(num == 1) carP1.dy = carP1.speedY;
    else carP2.dy = carP2.speedY;
}

function moveUp(num){
    if(num == 1) carP1.dy = -carP1.speedY;
    else carP2.dy = -carP2.speedY;
}

function moveLeft(num){
    if(num == 1) carP1.dx = -carP1.speedX;
    else carP2.dx = -carP2.speedX;
}

function moveRight(num){
    if(num == 1) carP1.dx = carP1.speedX;
    else carP2.dx = carP2.speedX;
}

function keyDown(e){
    // console.log(e.key);
    if(e.key === 'ArrowRight' || e.key === 'Right') moveRight(1);
    else if(e.key === 'ArrowLeft' || e.key === 'Left') moveLeft(1);
    else if((e.key === 'ArrowUp' || e.key === 'Up') && carP1.speedY > 0) moveUp(1);
    else if(e.key === 'ArrowDown' || e.key === 'Down') moveDown(1);
    else if(e.key === 'd' || e.key === 'D') moveRight(2);
    else if(e.key === 'a' || e.key === 'A') moveLeft(2);
    else if(e.key === 'w' || e.key === 'W' && carP2.speedY > 0) moveUp(2);
    else if(e.key === 's' || e.key === 'S') moveDown(2);
    
}

function keyUp(e){
    if( e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left' ||
        e.key === 'ArrowUp' ||
        e.key === 'Up' ||
        e.key === 'ArrowDown' ||
        e.key === 'Down'){
        
        carP1.dx = 0;
        carP1.dy = 0;
    }

    else if( e.key === 'D' ||
        e.key === 'd' ||
        e.key === 'A' ||
        e.key === 'a' ||
        e.key === 'w' ||
        e.key === 'W' ||
        e.key === 's' ||
        e.key === 'S'){
    
        carP2.dx = 0;
        carP2.dy = 0;
    }
}

/* Start GPT */
function spawnObstacle() {
    const lanes = [
        { xStart: 0, xEnd: 300 },  // Lane 1 range
        { xStart: 300, xEnd: 600 },  // Lane 2 range
        { xStart: 600, xEnd: 900 },  // Lane 3 range
        { xStart: 900, xEnd: 1200 } // Lane 4 range
    ];
    
    const excludedLaneIndex = Math.floor(Math.random() * lanes.length); // Random lane to exclude

    for (let i = 0; i < lanes.length; i++) {
        if (i === excludedLaneIndex) continue; // Skip one random lane

        const randomWidth = Math.floor(Math.random() * (90 - 20 + 1)) + 20; // Width between 20px and 90px
        const randomHeight = Math.floor(Math.random() * (60 - 30 + 1)) + 30; // Height between 30px and 60px
        const randomX = Math.floor(Math.random() * (lanes[i].xEnd - lanes[i].xStart - randomWidth)) + lanes[i].xStart;

        const obstacle = {
            x: randomX, // Random position in lane
            y: -randomHeight, // Start above the canvas
            w: randomWidth,
            h: randomHeight,
            speed: 6, // Downward movement speed
        };

        obstacles.push(obstacle);
    }
}



function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        // Move obstacle downward
        obstacles[i].y += obstacles[i].speed;

        // Remove obstacle if it exits the canvas
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
        } else {
            // Draw the obstacle
            // ctx.fillStyle = "red"; // Obstacle color
            ctx.drawImage(spikes,obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);
        }
    }
}

/* End GPT */

function playerCollide() {
    // Check if Player 1 collides with Player 2
    if (
        carP1.x < carP2.x + carP2.w &&
        carP1.x + carP1.w > carP2.x &&
        carP1.y < carP2.y + carP2.h &&
        carP1.y + carP1.h > carP2.y
    ) {
        console.log("Player 1 loses!");  // Log when Player 1 loses
        isScorePausedP1 = true;  // Pause Player 1's score
    }

    // Check if Player 2 collides with Player 1
    if (
        carP2.x < carP1.x + carP1.w &&
        carP2.x + carP2.w > carP1.x &&
        carP2.y < carP1.y + carP1.h &&
        carP2.y + carP2.h > carP1.y
    ) {
        console.log("Player 2 loses!");  // Log when Player 2 loses
        isScorePausedP2 = true;  // Pause Player 2's score
    }
}


function detectWalls() {
    // Player 1 wall collision
    if (carP1.x < 0 || carP1.x + carP1.w > canvas.width || carP1.y < 0 || carP1.y + carP1.h > canvas.height) {
        console.log("Player 1 loses!");  // Log when Player 1 loses
        isScorePausedP1 = true;  // Pause Player 1's score
    }

    // Player 2 wall collision
    if (carP2.x < 0 || carP2.x + carP2.w > canvas.width || carP2.y < 0 || carP2.y + carP2.h > canvas.height) {
        console.log("Player 2 loses!");  // Log when Player 2 loses
        isScorePausedP2 = true;  // Pause Player 2's score
    }
}

function obstacleCollide() {
    obstacles.forEach(obstacle => {
        // Check collision for Player 1
        const p1Collide = 
            carP1.x < obstacle.x + obstacle.w &&
            carP1.x + carP1.w > obstacle.x &&
            carP1.y < obstacle.y + obstacle.h &&
            carP1.y + carP1.h > obstacle.y;

        if (p1Collide) {
            console.log("Player 1 loses!");  // Log when Player 1 loses
            isScorePausedP1 = true;  // Pause Player 1's score
            
        }

        // Check collision for Player 2
        const p2Collide = 
            carP2.x < obstacle.x + obstacle.w &&
            carP2.x + carP2.w > obstacle.x &&
            carP2.y < obstacle.y + obstacle.h &&
            carP2.y + carP2.h > obstacle.y;

        if (p2Collide) {
            console.log("Player 2 loses!");  // Log when Player 2 loses
            isScorePausedP2 = true;  // Pause Player 2's score
        }
    });
}


function p1CarMoved() {
    

    carP1.x += carP1.dx;  // Normal movement
    carP1.y += carP1.dy;

    playerCollide();
    detectWalls();
    obstacleCollide();
}

function p2CarMoved() {
    

    carP2.x += carP2.dx;  // Normal movement
    carP2.y += carP2.dy;

    playerCollide();
    detectWalls();
    obstacleCollide();
}


function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function lanes(){
    ctx.fillStyle = 'white';
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
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Player 1: ' + scoreP1, 10, 30); // Display Player 1's score at top-left
    ctx.fillText('Player 2: ' + scoreP2, canvas.width - 150, 30); // Display Player 2's score at top-right
}


function moveCar(){
    clear();
    
    lanes();

    updateObstacles();


    drawCarP1();
    drawCarP2();

    p1CarMoved();
    p2CarMoved();

    if(!isScorePausedP1) scoreP1++;
    else{
        carP1.dy = 6;
        carP1.dx = 0;
        carP1.speedY = 0;
        carP1.speedX = 0;
    }
    if(!isScorePausedP2) scoreP2++;
    else{
        carP2.dy = 6;
        carP2.dx = 0;
        carP2.speedY = 0;
        carP2.speedX = 0;
    }

    displayScore();
    if(!isScorePausedP1 || !isScorePausedP2)
    requestAnimationFrame(moveCar);
}

function startSpawningObstacles() {
    if (Math.random() < spawnChance) {
        spawnObstacle(); // Spawn obstacle based on chance
    }

    // Adjust spawn interval and chance over time
    if (spawnInterval > minSpawnInterval) {
        spawnInterval -= intervalReduction; // Reduce the interval gradually
    }
    if (spawnChance < maxSpawnChance) {
        spawnChance += spawnChanceAddition; // Increase the chance gradually
    }

    // Schedule the next spawn attempt
    setTimeout(startSpawningObstacles, spawnInterval);
}

startSpawningObstacles();
moveCar();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp)