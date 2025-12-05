/**
 * Effects - Các hiệu ứng chung cho trang
 * Hello Kitty Theme - Hearts, Stars, Bows
 */

class SnowEffect {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.snowflakes = [];
        this.maxSnowflakes = 40;
        // Hello Kitty symbols: hearts, stars, bows, flowers
        this.symbols = ['💕', '✨', '🎀', '🌸', '💖', '⭐', '♡', '✿', '❀', '♥'];
    }

    init() {
        // Tạo particles ban đầu
        for (let i = 0; i < this.maxSnowflakes; i++) {
            this.createSnowflake();
        }
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        
        // Random properties
        const size = 0.6 + Math.random() * 0.8;
        const duration = 12 + Math.random() * 18;
        const delay = Math.random() * 12;
        
        snowflake.style.cssText = `
            left: ${Math.random() * 100}%;
            font-size: ${size}rem;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
            opacity: ${0.4 + Math.random() * 0.4};
            filter: drop-shadow(0 0 3px rgba(255, 105, 180, 0.5));
        `;

        this.container.appendChild(snowflake);
        this.snowflakes.push(snowflake);

        // Reset position khi animation lặp lại
        snowflake.addEventListener('animationiteration', () => {
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        });
    }

    stop() {
        this.snowflakes.forEach(sf => sf.remove());
        this.snowflakes = [];
    }
}

// Khởi tạo effect
window.snowEffect = new SnowEffect('snowflakes');