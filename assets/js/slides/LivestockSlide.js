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
        this.characters = [];
        this.characterImages = [];

        // Character names corresponding to chr_47.png to chr_92.png
        this.characterNames = [
            "Khánh", "Leobae", "Xương", "ChíVỹ", "HVĩ", "ChúcHà", "PDan", "Út iuuu",
            "Cyshi", "Thuthu", "VũDương", "Triều", "btdung", "Cam", "TA", "emMy",
            "TấnDũng", "NhânPhan", "Boo", "Rùa", "vson", "qminh", "lhuong", "Nhoxing",
            "Chii", "Ong🐝", "xh", "Salm", "Hhung", "TrieuNam", "Gnasche?", "chịTom",
            "Ghost", "Chuột", "Tbien", "Louis", "Paw", "hphuc", "ThaoMy", "dabaly",
            "Oni", "Star", "ĐLuận", "bé7"
        ];
        this.startIndex = 47;

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

        this.loadCharacterImages();
        this.initAnimals();
        this.initCharacters();
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

    loadCharacterImages() {
        this.characterImages = [];
        for (let i = 0; i < this.characterNames.length; i++) {
            const img = new Image();
            img.src = `assets/images/characters/chr_${this.startIndex + i}.png`;
            this.characterImages.push(img);
        }
    }

    initCharacters() {
        this.characters = [];
        const scale = Math.min(this.width, this.height) / 800;

        const groundY = this.height - 100 * scale;
        const charSize = 80 * scale;
        const numChars = this.characterNames.length;
        const baseSpacing = this.width * 2.5 / numChars;

        this.characterNames.forEach((name, i) => {
            const baseX = (i * baseSpacing) + (Math.random() - 0.5) * baseSpacing * 0.7;
            const yOffset = (Math.random() * 200 - 100) * scale;

            this.characters.push({
                name: name,
                imageIndex: i,
                x: baseX,
                y: groundY + yOffset,
                size: charSize
            });
        });

        this.characters.sort((a, b) => a.y - b.y);
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

        // Combine all objects and sort by Y depth
        const allObjects = [];
        this.characters.forEach(c => allObjects.push({ type: 'char', data: c }));
        this.animals.forEach(a => allObjects.push({ type: 'animal', data: a }));
        allObjects.sort((a, b) => a.data.y - b.data.y);

        // Render in sorted order
        allObjects.forEach(obj => {
            if (obj.type === 'char') {
                const char = obj.data;
                const screenX = char.x - scrollOffset;
                if (screenX > -char.size && screenX < this.width + char.size) {
                    const img = this.characterImages[char.imageIndex];
                    if (img && img.complete) {
                        const aspect = img.width / img.height;
                        const width = char.size * aspect;
                        const height = char.size;
                        ctx.drawImage(img, screenX - width / 2, char.y - height, width, height);
                    }
                    this.drawCharacterName(ctx, char.name, screenX, char.y - char.size - 5, scale);
                }
            } else {
                const animal = obj.data;
                const img = this.images[animal.type];
                if (img && img.complete) {
                    let screenX = animal.x - scrollOffset;
                    if (screenX < -animal.size) screenX += this.loopWidth;
                    if (screenX > this.width + animal.size) screenX -= this.loopWidth;
                    if (screenX > -animal.size && screenX < this.width + animal.size) {
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
            }
        });

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

    drawCharacters(ctx, scale, scrollOffset) {
        this.characters.forEach(char => {
            const screenX = char.x - scrollOffset;

            if (screenX > -char.size && screenX < this.width + char.size) {
                const img = this.characterImages[char.imageIndex];

                if (img && img.complete) {
                    ctx.save();
                    const aspect = img.width / img.height;
                    const width = char.size * aspect;
                    const height = char.size;

                    ctx.drawImage(img, screenX - width / 2, char.y - height, width, height);
                    ctx.restore();
                }

                this.drawCharacterName(ctx, char.name, screenX, char.y - char.size - 5, scale);
            }
        });
    }

    drawCharacterName(ctx, name, x, y, scale) {
        ctx.save();
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const textWidth = ctx.measureText(name).width;
        const padding = 4 * scale;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(
            x - textWidth / 2 - padding,
            y - 18 * scale,
            textWidth + padding * 2,
            20 * scale,
            3 * scale
        );
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.fillText(name, x, y);

        ctx.restore();
    }

    cleanup() {
        super.cleanup();
        this.animals = [];
        this.characters = [];
    }
}

// Đăng ký slide
window.slideManager.addSlide(new Slide3());
