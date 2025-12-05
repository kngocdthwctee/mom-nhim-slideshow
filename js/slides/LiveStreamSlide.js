/**
 * LiveStream Slide - Camera disabled
 */
class LiveStreamSlide extends BaseSlide {
    constructor() {
        super();
        this.title = 'Livestream';
        this.content = '<p>Mom Nhím livestream!</p>';
        this.comments = [];
        this.giftVideo = null;
        this.slideStartTime = 0;
        this.giftEffectTriggered = false;
        this.showGiftEffect = false;
        this.livestreamVideo = null;
        this.giftAudio = null;
        this.showReactions = false;
        this.viewerCount = 35;
        this.lastViewerUpdate = 0;
        this.giftViewerBoost = false;
        this.giftBoostStartTime = 0;

        // Disable camera panning for livestream
        this.cameraEnabled = false;
        this.cameraX = 0;
    }

    init(canvas, ctx) {
        super.initBase(canvas, ctx);
        this.initComments();
        this.initGiftVideo();
        this.initLivestreamVideo();
        this.initGiftAudio();
        this.maxCameraOffset = 0;
    }

    initGiftVideo() {
        this.giftVideo = document.createElement('video');
        this.giftVideo.src = 'public/video/tiktokuniverse.mp4';
        this.giftVideo.style.display = 'none';
        this.giftVideo.muted = false;
        this.giftVideo.loop = false;
        document.body.appendChild(this.giftVideo);

        this.giftVideo.addEventListener('ended', () => {
            this.showGiftEffect = false;
            this.showReactions = true;
            this.addGiftReactions();
            if (this.livestreamVideo) this.livestreamVideo.play();
            if (this.giftAudio) {
                this.giftAudio.pause();
                this.giftAudio.currentTime = 0;
            }
        });
    }

    initLivestreamVideo() {
        this.livestreamVideo = document.createElement('video');
        this.livestreamVideo.src = 'public/video/livestream.mp4';
        this.livestreamVideo.style.display = 'none';
        this.livestreamVideo.muted = false;
        this.livestreamVideo.volume = 0.7;
        this.livestreamVideo.loop = true;
        document.body.appendChild(this.livestreamVideo);
        this.livestreamVideo.play();
    }

    initGiftAudio() {
        this.giftAudio = document.createElement('audio');
        this.giftAudio.src = 'public/audio/gift-sound.mp3';
        this.giftAudio.style.display = 'none';
        this.giftAudio.volume = 0.5;
        document.body.appendChild(this.giftAudio);
    }

    initComments() {
        this.comments = [
            { text: "❤️ Mom giỏi quá!", username: "Fan1" },
            { text: "👍 Yêu Mom!", username: "Fan2" },
            { text: "😍 Khi nào livestream tiếp?", username: "Fan3" },
            { text: "🎉 Chúc mừng Mom!", username: "Fan4" }
        ];
    }

    addGiftReactions() {
        const reactions = [
            { text: "🎁 WOW QUÀ KHỦNG!", username: "Fan5" },
            { text: "😱 OMG Universe!!", username: "Fan6" },
            { text: "💎 Quá đẹp luôn!", username: "Fan7" },
            { text: "🌟 Chúc mừng Mom!", username: "Fan8" },
            { text: "🔥 Xứng đáng quá!", username: "Fan9" },
            { text: "👏 Ngạc nhiên quá!", username: "Fan10" },
            { text: "💖 Yêu Mom nhất!", username: "Fan11" },
            { text: "✨ Quá tuyệt vời!", username: "Fan12" }
        ];

        reactions.forEach((r, i) => {
            setTimeout(() => {
                this.comments.unshift(r);
                if (this.comments.length > 12) this.comments.pop();
            }, i * 300);
        });

        setTimeout(() => { this.showReactions = false; }, 10000);
    }

    updateViewerCount(timestamp) {
        if (timestamp - this.lastViewerUpdate > 1000) {
            this.lastViewerUpdate = timestamp;

            const boostElapsed = timestamp - this.giftBoostStartTime;
            const isBoostActive = this.giftViewerBoost && boostElapsed < 5000;

            if (isBoostActive) {
                this.viewerCount += Math.floor(Math.random() * 51) + 50;
            } else {
                this.giftViewerBoost = false;
                this.viewerCount += Math.floor(Math.random() * 9) - 4;
                if (this.viewerCount < 30) this.viewerCount = 30;
                if (this.viewerCount > 500) this.viewerCount = Math.floor(Math.random() * 11) + 30;
            }
        }
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        super.initSnowfall();
    }

    render(timestamp) {
        const ctx = this.ctx;
        const scale = Math.min(this.width, this.height) / 800;

        if (this.slideStartTime === 0) this.slideStartTime = timestamp;

        const elapsed = timestamp - this.slideStartTime;
        if (elapsed > 5000 && !this.giftEffectTriggered) {
            this.giftEffectTriggered = true;
            this.showGiftEffect = true;
            this.giftViewerBoost = true;
            this.giftBoostStartTime = timestamp;

            if (this.livestreamVideo) this.livestreamVideo.pause();
            this.giftVideo.currentTime = 0;
            this.giftVideo.play();
            if (this.giftAudio) {
                this.giftAudio.currentTime = 0;
                this.giftAudio.play();
            }
        }

        this.updateViewerCount(timestamp);

        if (this.showGiftEffect) {
            this.drawGiftEffect(ctx, scale);
        } else {
            this.drawLivestreamVideo(ctx, scale);
            this.drawLiveBadge(ctx, timestamp, scale);
            this.drawCommentBox(ctx, timestamp, scale);
        }
    }

    drawLiveBadge(ctx, timestamp, scale) {
        const x = 30 * scale;
        const y = 30 * scale;
        const pulse = Math.sin(timestamp / 300) * 0.3 + 0.7;

        ctx.save();
        ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
        ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
        ctx.shadowBlur = 15 * scale;
        ctx.beginPath();
        ctx.roundRect(x, y, 80 * scale, 30 * scale, 5 * scale);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${14 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('LIVE', x + 40 * scale, y + 20 * scale);

        ctx.font = `${12 * scale}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText(`👁️ ${this.viewerCount} watching`, x, y + 50 * scale);
        ctx.restore();
    }

    drawLivestreamVideo(ctx, scale) {
        if (!this.livestreamVideo || this.livestreamVideo.readyState < 2) return;

        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);

        const vAspect = this.livestreamVideo.videoWidth / this.livestreamVideo.videoHeight;
        const cAspect = this.width / this.height;
        let w, h, x, y;

        if (vAspect > cAspect) {
            w = this.width;
            h = w / vAspect;
            x = 0;
            y = (this.height - h) / 2;
        } else {
            h = this.height;
            w = h * vAspect;
            x = (this.width - w) / 2;
            y = 0;
        }

        this.drawAmbient(ctx, x, y, w, h);
        ctx.drawImage(this.livestreamVideo, x, y, w, h);
        ctx.restore();
    }

    drawCommentBox(ctx, timestamp, scale) {
        const x = this.width * 0.65;
        const y = this.height * 0.15;
        const w = this.width * 0.3;
        const h = this.height * 0.7;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 10 * scale);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#222';
        ctx.fillRect(x, y, w, 40 * scale);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${14 * scale}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText('💬 Chat', x + 15 * scale, y + 25 * scale);

        const startY = y + 60 * scale;
        const cHeight = 50 * scale;
        const highlight = this.showReactions ? Math.sin(timestamp / 200) * 0.3 + 0.7 : 1;

        this.comments.forEach((c, i) => {
            const yPos = startY + (i * cHeight);
            if (yPos >= y + h - 20 * scale) return;

            ctx.fillStyle = '#aaa';
            ctx.font = `bold ${10 * scale}px Arial`;
            ctx.fillText(c.username, x + 15 * scale, yPos);

            const isReact = i < 8 && this.showReactions;
            ctx.fillStyle = isReact ? `rgba(255, 215, 0, ${0.3 * highlight})` : 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.roundRect(x + 15 * scale, yPos + 5 * scale, w - 30 * scale, 30 * scale, 5 * scale);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = `${11 * scale}px Arial`;
            ctx.fillText(c.text, x + 25 * scale, yPos + 22 * scale);
        });

        ctx.restore();
    }

    drawGiftEffect(ctx, scale) {
        if (!this.giftVideo || this.giftVideo.readyState < 2) return;

        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);

        const vAspect = this.giftVideo.videoWidth / this.giftVideo.videoHeight;
        const cAspect = this.width / this.height;
        let w, h, x, y;

        if (vAspect > cAspect) {
            w = this.width;
            h = w / vAspect;
            x = 0;
            y = (this.height - h) / 2;
        } else {
            h = this.height;
            w = h * vAspect;
            x = (this.width - w) / 2;
            y = 0;
        }

        this.drawAmbient(ctx, x, y, w, h);
        ctx.drawImage(this.giftVideo, x, y, w, h);
        ctx.restore();
    }

    drawAmbient(ctx, vx, vy, vw, vh) {
        const size = 150;

        if (vy > 0) {
            const g = ctx.createLinearGradient(0, vy, 0, Math.max(0, vy - size));
            g.addColorStop(0, 'rgba(100, 100, 150, 0.3)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, this.width, vy);
        }

        if (vy + vh < this.height) {
            const g = ctx.createLinearGradient(0, vy + vh, 0, Math.min(this.height, vy + vh + size));
            g.addColorStop(0, 'rgba(100, 100, 150, 0.3)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, vy + vh, this.width, this.height - (vy + vh));
        }

        if (vx > 0) {
            const g = ctx.createLinearGradient(vx, 0, Math.max(0, vx - size), 0);
            g.addColorStop(0, 'rgba(100, 100, 150, 0.3)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, vx, this.height);
        }

        if (vx + vw < this.width) {
            const g = ctx.createLinearGradient(vx + vw, 0, Math.min(this.width, vx + vw + size), 0);
            g.addColorStop(0, 'rgba(100, 100, 150, 0.3)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = g;
            ctx.fillRect(vx + vw, 0, this.width - (vx + vw), this.height);
        }
    }

    cleanup() {
        super.cleanup();
        this.comments = [];
        this.slideStartTime = 0;
        this.giftEffectTriggered = false;
        this.showGiftEffect = false;
        this.showReactions = false;
        this.viewerCount = 35;
        this.lastViewerUpdate = 0;
        this.giftViewerBoost = false;
        this.giftBoostStartTime = 0;

        if (this.giftVideo) {
            this.giftVideo.pause();
            this.giftVideo.currentTime = 0;
        }
        if (this.livestreamVideo) this.livestreamVideo.pause();
        if (this.giftAudio) {
            this.giftAudio.pause();
            this.giftAudio.currentTime = 0;
        }
    }
}

window.slideManager.addSlide(new LiveStreamSlide());
