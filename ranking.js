const RANKING_STORAGE_KEY = 'stickmanPartyRanking';
const MAX_RANKING_ITEMS = 50;

function getRankingData() {
    let data = localStorage.getItem(RANKING_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveRankingData(data) {
    localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(data));
}

function addToRanking(playerName, score, gameType) {
    let rankings = getRankingData();
    
    rankings.push({
        name: playerName,
        score: score,
        game: gameType,
        date: new Date().toLocaleString('uz-UZ')
    });

    rankings.sort((a, b) => b.score - a.score);

    if (rankings.length > MAX_RANKING_ITEMS) {
        rankings = rankings.slice(0, MAX_RANKING_ITEMS);
    }

    saveRankingData(rankings);
}

function displayRanking() {
    let rankings = getRankingData();
    let rankingList = document.getElementById('rankingList');
    
    rankingList.innerHTML = '';

    if (rankings.length === 0) {
        rankingList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Hali o\'yinchilar yo\'q! Birinchi bo\'ling! 🚀</p>';
        return;
    }

    let top5 = rankings.slice(0, 5);
    
    top5.forEach((item, index) => {
        let medal = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index];
        
        let rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
            <div class="ranking-position">${medal}</div>
            <div class="ranking-info">
                <div class="ranking-name">${item.name}</div>
                <div class="ranking-score">Skor: ${item.score} | ${item.game}</div>
                <div style="font-size: 12px; opacity: 0.8;">${item.date}</div>
            </div>
        `;
        
        rankingList.appendChild(rankingItem);
    });
}

function clearRanking() {
    if (confirm('Barcha ranking ma\'lumotlarini o\'chirasizmi?')) {
        localStorage.removeItem(RANKING_STORAGE_KEY);
        displayRanking();
        alert('Ranking ma\'lumotlari o\'chirildi!');
    }
}
