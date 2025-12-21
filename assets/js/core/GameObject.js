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
    constructor(x, y, size, image = null, sound = null) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = image;

        // Sound effect
        this.sound = null;
        if (sound) {
            this.sound = new Audio(sound);
        }

        // Chat bubble properties
        this.chatMessage = null;
        this.chatEndTime = 0;
    }

    /**
     * Play object sound if available
     */
    playSound() {
        if (this.sound) {
            this.sound.currentTime = 0;
            this.sound.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    /**
     * Get depth value for sorting (objects with smaller Y render first)
     * @returns {number} Depth value
     */
    getDepth() {
        return this.y;
    }

    /**
     * Calculate distance to another GameObject
     * @param {GameObject} other - The other object
     * @returns {number} Distance in pixels
     */
    distanceTo(other) {
        if (!other) return Infinity;
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculate screen X position with scrolling
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
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
        const hitWidth = this.getHitboxWidth();
        const halfWidth = hitWidth / 2;
        const left = objectScreenX - halfWidth;
        const right = objectScreenX + halfWidth;
        const top = this.y - this.size;
        const bottom = this.y;

        // 1. Basic bounding box check
        const inBounds = clickX >= left && clickX <= right && clickY >= top && clickY <= bottom;
        if (!inBounds) return false;

        // 2. Pixel-perfect check if image is available
        if (this.image && this.image.complete && this.image.width > 0) {
            try {
                // Calculate relative position (0 to 1)
                const relX = (clickX - left) / hitWidth;
                const relY = (clickY - top) / this.size;

                // Map to source image coordinates
                let srcX = Math.floor(relX * this.image.width);
                let srcY = Math.floor(relY * this.image.height);

                // Handle flipped objects (e.g. Tree)
                if (this.flip) {
                    srcX = this.image.width - 1 - srcX;
                }

                // Ensure coordinates are within bounds
                srcX = Math.max(0, Math.min(this.image.width - 1, srcX));
                srcY = Math.max(0, Math.min(this.image.height - 1, srcY));

                // Check alpha value
                const alpha = GameObject.getPixelAlpha(this.image, srcX, srcY);
                return alpha > 10; // Threshold: ignore if alpha <= 10
            } catch (e) {
                console.warn('Pixel check failed, falling back to bounding box', e);
                return true;
            }
        }

        return true;
    }

    /**
     * Get the clickable width of the object
     * Subclasses can override this if their visual width != size
     */
    getHitboxWidth() {
        if (this.image && this.image.complete && this.image.height > 0) {
            const aspect = this.image.width / this.image.height;
            return this.size * aspect;
        }
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

    /**
     * Get alpha value of a pixel from an image
     * Uses a shared static canvas for performance
     */
    static getPixelAlpha(image, x, y) {
        if (!GameObject.pixelCheckCanvas) {
            GameObject.pixelCheckCanvas = document.createElement('canvas');
            GameObject.pixelCheckCanvas.width = 1;
            GameObject.pixelCheckCanvas.height = 1;
            GameObject.pixelCheckCtx = GameObject.pixelCheckCanvas.getContext('2d', { willReadFrequently: true });
        }

        const ctx = GameObject.pixelCheckCtx;
        // Optimization: Clear only if strict transparency is needed, but drawImage overwrites usually.
        // Clearing is safer.
        ctx.clearRect(0, 0, 1, 1);

        ctx.drawImage(image, x, y, 1, 1, 0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return data[3];
    }
}
// Static properties for pixel checking
GameObject.pixelCheckCanvas = null;
GameObject.pixelCheckCtx = null;

