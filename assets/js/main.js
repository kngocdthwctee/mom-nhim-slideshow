/**
 * Main.js - Khởi tạo ứng dụng
 */

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo snow effect
    window.snowEffect.init();
    
    // Khởi tạo slide manager
    window.slideManager.init();
    
    console.log('Mom Nhím Slideshow loaded!');
    console.log(`Total slides: ${window.slideManager.getSlideCount()}`);
});

/**
 * API để thêm slide mới từ bên ngoài
 * 
 * Cách dùng:
 * 
 * const mySlide = {
 *     title: 'Tiêu đề slide',
 *     content: '<p>Nội dung HTML</p>',
 *     
 *     init(canvas, ctx) {
 *         // Khởi tạo slide
 *         this.canvas = canvas;
 *         this.ctx = ctx;
 *         this.width = canvas.width / window.devicePixelRatio;
 *         this.height = canvas.height / window.devicePixelRatio;
 *     },
 *     
 *     render(timestamp) {
 *         // Vẽ canvas mỗi frame
 *         const ctx = this.ctx;
 *         ctx.clearRect(0, 0, this.width, this.height);
 *         // ... code vẽ của bạn
 *     },
 *     
 *     onResize(width, height) {
 *         // Xử lý khi resize (optional)
 *         this.width = width;
 *         this.height = height;
 *     },
 *     
 *     cleanup() {
 *         // Cleanup khi chuyển slide (optional)
 *     }
 * };
 * 
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
