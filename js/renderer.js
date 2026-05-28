/**
 * RENDERER MODULE
 * Handles all canvas drawing and UI updates
 */

class GameRenderer {
    constructor(canvasId, game) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.game = game;

        // Colors
        this.colors = {
            background: '#000000',
            grid: '#1a1a2e',
            snake: '#00ff00',
            snakeHead: '#00ff88',
            food: '#ff0055',
            text: '#ffffff',
            gridBorder: '#00d4ff'
        };

        // Block size (calculated from canvas size)
        this.updateBlockSize();

        // Bind resize handler
        window.addEventListener('resize', () => this.updateBlockSize());
    }

    /**
     * Calculate block size based on canvas dimensions
     */
    updateBlockSize() {
        this.blockSize = Math.floor(this.canvas.width / this.game.gridWidth);
    }

    /**
     * Main render function - called each frame
     */
    render() {
        this.clearCanvas();
        this.drawGrid();
        this.drawFood();
        this.drawSnake();
    }

    /**
     * Clear canvas with background color
     */
    clearCanvas() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw subtle grid
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i <= this.game.gridWidth; i++) {
            const x = i * this.blockSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let i = 0; i <= this.game.gridHeight; i++) {
            const y = i * this.blockSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw border
        this.ctx.strokeStyle = this.colors.gridBorder;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw grid background
     */
    drawGrid() {
        // Grid is drawn in clearCanvas
    }

    /**
     * Draw snake
     */
    drawSnake() {
        const segments = this.game.getSnakeSegments();

        segments.forEach((segment, index) => {
            // Draw head with special color
            if (index === 0) {
                this.ctx.fillStyle = this.colors.snakeHead;
                // Add glow effect to head
                this.ctx.shadowColor = this.colors.snakeHead;
                this.ctx.shadowBlur = 8;
            } else {
                this.ctx.fillStyle = this.colors.snake;
                this.ctx.shadowBlur = 0;
            }

            const x = segment.x * this.blockSize;
            const y = segment.y * this.blockSize;
            const padding = 1;

            this.ctx.fillRect(
                x + padding,
                y + padding,
                this.blockSize - padding * 2,
                this.blockSize - padding * 2
            );

            // Draw segment border
            this.ctx.strokeStyle = '#00cc00';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                x + padding,
                y + padding,
                this.blockSize - padding * 2,
                this.blockSize - padding * 2
            );

            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * Draw food
     */
    drawFood() {
        const food = this.game.getFoodPosition();
        if (!food) return;

        const x = food.x * this.blockSize;
        const y = food.y * this.blockSize;
        const centerX = x + this.blockSize / 2;
        const centerY = y + this.blockSize / 2;
        const radius = this.blockSize / 2 - 1;

        // Draw glowing circle
        this.ctx.shadowColor = this.colors.food;
        this.ctx.shadowBlur = 10;

        this.ctx.fillStyle = this.colors.food;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw border
        this.ctx.strokeStyle = '#ff88cc';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.shadowBlur = 0;
    }

    /**
     * Update score display
     * @param {number} score
     * @param {number} highScore
     */
    updateScore(score, highScore) {
        document.getElementById('currentScore').textContent = score;
        document.getElementById('highScore').textContent = highScore;
    }

    /**
     * Update game over screen
     * @param {number} finalScore
     * @param {number} highScore
     */
    updateGameOverScreen(finalScore, highScore) {
        document.getElementById('finalScore').textContent = finalScore;
        document.getElementById('gameOverHighScore').textContent = highScore;
    }

    /**
     * Show/hide screen overlay
     * @param {string} screenId
     * @param {boolean} show
     */
    showScreen(screenId, show = true) {
        const screen = document.getElementById(screenId);
        if (screen) {
            if (show) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        }
    }

    /**
     * Fade effect for screen transitions
     * @param {string} fromScreenId
     * @param {string} toScreenId
     */
    transitionScreen(fromScreenId, toScreenId) {
        this.showScreen(fromScreenId, false);
        this.showScreen(toScreenId, true);
    }

    /**
     * Get canvas dimensions
     * @returns {Object} {width, height}
     */
    getCanvasDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * Resize canvas to fit container
     * @param {number} width
     * @param {number} height
     */
    resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.updateBlockSize();
    }
}