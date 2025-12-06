class House extends GameObject {
    constructor(x, y, size, image) {
        super(x, y, size);
        this.image = image;
    }

    render(ctx, scale, scrollOffset, canvasWidth, loopWidth, timestamp) {
        const screenX = this.getScreenX(scrollOffset, canvasWidth, loopWidth);
        if (screenX === null) return;

        if (!this.image || !this.image.complete) return;

        this.drawHouse(ctx, this.image, screenX, this.y);

        // Draw chat bubble if active
        this.drawChatBubble(ctx, screenX, scale);
    }

    drawHouse(ctx, img, x, bottomY) {
        ctx.save();
        ctx.translate(x, bottomY);

        const aspect = img.width / img.height;
        const width = this.size * aspect;
        const height = this.size;

        // Add glow
        ctx.shadowColor = 'rgba(255, 255, 200, 0.3)';
        ctx.shadowBlur = 30;

        // Draw centered horizontally, sitting on bottomY (0, 0 local)
        ctx.drawImage(img, -width / 2, -height, width, height);

        ctx.restore();
    }

    // Override generic hitbox if needed, but basic size-based box might be too square for a wide house?
    // GameObject default hitbox uses this.size as width.
    // House width = size * aspect.
    // We should implement getHitboxWidth to return actual visual width.

    getHitboxWidth() {
        if (!this.image || !this.image.complete) return this.size;
        const aspect = this.image.width / this.image.height;
        return this.size * aspect;
    }

    onClick() {
        this.showChat("Welcome to Mom & Nhím's House! 🏠", 3000);
    }
}
