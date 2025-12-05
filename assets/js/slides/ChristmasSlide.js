/**
 * Slide 4 - Lời chúc Giáng Sinh
 * Vẽ cảnh Mom Nhím gửi lời chúc với hiệu ứng lễ hội
 */
class Slide4 extends BaseSlide {
    constructor() {
        super();
        this.title = 'Lời chúc Giáng Sinh 🎄';
        this.content = `
            <p><span class="highlight">Mom Nhím</span> xuất hiện, gửi lời chúc Giáng Sinh ấm áp và vui tươi:</p>
            <p style="text-align: center; font-size: 1.1rem; margin: 20px 0;">
                <span class="character">"Chúc cả nhà một mùa Giáng Sinh an lành, ấm áp bên người thương! 🎁"</span>
            </p>
            <p>Giọng văn mang chút thần bí nhưng vẫn ấm lòng và hài hước...</p>
            <p style="margin-top: 15px;">Các "con" đồng thanh: <span class="character">"Cảm ơn Mom~ Merry Christmas! 🎅"</span></p>
            <p style="text-align: center; margin-top: 20px; font-size: 1.5rem;">🎄 ❄️ 🎁 ❄️ 🎄</p>
        `;

        this.ornaments = [];
        this.lightBulbs = [];

        // Tree image
        this.treeImage = new Image();

        // Disable camera panning for Christmas
        this.cameraEnabled = false;
        this.maxCameraOffset = 0;
    }

    init(canvas, ctx) {
        super.initBase(canvas, ctx);

        // Load tree image
        this.treeImage.src = 'assets/images/trees/candy-tree.png';

        this.initOrnaments();
        this.initLights();
    }

    initConfetti() {
        this.confetti = [];
        for (let i = 0; i < 50; i++) {
            this.confetti.push({
                x: Math.random() * this.width,
                y: -20 - Math.random() * this.height,
                size: 5 + Math.random() * 10,
                speedY: 1 + Math.random() * 2,
                speedX: (Math.random() - 0.5) * 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                color: ['#c41e3a', '#2d5a3d', '#d4a853', '#fff', '#ff6b6b'][Math.floor(Math.random() * 5)]
            });
        }
    }

    initOrnaments() {
        this.ornaments = [];
        const colors = ['#c41e3a', '#d4a853', '#2d5a3d', '#4169e1', '#ff69b4'];
        for (let i = 0; i < 12; i++) {
            this.ornaments.push({
                x: (i + 0.5) * (this.width / 12),
                baseY: 30,
                swing: Math.random() * Math.PI * 2,
                color: colors[i % colors.length],
                size: 12 + Math.random() * 8
            });
        }
    }

    initLights() {
        const scale = Math.min(this.width, this.height) / 800;
        this.maxCameraOffset = 0; // Disable camera panning

        this.lightBulbs = [];
        const numLights = 30;
        for (let i = 0; i < numLights; i++) {
            this.lightBulbs.push({
                x: (i / (numLights - 1)) * this.width,
                y: 15,
                color: ['#ff0000', '#00ff00', '#ffff00', '#0080ff', '#ff00ff'][i % 5],
                phase: i * 0.5
            });
        }
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        this.initOrnaments();
        this.initLights();
        super.initSnowfall();
    }

    render(timestamp) {
        const ctx = this.ctx;
        // ctx.clearRect(0, 0, this.width, this.height); // Handled by SlideManager

        // Calculate scale factor
        const scale = Math.min(this.width, this.height) / 800;

        // Camera control with limits
        if (this.cameraX < -this.maxCameraOffset) this.cameraX = -this.maxCameraOffset;
        if (this.cameraX > this.maxCameraOffset) this.cameraX = this.maxCameraOffset;

        const scrollOffset = this.cameraX;

        // Apply global scale
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.drawBackground(ctx, timestamp);
        this.drawGround(ctx, scale);
        this.drawFence(ctx, scale, scrollOffset);
        ctx.restore();

        // Draw Christmas lights
        this.drawLights(ctx, timestamp, scale);

        // Draw hanging ornaments
        this.drawOrnaments(ctx, timestamp, scale);

        // Draw Christmas tree
        this.drawChristmasTree(ctx, timestamp, scale);
        this.drawSnowfall(ctx, timestamp);
        this.drawGreeting(ctx, timestamp, scale);
    }

    drawGround(ctx, scale) {
        super.drawGround(ctx, scale, 'snow');
    }


    drawLights(ctx, timestamp, scale) {
        const scrollOffset = this.cameraX;

        // Wire - draw from left edge to right edge of scrollable area
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();

        // Start from far left of scrollable area
        const startX = -this.maxCameraOffset - scrollOffset;
        const endX = this.width + this.maxCameraOffset - scrollOffset;

        ctx.moveTo(startX, 15 * scale);
        for (let x = -this.maxCameraOffset; x <= this.width + this.maxCameraOffset; x += 20 * scale) {
            const screenX = x - scrollOffset;
            ctx.lineTo(screenX, 15 * scale + Math.sin(x / (30 * scale)) * 5 * scale);
        }
        ctx.stroke();

        // Light bulbs
        this.lightBulbs.forEach((light, i) => {
            const screenX = light.x - scrollOffset;

            // Only draw if visible
            if (screenX > -50 && screenX < this.width + 50) {
                const blink = Math.sin(timestamp / 500 + light.phase) > 0;
                const y = 15 * scale + Math.sin(light.x / (30 * scale)) * 5 * scale;

                if (blink) {
                    ctx.shadowColor = light.color;
                    ctx.shadowBlur = 15 * scale;
                }

                ctx.beginPath();
                ctx.arc(screenX, y + 8 * scale, 6 * scale, 0, Math.PI * 2);
                ctx.fillStyle = blink ? light.color : '#333';
                ctx.fill();

                ctx.shadowBlur = 0;
            }
        });
    }

    drawOrnaments(ctx, timestamp, scale) {
        const scrollOffset = this.cameraX;

        this.ornaments.forEach((orn, i) => {
            const swing = Math.sin(timestamp / 1000 + orn.swing) * 10 * scale;
            const baseX = orn.x - scrollOffset;
            const x = baseX + swing;
            const y = orn.baseY * scale + 25 * scale;
            const size = orn.size * scale;

            // String
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(baseX, orn.baseY * scale);
            ctx.lineTo(x, y - size);
            ctx.stroke();

            // Ornament
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                x - size * 0.3, y - size * 0.3, 0,
                x, y, size
            );
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(0.3, orn.color);
            gradient.addColorStop(1, this.darkenColor(orn.color, 0.5));
            ctx.fillStyle = gradient;
            ctx.fill();

            // Shine
            ctx.beginPath();
            ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        });
    }

    darkenColor(color, factor) {
        // Simple color darkening
        return color;
    }

    drawChristmasTree(ctx, timestamp, scale) {
        if (this.treeImage && this.treeImage.complete) {
            const scrollOffset = this.cameraX;
            const treeX = this.width * 0.25 - scrollOffset;
            const treeY = this.height * 0.9;
            const treeSize = 400 * scale;

            const aspect = this.treeImage.width / this.treeImage.height;
            const width = treeSize * aspect;
            const height = treeSize;

            // Draw tree image
            ctx.drawImage(this.treeImage, treeX - width / 2, treeY - height, width, height);

            // Star on top
            this.drawStar(ctx, treeX, treeY - height - 10 * scale, 20 * scale, timestamp);
        }
    }

    drawStar(ctx, x, y, size, timestamp) {
        const glow = Math.sin(timestamp / 300) * 0.3 + 0.7;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(timestamp / 2000);

        // Glow
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20 * glow;

        // Star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = '#ffd700';
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    drawMomNhim(ctx, timestamp, scale) {
        const x = this.width * 0.7;
        const y = this.height * 0.75;
        const bounce = Math.sin(timestamp / 500) * 5 * scale;

        // Body
        ctx.beginPath();
        ctx.ellipse(x, y + bounce, 50 * scale, 40 * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#8b7355';
        ctx.fill();

        // Spikes
        ctx.fillStyle = '#4a3728';
        for (let i = 0; i < 12; i++) {
            const angle = Math.PI + (i / 11) * Math.PI;
            const spikeX = x + Math.cos(angle) * 45 * scale;
            const spikeY = y + bounce + Math.sin(angle) * 35 * scale;
            const spikeEndX = x + Math.cos(angle) * 70 * scale;
            const spikeEndY = y + bounce + Math.sin(angle) * 55 * scale;

            ctx.beginPath();
            ctx.moveTo(spikeX - 5 * scale, spikeY);
            ctx.lineTo(spikeEndX, spikeEndY);
            ctx.lineTo(spikeX + 5 * scale, spikeY);
            ctx.fill();
        }

        // Face
        ctx.beginPath();
        ctx.ellipse(x, y + bounce + 15 * scale, 25 * scale, 20 * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#d4a574';
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - 10 * scale, y + bounce + 10 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.arc(x + 10 * scale, y + bounce + 10 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x - 11 * scale, y + bounce + 9 * scale, 1.5 * scale, 0, Math.PI * 2);
        ctx.arc(x + 9 * scale, y + bounce + 9 * scale, 1.5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.beginPath();
        ctx.arc(x, y + bounce + 20 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();

        // Smile
        ctx.beginPath();
        ctx.arc(x, y + bounce + 22 * scale, 10 * scale, 0.2, Math.PI - 0.2);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        // Santa hat
        ctx.fillStyle = '#c41e3a';
        ctx.beginPath();
        ctx.moveTo(x - 30 * scale, y + bounce - 15 * scale);
        ctx.lineTo(x + 10 * scale, y + bounce - 50 * scale);
        ctx.lineTo(x + 35 * scale, y + bounce - 10 * scale);
        ctx.closePath();
        ctx.fill();

        // Hat trim
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(x, y + bounce - 12 * scale, 35 * scale, 8 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hat pom
        ctx.beginPath();
        ctx.arc(x + 10 * scale, y + bounce - 50 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawConfetti(ctx, timestamp, scale) {
        this.confetti.forEach(c => {
            // Update
            c.y += c.speedY * scale;
            c.x += c.speedX * scale + Math.sin(timestamp / 500 + c.rotation) * 0.5 * scale;
            c.rotation += c.rotationSpeed;

            // Reset if off screen
            if (c.y > this.height + 20) {
                c.y = -20;
                c.x = Math.random() * this.width;
            }

            // Draw
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size * scale / 2, -c.size * scale / 4, c.size * scale, c.size * scale / 2);
            ctx.restore();
        });
    }

    drawGreeting(ctx, timestamp, scale) {
        const pulse = Math.sin(timestamp / 500) * 0.1 + 1;

        ctx.save();
        ctx.font = `bold ${24 * pulse * scale}px Cormorant Garamond`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10 * scale;
        ctx.fillText('Merry Christmas!', this.width / 2, this.height - 40 * scale);
        ctx.restore();
    }

    cleanup() {
        super.cleanup();
        this.ornaments = [];
        this.lightBulbs = [];
    }
}

// Đăng ký slide
window.slideManager.addSlide(new Slide4());
