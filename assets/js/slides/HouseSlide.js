/**
 * Slide 1 - Ngôi nhà của Mom Nhím
 * Vẽ ngôi nhà sáng sủa với hiệu ứng tim bay
 */
class HouseSlide extends BaseSlide {
    constructor() {
        super();
        console.log('HouseSlide initialized - Interactive House Version');
        this.title = 'Ngôi nhà của Mom Nhím';
        this.content = `
            <p>Giáng Sinh tới, nhà <span class="highlight">Mom Nhím</span> sáng rực như bật max đồ họa.</p>
            <p>Đèn treo khắp nơi, trong nhà ấm áp, thơm mùi bánh.</p>
            <p>Còn tụi nhỏ thì sao? Mom cho ra <span class="highlight">ở ngoài trời</span> hết.</p>
            <p>Mom nói rất tỉnh: <span class="character">"Ra đây cho mát, cho khỏe, cho… quen gió quen sương."</span></p>
            <p>Gió thổi cái vèo. Tụi nhỏ nhìn nhau:</p>
            <p><span class="highlight">Ủa Giáng Sinh hay trại huấn luyện phiên bản huyền bí vậy Mom?</span></p>
        `;

        this.houses = [];

        // Enable camera panning
        this.cameraEnabled = true;

        // House image
        this.houseImage = new Image();
    }

    init(canvas, ctx) {
        super.initBase(canvas, ctx);

        // Load house image
        this.houseImage.src = 'assets/images/house/house.png';

        // Load character image (Nhím - Mom)
        this.momImage = new Image();
        this.momImage.src = 'assets/images/characters/chr_106.png';

        this.initCharacters();
        this.initHouses();

        // Add click handler for GameObjects
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        canvas.addEventListener('click', this.handleCanvasClick);
    }

    initHouses() {
        this.houses = [];
        const scale = this.getScale();

        // Single centered house
        const groundY = this.height;
        const size = 800 * scale;

        // Create House object
        const house = new House(this.width / 2, groundY, size, this.houseImage, this.characters[0]);
        this.houses.push(house);

        // Set camera limits (can pan left/right a bit)
        this.maxCameraOffset = 300 * scale;
    }

    initCharacters() {
        this.characters = [];
        const scale = this.getScale();
        const groundY = this.height - 150 * scale; // Slightly above bottom
        const size = 150 * scale;

        // Add "Nhím - Mom" character
        // Positioned slightly to the right of the house center
        const x = this.width / 2 - 100 * scale;

        const momChar = new Character(x, groundY, size, this.momImage, "Nhím - Mom", [
            "Chào bạn! 👋",
            "Hôm nay thật đẹp trời! ☀️",
            "Mình đang bận quá! 😅",
            "Được nghỉ rồi! 🎉",
            "Đi chơi không? 🎈",
            "Mệt quá! 😴",
            "Vui quá! 😊",
            "Làm gì thế?  🤔",
            "Ăn gì đây? 🍰",
            "Tuyệt vời! ⭐",
            "Hehe 😄",
            "À... 😯",
            "Ồ! 😲",
            "Được rồi! 👍"
        ]);
        this.characters.push(momChar);
    }

    /**
     * Handle canvas click to detect object clicks
     * @param {MouseEvent} e - Mouse event
     */
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width) / window.devicePixelRatio;
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height) / window.devicePixelRatio;

        const scrollOffset = Math.max(-this.maxCameraOffset, Math.min(this.maxCameraOffset, this.cameraX));
        // Check all objects (reverse order to click frontmost first)
        const allObjects = [...this.houses, ...this.characters];
        // allObjects.sort((a, b) => a.getDepth() - b.getDepth());
        for (let i = allObjects.length - 1; i >= 0; i--) {
            const obj = allObjects[i];
            const screenX = obj.getScreenX(scrollOffset, this.width);
            if (screenX !== null && obj.isPointInside(x, y, screenX)) {
                obj.onClick();
                break; // Only trigger first clicked object
            }
        }
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        this.initCharacters(); // Re-init characters on resize
        this.initHouses();
        super.initSnowfall();
    }

    render(timestamp) {
        const ctx = this.ctx;
        const scale = this.getScale();

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

        // Render houses first (background layer)
        if (this.houses) {
            this.houses.forEach(house => {
                house.render(ctx, scale, scrollOffset, this.width, timestamp);
            });
        }

        // Render characters (middle layer)
        if (this.characters) {
            this.characters.forEach(char => {
                char.render(ctx, scale, scrollOffset, this.width, timestamp);
            });
        }
        this.drawSnowfall(ctx, timestamp);

        ctx.restore();
    }

    drawGround(ctx, scale) {
        super.drawGround(ctx, scale, 'snow');
    }

    /**
     * Custom background: Soft pink winter morning with cherry blossoms
     */
    drawBackground(ctx, timestamp) {
        // Pink gradient sky
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#fce7f3');   // pink-100
        gradient.addColorStop(0.4, '#fbcfe8'); // pink-200
        gradient.addColorStop(0.7, '#fff1f2'); // rose-50
        gradient.addColorStop(1, '#fdf2f8');   // pink-50
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Soft pink sun with glow
        const sunX = this.width * 0.85;
        const sunY = this.height * 0.18;
        const sunRadius = 50;

        // Sun glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.5);
        sunGlow.addColorStop(0, 'rgba(251, 207, 232, 0.6)');
        sunGlow.addColorStop(0.5, 'rgba(251, 207, 232, 0.2)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(sunX - sunRadius * 3, sunY - sunRadius * 3, sunRadius * 6, sunRadius * 6);

        // Sun
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGradient.addColorStop(0, '#fef3c7');
        sunGradient.addColorStop(1, '#fcd34d');
        ctx.fillStyle = sunGradient;
        ctx.fill();

        // Cherry blossom petals (sakura)
        this.drawSakuraPetals(ctx, timestamp);
    }

    /**
     * Draw floating sakura petals
     */
    drawSakuraPetals(ctx, timestamp) {
        if (!this.sakuraPetals) {
            this.sakuraPetals = [];
            for (let i = 0; i < 25; i++) {
                this.sakuraPetals.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height * 0.7,
                    size: 4 + Math.random() * 6,
                    rotation: Math.random() * Math.PI * 2,
                    speed: 0.3 + Math.random() * 0.5,
                    drift: (Math.random() - 0.5) * 0.8,
                    rotationSpeed: (Math.random() - 0.5) * 0.02
                });
            }
        }

        ctx.save();
        this.sakuraPetals.forEach(petal => {
            // Update position
            petal.y += petal.speed;
            petal.x += Math.sin(timestamp / 1000 + petal.rotation) * petal.drift;
            petal.rotation += petal.rotationSpeed;

            // Reset if off screen
            if (petal.y > this.height * 0.7) {
                petal.y = -10;
                petal.x = Math.random() * this.width;
            }

            // Draw petal
            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.rotation);
            ctx.globalAlpha = 0.7;

            // Petal shape (ellipse-like)
            ctx.beginPath();
            ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#f9a8d4';
            ctx.fill();

            ctx.restore();
        });
        ctx.restore();
    }

    cleanup() {
        super.cleanup();
        this.houses = [];
        this.characters = [];
        if (this.handleCanvasClick) {
            this.canvas.removeEventListener('click', this.handleCanvasClick);
        }
    }
}

// Đăng ký slide
window.slideManager.addSlide(new HouseSlide());
