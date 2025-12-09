/**
 * BaseSlide - Base class for all slides
 * Contains common functionality like sky, ground, fence, and camera controls
 */
class BaseSlide {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;

        // Camera control
        this.cameraEnabled = true; // Default: camera enabled
        this.cameraX = 0;
        this.isDragging = false;
        this.lastMouseX = 0;

        // Bind events
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        // Snowfall effect
        this.snowflakes = [];
    }

    initBase(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width / window.devicePixelRatio;
        this.height = canvas.height / window.devicePixelRatio;

        // Initialize snowfall
        this.initSnowfall();

        // Add event listeners only if camera is enabled
        if (this.cameraEnabled) {
            canvas.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);

            canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
            window.addEventListener('touchmove', this.onTouchMove, { passive: false });
            window.addEventListener('touchend', this.onTouchEnd);
        }
    }

    // Input Handling
    onMouseDown(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        const delta = (e.clientX - this.lastMouseX);
        this.cameraX -= delta;
        this.lastMouseX = e.clientX;
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onTouchStart(e) {
        if (e.touches.length > 0) {
            this.isDragging = true;
            this.lastMouseX = e.touches[0].clientX;
        }
    }

    onTouchMove(e) {
        if (!this.isDragging) return;
        if (e.touches.length > 0) {
            e.preventDefault();
            const delta = (e.touches[0].clientX - this.lastMouseX);
            this.cameraX -= delta;
            this.lastMouseX = e.touches[0].clientX;
        }
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    drawBackground(ctx, timestamp) {
        // Day sky (matching Slide3)
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#B0E0E6');
        gradient.addColorStop(1, '#98D8C8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Sun
        const sunX = this.width * 0.8;
        const sunY = this.height * 0.2;
        const sunRadius = 40;

        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2);
        sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        sunGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.1)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(sunX - sunRadius * 2, sunY - sunRadius * 2, sunRadius * 4, sunRadius * 4);

        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }

    // Common rendering methods
    drawSky(ctx) {
        // Day sky
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#B0E0E6');
        gradient.addColorStop(1, '#98D8C8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Sun
        const sunX = this.width * 0.8;
        const sunY = this.height * 0.2;
        const sunRadius = 40;

        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2);
        sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        sunGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.1)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(sunX - sunRadius * 2, sunY - sunRadius * 2, sunRadius * 4, sunRadius * 4);

        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }

    drawGround(ctx, scale, groundColor = null) {
        const groundY = this.height - 250 * scale;

        // Use custom color or default green
        const gradient = ctx.createLinearGradient(0, groundY, 0, this.height);
        if (groundColor === 'snow') {
            gradient.addColorStop(0, '#e8f4f8');
            gradient.addColorStop(0.5, '#d5e8f0');
            gradient.addColorStop(1, '#c5dde8');
        } else if (groundColor === 'brown') {
            gradient.addColorStop(0, '#8B7355');
            gradient.addColorStop(0.5, '#A0826D');
            gradient.addColorStop(1, '#6F5E4C');
        } else {
            // Default green
            gradient.addColorStop(0, '#2d5016');
            gradient.addColorStop(0.5, '#3d6b1f');
            gradient.addColorStop(1, '#1f3a0f');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(-10000, groundY, 20000, this.height - groundY + 500);
    }

    drawFence(ctx, scale, scrollOffset) {
        const fenceY = this.height - 250 * scale;
        const postSpacing = 80 * scale;
        const postHeight = 70 * scale;
        const postWidth = 8 * scale;

        ctx.strokeStyle = '#8B4513';
        ctx.fillStyle = '#8B4513';
        ctx.lineWidth = 5 * scale;
        ctx.lineCap = 'round';

        const patternOffset = scrollOffset % postSpacing;

        // Fence posts
        for (let x = -patternOffset - postSpacing; x <= this.width + postSpacing; x += postSpacing) {
            ctx.fillRect(x - postWidth / 2, fenceY - postHeight, postWidth, postHeight);
        }

        // Horizontal rails
        const railHeight = 5 * scale;
        ctx.fillRect(-5000, fenceY - postHeight * 0.7, this.width + 10000, railHeight);
        ctx.fillRect(-5000, fenceY - postHeight * 0.3, this.width + 10000, railHeight);
    }

    initSnowfall() {
        this.snowflakes = [];
        for (let i = 0; i < 100; i++) {
            this.snowflakes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 1 + 0.5,
                drift: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.6 + 0.4
            });
        }
    }

    drawSnowfall(ctx, timestamp) {
        this.snowflakes.forEach(flake => {
            // Update position
            flake.y += flake.speed;
            flake.x += Math.sin(timestamp / 1000 + flake.y) * flake.drift;

            // Reset if off screen
            if (flake.y > this.height) {
                flake.y = -10;
                flake.x = Math.random() * this.width;
            }
            if (flake.x < 0) flake.x = this.width;
            if (flake.x > this.width) flake.x = 0;

            // Draw snowflake
            ctx.save();
            ctx.globalAlpha = flake.opacity;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    cleanupBase() {
        // Remove event listeners
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.onMouseDown);
            this.canvas.removeEventListener('touchstart', this.onTouchStart);
        }
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
    }

    // Methods to be overridden by child classes
    init(canvas, ctx) {
        throw new Error('init() must be implemented by child class');
    }

    render(timestamp) {
        throw new Error('render() must be implemented by child class');
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
    }

    cleanup() {
        this.cleanupBase();
    }
    /**
     * Get global scale factor based on screen size
     * @returns {number} Scale factor
     */
    getScale() {
        return Math.min(this.width, this.height) / 800;
    }
}

BaseSlide.CHARACTERS = [
    {
        id: 1,
        name: "Pun",
        messages: ["dũi", "mum hong chào", "hi qn iu", "khót"],
        avatar: 1,
        treeOwner: "caymit",
        giftMessages: ["Mum ăn ik", "Đó, cầm ik mum", "Mời mọi người ăn mít!"],
        noGiftMessages: ["Kh động zô", "Ai cho mò đụng", "Cây này của Pun"]
    },
    {
        id: 2,
        name: "qn",
        messages: ["mom trap qn", "iu pun"],
        avatar: 5,
        treeOwner: "cayxoai",
        giftMessages: ["Xoài cát hòa lộc đấy! 🥭", "Chua chua ngọt ngọt!", "Ai ăn xoài lắc không?"],
        noGiftMessages: ["Xoài còn xanh lắm 🍃", "Chưa hái được đâu", "Đừng rung cây nữa!"]
    },
    {
        id: 3,
        name: "Ong",
        messages: ["mom ơi nhậu hong"],
        avatar: 3,
        treeOwner: "caysaurieng",
        giftMessages: ["Sầu riêng rụng rồi! 🤤", "Thơm nức mũi luôn!", "Hàng tuyển đấy!"],
        noGiftMessages: ["Coi chừng gai đâm!", "Chưa rụng đâu", "Đợi gió to đã 🌬️"],
        sound: "assets/sound/bee-landing-on-flower.mp3"
    },
    { id: 4, name: "lez", messages: ["hi cô Nhím"], avatar: 4 },
    { id: 5, name: "Hluan", messages: ["chị Nhím địch"], avatar: 2 },
    { id: 6, name: "tvy", messages: ["chị nhímmmm"], avatar: 11 },
    { id: 7, name: "ThTien", messages: ["bà dà Nhím"], avatar: 7 },
    { id: 8, name: "tngyn", messages: ["2 ko tin em hả"], avatar: 9 },
    { id: 9, name: "anhPhong", messages: ["Nhím chua"], avatar: 8 },
    { id: 10, name: "nno", messages: ["155..."], avatar: 10 },
    { id: 11, name: "XThanh", messages: ["ăn uống gì chưa z"], avatar: 6 },
    { id: 12, name: "Bé5", messages: ["mom ơiii"], avatar: 14 },
    { id: 13, name: "Dòi", messages: ["đún đún"], avatar: 13 },
    {
        id: 14,
        name: "Táo",
        messages: ["trào mum", "iu pun", "iu qn", "iu mum", "iu táo"],
        avatar: 12,
        treeOwner: "caytao",
        giftMessages: ["Nè!", "Táo đây"],
        noGiftMessages: ["Ê nha, đừng đụng zô táo", "Ko cho", "Đừng sờ"]

    },
    { id: 15, name: "Zin", messages: ["rep chuỗiii"], avatar: 18 },
    { id: 16, name: "Bon", messages: ["chị nhiễm"], avatar: 16 },
    { id: 17, name: "Ếch", messages: ["nay hiền ko khịa Nhím nữa"], avatar: 28 },
    { id: 18, name: "Xuyến", messages: ["đi chơi điii"], avatar: 15 },
    { id: 19, name: "Giang", messages: ["0 có"], avatar: 19 },
    { id: 20, name: "Nom", messages: ["ê m ơi, có biến"], avatar: 20 },
    { id: 21, name: "NHND", messages: ["ngủ sớm chưa???"], avatar: 33 },
    { id: 22, name: "Anh3", messages: ["em t tẽn lắm chứ khong thể dth v được"], avatar: 24 },
    { id: 23, name: "Bò Rừng Juno", messages: ["Òooooooo"], avatar: 23, sound: "assets/sound/cow-mooing.mp3" },
    { id: 24, name: "TuấnL", messages: ["BFF ^.^"], avatar: 22 },
    { id: 25, name: "Tuấncon", messages: ["2 đợi em đi nvqs về nha"], avatar: 86 },
    { id: 26, name: "Latuna", messages: ["10k mute mom"], avatar: 26 },
    { id: 27, name: "ChịBi", messages: ["chào em gái của chị"], avatar: 89 },
    { id: 28, name: "Chanh", messages: ["chị iuuu"], avatar: 17 },
    { id: 29, name: "TP", messages: ["4-0"], avatar: 91 },
    { id: 30, name: "Kenny", messages: ["lâu quá ko gặp"], avatar: 30 },
    { id: 31, name: "Lê Bảo", messages: ["thả nhãn dán hết live ..."], avatar: 31 },
    { id: 32, name: "VHieu", messages: ["ôi Thuy ơi"], avatar: 90 },
    { id: 33, name: "empuu", messages: ["em buòn quá Nhím ơi"], avatar: 21 },
    { id: 34, name: "cớt🐷", messages: ["li dị đi"], avatar: 34 },
    { id: 35, name: "LPhi", messages: ["cô ơiiiiii hóng hóng"], avatar: 35 },
    { id: 36, name: "Tiên Nữ", messages: ["cưng Nhím lắmmmm"], avatar: 61 },
    { id: 37, name: "qnhu", messages: ["bệnh bệnh kiểu gì á tr"], avatar: 38 },
    { id: 38, name: "anhCá", messages: ["anh có bắt chước đâu?"], avatar: 37 },
    { id: 39, name: "ThiSon", messages: ["hi chị Thuy"], avatar: 42 },
    { id: 40, name: "L.ANH", messages: ["hi bà"], avatar: 40 },
    { id: 41, name: "PNhi", messages: ["anh iu, lên SG lẹ đi em chờ"], avatar: 41 },
    { id: 42, name: "Chip", messages: ["mom ác nào giờ mà"], avatar: 39 },
    { id: 43, name: "pphhuy", messages: ["boy si tình"], avatar: 43 },
    { id: 44, name: "duke", messages: ["thầy ơi"], avatar: 94 },
    { id: 45, name: "Mò", messages: ["xin 500"], avatar: 45 },
    { id: 46, name: "Khánh", messages: ["hi Nhím"], avatar: 46 },
    { id: 47, name: "Leobae", messages: ["Nhím ơiiii ngta ăn hiếp chị"], avatar: 48 },
    { id: 48, name: "Xương", messages: ["chị đẹp tư vấn cho em"], avatar: 47 },
    { id: 49, name: "ChíVỹ", messages: ["2 có pro khong"], avatar: 49 },
    { id: 50, name: "HVĩ", messages: ["hehe"], avatar: 51 },
    { id: 51, name: "ChúcHà", messages: ["bà già"], avatar: 50 },
    { id: 52, name: "PDan", messages: ["Dân iu của mẹ nè"], avatar: 52 },
    { id: 53, name: "Utiu", messages: ["hi ngdeppp"], avatar: 53 },
    { id: 54, name: "Cyshi", messages: ["hello dca F A nha"], avatar: 54 },
    { id: 55, name: "Thuthu", messages: ["Cy tệ ..."], avatar: 55 },
    { id: 56, name: "Vũ Dương", messages: ["em đi nvqs nha ..."], avatar: 56 },
    { id: 57, name: "Triều", messages: ["đi đám cưới em !!!"], avatar: 95 },
    { id: 58, name: "btdung", messages: ["Nhím tệ"], avatar: 58 },
    { id: 59, name: "Cam", messages: ["Nhím cân4 đi, em cho kèo"], avatar: 69 },
    { id: 60, name: "TA", messages: ["ai hi chị đâu mà hi lại"], avatar: 60 },
    { id: 61, name: "emMy", messages: ["em bị vợ cho ra đường ngủ rồi anh ơi ..."], avatar: 36 },
    { id: 62, name: "TấnDũng", messages: ["trà sữa hong mom"], avatar: 62 },
    { id: 63, name: "NhânPhan", messages: ["Hi Nhím"], avatar: 68 },
    { id: 64, name: "Boo", messages: ["em Bo nè chị Nhím"], avatar: 64 },
    { id: 65, name: "Rùa", messages: ["chicken"], avatar: 65 },
    { id: 66, name: "vson", messages: ["lq đi"], avatar: 66 },
    { id: 67, name: "qminh", messages: ["hi 2, em minh nè"], avatar: 67 },
    { id: 68, name: "lhuong", messages: ["ủa nhím?"], avatar: 63 },
    { id: 69, name: "Nhoxing", messages: ["sao chị làm z với emmm"], avatar: 59 },
    { id: 70, name: "Chii", messages: ["💗"], avatar: 70 },
    { id: 71, name: "xh", messages: ["tui rank ht mà"], avatar: 71 },
    { id: 72, name: "Salm", messages: ["đuổi hong đi"], avatar: 96 },
    { id: 73, name: "HHung", messages: ["bấm lộn"], avatar: 73 },
    { id: 74, name: "TrieuNam", messages: ["chặn rồi, khỏi kiếm"], avatar: 98 },
    { id: 75, name: "Gnasche", messages: ["âm thầm điểm danh"], avatar: 75 },
    { id: 76, name: "chịTom", messages: ["quen biết gì mà hello"], avatar: 100 },
    { id: 77, name: "Ghost", messages: ["hi mom"], avatar: 77 },
    { id: 78, name: "Chuột", messages: ["hi 2, Chuột mới làm về"], avatar: 78 },
    { id: 79, name: "Tbien", messages: ["lâu quá hong gặp cô"], avatar: 102 },
    { id: 80, name: "Louis", messages: ["Nhím vẫn ế hả?"], avatar: 80 },
    { id: 81, name: "Paw", messages: ["coi chùa"], avatar: 103 },
    { id: 82, name: "Đạica", messages: ["Chào mày"], avatar: 82 },
    { id: 83, name: "Star", messages: ["hẹn gặp lại mùa hoa nở"], avatar: 104 },
    { id: 84, name: "ĐLuận", messages: ["tui fl hết"], avatar: 84 },
    { id: 85, name: "bé7", messages: ["biết t là ai khong"], avatar: 0 }
];
