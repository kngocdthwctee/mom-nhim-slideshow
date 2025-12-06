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
    constructor(x, y, size, type, images, flip = false) {
        super(x, y, size);
        this.type = type;
        this.images = images;
        this.flip = flip;
    }

    /**
     * Render the tree
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} scale - Scale factor
     * @param {number} scrollOffset - Camera scroll offset
     * @param {number} canvasWidth - Canvas width
     * @param {number} loopWidth - Width for wrapping
     * @param {number} timestamp - Animation timestamp (unused)
     */
    render(ctx, scale, scrollOffset, canvasWidth, loopWidth, timestamp) {
        const screenX = this.getScreenX(scrollOffset, canvasWidth, loopWidth);
        if (screenX === null) return;

        const img = this.images[this.type];
        if (!img || !img.complete) return;

        ctx.save();

        if (this.flip) {
            ctx.translate(screenX + this.size, this.y);
            ctx.scale(-1, 1);
            this.drawTree(ctx, img, 0, 0);
        } else {
            this.drawTree(ctx, img, screenX, this.y);
        }

        ctx.restore();
    }

    /**
     * Draw tree at specified position
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Image} img - Tree image
     * @param {number} x - X position (center)
     * @param {number} bottomY - Bottom Y position
     */
    drawTree(ctx, img, x, bottomY) {
        const aspect = img.width / img.height;
        const width = this.size * aspect;
        const height = this.size;

        ctx.drawImage(img, x - width / 2, bottomY - height, width, height);
    }
}
