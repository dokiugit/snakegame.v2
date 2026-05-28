/**
 * STORAGE MODULE
 * Handles persistent high score storage using localStorage
 */

class ScoreStorage {
    constructor(storageKey = 'snakegame_highscore') {
        this.storageKey = storageKey;
    }

    /**
     * Get high score from localStorage
     * @returns {number} High score value
     */
    getHighScore() {
        try {
            const score = localStorage.getItem(this.storageKey);
            return score ? parseInt(score, 10) : 0;
        } catch (error) {
            console.warn('localStorage not available:', error);
            return 0;
        }
    }

    /**
     * Save high score to localStorage
     * @param {number} score
     * @returns {boolean} Success indicator
     */
    saveHighScore(score) {
        try {
            localStorage.setItem(this.storageKey, score.toString());
            return true;
        } catch (error) {
            console.warn('Failed to save high score:', error);
            return false;
        }
    }

    /**
     * Update high score if new score is higher
     * @param {number} currentScore
     * @returns {number} The high score (updated or existing)
     */
    updateHighScore(currentScore) {
        const highScore = this.getHighScore();

        if (currentScore > highScore) {
            this.saveHighScore(currentScore);
            return currentScore;
        }

        return highScore;
    }

    /**
     * Reset high score (for testing/admin purposes)
     * @returns {boolean} Success indicator
     */
    resetHighScore() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.warn('Failed to reset high score:', error);
            return false;
        }
    }

    /**
     * Get all scores data as object
     * @returns {Object} {currentHighScore, lastUpdated}
     */
    getScoreData() {
        return {
            highScore: this.getHighScore(),
            lastUpdated: localStorage.getItem(`${this.storageKey}_updated`) || 'Never'
        };
    }

    /**
     * Get statistics (for future expansion)
     * @returns {Object} Game statistics
     */
    getStatistics() {
        return {
            highScore: this.getHighScore(),
            storageAvailable: this.isStorageAvailable()
        };
    }

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    isStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}