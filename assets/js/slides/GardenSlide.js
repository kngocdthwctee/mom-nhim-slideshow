/**
 * Slide 2 - Khu vườn huyền bí phía sau
 * Vẽ khu vườn với các cây mít, xoài, ổi và hiệu ứng huyền bí
 * Version: Updated Layout with New Trees (Mit, Sau Rieng)
 */
class Slide2 extends BaseSlide {
    constructor() {
        super();
        console.log('Slide2 initialized - New Trees Version');
        this.title = 'Khu vườn huyền bí phía sau';
        this.content = `
            <p>Phía sau là khu vườn Mom trồng riêng cho từng đứa: </p>
            <p>cây mít thì cứ rung bần bật mỗi khi Pun đi ngang, </p>
            <p>xoài của Quỳnh Như thì tỏa mùi thơm như đang rủ rê, </p>
            <p> còn cây ổi của Ong thỉnh thoảng khẽ nghiêng đầu như gật gù.</p>
            <p>Hoa quả lúc nào cũng sai trĩu, tụi nhỏ vừa hái vừa ăn, vừa nghe tiếng lá xào xạc như đang cười khúc khích.</p>
            <p>Thỉnh thoảng một quả tự rơi xuống đất cộp — không mạnh, chỉ vừa đủ để mọi người giật mình rồi phá lên cười: "Vườn nhà Mom còn biết troll!"</p>
        `;

        // Enable camera panning
        this.cameraEnabled = true;

        this.trees = [];

        // Images
        this.images = {
            cayoi: new Image(),
            cayxoai: new Image(),
            caymit: new Image(),
            caysaurieng: new Image(),
            caychuoi: new Image(),
            caycam: new Image()
        };
    }

    init(canvas, ctx) {
        super.initBase(canvas, ctx);

        // Load images
        this.images.cayoi.src = 'assets/images/garden/cayoi.png';
        this.images.cayxoai.src = 'assets/images/garden/cayxoai.png';
        this.images.caymit.src = 'assets/images/garden/caymit.png';
        this.images.caysaurieng.src = 'assets/images/garden/caysaurieng.png';
        this.images.caychuoi.src = 'assets/images/garden/caychuoi.png';
        this.images.caycam.src = 'assets/images/garden/caycam.png';

        this.initTrees();
    }

    initTrees() {
        this.trees = [];
        const scale = Math.min(this.width, this.height) / 800;

        // Set camera limits
        this.maxCameraOffset = 400 * scale;

        const groundY = this.height - 100 * scale;
        const treeTypes = ['caymit', 'cayxoai', 'caysaurieng', 'cayoi', 'caychuoi', 'caycam'];
        const numTrees = 8;

        for (let i = 0; i < numTrees; i++) {
            const type = treeTypes[i % treeTypes.length];
            const baseSpacing = this.width / numTrees;
            const jitter = (Math.random() - 0.5) * (baseSpacing * 0.3);
            const x = (i * baseSpacing) + jitter;
            // Increased random Y offset for more depth/scatter
            const yOffset = (Math.random() * 200 - 100) * scale;
            const size = (200 + Math.random() * 100) * scale;

            this.trees.push({
                type: type,
                x: x,
                y: groundY + yOffset,
                size: size,
                flip: Math.random() > 0.5
            });
        }

        // Sort trees by Y coordinate (smaller Y first) to handle depth overlapping correctly
        this.trees.sort((a, b) => a.y - b.y);
    }

    initFlowers() {
        this.flowers = [];
        const scale = Math.min(this.width, this.height) / 800;
        const gardenHeight = 450 * scale;
        const startY = this.height - gardenHeight;

        for (let i = 0; i < 60; i++) {
            this.flowers.push({
                x: Math.random() * this.width,
                y: startY + gardenHeight * 0.3 + Math.random() * (gardenHeight * 0.7),
                size: 3 + Math.random() * 5,
                color: Math.random() > 0.5 ? '#ff69b4' : '#ffff00',
                type: Math.floor(Math.random() * 3)
            });
        }
    }

    initSparkles() {
        this.sparkles = [];
        for (let i = 0; i < 20; i++) {
            this.sparkles.push({
                x: Math.random() * this.width,
                y: this.height - Math.random() * (this.height * 0.6),
                size: Math.random() * 3,
                maxSize: 2 + Math.random() * 3,
                speed: 0.02 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2,
                opacity: Math.random()
            });
        }
    }

    initFireflies() {
        this.fireflies = [];
        for (let i = 0; i < 30; i++) {
            this.fireflies.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 2 + Math.random() * 3,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    initLeaves() {
        this.leaves = [];
        for (let i = 0; i < 15; i++) {
            this.leaves.push({
                x: Math.random() * this.width,
                y: -20 - Math.random() * 100,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                fallSpeed: 0.5 + Math.random() * 0.8,
                wobble: Math.random() * Math.PI * 2,
                size: 8 + Math.random() * 8,
                type: Math.floor(Math.random() * 2) // 0: green, 1: slightly yellow
            });
        }
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        this.initTrees();
        super.initSnowfall();
    }

    render(timestamp) {
        const ctx = this.ctx;
        const scale = Math.min(this.width, this.height) / 800;

        // Apply camera limits
        if (this.cameraX < -this.maxCameraOffset) this.cameraX = -this.maxCameraOffset;
        if (this.cameraX > this.maxCameraOffset) this.cameraX = this.maxCameraOffset;

        const scrollOffset = this.cameraX;

        // Apply global scale for correct drawing in logical pixels
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.drawBackground(ctx, timestamp);
        this.drawGround(ctx, scale);
        this.drawFence(ctx, scale, scrollOffset);
        this.drawTreeImages(ctx, scale, scrollOffset);
        this.drawSnowfall(ctx, timestamp);

        ctx.restore();
    }

    drawMoon(ctx, timestamp, scale) {
        const moonX = this.width * 0.85;
        const moonY = this.height * 0.15;
        const moonSize = 80 * scale;

        // Moon glow
        const glowSize = moonSize * 2.5;
        const glow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, glowSize);
        glow.addColorStop(0, 'rgba(255, 255, 220, 0.4)');
        glow.addColorStop(0.5, 'rgba(255, 255, 220, 0.1)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(moonX - glowSize, moonY - glowSize, glowSize * 2, glowSize * 2);

        // Moon
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonSize, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffe0';
        ctx.fill();

        // Moon craters
        ctx.fillStyle = 'rgba(220, 220, 200, 0.6)';
        ctx.beginPath();
        ctx.arc(moonX - moonSize * 0.3, moonY - moonSize * 0.2, moonSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(moonX + moonSize * 0.2, moonY + moonSize * 0.3, moonSize * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFlowers(ctx, timestamp, scrollOffset) {
        const sway = Math.sin(timestamp / 500) * 2;

        this.flowers.forEach(flower => {
            let screenX = flower.x - scrollOffset;
            if (screenX < -50) screenX += this.loopWidth;
            if (screenX > this.width + 50) screenX -= this.loopWidth;

            if (screenX > -50 && screenX < this.width + 50) {
                ctx.save();
                ctx.translate(screenX + sway, flower.y);

                // Stem
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 10);
                ctx.strokeStyle = '#006400';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Petals
                ctx.fillStyle = flower.color;
                if (flower.type === 0) {
                    ctx.beginPath();
                    ctx.arc(0, 0, flower.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (flower.type === 1) {
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        ctx.rotate(Math.PI * 2 / 5);
                        ctx.lineTo(0, flower.size);
                        ctx.lineTo(flower.size * 0.5, flower.size * 0.5);
                    }
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, flower.size, 0, Math.PI, false);
                    ctx.fill();
                }

                ctx.restore();
            }
        });
    }

    drawTreeImages(ctx, scale, scrollOffset) {
        this.trees.forEach(tree => {
            const img = this.images[tree.type];
            if (img && img.complete) {
                let screenX = tree.x - scrollOffset;

                // Wrap around
                if (screenX < -tree.size) screenX += this.loopWidth;
                if (screenX > this.width + tree.size) screenX -= this.loopWidth;

                if (screenX > -tree.size && screenX < this.width + tree.size) {
                    ctx.save();
                    if (tree.flip) {
                        ctx.translate(screenX + tree.size, tree.y);
                        ctx.scale(-1, 1);
                        this.drawSingleTree(ctx, img, 0, 0, tree.size);
                    } else {
                        this.drawSingleTree(ctx, img, screenX, tree.y, tree.size);
                    }
                    ctx.restore();
                }
            }
        });
    }

    drawSingleTree(ctx, img, x, bottomY, size) {
        const aspect = img.width / img.height;
        const width = size * aspect;
        const height = size;

        // x is center, bottomY is bottom
        ctx.drawImage(img, x - width / 2, bottomY - height, width, height);
    }

    drawSparkles(ctx, timestamp, scale) {
        this.sparkles.forEach(s => {
            // Update
            s.y -= s.speed * scale;
            s.x += Math.sin(timestamp / 500 + s.phase) * 0.5;
            if (s.y < 0) {
                s.y = this.height;
                s.x = Math.random() * this.width;
            }

            const twinkle = Math.abs(Math.sin(timestamp / 300 + s.phase));

            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.scale(twinkle, twinkle);

            ctx.beginPath();
            ctx.arc(0, 0, s.size * scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
            ctx.fill();

            // Cross shape for larger sparkles
            if (s.maxSize > 3) {
                ctx.beginPath();
                ctx.moveTo(-s.size * 2 * scale, 0);
                ctx.lineTo(s.size * 2 * scale, 0);
                ctx.moveTo(0, -s.size * 2 * scale);
                ctx.lineTo(0, s.size * 2 * scale);
                ctx.strokeStyle = `rgba(255, 255, 255, ${s.opacity * 0.8})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.restore();
        });
    }

    drawFireflies(ctx, timestamp, scale) {
        this.fireflies.forEach(ff => {
            // Update position
            ff.x += ff.speedX;
            ff.y += ff.speedY;

            // Bounce off edges
            if (ff.x < 0 || ff.x > this.width) ff.speedX *= -1;
            if (ff.y < 0 || ff.y > this.height) ff.speedY *= -1;

            // Glow effect
            const glow = Math.sin(timestamp / 300 + ff.phase) * 0.5 + 0.5;

            // Draw firefly glow
            const gradient = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 4 * scale);
            gradient.addColorStop(0, `rgba(200, 255, 100, ${glow})`);
            gradient.addColorStop(0.5, `rgba(150, 255, 50, ${glow * 0.3})`);
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(ff.x, ff.y, ff.size * 4 * scale, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(ff.x, ff.y, ff.size * 0.5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 200, ${glow + 0.5})`;
            ctx.fill();
        });
    }

    drawLeaves(ctx, timestamp, scale) {
        this.leaves.forEach(leaf => {
            // Update position
            leaf.y += leaf.fallSpeed * scale;
            leaf.x += Math.sin(timestamp / 1000 + leaf.wobble) * 0.5;
            leaf.rotation += leaf.rotationSpeed;

            // Reset if off screen
            if (leaf.y > this.height + 20) {
                leaf.y = -20;
                leaf.x = Math.random() * this.width;
            }

            // Draw leaf
            ctx.save();
            ctx.translate(leaf.x, leaf.y);
            ctx.rotate(leaf.rotation);

            ctx.beginPath();
            ctx.ellipse(0, 0, leaf.size * scale, leaf.size / 2 * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = leaf.type === 0 ? '#4a7c4a' : '#8b9d4a'; // Variation
            ctx.fill();

            ctx.restore();
        });
    }

    cleanup() {
        super.cleanup();
        this.trees = [];
    }

}

// Đăng ký slide
window.slideManager.addSlide(new Slide2());
