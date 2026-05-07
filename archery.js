let archeryCanvas, archeryCtx;
let archeryPlayer, archeryRobot, arrow;
let archeryPlayerScore = 0, archeryRobotScore = 0;
let archeryGameRunning = false;
let archeryRound = 0;
const MAX_ROUNDS = 5;

function initArcheryGame() {
    archeryCanvas = document.getElementById('archeryCanvas');
    archeryCtx = archeryCanvas.getContext('2d');

    archeryPlayer = {
        x: 30,
        y: archeryCanvas.height / 2,
        width: 20,
        height: 40
    };

    archeryRobot = new AIPlayer('normal');
    archeryRobot.x = archeryCanvas.width - 50;
    archeryRobot.y = archeryCanvas.height / 2;

    arrow = null;
    archeryPlayerScore = 0;
    archeryRobotScore = 0;
    archeryRound = 0;
    archeryGameRunning = true;

    document.getElementById('powerSlider').addEventListener('input', function() {
        document.getElementById('powerValue').textContent = this.value;
    });

    archeryGameLoop();
}

function archeryGameLoop() {
    if (!archeryGameRunning) return;

    archeryCtx.fillStyle = '#87CEEB';
    archeryCtx.fillRect(0, 0, archeryCanvas.width, archeryCanvas.height);

    drawArchers();
    drawTarget();

    if (arrow) {
        updateArrow();
        drawArrow();
        checkArrowHit();
    }

    document.getElementById('archeryPlayerScore').textContent = archeryPlayerScore;
    document.getElementById('archeryRobotScore').textContent = archeryRobotScore;

    if (archeryRound < MAX_ROUNDS) {
        requestAnimationFrame(archeryGameLoop);
    } else {
        endArcheryGame();
    }
}

function shootArrow() {
    if (!archeryGameRunning || arrow) return;

    const power = parseInt(document.getElementById('powerSlider').value);
    
    arrow = {
        x: archeryPlayer.x + 20,
        y: archeryPlayer.y,
        velocityX: power * 2,
        velocityY: (Math.random() - 0.5) * 3
    };

    archeryRound++;

    setTimeout(robotShoot, 1000);
}

function robotShoot() {
    if (!archeryGameRunning) return;

    const robotPower = Math.random() * 100;
    
    let robotArrow = {
        x: archeryRobot.x - 20,
        y: archeryRobot.y,
        velocityX: -robotPower * 1.8,
        velocityY: (Math.random() - 0.5) * 3
    };

    let startTime = Date.now();
    let shootAnimation = () => {
        let elapsed = Date.now() - startTime;
        if (elapsed < 800) {
            robotArrow.x += robotArrow.velocityX * 0.02;
            robotArrow.y += robotArrow.velocityY * 0.02;
            
            let targetDist = Math.sqrt(
                Math.pow(robotArrow.x - (archeryCanvas.width / 2), 2) +
                Math.pow(robotArrow.y - (archeryCanvas.height / 2), 2)
            );

            if (targetDist < 30) {
                archeryRobotScore++;
                arrow = null;
            }

            requestAnimationFrame(shootAnimation);
        }
    };
    shootAnimation();
}

function updateArrow() {
    arrow.x += arrow.velocityX;
    arrow.y += arrow.velocityY;
}

function drawArrow() {
    archeryCtx.strokeStyle = '#FF6B6B';
    archeryCtx.lineWidth = 2;
    archeryCtx.beginPath();
    archeryCtx.moveTo(arrow.x, arrow.y);
    archeryCtx.lineTo(arrow.x - arrow.velocityX * 0.1, arrow.y - arrow.velocityY * 0.1);
    archeryCtx.stroke();
}

function checkArrowHit() {
    let targetX = archeryCanvas.width / 2;
    let targetY = archeryCanvas.height / 2;

    let distance = Math.sqrt(
        Math.pow(arrow.x - targetX, 2) +
        Math.pow(arrow.y - targetY, 2)
    );

    if (distance < 30) {
        archeryPlayerScore++;
        arrow = null;
    }

    if (arrow && (arrow.x > archeryCanvas.width || arrow.x < 0 || 
        arrow.y > archeryCanvas.height || arrow.y < 0)) {
        arrow = null;
    }
}

function drawArchers() {
    archeryCtx.fillStyle = '#4ECDC4';
    archeryCtx.fillRect(archeryPlayer.x, archeryPlayer.y - 20, archeryPlayer.width, 40);

    archeryCtx.fillStyle = '#FF6B6B';
    archeryCtx.fillRect(archeryRobot.x - 20, archeryRobot.y - 20, archeryRobot.width, 40);
}

function drawTarget() {
    let targetX = archeryCanvas.width / 2;
    let targetY = archeryCanvas.height / 2;

    archeryCtx.strokeStyle = '#FFD700';
    archeryCtx.lineWidth = 3;
    archeryCtx.beginPath();
    archeryCtx.arc(targetX, targetY, 50, 0, Math.PI * 2);
    archeryCtx.stroke();

    archeryCtx.strokeStyle = '#FF6B6B';
    archeryCtx.beginPath();
    archeryCtx.arc(targetX, targetY, 30, 0, Math.PI * 2);
    archeryCtx.stroke();

    archeryCtx.fillStyle = '#FFD700';
    archeryCtx.beginPath();
    archeryCtx.arc(targetX, targetY, 10, 0, Math.PI * 2);
    archeryCtx.fill();
}

function endArcheryGame() {
    archeryGameRunning = false;
    const winner = archeryPlayerScore > archeryRobotScore ? 'SIZ YUTDINGIZ! 🎉' : 'ROBOT YUTDI! 🤖';
    showGameOverDialog(winner, `Sizning skor: ${archeryPlayerScore}\nRobotning skor: ${archeryRobotScore}`);
    addToRanking(playerName, archeryPlayerScore, 'Archery');
}

function stopArcheryGame() {
    archeryGameRunning = false;
}
