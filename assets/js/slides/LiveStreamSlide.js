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
        this.giftAudioTimeout = null;
        this.giftVideoEnded = false;
        this.giftAudioEnded = false;
        this.fillerVideo = null;
        this.showFillerVideo = false;

        // Disable camera panning for livestream
        this.cameraEnabled = false;
        this.cameraX = 0;
    }

    init(canvas, ctx) {
        super.initBase(canvas, ctx);
        this.initComments();
        this.initGiftVideo();
        this.initLivestreamVideo();
        this.initFillerVideo();
        this.initGiftAudio();
        this.maxCameraOffset = 0;
    }

    initGiftVideo() {
        this.giftVideo = document.createElement('video');
        this.giftVideo.src = 'assets/videos/tiktokuniverse.mp4';
        this.giftVideo.style.display = 'none';
        this.giftVideo.muted = false;
        this.giftVideo.volume = 0.5;
        this.giftVideo.loop = false;
        document.body.appendChild(this.giftVideo);

        this.giftVideo.addEventListener('ended', () => {
            this.showGiftEffect = false;
            this.giftVideoEnded = true;
            this.checkResumelivestream();
        });
    }

    initLivestreamVideo() {
        this.livestreamVideo = document.createElement('video');
        this.livestreamVideo.src = 'assets/videos/livestream.mp4';
        this.livestreamVideo.style.display = 'none';
        this.livestreamVideo.muted = false;
        this.livestreamVideo.volume = 0.5;
        this.livestreamVideo.loop = false;
        document.body.appendChild(this.livestreamVideo);
        this.livestreamVideo.play();

        this.livestreamVideo.addEventListener('ended', () => {
            // Only switch to filler when video has enough data loaded
            if (this.fillerVideo && this.fillerVideo.readyState >= 3) {
                this.showFillerVideo = true;
                this.fillerVideo.play();
            } else if (this.fillerVideo) {
                // If not ready, wait for it
                this.fillerVideo.addEventListener('canplay', () => {
                    this.showFillerVideo = true;
                    this.fillerVideo.play();
                }, { once: true });
            }
        });
    }

    initFillerVideo() {
        this.fillerVideo = document.createElement('video');
        this.fillerVideo.src = 'assets/videos/filler.mp4';
        this.fillerVideo.style.display = 'none';
        this.fillerVideo.muted = true;
        this.fillerVideo.loop = true;
        this.fillerVideo.preload = 'auto';
        document.body.appendChild(this.fillerVideo);
        this.fillerVideo.load();
    }

    initGiftAudio() {
        this.giftAudio = document.createElement('audio');
        this.giftAudio.src = 'assets/audio/gift-sound.mp3';
        this.giftAudio.style.display = 'none';
        this.giftAudio.volume = 1;
        document.body.appendChild(this.giftAudio);

        this.giftAudio.addEventListener('ended', () => {
            this.giftAudioEnded = true;
            this.checkResumelivestream();
        });
    }

    checkResumelivestream() {
        // Only resume livestream when both giftVideo and giftAudio have ended
        if (this.giftVideoEnded && this.giftAudioEnded) {
            this.showReactions = true;
            this.addGiftReactions();
            if (this.livestreamVideo) this.livestreamVideo.play();
        }
    }

    initComments() {
        this.comments = [];
        const commentList = [
            { text: "Hi mum", username: "Pun", startTime: 500 },
            { text: "Hê lô mom", username: "qn", startTime: 600 },
            { text: "Hê lô nhím", username: "Ong Chăm Chỉ", startTime: 1500 },
            { text: "@qn hí iuuu", username: "Pun", startTime: 3000 },
            { text: "@Pun hí iuu", username: "qn", startTime: 4000 },
            { text: "Đã tặng x10 Bông hồng", username: "qn", startTime: 13000 },
            { text: "Quà huyền bí bay quá tr lun kìa mum", username: "qn", startTime: 25000 }
        ];

        this.commentTimeouts = [];
        commentList.forEach((comment) => {
            const timeout = setTimeout(() => {
                this.comments.unshift(comment);
                if (this.comments.length > 12) this.comments.pop();
            }, comment.startTime);
            this.commentTimeouts.push(timeout);
        });
    }

    addGiftReactions() {
        const reactions = [
            { text: "Adu vuýp!", username: "chịTom" },
            { text: "Auuu", username: "Dòi" },
            { text: "Adu adu", username: "Lez" },
            { text: "Troi oiiiiii", username: "Louis" },
            { text: "Adduuuu", username: "Pun" },
            { text: "U ni vơ", username: "Pun" },
            { text: "Aduuuu uniiiii", username: "qn" },
            { text: "Giàu dữ tr", username: "Vand Dung" },
            { text: "Aduuuu, uni", username: "Xuân Thànhh" }
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

        // Mobile font multiplier - increase font size on small screens
        const isMobile = this.width < 600;
        const fontScale = isMobile ? Math.max(scale * 2, 1) : scale;

        if (this.slideStartTime === 0) this.slideStartTime = timestamp;

        const elapsed = timestamp - this.slideStartTime;
        if (elapsed > 130000 && !this.giftEffectTriggered) {
            this.giftEffectTriggered = true;
            this.showGiftEffect = true;
            this.giftViewerBoost = true;
            this.giftBoostStartTime = timestamp;
            this.giftVideoEnded = false;
            this.giftAudioEnded = false;

            if (this.livestreamVideo) this.livestreamVideo.pause();
            this.giftVideo.currentTime = 0;
            this.giftVideo.play();

            // Play giftAudio after 3 seconds
            if (this.giftAudio) {
                this.giftAudioTimeout = setTimeout(() => {
                    this.giftAudio.currentTime = 0;
                    this.giftAudio.play();
                }, 8000);
            }
        }

        this.updateViewerCount(timestamp);

        if (this.showGiftEffect) {
            this.drawGiftEffect(ctx, scale);
        } else if (this.showFillerVideo) {
            this.drawFillerVideo(ctx, scale);
            this.drawLiveBadge(ctx, timestamp, fontScale);
            this.drawCommentBox(ctx, timestamp, fontScale);
        } else {
            this.drawLivestreamVideo(ctx, scale);
            this.drawLiveBadge(ctx, timestamp, fontScale);
            this.drawCommentBox(ctx, timestamp, fontScale);
        }
    }

    drawLiveBadge(ctx, timestamp, scale) {
        const x = 20 * scale;
        const y = 20 * scale;
        const pulse = Math.sin(timestamp / 300) * 0.3 + 0.7;

        ctx.save();
        ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
        ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
        ctx.shadowBlur = 12 * scale;
        ctx.beginPath();
        ctx.roundRect(x, y, 55 * scale, 20 * scale, 4 * scale);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${11 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('LIVE', x + 27.5 * scale, y + 14 * scale);

        ctx.font = `${10 * scale}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText(`👁️ ${this.viewerCount}`, x, y + 40 * scale);
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

    drawFillerVideo(ctx, scale) {
        if (!this.fillerVideo || this.fillerVideo.readyState < 2) return;

        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);

        const vAspect = this.fillerVideo.videoWidth / this.fillerVideo.videoHeight;
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
        ctx.drawImage(this.fillerVideo, x, y, w, h);
        ctx.restore();
    }

    drawCommentBox(ctx, timestamp, scale) {
        // Mobile gets wider comment box
        const isMobile = this.width < 600;
        const boxWidth = isMobile ? 0.4 : 0.3;
        const boxX = isMobile ? 0.58 : 0.65;

        const x = this.width * boxX;
        const y = this.height * 0.15;
        const w = this.width * boxWidth;
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
        ctx.fillRect(x, y, w, 35 * scale);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${13 * scale}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText('💬 Chat', x + 12 * scale, y + 22 * scale);

        const startY = y + 45 * scale;
        const cHeight = 36 * scale; // Reduced from 50
        const highlight = this.showReactions ? Math.sin(timestamp / 200) * 0.3 + 0.7 : 1;

        this.comments.forEach((c, i) => {
            const yPos = startY + (i * cHeight);
            if (yPos >= y + h - 15 * scale) return;

            ctx.fillStyle = '#aaa';
            ctx.font = `bold ${9 * scale}px Arial`;
            ctx.fillText(c.username, x + 12 * scale, yPos);

            const isReact = i < 8 && this.showReactions;
            ctx.fillStyle = isReact ? `rgba(255, 215, 0, ${0.3 * highlight})` : 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.roundRect(x + 12 * scale, yPos + 3 * scale, w - 24 * scale, 24 * scale, 4 * scale);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = `${10 * scale}px Arial`;
            ctx.fillText(c.text, x + 18 * scale, yPos + 18 * scale);
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
        this.giftVideoEnded = false;
        this.giftAudioEnded = false;
        this.showFillerVideo = false;

        if (this.giftAudioTimeout) {
            clearTimeout(this.giftAudioTimeout);
            this.giftAudioTimeout = null;
        }

        if (this.commentTimeouts) {
            this.commentTimeouts.forEach(timeout => clearTimeout(timeout));
            this.commentTimeouts = [];
        }

        if (this.giftVideo) {
            this.giftVideo.pause();
            this.giftVideo.currentTime = 0;
        }
        if (this.livestreamVideo) this.livestreamVideo.pause();
        if (this.fillerVideo) {
            this.fillerVideo.pause();
            this.fillerVideo.currentTime = 0;
        }
        if (this.giftAudio) {
            this.giftAudio.pause();
            this.giftAudio.currentTime = 0;
        }
    }
}

window.slideManager.addSlide(new LiveStreamSlide());
