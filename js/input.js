/**
 * INPUT HANDLER MODULE
 * Manages keyboard and touch input for desktop and mobile
 */

class InputHandler {
    constructor(game, renderer) {
        this.game = game;
        this.renderer = renderer;

        // Direction mappings
        this.directionMap = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 },
            'w': { x: 0, y: -1 },
            'W': { x: 0, y: -1 },
            's': { x: 0, y: 1 },
            'S': { x: 0, y: 1 },
            'a': { x: -1, y: 0 },
            'A': { x: -1, y: 0 },
            'd': { x: 1, y: 0 },
            'D': { x: 1, y: 0 }
        };

        // Key press tracking to prevent rapid repeated inputs
        this.keyPressed = new Set();

        // Initialize event listeners
        this.initKeyboardListeners();
        this.initTouchListeners();
        this.initButtonListeners();
    }

    /**
     * Initialize keyboard event listeners
     */
    initKeyboardListeners() {
        document.addEventListener('keydown', (event) => {
            const key = event.key;

            // Prevent key repeat
            if (this.keyPressed.has(key)) return;
            this.keyPressed.add(key);

            if (this.directionMap[key]) {
                event.preventDefault();
                this.game.changeDirection(this.directionMap[key]);
            }
        });

        document.addEventListener('keyup', (event) => {
            this.keyPressed.delete(event.key);
        });
    }

    /**
     * Initialize touch listeners for mobile
     */
    initTouchListeners() {
        const canvas = document.getElementById('gameCanvas');

        canvas.addEventListener('touchstart', (event) => {
            this.handleTouchStart(event);
        }, false);

        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            this.handleTouchMove(event);
        }, false);

        canvas.addEventListener('touchend', (event) => {
            this.keyPressed.clear();
        }, false);
    }

    /**
     * Handle touch start event
     */
    handleTouchStart(event) {
        if (event.touches.length === 0) return;

        const touch = event.touches[0];
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();

        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        this.handleSwipeStart(x, y);
    }

    /**
     * Handle touch move event
     */
    handleTouchMove(event) {
        if (event.touches.length === 0) return;

        const touch = event.touches[0];
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();

        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        this.handleSwipeMove(x, y);
    }

    /**
     * Handle swipe detection
     */
    handleSwipeStart(x, y) {
        this.swipeStartX = x;
        this.swipeStartY = y;
    }

    handleSwipeMove(x, y) {
        if (!this.swipeStartX || !this.swipeStartY) return;

        const deltaX = x - this.swipeStartX;
        const deltaY = y - this.swipeStartY;

        const threshold = 30;
        let direction = null;

        if (Math.abs(deltaX) > threshold) {
            direction = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        } else if (Math.abs(deltaY) > threshold) {
            direction = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        }

        if (direction) {
            this.game.changeDirection(direction);
            this.swipeStartX = x;
            this.swipeStartY = y;
        }
    }

    /**
     * Initialize D-Pad button listeners
     */
    initButtonListeners() {
        // Up button
        document.getElementById('btnUp')?.addEventListener('mousedown', () => {
            this.game.changeDirection({ x: 0, y: -1 });
        });

        document.getElementById('btnUp')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.game.changeDirection({ x: 0, y: -1 });
        });

        // Down button
        document.getElementById('btnDown')?.addEventListener('mousedown', () => {
            this.game.changeDirection({ x: 0, y: 1 });
        });

        document.getElementById('btnDown')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.game.changeDirection({ x: 0, y: 1 });
        });

        // Left button
        document.getElementById('btnLeft')?.addEventListener('mousedown', () => {
            this.game.changeDirection({ x: -1, y: 0 });
        });

        document.getElementById('btnLeft')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.game.changeDirection({ x: -1, y: 0 });
        });

        // Right button
        document.getElementById('btnRight')?.addEventListener('mousedown', () => {
            this.game.changeDirection({ x: 1, y: 0 });
        });

        document.getElementById('btnRight')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.game.changeDirection({ x: 1, y: 0 });
        });
    }

    /**
     * Detect if device is mobile based on screen size
     * @returns {boolean}
     */
    static isMobileDevice() {
        return window.innerWidth < 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Enable or disable D-Pad visibility
     * @param {boolean} show
     */
    setDPadVisible(show) {
        const controls = document.getElementById('touchControls');
        if (controls) {
            controls.style.display = show ? 'flex' : 'none';
        }
    }
}