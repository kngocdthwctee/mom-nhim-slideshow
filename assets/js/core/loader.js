/**
 * Resource Loader - Tracks all resources and displays loading progress
 */
(function () {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('progressBar');

    // All resources to preload
    const resources = {
        videos: [
            'assets/videos/livestream.mp4',
            'assets/videos/tiktokuniverse.mp4',
            'assets/videos/filler.mp4'
        ],
        images: [
            'assets/images/backgrounds/bg-pc.jpg',
            'assets/images/backgrounds/bg-mobile.jpg',

            'assets/images/house/house.png',

            'assets/images/livestock/conbo.png',
            'assets/images/livestock/conga.png',
            'assets/images/livestock/conlon.png',
            'assets/images/livestock/contrau.png',

            'assets/images/garden/caycam.png',
            'assets/images/garden/caychuoi.png',
            'assets/images/garden/caymit.png',
            'assets/images/garden/cayoi.png',
            'assets/images/garden/caysaurieng.png',
            'assets/images/garden/caytao.png',
            'assets/images/garden/cayxoai.png',

            'assets/images/fruits/naichuoi.png',
            'assets/images/fruits/quaccam.png',
            'assets/images/fruits/quaoi.png',
            'assets/images/fruits/quamit.png',
            'assets/images/fruits/quatao.png',
            'assets/images/fruits/quaxoai.png',
            'assets/images/fruits/quasaurieng.png',

            'assets/images/trees/candy-tree.png',
        ],
        audio: [
            'assets/audio/gift-sound.mp3'
        ],
        sounds: [
            'assets/sounds/bee-landing-on-flower.mp3',
            'assets/sounds/cow-mooing.mp3'
        ]
    };

    let totalResources = 0;
    let loadedResources = 0;

    // Count total resources
    Object.values(resources).forEach(arr => {
        totalResources += arr.length;
    });

    function updateProgress() {
        loadedResources++;
        const percent = Math.round((loadedResources / totalResources) * 100);
        progressBar.style.width = percent + '%';
        progressBar.textContent = percent + '%';

        if (loadedResources >= totalResources) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 300);
        }
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                updateProgress();
                resolve();
            };
            img.onerror = () => {
                console.warn('Failed to load image:', src);
                updateProgress(); // Still update progress even on error
                resolve();
            };
            img.src = src;
        });
    }

    function loadVideo(src) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.oncanplaythrough = () => {
                updateProgress();
                resolve();
            };
            video.onerror = () => {
                console.warn('Failed to load video:', src);
                updateProgress(); // Still update progress even on error
                resolve();
            };
            video.src = src;
            video.load();
        });
    }

    function loadAudio(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                updateProgress();
                resolve();
            };
            audio.onerror = () => {
                console.warn('Failed to load audio:', src);
                updateProgress(); // Still update progress even on error
                resolve();
            };
            audio.src = src;
            audio.load();
        });
    }

    // Start loading all resources
    function startLoading() {
        const promises = [];

        // Load images
        resources.images.forEach(src => {
            promises.push(loadImage(src));
        });

        // Load videos
        resources.videos.forEach(src => {
            promises.push(loadVideo(src));
        });

        // Load audio
        resources.audio.forEach(src => {
            promises.push(loadAudio(src));
        });

        // Load sounds
        resources.sounds.forEach(src => {
            promises.push(loadAudio(src));
        });

        // Wait for all resources
        Promise.all(promises).then(() => {
            console.log('All resources loaded!');
        }).catch(err => {
            console.error('Error loading resources:', err);
        });
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoading);
    } else {
        startLoading();
    }
})();
