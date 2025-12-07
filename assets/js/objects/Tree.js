/**
 * Tree - Represents a tree object in the slide
 */
class Tree extends GameObject {
    /**
     * @param {number} x - X position
     * @param {number} y - Y position (bottom)
     * @param {number} size - Tree size
     * @param {string} type - Tree type (cayoi, cayxoai, etc.)
     * @param {Object} images - Map of tree images
     * @param {boolean} flip - Whether to flip horizontally
     */
    constructor(x, y, size, type, image, flip = false) {
        super(x, y, size, image);
        this.type = type;
        this.flip = flip;

        // Gift logic
        this.giftImage = new Image();
        this.giftActive = false;
        this.giftY = 0;
        this.giftOpacity = 0;
        this.giftStartTime = 0;

        const giftMap = {
            'cayoi': 'quaoi.png',
            'cayxoai': 'quaxoai.png',
            'caychuoi': 'naichuoi.png',
            'caymit': 'quamit.png',
            'caycam': 'quacam.png',
            'caysaurieng': 'quasaurieng.png',
            'caytao': 'quatao.png'
        };

        if (giftMap[type]) {
            this.giftImage.src = `assets/images/fruits/${giftMap[type]}`;
        }
    }

    getDepth() {
        return this.y;
    }

    /**
     * Get random chat message for trees
     */
    static getRandomMessage() {
        const messages = [
            "Rì rào... Rì rào...",
            "Gió mát quá! 🍃",
            "Cây này do Mom trồng đó!",
            "Lớn nhanh nào!",
            "Xào xạc... Xào xạc...",
            "Chào bạn nhỏ! 👋"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Handle click on tree
     */
    onClick() {
        if (this.owner) {
            this.owner.treeOnClick(this);
        } else {
            this.activateGift();
        }
    }

    activateGift() {
        this.giftActive = true;
        this.giftY = this.y - this.size * 0.8; // Start from tree canopy
        this.giftOpacity = 1;
        this.giftStartTime = Date.now();
    }

    /**
     * Render the tree
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} scale - Scale factor
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} timestamp - Animation timestamp (unused)
     */
    render(ctx, scale, scrollOffset, canvasWidth, timestamp) {
        const screenX = this.getScreenX(scrollOffset, canvasWidth);
        if (screenX === null) return;

        if (!this.image || !this.image.complete) return;

        this.drawTree(ctx, this.image, screenX, this.y, this.flip);

        // Draw gift if active
        if (this.giftActive) {
            this.drawGift(ctx, screenX, scale);
        }

        // Draw chat bubble if active
        this.drawChatBubble(ctx, screenX, scale);
    }

    drawGift(ctx, x, scale) {
        const elapsed = Date.now() - this.giftStartTime;
        const duration = 2000;

        if (elapsed > duration) {
            this.giftActive = false;
            return;
        }

        // Animation: Float up and fade out
        const progress = elapsed / duration;
        const floatUp = progress * 100 * scale;
        this.giftOpacity = 1 - Math.pow(progress, 3); // Ease out fade

        const giftSize = 60 * scale;
        const currentY = this.giftY - floatUp;

        ctx.save();
        ctx.globalAlpha = this.giftOpacity;

        // Draw glow behind gift
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 20 * scale;

        const aspect = this.giftImage.width / this.giftImage.height;
        const width = giftSize * aspect;

        ctx.drawImage(this.giftImage, x - width / 2, currentY - giftSize / 2, width, giftSize);

        ctx.restore();
    }

    /**
     * Draw tree at specified position with flip support
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Image} img - Tree image
     * @param {number} x - X position (center)
     * @param {number} bottomY - Bottom Y position
     * @param {boolean} flip - Whether to flip horizontally
     */
    drawTree(ctx, img, x, bottomY, flip) {
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
