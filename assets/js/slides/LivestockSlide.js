/**
 * Slide 3 - Khu chuồng trại chăn nuôi
 * Vẽ chuồng trại với các con vật: gà, lợn, bò, trâu
 */
class Slide3 extends BaseSlide {
    constructor() {
        super();
        console.log('Slide3 initialized - Livestock Pen Version');
        this.title = 'Khu chuồng trại';
        this.content = `
            <p>Phía bên là khu chuồng trại Mom chăm sóc: </p>
            <p>gà thì cứ chạy linh tinh, lợn thì nằm ườn ra, </p>
            <p>bò và trâu thì đang nhai cỏ nhìn mọi người.</p>
            <p>Thỉnh thoảng có tiếng "cục ta" của gà, "ủn ỉn" của lợn tạo không khí ồn ã nhưng vui vẻ.</p>
            <p>Mom thích nhất là ngồi đây vừa xem mấy con vật vừa tám chuyện!</p>
        `;

        // Enable camera panning
        this.cameraEnabled = true;

        this.animals = [];

        // Images
        this.images = {
            conga: new Image(),
            conlon: new Image(),
            conbo: new Image(),
            contrau: new Image()
        };
    }

    init(canvas, ctx) {
        super.initBase(canvas, ctx);

        // Load images
        this.images.conga.src = 'assets/images/livestock/conga.png';
        this.images.conlon.src = 'assets/images/livestock/conlon.png';
        this.images.conbo.src = 'assets/images/livestock/conbo.png';
        this.images.contrau.src = 'assets/images/livestock/contrau.png';

        this.initAnimals();
    }

    initAnimals() {
        this.animals = [];
        const scale = Math.min(this.width, this.height) / 800;

        // Set camera limits
        this.maxCameraOffset = 400 * scale;

        const groundY = this.height - 100 * scale;

        const animalTypes = ['conga', 'conlon', 'conbo', 'contrau'];
        const numAnimals = 10;
        const baseSpacing = this.width / numAnimals;

        for (let i = 0; i < numAnimals; i++) {
            const type = animalTypes[i % animalTypes.length];

            // Add jitter to X but ensure minimal spacing
            const jitter = (Math.random() - 0.5) * (baseSpacing * 0.3);
            const x = (i * baseSpacing) + jitter;

            // Random Y offset for depth
            const yOffset = (Math.random() * 150 - 75) * scale;
            const size = (150 + Math.random() * 80) * scale;

            this.animals.push({
                type: type,
                x: x,
                y: groundY + yOffset,
                size: size,
                flip: Math.random() > 0.5,
                bobPhase: Math.random() * Math.PI * 2
            });
        }

        // Sort animals by Y coordinate for proper depth
        this.animals.sort((a, b) => a.y - b.y);
    }

    initGrass() {
        this.grass = [];
        for (let i = 0; i < 80; i++) {
            this.grass.push({
                x: Math.random() * this.width,
                y: this.height - 100 - Math.random() * 200,
                sway: Math.random() * Math.PI * 2,
                height: 10 + Math.random() * 15
            });
        }
    }

    initButterflies() {
        this.butterflies = [];
        for (let i = 0; i < 5; i++) {
            this.butterflies.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height * 0.6,
                phase: Math.random() * Math.PI * 2,
                speed: 1 + Math.random()
            });
        }
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        this.initAnimals();
        super.initSnowfall();
    }

    render(timestamp) {
        const ctx = this.ctx;
        const scale = Math.min(this.width, this.height) / 800;

        // Apply camera limits
        if (this.cameraX < -this.maxCameraOffset) this.cameraX = -this.maxCameraOffset;
        if (this.cameraX > this.maxCameraOffset) this.cameraX = this.maxCameraOffset;

        const scrollOffset = this.cameraX;

        // Apply global scale
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.drawBackground(ctx);
        this.drawGround(ctx, scale);
        this.drawFence(ctx, scale, scrollOffset);
        this.drawAnimals(ctx, scale, scrollOffset, timestamp);
        this.drawSnowfall(ctx, timestamp);

        ctx.restore();
    }

    drawGround(ctx, scale) {
        super.drawGround(ctx, scale, 'brown');
    }


    drawAnimals(ctx, scale, scrollOffset, timestamp) {
        this.animals.forEach(animal => {
            const img = this.images[animal.type];
            if (img && img.complete) {
                let screenX = animal.x - scrollOffset;

                // Wrap around
                if (screenX < -animal.size) screenX += this.loopWidth;
                if (screenX > this.width + animal.size) screenX -= this.loopWidth;

                if (screenX > -animal.size && screenX < this.width + animal.size) {
                    // Small bobbing animation
                    const bob = Math.sin(timestamp / 1000 + animal.bobPhase) * 3;

                    ctx.save();
                    if (animal.flip) {
                        ctx.translate(screenX + animal.size, animal.y + bob);
                        ctx.scale(-1, 1);
                        this.drawSingleAnimal(ctx, img, 0, 0, animal.size);
                    } else {
                        this.drawSingleAnimal(ctx, img, screenX, animal.y + bob, animal.size);
                    }
                    ctx.restore();
                }
            }
        });
    }

    drawSingleAnimal(ctx, img, x, bottomY, size) {
        const aspect = img.width / img.height;
        const width = size * aspect;
        const height = size;

        ctx.drawImage(img, x - width / 2, bottomY - height, width, height);
    }

    drawButterflies(ctx, timestamp, scale) {
        this.butterflies.forEach(b => {
            b.x += Math.cos(timestamp / 1000 + b.phase) * b.speed;
            b.y += Math.sin(timestamp / 800 + b.phase) * 0.5;

            // Wrap around
            if (b.x > this.width + 20) b.x = -20;
            if (b.x < -20) b.x = this.width + 20;
            if (b.y > this.height) b.y = 0;
            if (b.y < 0) b.y = this.height;

            const wingFlap = Math.abs(Math.sin(timestamp / 100 + b.phase));

            ctx.save();
            ctx.translate(b.x, b.y);

            // Simple butterfly shape
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.ellipse(-3 * scale, 0, 4 * scale * wingFlap, 6 * scale, -0.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(3 * scale, 0, 4 * scale * wingFlap, 6 * scale, 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Body
            ctx.fillStyle = '#000';
            ctx.fillRect(-1, -3 * scale, 2, 6 * scale);

            ctx.restore();
        });
    }

    cleanup() {
        super.cleanup();
        this.animals = [];
    }
}

// Đăng ký slide
window.slideManager.addSlide(new Slide3());
