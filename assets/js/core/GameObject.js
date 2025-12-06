/**
 * GameObject - Base class for all renderable objects in slides
 * Provides common properties and interface for rendering and sorting
 */
class GameObject {
    /**
     * @param {number} x - X position
     * @param {number} y - Y position (bottom position for depth sorting)
     * @param {number} size - Object size
     */
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    /**
     * Get depth value for sorting (objects with smaller Y render first)
     * @returns {number} Depth value
     */
    getDepth() {
        return this.y;
    }

    /**
     * Calculate screen X position with scrolling
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} loopWidth - Width for wrapping
     * @returns {number|null} Screen X position or null if off-screen
     */
    getScreenX(scrollOffset, canvasWidth, loopWidth) {
        let screenX = this.x - scrollOffset;

        // Wrap around for infinite scrolling
        if (loopWidth) {
            if (screenX < -this.size) screenX += loopWidth;
            if (screenX > canvasWidth + this.size) screenX -= loopWidth;
        }

        // Check if visible
        if (screenX < -this.size || screenX > canvasWidth + this.size) {
            return null;
        }

        return screenX;
    }

    /**
     * Render the object (must be implemented by subclasses)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} scale - Scale factor
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} loopWidth - Width for wrapping
     * @param {number} timestamp - Animation timestamp
     */
    render(ctx, scale, scrollOffset, canvasWidth, loopWidth, timestamp) {
        throw new Error('render() must be implemented by subclass');
    }
}
