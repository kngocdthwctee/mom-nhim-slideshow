/**
 * BaseSlide - Base class for all slides
 * Contains common functionality like sky, ground, fence, and camera controls
 */
class BaseSlide {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;

        // Camera control
        this.cameraEnabled = true; // Default: camera enabled
        this.cameraX = 0;
        this.isDragging = false;
        this.lastMouseX = 0;

        // Bind events
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        // Snowfall effect
        this.snowflakes = [];
    }

    initBase(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width / window.devicePixelRatio;
        this.height = canvas.height / window.devicePixelRatio;

        // Initialize snowfall
        this.initSnowfall();

        // Add event listeners only if camera is enabled
        if (this.cameraEnabled) {
            canvas.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);

            canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
            window.addEventListener('touchmove', this.onTouchMove, { passive: false });
            window.addEventListener('touchend', this.onTouchEnd);
        }
    }

    // Input Handling
    onMouseDown(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        const delta = (e.clientX - this.lastMouseX);
        this.cameraX -= delta;
        this.lastMouseX = e.clientX;
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onTouchStart(e) {
        if (e.touches.length > 0) {
            this.isDragging = true;
            this.lastMouseX = e.touches[0].clientX;
        }
    }

    onTouchMove(e) {
        if (!this.isDragging) return;
        if (e.touches.length > 0) {
            e.preventDefault();
            const delta = (e.touches[0].clientX - this.lastMouseX);
            this.cameraX -= delta;
            this.lastMouseX = e.touches[0].clientX;
        }
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    drawBackground(ctx, timestamp) {
        // Day sky (matching Slide3)
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#B0E0E6');
        gradient.addColorStop(1, '#98D8C8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Sun
        const sunX = this.width * 0.8;
        const sunY = this.height * 0.2;
        const sunRadius = 40;

        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2);
        sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        sunGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.1)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(sunX - sunRadius * 2, sunY - sunRadius * 2, sunRadius * 4, sunRadius * 4);

        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }

    // Common rendering methods
    drawSky(ctx) {
        // Day sky
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#B0E0E6');
        gradient.addColorStop(1, '#98D8C8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Sun
        const sunX = this.width * 0.8;
        const sunY = this.height * 0.2;
        const sunRadius = 40;

        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2);
        sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        sunGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.1)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(sunX - sunRadius * 2, sunY - sunRadius * 2, sunRadius * 4, sunRadius * 4);

        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }

    drawGround(ctx, scale, groundColor = null) {
        const groundY = this.height - 250 * scale;

        // Use custom color or default green
        const gradient = ctx.createLinearGradient(0, groundY, 0, this.height);
        if (groundColor === 'snow') {
            gradient.addColorStop(0, '#e8f4f8');
            gradient.addColorStop(0.5, '#d5e8f0');
            gradient.addColorStop(1, '#c5dde8');
        } else if (groundColor === 'brown') {
            gradient.addColorStop(0, '#8B7355');
            gradient.addColorStop(0.5, '#A0826D');
            gradient.addColorStop(1, '#6F5E4C');
        } else {
            // Default green
            gradient.addColorStop(0, '#2d5016');
            gradient.addColorStop(0.5, '#3d6b1f');
            gradient.addColorStop(1, '#1f3a0f');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(-10000, groundY, 20000, this.height - groundY + 500);
    }

    drawFence(ctx, scale, scrollOffset) {
        const fenceY = this.height - 250 * scale;
        const postSpacing = 80 * scale;
        const postHeight = 70 * scale;
        const postWidth = 8 * scale;

        ctx.strokeStyle = '#8B4513';
        ctx.fillStyle = '#8B4513';
        ctx.lineWidth = 5 * scale;
        ctx.lineCap = 'round';

        const patternOffset = scrollOffset % postSpacing;

        // Fence posts
        for (let x = -patternOffset - postSpacing; x <= this.width + postSpacing; x += postSpacing) {
            ctx.fillRect(x - postWidth / 2, fenceY - postHeight, postWidth, postHeight);
        }

        // Horizontal rails
        const railHeight = 5 * scale;
        ctx.fillRect(-5000, fenceY - postHeight * 0.7, this.width + 10000, railHeight);
        ctx.fillRect(-5000, fenceY - postHeight * 0.3, this.width + 10000, railHeight);
    }

    initSnowfall() {
        this.snowflakes = [];
        for (let i = 0; i < 100; i++) {
            this.snowflakes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 1 + 0.5,
                drift: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.6 + 0.4
            });
        }
    }

    drawSnowfall(ctx, timestamp) {
        this.snowflakes.forEach(flake => {
            // Update position
            flake.y += flake.speed;
            flake.x += Math.sin(timestamp / 1000 + flake.y) * flake.drift;

            // Reset if off screen
            if (flake.y > this.height) {
                flake.y = -10;
                flake.x = Math.random() * this.width;
            }
            if (flake.x < 0) flake.x = this.width;
            if (flake.x > this.width) flake.x = 0;

            // Draw snowflake
            ctx.save();
            ctx.globalAlpha = flake.opacity;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    /**
     * Draw a single character with their name
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Image} img - Character image
     * @param {number} x - Screen X position (center)
     * @param {number} y - Bottom Y position
     * @param {number} size - Character size
     * @param {string} name - Character name
     * @param {number} scale - Scale factor
     */
    drawCharacter(ctx, img, x, y, size, name, scale) {
        if (!img || !img.complete) return;

        const aspect = img.width / img.height;
        const width = size * aspect;
        const height = size;

        ctx.drawImage(img, x - width / 2, y - height, width, height);
        this.drawCharacterName(ctx, name, x, y - size - 5, scale);
    }

    /**
     * Draw character name with background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} name - Character name
     * @param {number} x - Center X position
     * @param {number} y - Bottom Y position
     * @param {number} scale - Scale factor
     */
    drawCharacterName(ctx, name, x, y, scale) {
        ctx.save();
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const textWidth = ctx.measureText(name).width;
        const padding = 4 * scale;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(
            x - textWidth / 2 - padding,
            y - 18 * scale,
            textWidth + padding * 2,
            20 * scale,
            3 * scale
        );
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.fillText(name, x, y);

        ctx.restore();
    }

    cleanupBase() {
        // Remove event listeners
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.onMouseDown);
            this.canvas.removeEventListener('touchstart', this.onTouchStart);
        }
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
    }

    // Methods to be overridden by child classes
    init(canvas, ctx) {
        throw new Error('init() must be implemented by child class');
    }

    render(timestamp) {
        throw new Error('render() must be implemented by child class');
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
    }

    cleanup() {
        this.cleanupBase();
    }
}
