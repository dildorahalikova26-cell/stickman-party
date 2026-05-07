let currentGame = null;
let playerName = 'O\'yinchi';

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

function startGame(gameType) {
    currentGame = gameType;
    
    if (gameType === 'football') {
        showScreen('footballScreen');
        initFootballGame();
    } else if (gameType === 'archery') {
        showScreen('archeryScreen');
        initArcheryGame();
    } else {
        alert('Bu o\'yin tez kunda chiqadi! 🚀');
    }
}

function showRanking() {
    showScreen('rankingScreen');
    displayRanking();
}

function backToMenu() {
    showScreen('menuScreen');
    stopAllGames();
}

function pauseGame() {
    alert('O\'yin pauzada! Davom etish uchun OK bosing.');
}

function stopAllGames() {
    if (currentGame === 'football') {
        stopFootballGame();
    } else if (currentGame === 'archery') {
        stopArcheryGame();
    }
}

function showGameOverDialog(title, message) {
    document.getElementById('gameOverTitle').textContent = title;
    document.getElementById('gameOverMessage').textContent = message;
    document.getElementById('gameOverDialog').classList.add('active');
}

function closeGameOverDialog() {
    document.getElementById('gameOverDialog').classList.remove('active');
    showScreen('menuScreen');
}

showScreen('menuScreen');