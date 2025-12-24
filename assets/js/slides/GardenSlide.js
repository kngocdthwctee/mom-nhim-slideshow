/**
 * Slide 2 - Khu vườn huyền bí phía sau
 * Vẽ khu vườn với các cây mít, xoài, ổi và hiệu ứng huyền bí
 * Version: Updated Layout with New Trees (Mit, Sau Rieng)
 */
class GardenSlide extends BaseSlide {
    constructor() {
        super();
        console.log('GardenSlide initialized - New Trees Version');
        this.title = 'Khu vườn huyền bí';

        // Enable camera panning
        this.cameraEnabled = true;

        this.trees = [];
        this.characters = [];
        this.characterImages = [];

        // Global list split
        const total = BaseSlide.CHARACTERS.length;
        const splitIndex = Math.ceil(total / 2);
        this.characterNames = BaseSlide.CHARACTERS.slice(0, splitIndex);

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

        // Set camera limits (Expanded map size with Y panning and zoom)
        this.maxCameraOffset = 2500 * scale;
        this.maxCameraOffsetX = 2500 * scale;
        this.maxCameraOffsetY = 300 * scale;

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
            const image = this.images[type];
            const tree = new Tree(x, groundY + yOffset, size, type, image, flip);
            this.trees.push(tree);
        }
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
            const character = new Character(finalX, groundY + yOffset, charSize, image, characterData.name, characterData.messages, characterData.giftMessages, characterData.noGiftMessages, characterData.sound);

            if (characterData.treeOwner) {
                this.trees.filter(tree => tree.type == characterData.treeOwner).forEach(tree => {
                    tree.owner = character;
                });
            }

            this.characters.push(character);
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

        // Apply camera limits (using clampCamera from BaseSlide)
        this.clampCamera();

        const scrollOffset = this.cameraX;

        // Apply camera transform (handles DPI, zoom, and pan)
        ctx.save();
        this.applyCameraTransform(ctx);

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

    /**
     * Custom background: Magical enchanted garden with sparkles
     */
    drawBackground(ctx, timestamp) {
        // Blue sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');   // Light sky blue
        gradient.addColorStop(0.3, '#bae6fd'); // sky-200
        gradient.addColorStop(0.6, '#e0f2fe'); // sky-100
        gradient.addColorStop(1, '#f0fdf4');   // green-50 (blends with grass)
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Golden sun with warm glow
        const sunX = this.width * 0.8;
        const sunY = this.height * 0.2;
        const sunRadius = 45;

        // Sun glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
        sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.5)');
        sunGlow.addColorStop(0.4, 'rgba(253, 224, 71, 0.2)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(sunX - sunRadius * 4, sunY - sunRadius * 4, sunRadius * 8, sunRadius * 8);

        // Sun
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#fcd34d';
        ctx.fill();

        // Draw sparkles
        this.drawSparkles(ctx, timestamp);
    }

    /**
     * Draw magical sparkle particles
     */
    drawSparkles(ctx, timestamp) {
        if (!this.sparkles) {
            this.sparkles = [];
            for (let i = 0; i < 30; i++) {
                this.sparkles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height * 0.6,
                    size: 2 + Math.random() * 4,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random()
                });
            }
        }

        ctx.save();
        this.sparkles.forEach(sparkle => {
            // Twinkle effect
            const twinkle = (Math.sin(timestamp / 300 + sparkle.phase) + 1) / 2;
            if (twinkle < 0.3) return;

            ctx.globalAlpha = twinkle * 0.8;

            // Draw star shape
            ctx.save();
            ctx.translate(sparkle.x, sparkle.y);

            // 4-point star
            ctx.beginPath();
            const size = sparkle.size * twinkle;
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.3, -size * 0.3);
            ctx.lineTo(size, 0);
            ctx.lineTo(size * 0.3, size * 0.3);
            ctx.lineTo(0, size);
            ctx.lineTo(-size * 0.3, size * 0.3);
            ctx.lineTo(-size, 0);
            ctx.lineTo(-size * 0.3, -size * 0.3);
            ctx.closePath();

            ctx.fillStyle = '#fef08a';
            ctx.fill();

            ctx.restore();
        });
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
