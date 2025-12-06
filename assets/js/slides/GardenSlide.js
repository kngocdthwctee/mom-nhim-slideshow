/**
 * Slide 2 - Khu vườn huyền bí phía sau
 * Vẽ khu vườn với các cây mít, xoài, ổi và hiệu ứng huyền bí
 * Version: Updated Layout with New Trees (Mit, Sau Rieng)
 */
class GardenSlide extends BaseSlide {
    constructor() {
        super();
        console.log('GardenSlide initialized - New Trees Version');
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
        this.characters = [];
        this.characterImages = [];

        // Global list split
        const total = BaseSlide.CHARACTER_NAMES.length;
        const splitIndex = Math.ceil(total / 2);
        this.characterNames = BaseSlide.CHARACTER_NAMES.slice(0, splitIndex);

        // Images
        this.images = {
            cayoi: new Image(),
            cayxoai: new Image(),
            caymit: new Image(),
            caysaurieng: new Image(),
            caychuoi: new Image(),
            caycam: new Image(),
            caytao: new Image()
        };
    }

    init(canvas, ctx) {
        // Load character images first (so onResize logic works if called)
        this.loadCharacterImages();

        super.initBase(canvas, ctx);

        // Load asset images
        this.images.cayoi.src = 'assets/images/garden/cayoi.png';
        this.images.cayxoai.src = 'assets/images/garden/cayxoai.png';
        this.images.caymit.src = 'assets/images/garden/caymit.png';
        this.images.caysaurieng.src = 'assets/images/garden/caysaurieng.png';
        this.images.caychuoi.src = 'assets/images/garden/caychuoi.png';
        this.images.caycam.src = 'assets/images/garden/caycam.png';
        this.images.caytao.src = 'assets/images/garden/caytao.png';

        this.initTrees();
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
        const allObjects = [...this.characters, ...this.trees];
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

    initTrees() {
        this.trees = [];
        const scale = this.getScale();

        // Set camera limits (Expanded map size)
        this.maxCameraOffset = 2500 * scale; // Increased from 400 to 2500

        const groundY = this.height - 100 * scale;
        const treeTypes = ['caymit', 'cayxoai', 'caysaurieng', 'cayoi', 'caychuoi', 'caycam', 'caytao'];

        // Increase number of trees for larger map
        const numTrees = 20;

        // Distribute trees across the entire extended map width
        const totalWidth = this.width + this.maxCameraOffset * 2;
        const startX = -this.maxCameraOffset;

        for (let i = 0; i < numTrees; i++) {
            const type = treeTypes[i % treeTypes.length];
            const baseSpacing = totalWidth / numTrees;
            const jitter = (Math.random() - 0.5) * (baseSpacing * 0.4);
            const x = startX + (i * baseSpacing) + jitter + baseSpacing / 2;
            const yOffset = (Math.random() * 200 - 100) * scale;
            const size = (150 + Math.random() * 20) * scale;
            const flip = Math.random() > 0.5;

            // Create Tree object
            this.trees.push(new Tree(x, groundY + yOffset, size, type, this.images, flip));
        }
    }

    loadCharacterImages() {
        this.characterImages = [];
        for (let i = 0; i < this.characterNames.length; i++) {
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

        this.characterNames.forEach((name, i) => {
            // Distribute within visible camera range
            const baseX = cameraMinX + margin + (i * baseSpacing);

            // Add jitter within safe bounds
            const jitterRange = Math.min(baseSpacing * 0.3, 30 * scale);
            const jitter = (Math.random() - 0.5) * jitterRange * 2;
            const finalX = baseX + jitter;


            const yOffset = (Math.random() * 200 - 100) * scale;

            // Create Character object
            const image = this.characterImages[i];
            this.characters.push(new Character(finalX, groundY + yOffset, charSize, image, name));
        });

        // No need to sort here, will sort with trees together
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        this.initTrees();
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

        // Apply global scale for correct drawing in logical pixels
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.drawBackground(ctx, timestamp);
        this.drawGround(ctx, scale);
        this.drawFence(ctx, scale, scrollOffset);

        // Combine all game objects and sort by depth
        const allObjects = [...this.characters, ...this.trees];
        allObjects.sort((a, b) => a.getDepth() - b.getDepth());

        // Render all objects polymorphically
        allObjects.forEach(obj => {
            obj.render(ctx, scale, scrollOffset, this.width, timestamp);
        });

        this.drawSnowfall(ctx, timestamp);

        ctx.restore();
    }

    cleanup() {
        super.cleanup();
        if (this.canvas && this.handleCanvasClick) {
            this.canvas.removeEventListener('click', this.handleCanvasClick);
        }
        this.trees = [];
        this.characters = [];
    }

}

// Đăng ký slide
window.slideManager.addSlide(new GardenSlide());
