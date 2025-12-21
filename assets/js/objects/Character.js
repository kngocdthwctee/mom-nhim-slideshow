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
    constructor(x, y, size, image, name, messages, giftMessages = [], noGiftMessages = [], sound = null) {
        super(x, y, size, image, sound);
        this.name = name;
        this.messages = messages;
        this.giftMessages = giftMessages;
        this.noGiftMessages = noGiftMessages;
        this.targetX = x;
        this.targetY = y;
        this.isMoving = false;
        this.lastTimestamp = 0;
    }

    /**
     * Get random chat message for characters
     * @returns {string} Random message
     */
    getRandomMessage() {
        if (!this.messages || this.messages.length === 0) return "...";
        return this.messages[Math.floor(Math.random() * this.messages.length)];
    }

    /**
     * Handle click on character
     */
    onClick() {
        this.showChat(this.getRandomMessage(), 5000);
        this.playSound();
    }

    /**
     * Move character to specific position
     * @param {number} x - Target X
     * @param {number} y - Target Y
     */
    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;
    }

    treeOnClick(tree) {
        // Calculate safe position relative to size
        // Stand slightly to the left and in front (lower Y)
        const targetX = tree.x - this.size * 0.5;
        const targetY = tree.y + this.size * 0.2;

        this.moveTo(targetX, targetY);

        // 10% chance to drop gift
        if (Math.random() < 0.1) {
            tree.activateGift();
            if (this.giftMessages && this.giftMessages.length > 0) {
                this.showChat(this.giftMessages[Math.floor(Math.random() * this.giftMessages.length)], 5000);
            }
        } else {
            if (this.noGiftMessages && this.noGiftMessages.length > 0) {
                this.showChat(this.noGiftMessages[Math.floor(Math.random() * this.noGiftMessages.length)], 5000);
            }
        }
    }

    /**
     * Render the character with their name
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} scale - Scale factor
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} timestamp - Animation timestamp
     */
    render(ctx, scale, scrollOffset, canvasWidth, timestamp) {
        // Handle movement
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1); // Cap dt at 0.1s
        this.lastTimestamp = timestamp;

        if (this.isMoving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            } else {
                const speed = 500 * scale; // pixels per second
                const moveDist = speed * dt;

                if (moveDist >= dist) {
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.isMoving = false;
                } else {
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * moveDist;
                    this.y += Math.sin(angle) * moveDist;
                }
            }
        }

        const screenX = this.getScreenX(scrollOffset, canvasWidth);
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
