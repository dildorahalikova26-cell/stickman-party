class AIPlayer {
    constructor(difficulty = 'normal') {
        this.difficulty = difficulty;
        this.x = 350;
        this.y = 450;
        this.width = 30;
        this.height = 40;
        this.speed = 3;
        this.score = 0;
    }

    move(ballX, ballY, canvasWidth) {
        let targetX = this.x;

        if (this.difficulty === 'easy') {
            if (Math.random() > 0.5) {
                targetX = ballX - this.width / 2;
            }
            this.speed = 2;
        } else if (this.difficulty === 'normal') {
            targetX = ballX - this.width / 2;
            this.speed = 3;
        } else if (this.difficulty === 'hard') {
            targetX = ballX - this.width / 2;
            this.speed = 4;
        }

        if (targetX < 0) targetX = 0;
        if (targetX + this.width > canvasWidth) targetX = canvasWidth - this.width;

        if (this.x < targetX) {
            this.x += this.speed;
        } else if (this.x > targetX) {
            this.x -= this.speed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - 10, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}
