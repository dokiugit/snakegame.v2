/**
 * GAME LOGIC & STATE MANAGEMENT
 * Handles snake movement, collision detection, food spawning, and scoring
 */

class SnakeGame {
    constructor(gridWidth = 20, gridHeight = 20, speed = 0.15) {
        // Grid configuration
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.speed = speed; // Time interval in seconds

        // Game state
        this.gameState = 'MENU'; // MENU, RUNNING, GAME_OVER
        this.snake = [];
        this.food = null;
        this.direction = { x: 1, y: 0 }; // Current direction
        this.nextDirection = { x: 1, y: 0 }; // Next direction (buffered input)
        this.score = 0;
        this.gameLoopId = null;
        this.deltaTime = 0;

        // Initialize game
        this.initGame();
    }

    /**
     * Initialize a new game
     */
    initGame() {
        // Create snake at center with 3 segments
        const centerX = Math.floor(this.gridWidth / 2);
        const centerY = Math.floor(this.gridHeight / 2);

        this.snake = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY }
        ];

        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.food = this.generateFood();
        this.gameState = 'RUNNING';
        this.deltaTime = 0;
    }

    /**
     * Generate food at random unoccupied position
     * @returns {Object} Food position {x, y}
     */
    generateFood() {
        let newFood;
        let isOccupied = true;

        while (isOccupied) {
            newFood = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };

            // Check if position is occupied by snake
            isOccupied = this.snake.some(
                segment => segment.x === newFood.x && segment.y === newFood.y
            );
        }

        return newFood;
    }

    /**
     * Change direction with 90-degree constraint
     * Prevents 180-degree reversals (e.g., can't go left while moving right)
     * @param {Object} newDirection - {x, y} direction vector
     */
    changeDirection(newDirection) {
        // Prevent 180-degree reversal
        const isReverse = 
            (this.direction.x === -newDirection.x && this.direction.y === -newDirection.y);

        if (!isReverse && this.gameState === 'RUNNING') {
            this.nextDirection = newDirection;
        }
    }

    /**
     * Update game state (called every tick)
     */
    update(deltaTime) {
        if (this.gameState !== 'RUNNING') return;

        this.deltaTime += deltaTime;

        // Only move snake at fixed intervals
        if (this.deltaTime < this.speed) return;

        this.deltaTime = 0;

        // Apply buffered direction
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // Check boundary collision
        if (this.checkBoundaryCollision(newHead)) {
            this.endGame();
            return;
        }

        // Check self collision
        if (this.checkSelfCollision(newHead)) {
            this.endGame();
            return;
        }

        // Add new head
        this.snake.unshift(newHead);

        // Check food collision
        if (this.checkFoodCollision(newHead)) {
            this.score += 10;
            this.food = this.generateFood();
        } else {
            // Remove tail if no food consumed (snake doesn't grow)
            this.snake.pop();
        }
    }

    /**
     * Check if head collided with boundary
     * @param {Object} head - Head position {x, y}
     * @returns {boolean}
     */
    checkBoundaryCollision(head) {
        return (
            head.x < 0 ||
            head.x >= this.gridWidth ||
            head.y < 0 ||
            head.y >= this.gridHeight
        );
    }

    /**
     * Check if head collided with body
     * @param {Object} head - Head position {x, y}
     * @returns {boolean}
     */
    checkSelfCollision(head) {
        return this.snake.some(
            segment => segment.x === head.x && segment.y === head.y
        );
    }

    /**
     * Check if head collided with food
     * @param {Object} head - Head position {x, y}
     * @returns {boolean}
     */
    checkFoodCollision(head) {
        return head.x === this.food.x && head.y === this.food.y;
    }

    /**
     * End game and trigger game over screen
     */
    endGame() {
        this.gameState = 'GAME_OVER';
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }

    /**
     * Reset to menu state
     */
    reset() {
        this.gameState = 'MENU';
        this.score = 0;
        this.snake = [];
        this.food = null;
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.deltaTime = 0;
    }

    /**
     * Get snake data for rendering
     * @returns {Array} Array of segment objects
     */
    getSnakeSegments() {
        return this.snake;
    }

    /**
     * Get food data for rendering
     * @returns {Object} Food position {x, y}
     */
    getFoodPosition() {
        return this.food;
    }

    /**
     * Get current score
     * @returns {number}
     */
    getScore() {
        return this.score;
    }

    /**
     * Get current game state
     * @returns {string} MENU, RUNNING, or GAME_OVER
     */
    getGameState() {
        return this.gameState;
    }

    /**
     * Serialize game state for debugging
     * @returns {Object}
     */
    getState() {
        return {
            gameState: this.gameState,
            score: this.score,
            snake: this.snake,
            food: this.food,
            direction: this.direction,
            nextDirection: this.nextDirection
        };
    }
}