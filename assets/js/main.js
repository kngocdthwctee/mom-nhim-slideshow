/**
 * Main.js - Khởi tạo ứng dụng
 */

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo snow effect
    window.snowEffect.init();

    // Khởi tạo slide manager
    window.slideManager.init();

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
