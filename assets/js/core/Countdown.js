/**
 * Countdown.js - Đếm ngược đến Giáng Sinh 2025
 */
class ChristmasCountdown {
    constructor(targetDate, elementId) {
        this.targetDate = new Date(targetDate).getTime();
        this.element = document.getElementById(elementId);

        if (!this.element) {
            console.warn(`Countdown element with ID '${elementId}' not found.`);
            return;
        }

        this.daysEl = this.element.querySelector('#days');
        this.hoursEl = this.element.querySelector('#hours');
        this.minutesEl = this.element.querySelector('#minutes');
        this.secondsEl = this.element.querySelector('#seconds');

        this.interval = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;

        // Show the overlay
        this.element.style.display = 'flex';
        this.isRunning = true;

        this.update(); // Update immediately
        this.interval = setInterval(() => this.update(), 1000);
        console.log('Christmas Countdown started!');
    }

    stop() {
        if (!this.isRunning) return;

        // Hide the overlay
        this.element.style.display = 'none';
        this.isRunning = false;

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        console.log('Christmas Countdown stopped.');
    }

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            this.stop();
            this.daysEl.innerText = "00";
            this.hoursEl.innerText = "00";
            this.minutesEl.innerText = "00";
            this.secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (this.daysEl) this.daysEl.innerText = this.formatTime(days);
        if (this.hoursEl) this.hoursEl.innerText = this.formatTime(hours);
        if (this.minutesEl) this.minutesEl.innerText = this.formatTime(minutes);
        if (this.secondsEl) this.secondsEl.innerText = this.formatTime(seconds);
    }

    formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
}
