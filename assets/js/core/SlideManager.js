/**
 * SlideManager - Quản lý slideshow
 * Xử lý việc đăng ký, chuyển đổi và render các slide
 */
class SlideManager {
    constructor() {
        this.slides = [];
        this.currentIndex = 0;
        this.canvasContainer = null;
        this.titleElement = null;
        this.nextButton = null;
        this.prevButton = null;
        this.currentCanvas = null;
        this.animationId = null;

        // Camera state
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            isDragging: false,
            lastX: 0,
            lastY: 0
        };
    }

    /**
     * Khởi tạo SlideManager với các DOM elements
     */
    init() {
        this.canvasContainer = document.getElementById('canvasContainer');
        this.titleElement = document.getElementById('slideTitle');
        this.nextButton = document.getElementById('nextBtn');
        this.prevButton = document.getElementById('prevBtn');

        // Bind event listeners
        this.nextButton.addEventListener('click', () => this.nextSlide());
        this.prevButton.addEventListener('click', () => this.prevSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                this.prevSlide();
            }
        });

        // Camera controls
        this.initCameraListeners();

        // Render slide đầu tiên
        if (this.slides.length > 0) {
            this.renderSlide();
        }
    }

    initCameraListeners() {
        const container = this.canvasContainer;

        // Mouse events
        container.addEventListener('mousedown', (e) => this.startDrag(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => this.drag(e.clientX, e.clientY));
        window.addEventListener('mouseup', () => this.stopDrag());

        // Touch events
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.startDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                this.drag(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        window.addEventListener('touchend', () => this.stopDrag());

        // Wheel zoom
        container.addEventListener('wheel', (e) => {
            // Check if current slide allows camera
            const currentSlide = this.slides[this.currentIndex];
            if (currentSlide && currentSlide.cameraEnabled === false) return;

            e.preventDefault();
            const zoomSpeed = 0.1;
            const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
            const newZoom = Math.max(0.5, Math.min(5, this.camera.zoom + delta));

            this.camera.zoom = newZoom;
        });
    }

    startDrag(x, y) {
        this.camera.isDragging = true;
        this.camera.lastX = x;
        this.camera.lastY = y;
        this.canvasContainer.style.cursor = 'grabbing';
    }

    drag(x, y) {
        if (!this.camera.isDragging) return;

        // Check if current slide allows camera
        const currentSlide = this.slides[this.currentIndex];
        if (currentSlide && currentSlide.cameraEnabled === false) return;

        const deltaX = x - this.camera.lastX;
        const deltaY = y - this.camera.lastY;

        this.camera.x += deltaX;
        this.camera.y += deltaY;

        this.camera.lastX = x;
        this.camera.lastY = y;
    }

    stopDrag() {
        this.camera.isDragging = false;
        this.canvasContainer.style.cursor = 'grab';
    }

    resetCamera() {
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            isDragging: false,
            lastX: 0,
            lastY: 0
        };
    }

    /**
     * Thêm slide mới vào danh sách
     * @param {BaseSlide} slide - Instance của slide kế thừa từ BaseSlide
     */
    addSlide(slide) {
        this.slides.push(slide);
    }

    /**
     * Chuyển sang slide tiếp theo
     */
    nextSlide() {
        if (this.slides.length === 0) return;

        // Cleanup slide hiện tại
        this.cleanupCurrentSlide();

        // Chuyển index
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;

        // Render slide mới
        this.renderSlide();
    }

    /**
     * Quay lại slide trước
     */
    prevSlide() {
        if (this.slides.length === 0) return;

        this.cleanupCurrentSlide();
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.renderSlide();
    }

    /**
     * Nhảy đến slide cụ thể
     * @param {number} index - Index của slide cần nhảy đến
     */
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.cleanupCurrentSlide();
        this.currentIndex = index;
        this.renderSlide();
    }

    /**
     * Cleanup slide hiện tại trước khi chuyển
     */
    cleanupCurrentSlide() {
        // Cancel animation frame nếu có
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Gọi cleanup của slide
        const currentSlide = this.slides[this.currentIndex];
        if (currentSlide && typeof currentSlide.cleanup === 'function') {
            currentSlide.cleanup();
        }

        // Remove canvas cũ
        if (this.currentCanvas) {
            this.currentCanvas.remove();
            this.currentCanvas = null;
        }
    }

    /**
     * Render slide hiện tại
     */
    renderSlide() {
        const slide = this.slides[this.currentIndex];
        if (!slide) return;

        // Reset camera for new slide
        this.resetCamera();

        // Update title
        this.updateTitle(slide.title, this.currentIndex + 1, this.slides.length);

        // Update button text
        this.updateButton();

        // Create và render canvas
        this.createCanvas(slide);
    }

    /**
     * Update tiêu đề slide
     */
    updateTitle(title, current, total) {
        this.titleElement.innerHTML = `
            <span class="slide-number">Slide ${current}/${total}</span>
            ${title}
        `;
        this.titleElement.classList.remove('fade-in');
        void this.titleElement.offsetWidth; // Trigger reflow
        this.titleElement.classList.add('fade-in');
    }

    /**
     * Update button states
     */
    updateButton() {
        const isFirstSlide = this.currentIndex === 0;
        const isLastSlide = this.currentIndex === this.slides.length - 1;

        // Handle prev button visibility
        if (isFirstSlide) {
            this.prevButton.classList.add('hidden');
        } else {
            this.prevButton.classList.remove('hidden');
        }

        // Handle next button icon (replay on last slide)
        const nextSvg = this.nextButton.querySelector('svg');
        if (isLastSlide) {
            // Replay icon
            nextSvg.innerHTML = '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>';
            this.nextButton.title = 'Xem lại';
        } else {
            // Arrow right icon
            nextSvg.innerHTML = '<path d="M5 12h14M12 5l7 7-7 7"/>';
            this.nextButton.title = 'Tiếp theo';
        }
    }

    /**
     * Tạo canvas mới và gọi slide render
     */
    createCanvas(slide) {
        // Tạo canvas element
        const canvas = document.createElement('canvas');
        canvas.id = `slide-canvas-${this.currentIndex}`;

        // Remove old canvas only (keep navigation buttons)
        if (this.currentCanvas) {
            this.currentCanvas.remove();
        }
        // Prepend canvas (before navigation buttons)
        this.canvasContainer.prepend(canvas);
        this.currentCanvas = canvas;

        // Set canvas size
        this.resizeCanvas();

        // Gọi init và render của slide
        const ctx = canvas.getContext('2d');
        slide.init(canvas, ctx);

        // Start animation loop
        this.startAnimation(slide);

        // Handle resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize canvas theo container
     */
    resizeCanvas() {
        if (!this.currentCanvas) return;

        const container = this.canvasContainer;
        const rect = container.getBoundingClientRect();

        // Set actual size in memory
        this.currentCanvas.width = rect.width * window.devicePixelRatio;
        this.currentCanvas.height = rect.height * window.devicePixelRatio;

        // Scale context for retina
        const ctx = this.currentCanvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Notify slide of resize
        const slide = this.slides[this.currentIndex];
        if (slide && typeof slide.onResize === 'function') {
            slide.onResize(rect.width, rect.height);
        }
    }

    /**
     * Start animation loop cho slide
     */
    startAnimation(slide) {
        const ctx = this.currentCanvas.getContext('2d');

        const animate = (timestamp) => {
            if (slide && typeof slide.render === 'function') {
                // Handle camera transform
                ctx.save();

                // Clear entire canvas in device pixels to ensure full clear
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.currentCanvas.width, this.currentCanvas.height);

                // Re-apply device pixel ratio scale
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

                // Apply camera transform only if slide allows it
                const currentSlide = this.slides[this.currentIndex];
                const useCameraTransform = !currentSlide || currentSlide.cameraEnabled !== false;

                if (useCameraTransform) {
                    // Apply camera transform
                    const centerX = this.currentCanvas.width / window.devicePixelRatio / 2;
                    const centerY = this.currentCanvas.height / window.devicePixelRatio / 2;

                    ctx.translate(centerX, centerY);
                    ctx.scale(this.camera.zoom, this.camera.zoom);
                    ctx.translate(-centerX, -centerY);

                    // Apply pan
                    ctx.translate(this.camera.x, this.camera.y);
                }

                slide.render(timestamp);

                ctx.restore();
            }
            this.animationId = requestAnimationFrame(animate);
        };
        this.animationId = requestAnimationFrame(animate);
    }

    /**
     * Lấy số lượng slide
     */
    getSlideCount() {
        return this.slides.length;
    }

    /**
     * Lấy index hiện tại
     */
    getCurrentIndex() {
        return this.currentIndex;
    }
}

// Export global instance
window.slideManager = new SlideManager();
