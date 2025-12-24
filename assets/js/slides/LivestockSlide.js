/**
 * Slide 3 - Khu chuồng trại chăn nuôi
 * Vẽ chuồng trại với các con vật: gà, lợn, bò, trâu
 */
class LivestockSlide extends BaseSlide {
    constructor() {
        super();
        console.log('LivestockSlide initialized - Livestock Pen Version');
        this.title = 'Khu sinh hoạt chung';

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

        const animalTypes = [{
            type: 'conga',
            sound: 'assets/sounds/chicken-cluking.mp3'
        }, {
            type: 'conlon',
            sound: 'assets/sounds/pig.mp3'
        }, {
            type: 'conbo',
            sound: 'assets/sounds/cow-mooing.mp3'
        }, {
            type: 'contrau',
            sound: 'assets/sounds/ox_mooing.mp3'
        }];

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
            const image = this.images[type.type];

            // Create Animal object
            this.animals.push(new Animal(x, groundY + yOffset, size, type.type, image, flip, bobPhase, type.sound));
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

            const character = new Character(finalX, groundY + yOffset, charSize, image, characterData.name, characterData.messages, [], [], characterData.sound);
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

    /**
     * Custom background: Warm rustic farm with golden hour lighting
     */
    drawBackground(ctx, timestamp) {
        // Golden hour gradient sky
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#93c5fd');   // blue-300
        gradient.addColorStop(0.3, '#bfdbfe'); // blue-200
        gradient.addColorStop(0.5, '#fef3c7'); // amber-100
        gradient.addColorStop(0.7, '#fde68a'); // amber-200
        gradient.addColorStop(1, '#fcd34d');   // amber-300
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw soft clouds
        this.drawClouds(ctx, timestamp);

        // Warm golden sun
        const sunX = this.width * 0.75;
        const sunY = this.height * 0.22;
        const sunRadius = 50;

        // Sun glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
        sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
        sunGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.2)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(sunX - sunRadius * 4, sunY - sunRadius * 4, sunRadius * 8, sunRadius * 8);

        // Sun
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGradient.addColorStop(0, '#fef3c7');
        sunGradient.addColorStop(0.7, '#fcd34d');
        sunGradient.addColorStop(1, '#f59e0b');
        ctx.fillStyle = sunGradient;
        ctx.fill();
    }

    /**
     * Draw soft fluffy clouds
     */
    drawClouds(ctx, timestamp) {
        if (!this.clouds) {
            this.clouds = [
                { x: this.width * 0.15, y: this.height * 0.15, scale: 1 },
                { x: this.width * 0.45, y: this.height * 0.1, scale: 1.2 },
                { x: this.width * 0.85, y: this.height * 0.12, scale: 0.8 }
            ];
        }

        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#ffffff';

        this.clouds.forEach(cloud => {
            const drift = Math.sin(timestamp / 5000) * 10;
            const x = cloud.x + drift;
            const y = cloud.y;
            const s = cloud.scale * 30;

            // Draw cloud using overlapping circles
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.arc(x + s * 1.2, y - s * 0.2, s * 0.9, 0, Math.PI * 2);
            ctx.arc(x + s * 2.2, y, s * 0.8, 0, Math.PI * 2);
            ctx.arc(x + s * 0.6, y - s * 0.5, s * 0.7, 0, Math.PI * 2);
            ctx.arc(x + s * 1.5, y - s * 0.4, s * 0.6, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
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
