/**
 * Main.js - Khởi tạo ứng dụng
 */

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo snow effect
    window.snowEffect.init();

    // Khởi tạo slide manager
    window.slideManager.init();

    // Khởi tạo fullscreen handler
    initFullscreen();

    // Christmas Countdown
    // Check environment: Disable on localhost/127.0.0.1/file protocol
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

    const ENABLE_COUNTDOWN = false;//!isLocal;

    if (ENABLE_COUNTDOWN) {
        const christmasCountdown = new ChristmasCountdown('2025-12-25T00:00:00', 'christmasCountdown');
        christmasCountdown.start();
    }

    console.log('Slideshow loaded!');
    console.log(`Total slides: ${window.slideManager.getSlideCount()}`);
});

/**
 * Fullscreen Handler
 */
function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const slideshowWrapper = document.querySelector('.slideshow-wrapper');
    const iconExpand = fullscreenBtn.querySelector('.icon-expand');
    const iconCompress = fullscreenBtn.querySelector('.icon-compress');

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            slideshowWrapper.requestFullscreen().then(() => {
                slideshowWrapper.classList.add('is-fullscreen');
                iconExpand.style.display = 'none';
                iconCompress.style.display = 'block';
                // Trigger canvas resize
                setTimeout(() => window.slideManager.resizeCanvas(), 100);
            }).catch(err => {
                // Fallback for browsers without fullscreen API
                slideshowWrapper.classList.add('is-fullscreen');
                iconExpand.style.display = 'none';
                iconCompress.style.display = 'block';
                setTimeout(() => window.slideManager.resizeCanvas(), 100);
            });
        } else {
            // Exit fullscreen
            document.exitFullscreen().then(() => {
                slideshowWrapper.classList.remove('is-fullscreen');
                iconExpand.style.display = 'block';
                iconCompress.style.display = 'none';
                setTimeout(() => window.slideManager.resizeCanvas(), 100);
            });
        }
    }

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Listen for fullscreen change (e.g., user presses Escape)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            slideshowWrapper.classList.remove('is-fullscreen');
            iconExpand.style.display = 'block';
            iconCompress.style.display = 'none';
            setTimeout(() => window.slideManager.resizeCanvas(), 100);
        }
    });

    // Auto-suggest fullscreen on landscape mobile
    let hasPrompted = false;
    window.addEventListener('orientationchange', () => {
        // Always resize canvas on orientation change
        setTimeout(() => {
            window.slideManager.resizeCanvas();
        }, 100);

        const isLandscape = window.matchMedia('(orientation: landscape)').matches;
        const isMobile = window.innerWidth <= 900;

        if (isLandscape && isMobile && !hasPrompted && !document.fullscreenElement) {
            hasPrompted = true;
            // Auto-enter fullscreen on mobile landscape
            setTimeout(() => {
                if (confirm('Bạn có muốn xem toàn màn hình không?')) {
                    toggleFullscreen();
                }
            }, 500);
        }
    });

    // Also resize on window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            window.slideManager.resizeCanvas();
        }, 100);
    });
}

/**
 * addNewSlide(mySlide);
 */
function addNewSlide(slideObject) {
    if (!slideObject.title || !slideObject.content || !slideObject.init || !slideObject.render) {
        console.error('Slide object must have: title, content, init(), render()');
        return false;
    }

    window.slideManager.addSlide(slideObject);
    console.log(`Added new slide: "${slideObject.title}"`);
    console.log(`Total slides: ${window.slideManager.getSlideCount()}`);
    return true;
}

// Export function để dùng global
window.addNewSlide = addNewSlide;
