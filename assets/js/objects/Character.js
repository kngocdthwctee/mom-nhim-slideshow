/**
 * Character - Represents a character object in the slide
 */
class Character extends GameObject {
    /**
     * @param {number} x - X position
     * @param {number} y - Y position (bottom)
     * @param {number} size - Character size
     * @param {Image} image - Character image
     * @param {string} name - Character name
     */
    constructor(x, y, size, image, name) {
        super(x, y, size);
        this.image = image;
        this.name = name;
    }

    /**
     * Get random chat message for characters
     * @returns {string} Random message
     */
    static getRandomMessage() {
        const messages = [
            "Chào bạn! 👋",
            "Hôm nay thật đẹp trời! ☀️",
            "Mình đang bận quá! 😅",
            "Được nghỉ rồi! 🎉",
            "Đi chơi không? 🎈",
            "Mệt quá! 😴",
            "Vui quá! 😊",
            "Làm gì thế?  🤔",
            "Ăn gì đây? 🍰",
            "Tuyệt vời! ⭐",
            "Hehe 😄",
            "À... 😯",
            "Ồ! 😲",
            "Được rồi! 👍"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Handle click on character
     */
    onClick() {
        this.showChat(Character.getRandomMessage(), 5000);
    }

    /**
     * Render the character with their name
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} scale - Scale factor
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} loopWidth - Width for wrapping (optional)
     * @param {number} timestamp - Animation timestamp (unused)
     */
    render(ctx, scale, scrollOffset, canvasWidth, loopWidth, timestamp) {
        const screenX = this.getScreenX(scrollOffset, canvasWidth, loopWidth);
        if (screenX === null) return;

        if (!this.image || !this.image.complete) return;

        // Draw character image
        const aspect = this.image.width / this.image.height;
        const width = this.size * aspect;
        const height = this.size;

        ctx.drawImage(this.image, screenX - width / 2, this.y - height, width, height);

        // Draw character name
        this.drawName(ctx, screenX, scale);

        // Draw chat bubble if active
        this.drawChatBubble(ctx, screenX, scale);
    }

    /**
     * Draw character name with background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} screenX - Screen X position
     * @param {number} scale - Scale factor
     */
    drawName(ctx, screenX, scale) {
        ctx.save();
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const textWidth = ctx.measureText(this.name).width;
        const padding = 4 * scale;
        const nameY = this.y - this.size - 5;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(
            screenX - textWidth / 2 - padding,
            nameY - 18 * scale,
            textWidth + padding * 2,
            20 * scale,
            3 * scale
        );
        ctx.fill();

        // Text
        ctx.fillStyle = '#fff';
        ctx.fillText(this.name, screenX, nameY);

        ctx.restore();
    }
}
