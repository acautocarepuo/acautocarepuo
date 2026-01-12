export class SplashScreen {
    constructor() {
        this.element = document.getElementById('splash-screen');
        this.progressBar = document.querySelector('.loader-progress');
        this.uiLayer = document.getElementById('ui-layer');

        // Hide Main UI initially
        if (this.uiLayer) this.uiLayer.classList.add('hidden');
    }

    updateProgress(message, percent) {
        if (this.progressBar) {
            this.progressBar.style.width = `${percent * 100}%`;
        }
        // Could also update a text element with 'message' if it existed
    }

    hide() {
        if (!this.element) return;

        // 1. Finish bar
        this.updateProgress('Ready', 1);

        // 2. Fade out
        setTimeout(() => {
            this.element.style.opacity = '0';
            this.element.style.pointerEvents = 'none'; // pass-through

            // 3. Show Main UI
            if (this.uiLayer) {
                this.uiLayer.classList.remove('hidden');
            }
        }, 500);
    }
}
