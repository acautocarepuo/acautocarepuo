export class SplashScreen {
    constructor() {
        this.element = document.getElementById('splash-screen');
        this.progressBar = document.querySelector('.loader-progress');
        this.uiLayer = document.getElementById('app-shell');
        this.loaderView = document.querySelector('.splash-loader-view');
        this.entryView = document.getElementById('splash-entry-view');
        this.aboutView = document.getElementById('about-project-view');
        this.continueBtn = document.getElementById('btn-continue-app');
        this.openAboutBtn = document.getElementById('btn-open-about');
        this.backEntryBtn = document.getElementById('btn-back-entry');
        this.aboutContinueBtn = document.getElementById('btn-about-continue');

        if (this.uiLayer) this.uiLayer.classList.add('hidden');
        this.setupEventListeners();
    }

    updateProgress(message, percent) {
        if (this.progressBar) {
            this.progressBar.style.width = `${percent * 100}%`;
        }

        const loadingText = document.querySelector('.loading-text');
        if (loadingText && message) {
            loadingText.textContent = message;
        }
    }

    setupEventListeners() {
        if (this.continueBtn) {
            this.continueBtn.addEventListener('click', () => this.enterApp());
        }

        if (this.openAboutBtn) {
            this.openAboutBtn.addEventListener('click', () => this.showAboutProject());
        }

        if (this.backEntryBtn) {
            this.backEntryBtn.addEventListener('click', () => this.showEntryView());
        }

        if (this.aboutContinueBtn) {
            this.aboutContinueBtn.addEventListener('click', () => this.enterApp());
        }
    }

    showEntryView() {
        if (this.entryView) this.entryView.classList.remove('hidden');
        if (this.aboutView) this.aboutView.classList.add('hidden');
    }

    showAboutProject() {
        if (this.entryView) this.entryView.classList.add('hidden');
        if (this.aboutView) this.aboutView.classList.remove('hidden');
    }

    enterApp() {
        if (!this.element) return;

        this.element.style.opacity = '0';
        this.element.style.pointerEvents = 'none';

        setTimeout(() => {
            this.element.classList.add('hidden');
            if (this.uiLayer) this.uiLayer.classList.remove('hidden');
        }, 500);
    }

    hide() {
        if (!this.element) return;

        this.updateProgress('Ready', 1);
        setTimeout(() => {
            if (this.loaderView) this.loaderView.classList.add('hidden');
            if (this.entryView) this.entryView.classList.remove('hidden');
        }, 500);
    }
}
