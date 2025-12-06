/**
 * GameObject - Base class for all renderable objects in slides
 * Provides common properties and interface for rendering and sorting
 */
class GameObject {
    /**
     * @param {number} x - X position
     * @param {number} y - Y position (bottom position for depth sorting)
     * @param {number} size - Object size
     * @param {Image} image - Object image (optional)
     */
    constructor(x, y, size, image = null) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = image;

        // Chat bubble properties
        this.chatMessage = null;
        this.chatEndTime = 0;
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
    getScreenX(scrollOffset, canvasWidth) {
        let screenX = this.x - scrollOffset;

        // Check if visible
        if (screenX < -this.size || screenX > canvasWidth + this.size) {
            return null;
        }

        return screenX;
    }

    /**
     * Show chat message above object
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (default 5000ms)
     */
    showChat(message, duration = 5000) {
        this.chatMessage = message;
        this.chatEndTime = Date.now() + duration;
    }

    /**
     * Check if chat is currently active
     * @returns {boolean} True if chat should be displayed
     */
    hasActiveChat() {
        return this.chatMessage && Date.now() < this.chatEndTime;
    }

    /**
     * Clear chat message
     */
    clearChat() {
        this.chatMessage = null;
        this.chatEndTime = 0;
    }

    /**
     * Check if a point (click) is inside this object
     * @param {number} clickX - Click X coordinate (canvas space)
     * @param {number} clickY - Click Y coordinate (canvas space)
     * @param {number} objectScreenX - Object's screen X position (center)
     * @returns {boolean} True if point is inside object bounds
     */
    isPointInside(clickX, clickY, objectScreenX) {
        // Calculate object bounds using its screen position
        const halfWidth = this.getHitboxWidth() / 2;
        const left = objectScreenX - halfWidth;
        const right = objectScreenX + halfWidth;
        const top = this.y - this.size;
        const bottom = this.y;

        return clickX >= left && clickX <= right && clickY >= top && clickY <= bottom;
    }

    /**
     * Get the clickable width of the object
     * Subclasses can override this if their visual width != size
     */
    getHitboxWidth() {
        return this.size;
    }

    /**
     * Draw chat bubble above object
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} screenX - Screen X position
     * @param {number} scale - Scale factor
     */
    drawChatBubble(ctx, screenX, scale) {
        if (!this.hasActiveChat()) return;

        ctx.save();

        const bubbleY = this.y - this.size - 15 * scale;
        const fontSize = 14 * scale;
        const padding = 8 * scale;
        const maxWidth = 200 * scale;

        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        // Measure text and wrap if needed
        const words = this.chatMessage.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);

        const lineHeight = fontSize * 1.3;
        const bubbleWidth = Math.max(...lines.map(line => ctx.measureText(line).width)) + padding * 2;
        const bubbleHeight = lines.length * lineHeight + padding * 2;

        const bubbleX = screenX - bubbleWidth / 2;
        const bubbleTop = bubbleY - bubbleHeight;

        // Draw bubble background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2 * scale;

        ctx.beginPath();
        const radius = 8 * scale;
        ctx.roundRect(bubbleX, bubbleTop, bubbleWidth, bubbleHeight, radius);
        ctx.fill();
        ctx.stroke();

        // Draw tail (triangle pointing down)
        ctx.beginPath();
        ctx.moveTo(screenX - 8 * scale, bubbleTop + bubbleHeight);
        ctx.lineTo(screenX, bubbleTop + bubbleHeight + 8 * scale);
        ctx.lineTo(screenX + 8 * scale, bubbleTop + bubbleHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.fillStyle = '#333';
        lines.forEach((line, i) => {
            ctx.fillText(line, screenX, bubbleTop + padding + (i + 1) * lineHeight - 4 * scale);
        });

        ctx.restore();
    }

    /**
     * Render the object (must be implemented by subclasses)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} scale - Scale factor
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} timestamp - Animation timestamp
     */
    render(ctx, scale, scrollOffset, canvasWidth, timestamp) {
        throw new Error('render() must be implemented by subclass');
    }
}
