let footballCanvas, footballCtx;
let player, robot, ball;
let playerScore = 0, robotScore = 0;
let gameRunning = false;
let leftPressed = false, rightPressed = false;

function initFootballGame() {
    footballCanvas = document.getElementById('footballCanvas');
    footballCtx = footballCanvas.getContext('2d');
    
    player = {
        x: 185,
        y: 430,
        width: 30,
        height: 40,
        speed: 4
    };

    robot = new AIPlayer('normal');

    ball = {
        x: footballCanvas.width / 2,
        y: 50,
        radius: 8,
        velocityX: 0,
        velocityY: 0,
        gravity: 0.3
    };

    playerScore = 0;
    robotScore = 0;
    gameRunning = true;

    footballGameLoop();
}

function footballGameLoop() {
    if (!gameRunning) return;

    footballCtx.fillStyle = '#87CEEB';
    footballCtx.fillRect(0, 0, footballCanvas.width, footballCanvas.height);

    footballCtx.fillStyle = '#228B22';
    footballCtx.fillRect(0, footballCanvas.height - 80, footballCanvas.width, 80);

    updatePlayerPosition();
    robot.move(ball.x, ball.y, footballCanvas.width);
    updateBall();

    drawGoals();
    detectGoal();

    drawPlayer();
    robot.draw(footballCtx);
    drawBall();

    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('robotScore').textContent = robotScore;

    if (playerScore < 5 && robotScore < 5) {
        requestAnimationFrame(footballGameLoop);
    } else {
        endFootballGame();
    }
}

function updatePlayerPosition() {
    if (leftPressed) {
        player.x -= player.speed;
    }
    if (rightPressed) {
        player.x += player.speed;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > footballCanvas.width) {
        player.x = footballCanvas.width - player.width;
    }
}

function updateBall() {
    ball.velocityY += ball.gravity;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.velocityX *= -0.8;
    }
    if (ball.x + ball.radius > footballCanvas.width) {
        ball.x = footballCanvas.width - ball.radius;
        ball.velocityX *= -0.8;
    }

    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.velocityY *= -0.8;
    }

    if (ball.y + ball.radius > footballCanvas.height - 80) {
        ball.y = footballCanvas.height - 80 - ball.radius;
        ball.velocityY *= -0.7;
        ball.velocityX *= 0.95;
    }
}

function drawGoals() {
    footballCtx.strokeStyle = 'yellow';
    footballCtx.lineWidth = 3;
    footballCtx.strokeRect(30, 50, 80, 50);
    footballCtx.strokeRect(footballCanvas.width - 110, 50, 80, 50);
}

function detectGoal() {
    if (ball.x - ball.radius < 30 + 40 && ball.y > 50 && ball.y < 100) {
        playerScore++;
        resetBall();
    }

    if (ball.x + ball.radius > footballCanvas.width - 110 - 40 && ball.y > 50 && ball.y < 100) {
        robotScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = footballCanvas.width / 2;
    ball.y = 50;
    ball.velocityX = 0;
    ball.velocityY = 0;
}

function drawPlayer() {
    footballCtx.fillStyle = '#4ECDC4';
    footballCtx.fillRect(player.x, player.y, player.width, player.height);
    footballCtx.beginPath();
    footballCtx.arc(player.x + player.width / 2, player.y - 10, 8, 0, Math.PI * 2);
    footballCtx.fill();
}

function drawBall() {
    footballCtx.fillStyle = 'white';
    footballCtx.beginPath();
    footballCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    footballCtx.fill();
}

function shoot() {
    if (!gameRunning) return;
    
    let distance = Math.abs(ball.x - (player.x + player.width / 2));
    
    if (distance < 50 && ball.y > player.y) {
        ball.velocityY = -12;
        ball.velocityX = (ball.x - (player.x + player.width / 2)) * 0.1;
    }
}

function moveLeft(pressed) {
    leftPressed = pressed;
}

function moveRight(pressed) {
    rightPressed = pressed;
}

function endFootballGame() {
    gameRunning = false;
    const winner = playerScore > robotScore ? 'SIZ YUTDINGIZ! 🎉' : 'ROBOT YUTDI! 🤖';
    showGameOverDialog(winner, `Sizning skor: ${playerScore}\nRobotning skor: ${robotScore}`);
    addToRanking(playerName, playerScore, 'Football');
}

function stopFootballGame() {
    gameRunning = false;
}
