/**
 * MAIN APPLICATION CONTROLLER
 * Orchestrates game logic, rendering, and input handling
 */

class SnakeGameApp {
    constructor() {
        // Initialize modules
        this.storage = new ScoreStorage();
        this.game = new SnakeGame(20, 20, 0.15);
        this.renderer = new GameRenderer('gameCanvas', this.game);
        this.input = new InputHandler(this.game, this.renderer);

        // State variables
        this.lastFrameTime = Date.now();
        this.animationFrameId = null;

        // Responsive design
        this.isMobile = InputHandler.isMobileDevice();
        this.configureForPlatform();

        // Initialize UI
        this.initializeUI();

        // Start game loop
        this.startGameLoop();
    }

    /**
     * Configure layout based on device type
     */
    configureForPlatform() {
        if (this.isMobile) {
            this.input.setDPadVisible(true);
            this.resizeCanvasForMobile();
        } else {
            this.input.setDPadVisible(false);
            this.resizeCanvasForDesktop();
        }

        window.addEventListener('resize', () => this.handleWindowResize());
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
    }

    /**
     * Resize canvas for mobile devices
     */
    resizeCanvasForMobile() {
        const container = document.querySelector('.canvas-wrapper');
        const availableSize = Math.min(window.innerWidth, window.innerHeight) - 100;
        this.renderer.resizeCanvas(availableSize, availableSize);
    }

    /**
     * Resize canvas for desktop
     */
    resizeCanvasForDesktop() {
        const size = Math.min(600, window.innerWidth - 40);
        this.renderer.resizeCanvas(size, size);
    }

    /**
     * Handle window resize event
     */
    handleWindowResize() {
        const wasMobile = this.isMobile;
        this.isMobile = InputHandler.isMobileDevice();

        if (this.isMobile !== wasMobile) {
            this.configureForPlatform();
        } else if (this.isMobile) {
            this.resizeCanvasForMobile();
        } else {
            this.resizeCanvasForDesktop();
        }
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        setTimeout(() => {
            if (this.isMobile) {
                this.resizeCanvasForMobile();
            }
        }, 100);
    }

    /**
     * Initialize UI event listeners
     */
    initializeUI() {
        // Start button
        document.getElementById('startBtn')?.addEventListener('click', () => {
            this.startNewGame();
        });

        // Restart button
        document.getElementById('restartBtn')?.addEventListener('click', () => {
            this.startNewGame();
        });

        // Menu button
        document.getElementById('menuBtn')?.addEventListener('click', () => {
            this.goToMenu();
        });

        // Show initial high score
        this.updateHighScoreDisplay();
    }

    /**
     * Start a new game
     */
    startNewGame() {
        this.game.initGame();
        this.renderer.transitionScreen('menuScreen', 'gameContainer');
        if (document.getElementById('gameOverScreen')) {
            this.renderer.showScreen('gameOverScreen', false);
        }
        this.lastFrameTime = Date.now();
    }

    /**
     * Go back to menu
     */
    goToMenu() {
        this.game.reset();
        this.renderer.transitionScreen('gameOverScreen', 'menuScreen');
    }

    /**
     * Update high score display
     */
    updateHighScoreDisplay() {
        const highScore = this.storage.getHighScore();
        this.renderer.updateScore(0, highScore);
    }

    /**
     * Main game loop (called via requestAnimationFrame)
     */
    gameLoop() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        // Update game state
        this.game.update(deltaTime);

        // Update UI
        const highScore = this.storage.getHighScore();
        const currentScore = this.game.getScore();
        this.renderer.updateScore(currentScore, highScore);

        // Render
        this.renderer.render();

        // Check game state
        const gameState = this.game.getGameState();

        if (gameState === 'GAME_OVER') {
            this.handleGameOver(currentScore);
        } else {
            // Continue loop
            this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        }
    }

    /**
     * Handle game over event
     * @param {number} finalScore
     */
    handleGameOver(finalScore) {
        // Update high score if necessary
        const newHighScore = this.storage.updateHighScore(finalScore);

        // Update game over screen
        this.renderer.updateGameOverScreen(finalScore, newHighScore);

        // Show game over screen
        this.renderer.showScreen('gameOverScreen', true);

        // Log statistics
        console.log('Game Over!', {
            finalScore,
            highScore: newHighScore,
            snakeLength: this.game.snake.length
        });
    }

    /**
     * Start the game loop
     */
    startGameLoop() {
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Stop the game loop
     */
    stopGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Pause game
     */
    pause() {
        const state = this.game.getGameState();
        if (state === 'RUNNING') {
            this.game.gameState = 'PAUSED';
        }
    }

    /**
     * Resume game
     */
    resume() {
        const state = this.game.getGameState();
        if (state === 'PAUSED') {
            this.game.gameState = 'RUNNING';
        }
    }

    /**
     * Get game statistics
     * @returns {Object}
     */
    getStatistics() {
        return {
            currentScore: this.game.getScore(),
            highScore: this.storage.getHighScore(),
            snakeLength: this.game.snake.length,
            gameState: this.game.getGameState()
        };
    }

    /**
     * Debug: Print game state to console
     */
    debugPrintState() {
        console.log('Game State:', this.game.getState());
        console.log('Statistics:', this.getStatistics());
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SnakeGameApp();
    console.log('🐍 Snake Game v2 initialized');
    console.log('Type window.app.debugPrintState() in console for debug info');
});
