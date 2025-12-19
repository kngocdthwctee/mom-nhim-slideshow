class House extends GameObject {
    constructor(x, y, size, image, owner) {
        super(x, y, size, image);
        this.owner = owner;
    }

    render(ctx, scale, scrollOffset, canvasWidth, timestamp) {
        const screenX = this.getScreenX(scrollOffset, canvasWidth);
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

    onClick() {
        if (this.owner) {
            this.owner.showChat("Nhà này là của mum, ai cho động zô", 3000);
        }
    }


}
