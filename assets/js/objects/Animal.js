/**
 * Animal - Represents an animal object in the slide
 */
class Animal extends GameObject {
    /**
     * @param {number} x - X position
     * @param {number} y - Y position (bottom)
     * @param {number} size - Animal size
     * @param {string} type - Animal type (conga, conlon, etc.)
     * @param {Object} images - Map of animal images
     * @param {boolean} flip - Whether to flip horizontally
     * @param {number} bobPhase - Phase offset for bobbing animation
     */
    constructor(x, y, size, type, images, flip = false, bobPhase = 0) {
        super(x, y, size);
        this.type = type;
        this.images = images;
        this.flip = flip;
        this.bobPhase = bobPhase;
    }

    /**
     * Get random chat message for animals
     * @returns {string} Random message
     */
    static getRandomMessage() {
        const messages = [
            "Ụ ục ục... 🐷",
            "Meo meo! 🐱",
            "Gá gà gò gò! 🐓",
            "Dùi dùi! 🐄",
            "Đói bụng rồi! 🍽️",
            "Cho em ăn nào! 🤤",
            "Mệt quá! 😴",
            "Vui quá! 🥳",
            "Nghỉ thôi... 😴",
            "Chơi cùng với! 🥰"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Handle click on animal
     */
    onClick() {
        this.showChat(Animal.getRandomMessage(), 5000);
    }

    /**
     * Render the animal with bobbing animation
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} scale - Scale factor
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} timestamp - Animation timestamp
     */
    render(ctx, scale, scrollOffset, canvasWidth, timestamp) {
        const screenX = this.getScreenX(scrollOffset, canvasWidth);
        if (screenX === null) return;

        const img = this.images[this.type];
        if (!img || !img.complete) return;

        // Calculate bobbing offset
        const bob = Math.sin(timestamp / 1000 + this.bobPhase) * 3;

        this.drawAnimal(ctx, img, screenX, this.y + bob, this.flip);

        // Draw chat bubble if active
        this.drawChatBubble(ctx, screenX, scale);
    }

    /**
     * Draw animal at specified position with flip support
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Image} img - Animal image
     * @param {number} x - X position (center)
     * @param {number} bottomY - Bottom Y position
     * @param {boolean} flip - Whether to flip horizontally
     */
    drawAnimal(ctx, img, x, bottomY, flip) {
        ctx.save();
        ctx.translate(x, bottomY);

        if (flip) {
            ctx.scale(-1, 1);
        }

        const aspect = img.width / img.height;
        const width = this.size * aspect;
        const height = this.size;

        // Draw centered horizontally, sitting on bottomY
        ctx.drawImage(img, -width / 2, -height, width, height);

        ctx.restore();
    }
}
