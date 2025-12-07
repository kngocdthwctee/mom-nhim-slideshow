/**
 * Slide 3 - Khu chuồng trại chăn nuôi
 * Vẽ chuồng trại với các con vật: gà, lợn, bò, trâu
 */
class LivestockSlide extends BaseSlide {
    constructor() {
        super();
        console.log('LivestockSlide initialized - Livestock Pen Version');
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
        this.characters = [];
        this.characterImages = [];

        this.butterflies = [];
        this.initButterflies();

        // Global list split
        const total = BaseSlide.CHARACTERS.length;
        const splitIndex = Math.ceil(total / 2);

        this.startIndex = splitIndex;
        this.characterNames = BaseSlide.CHARACTERS.slice(splitIndex);

        // Images
        this.images = {
            conga: new Image(),
            conlon: new Image(),
            conbo: new Image(),
            contrau: new Image()
        };
    }

    init(canvas, ctx) {
        // Load character images first to prevent errors in onResize
        this.loadCharacterImages();

        super.initBase(canvas, ctx);

        // Load images
        this.images.conga.src = 'assets/images/livestock/conga.png';
        this.images.conlon.src = 'assets/images/livestock/conlon.png';
        this.images.conbo.src = 'assets/images/livestock/conbo.png';
        this.images.contrau.src = 'assets/images/livestock/contrau.png';

        this.initAnimals();
        this.initCharacters();

        // Add click handler for GameObjects
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        canvas.addEventListener('click', this.handleCanvasClick);
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
        const allObjects = [...this.characters, ...this.animals];
        allObjects.sort((a, b) => a.getDepth() - b.getDepth());
        for (let i = allObjects.length - 1; i >= 0; i--) {
            const obj = allObjects[i];
            const screenX = obj.getScreenX(scrollOffset, this.width);
            if (screenX !== null && obj.isPointInside(x, y, screenX)) {
                obj.onClick();
                break; // Only trigger first clicked object
            }
        }
    }

    initAnimals() {
        this.animals = [];
        const scale = this.getScale();

        // Set camera limits (Expanded map size)
        this.maxCameraOffset = 2500 * scale; // Increased from 400 to 2500

        const groundY = this.height - 100 * scale;

        const animalTypes = ['conga', 'conlon', 'conbo', 'contrau'];

        // Increase number of animals for larger map
        const numAnimals = 20;

        // Distribute animals across the entire extended map width
        const totalWidth = this.width + this.maxCameraOffset * 2;
        const startX = -this.maxCameraOffset;

        for (let i = 0; i < numAnimals; i++) {
            const type = animalTypes[i % animalTypes.length];
            const baseSpacing = totalWidth / numAnimals;

            // Add jitter to X but ensure minimal spacing
            const jitter = (Math.random() - 0.5) * (baseSpacing * 0.4);
            const x = startX + (i * baseSpacing) + jitter + baseSpacing / 2;

            const yOffset = (Math.random() * 150 - 75) * scale;
            const size = (80 + Math.random() * 20) * scale;
            const flip = Math.random() > 0.5;
            const bobPhase = Math.random() * Math.PI * 2;

            // Create Animal object
            this.animals.push(new Animal(x, groundY + yOffset, size, type, this.images, flip, bobPhase));
        }

        // No need to sort here, will sort with characters together
    }

    loadCharacterImages() {
        this.characterImages = [];
        for (let i = 0; i < BaseSlide.CHARACTERS.length; i++) {
            const img = new Image();
            img.src = `assets/images/characters/chr_${i}.png`;
            this.characterImages.push(img);
        }
    }

    initCharacters() {
        this.characters = [];
        const scale = this.getScale();

        const groundY = this.height - 100 * scale;
        const charSize = 120 * scale;
        const numChars = this.characterNames.length;
        // Define visible camera range
        const cameraMinX = -this.maxCameraOffset;
        const cameraMaxX = this.width + this.maxCameraOffset;
        const visibleWidth = cameraMaxX - cameraMinX;

        // Add margins to prevent characters from being cut off
        const margin = charSize;
        const usableWidth = visibleWidth - margin * 2;
        const baseSpacing = usableWidth / (numChars - 1);

        this.characterNames.forEach((characterData, i) => {
            // Distribute within visible camera range
            const baseX = cameraMinX + margin + (i * baseSpacing);

            // Add jitter within safe bounds
            const jitterRange = Math.min(baseSpacing * 0.3, 30 * scale);
            const jitter = (Math.random() - 0.5) * jitterRange * 2;
            const finalX = baseX + jitter;


            const yOffset = (Math.random() * 200 - 100) * scale;

            // Create Character object
            const image = this.characterImages[characterData.avatar];

            const character = new Character(finalX, groundY + yOffset, charSize, image, characterData.name, characterData.messages);
            this.characters.push(character);
        });

        // No need to sort here, will sort with animals together
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
        this.initCharacters();
        super.initSnowfall();
    }

    render(timestamp) {
        const ctx = this.ctx;
        const scale = this.getScale();

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

        // Combine all game objects and sort by depth
        const allObjects = [...this.characters, ...this.animals];
        allObjects.sort((a, b) => a.getDepth() - b.getDepth());

        // Render all objects polymorphically
        allObjects.forEach(obj => {
            obj.render(ctx, scale, scrollOffset, this.width, timestamp);
        });

        this.drawSnowfall(ctx, timestamp);

        ctx.restore();
    }

    drawGround(ctx, scale) {
        super.drawGround(ctx, scale, 'brown');
    }

    cleanup() {
        super.cleanup();
        if (this.canvas && this.handleCanvasClick) {
            this.canvas.removeEventListener('click', this.handleCanvasClick);
        }
        this.animals = [];
        this.characters = [];
    }
}

// Đăng ký slide
window.slideManager.addSlide(new LivestockSlide());
