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
