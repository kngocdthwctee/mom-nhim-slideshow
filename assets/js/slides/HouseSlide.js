/**
 * Slide 1 - Ngôi nhà của Nhím
 * Vẽ ngôi nhà sáng sủa với hiệu ứng tim bay
 */
class HouseSlide extends BaseSlide {
    constructor() {
        super();
        console.log('HouseSlide initialized - Interactive House Version');
        this.title = 'Ngôi nhà của NhímNhor';

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

        // Load character image
        this.momImage = new Image();
        this.momImage.src = 'assets/images/characters/chr_106.png';

        this.initCharacters();
        this.initHouses();
        this.initDialogueSystem();

        // Add click handler for GameObjects
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        canvas.addEventListener('click', this.handleCanvasClick);

        // Start dialogue after a short delay
        setTimeout(() => this.startDialogue(), 2000);
    }

    /**
     * Initialize the dialogue system with scripted conversations
     */
    initDialogueSystem() {
        this.dialogueScript = [
            // Conversation 1: Greetings
            { character: "Pun", message: "hi mum 👋" },
            { character: "NhímNhor", message: "hi pun 😊" },
            { character: "qn", message: "hi mum 👋" },
            { character: "NhímNhor", message: "hi qn 😊" },
            { character: "Pun", message: "hi qn iuu 💕" },
            { character: "qn", message: "hi iuuuu 💖" },

            // Pause between conversations
            { character: null, message: null, delay: 3000 },

            // Conversation 2: About the house
            { character: "Pun", message: "nhà đẹp zạ 🏠✨" },
            { character: "NhímNhor", message: "nhà mum mà lại 😏" },
            { character: "qn", message: "bé mun zô nhà 🥺" },
            { character: "Pun", message: "bé cũng z 🥺" },
            { character: "NhímNhor", message: "nhà này của mum 🏠" },
            { character: "NhímNhor", message: "chỉ mik mum ở 😤" },
            { character: "Pun", message: "ik mò 😢" },
            { character: "NhímNhor", message: "mấy đứa ra vườn ở đi 👉🌳" },
            { character: "qn", message: "ik mò mum 😭" }
        ];

        this.currentDialogueIndex = 0;
        this.dialogueTimer = null;
        this.isDialogueRunning = false;
    }

    /**
     * Start playing the dialogue script
     */
    startDialogue() {
        if (this.isDialogueRunning) return;
        this.isDialogueRunning = true;
        this.currentDialogueIndex = 0;
        this.playNextDialogue();
    }

    /**
     * Play the next line of dialogue
     */
    playNextDialogue() {
        if (!this.isDialogueRunning) return;
        if (this.currentDialogueIndex >= this.dialogueScript.length) {
            // Stop dialogue when finished
            this.isDialogueRunning = false;
            return;
        }

        const line = this.dialogueScript[this.currentDialogueIndex];
        this.currentDialogueIndex++;

        // Handle pause lines
        if (line.character === null) {
            this.dialogueTimer = setTimeout(() => this.playNextDialogue(), line.delay || 2000);
            return;
        }

        // Find the character and make them speak
        const character = this.characters.find(c => c.name === line.character);
        if (character) {
            character.showChat(line.message, 2500);
        }

        // Schedule next dialogue line
        const delay = line.delay || 2500;
        this.dialogueTimer = setTimeout(() => this.playNextDialogue(), delay);
    }

    /**
     * Stop the dialogue system
     */
    stopDialogue() {
        this.isDialogueRunning = false;
        if (this.dialogueTimer) {
            clearTimeout(this.dialogueTimer);
            this.dialogueTimer = null;
        }
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
        let groundY = this.height - 150 * scale; // Slightly above bottom
        const size = 150 * scale;

        // Load character images
        if (!this.punImage) {
            this.punImage = new Image();
            this.punImage.src = 'assets/images/characters/chr_1.png';
        }
        if (!this.qnImage) {
            this.qnImage = new Image();
            this.qnImage.src = 'assets/images/characters/chr_5.png';
        }

        // Add "Nhím - Mom" character
        // Positioned slightly to the left of the house center
        const momX = this.width / 2 - 100 * scale;

        const momChar = new Character(momX, groundY, size, this.momImage, "NhímNhor", [
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

        groundY += 100 * scale;

        // Add "Pun" character - positioned to the right of the house
        const punX = this.width / 2 + 70 * scale;
        const punChar = new Character(punX, groundY, size, this.punImage, "Pun",
            ["hi mum", "mum cho bé zô nhà nho", "ik mò", "nhà đẹp zạ", "hi qn iuu"],
            [],
            []
        );
        this.characters.push(punChar);

        // Add "qn" character - positioned to the far right
        const qnX = this.width / 2 + 150 * scale;
        const qnChar = new Character(qnX, groundY, size, this.qnImage, "qn",
            ["bé mún zô nhà", "iu pun", "mum cho bé vs pun zô nhà ik mò"],
            [],
            []
        );
        this.characters.push(qnChar);
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
        this.stopDialogue(); // Stop dialogue when leaving slide
        this.houses = [];
        this.characters = [];
        if (this.handleCanvasClick) {
            this.canvas.removeEventListener('click', this.handleCanvasClick);
        }
    }
}

// Đăng ký slide
window.slideManager.addSlide(new HouseSlide());
