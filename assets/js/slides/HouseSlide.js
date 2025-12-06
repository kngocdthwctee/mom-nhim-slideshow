/**
 * Slide 1 - Ngôi nhà của Mom Nhím
 * Vẽ ngôi nhà sáng sủa với hiệu ứng tim bay
 */
class Slide1 extends BaseSlide {
    constructor() {
        super();
        console.log('Slide1 initialized - Interactive House Version');
        this.title = 'Ngôi nhà của Mom Nhím';
        this.content = `
            <p>Đêm Giáng Sinh, căn nhà của Mom sáng rực như được "buff ánh sáng cấp 10", đèn nhấp nháy lung linh đến mức mấy con tuần lộc bay ngang còn phải nheo mắt.</p>
            <p>Trong khi đó, tụi nhỏ thì được Mom "ưu ái" cho ở khu ngoài trời – nơi Mom gọi là "chương trình rèn luyện thể chất, tăng sức đề kháng và tận hưởng khí trời".</p>
            <p>Gió thổi phần phật, góc sân đôi khi phát ra tiếng "lách tách" lạ lạ, nhưng Mom bảo: "Không sao, không sao… tiếng thiên nhiên thôi."</p>
            <p>Ai nấy nhìn nhau kiểu: "Thiên nhiên mà biết chớp mắt hả Mom…?"</p>
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

        this.initHouses();
    }

    initHouses() {
        this.houses = [];
        const scale = Math.min(this.width, this.height) / 800;

        // Single centered house
        const groundY = this.height;
        const size = 800 * scale;

        this.houses.push({
            x: this.width / 2,
            y: groundY,
            size: size
        });

        // Set camera limits (can pan left/right a bit)
        this.maxCameraOffset = 300 * scale;
    }

    initHearts() {
        this.hearts = [];
        for (let i = 0; i < 30; i++) {
            this.hearts.push({
                x: Math.random() * this.width,
                y: this.height - Math.random() * this.height * 0.6,
                size: 8 + Math.random() * 12,
                floatSpeed: 0.3 + Math.random() * 0.5,
                wobblePhase: Math.random() * Math.PI * 2,
                opacity: 0.4 + Math.random() * 0.4
            });
        }
    }

    initFlowers() {
        this.flowers = [];
        for (let i = 0; i < 40; i++) {
            this.flowers.push({
                x: Math.random() * this.width,
                y: this.height - 80 - Math.random() * 150,
                size: 4 + Math.random() * 6,
                color: Math.random() > 0.5 ? '#ff69b4' : '#ffb6c1',
                swayPhase: Math.random() * Math.PI * 2
            });
        }
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        this.initHouses();
        super.initSnowfall();
    }

    render(timestamp) {
        const ctx = this.ctx;
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
        this.drawHouses(ctx, scale, scrollOffset);
        this.drawSnowfall(ctx, timestamp);

        ctx.restore();
    }

    drawGround(ctx, scale) {
        super.drawGround(ctx, scale, 'snow');
    }


    drawFlowers(ctx, timestamp, scrollOffset) {
        const sway = Math.sin(timestamp / 500) * 2;

        this.flowers.forEach(flower => {
            const screenX = flower.x - scrollOffset;

            if (screenX > -50 && screenX < this.width + 50) {
                ctx.save();
                ctx.translate(screenX + sway, flower.y);

                // Simple flower
                ctx.fillStyle = flower.color;
                ctx.beginPath();
                ctx.arc(0, 0, flower.size, 0, Math.PI * 2);
                ctx.fill();

                // Stem
                ctx.strokeStyle = '#4CAF50';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 10);
                ctx.stroke();

                ctx.restore();
            }
        });
    }

    drawHouses(ctx, scale, scrollOffset) {
        this.houses.forEach(house => {
            if (this.houseImage && this.houseImage.complete) {
                const screenX = house.x - scrollOffset;

                if (screenX > -house.size && screenX < this.width + house.size) {
                    this.drawSingleHouse(ctx, screenX, house.y, house.size);
                }
            }
        });
    }

    drawSingleHouse(ctx, x, bottomY, size) {
        const img = this.houseImage;
        const aspect = img.width / img.height;
        const width = size * aspect;
        const height = size;

        // Add glow
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 200, 0.3)';
        ctx.shadowBlur = 30;
        ctx.drawImage(img, x - width / 2, bottomY - height, width, height);
        ctx.restore();
    }

    drawHearts(ctx, timestamp, scrollOffset) {
        this.hearts.forEach(heart => {
            const screenX = heart.x - scrollOffset;

            if (screenX > -50 && screenX < this.width + 50) {
                // Floating animation
                const float = Math.sin(timestamp / 1000 + heart.wobblePhase) * 20;
                const wobble = Math.sin(timestamp / 500 + heart.wobblePhase) * 5;

                this.drawHeart(ctx, screenX + wobble, heart.y + float, heart.size, heart.opacity);
            }
        });
    }

    drawHeart(ctx, x, y, size, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size / 2, -size / 3, -size, size / 3, 0, size);
        ctx.bezierCurveTo(size, size / 3, size / 2, -size / 3, 0, size * 0.3);
        ctx.fillStyle = `rgba(255, 100, 120, ${opacity})`;
        ctx.fill();
        ctx.restore();
    }

    cleanup() {
        super.cleanup();
        this.houses = [];
    }
}

// Đăng ký slide
window.slideManager.addSlide(new Slide1());
