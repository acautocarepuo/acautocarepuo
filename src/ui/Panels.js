export class PanelManager {
    constructor(sceneManager, geminiService) {
        this.sceneManager = sceneManager;
        this.geminiService = geminiService;

        // Navigation Items
        this.navItems = {
            home: document.getElementById('nav-home'),
            engine: document.getElementById('nav-engine'),
            issues: document.getElementById('nav-issues'),
            ai: document.getElementById('nav-ai')
        };

        // Panels
        this.panels = {
            issues: document.getElementById('issues-panel'),
            ai: document.getElementById('ai-panel')
        };

        // Modal Elements
        this.modal = {
            overlay: document.getElementById('detail-modal'),
            title: document.getElementById('modal-title'),
            img: document.getElementById('modal-img'),
            issues: document.getElementById('modal-issues'),
            prevention: document.getElementById('modal-prevention'),
            askBtn: document.getElementById('btn-ask-ai')
        };

        this.loader = document.getElementById('transition-loader');

        this.setupEventListeners();
        this.loadCommonIssues();

        // Hook into scene transitions if method exists, else manual
        // Extending SceneManager via callback injection
        this.sceneManager.onTransitionStart = () => this.showLoader();
        this.sceneManager.onTransitionEnd = () => this.hideLoader();
    }

    showLoader() {
        if (this.loader) this.loader.classList.remove('hidden');
    }

    hideLoader() {
        if (this.loader) setTimeout(() => this.loader.classList.add('hidden'), 800); // Artificial delay for smoothness
    }

    setupEventListeners() {
        // Nav Click Handlers
        this.navItems.home.addEventListener('click', () => {
            if (this.sceneManager.state.currentView !== 'exterior') {
                this.sceneManager.switchToExteriorView();
            }
            this.setActiveNav('home');
            this.closeAllPanels();
        });

        this.navItems.engine.addEventListener('click', () => {
            if (this.sceneManager.state.currentView !== 'engine') {
                this.sceneManager.switchToEngineView();
            }
            this.setActiveNav('engine');
            this.closeAllPanels();
        });

        this.navItems.issues.addEventListener('click', () => {
            this.setActiveNav('issues');
            this.openPanel('issues');
        });

        this.navItems.ai.addEventListener('click', () => {
            this.setActiveNav('ai');
            this.openPanel('ai');
        });

        // Close Buttons
        document.querySelectorAll('.close-panel').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllPanels());
        });

        // Modal Close
        document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Chat Interaction
        const sendBtn = document.querySelector('.chat-send');
        const input = document.querySelector('.chat-input');

        const sendMessage = () => {
            const text = input.value.trim();
            if (!text) return;
            this.addChatMessage('user', text);
            input.value = '';

            this.addChatMessage('ai', 'Thinking...');
            const msgs = document.querySelector('.chat-messages');
            const loadingBubble = msgs.lastElementChild.querySelector('.bubble');

            this.geminiService.askQuestion(text).then(res => {
                loadingBubble.innerHTML = res.replace(/\n/g, '<br>');
            });
        };

        if (sendBtn) sendBtn.addEventListener('click', sendMessage);
        if (input) input.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
    }

    setActiveNav(id) {
        Object.values(this.navItems).forEach(el => el.classList.remove('active'));
        if (this.navItems[id]) this.navItems[id].classList.add('active');
    }

    openPanel(name) {
        this.closeAllPanels();
        const panel = this.panels[name];
        if (panel) panel.classList.remove('hidden');
    }

    closeAllPanels() {
        Object.values(this.panels).forEach(p => p.classList.add('hidden'));
    }

    openModal(item) {
        this.modal.title.textContent = item['Part Name'];
        this.modal.img.src = item['Part Image (URL)'];
        this.modal.img.onerror = () => this.modal.img.src = 'https://via.placeholder.com/300x150';

        // Format lists
        const issues = item['Part Common Issue (Seperate by /)'].split('/').map(i => `<p>• ${i.trim()}</p>`).join('');
        this.modal.issues.innerHTML = issues;

        const prevention = item['Part Prevention Method  (Seperate by /)'].split('/').map(i => `<p>• ${i.trim()}</p>`).join('');
        this.modal.prevention.innerHTML = prevention;

        // Setup AI Button
        this.modal.askBtn.onclick = () => {
            this.closeModal();
            this.setActiveNav('ai');
            this.openPanel('ai');

            setTimeout(() => {
                this.addChatMessage('user', `Diagnose: ${item['Part Name']}`);
                this.addChatMessage('ai', 'Analyzing details...');
                // Trigger AI
                this.geminiService.diagnosePart(item['Part Name'], item['Part Common Issue (Seperate by /)'])
                    .then(res => {
                        // Update the last message
                        const msgs = document.querySelector('.chat-messages');
                        const bubble = msgs.lastElementChild.querySelector('.bubble');
                        bubble.innerHTML = res.replace(/\n/g, '<br>');
                    });
            }, 300);
        };

        this.modal.overlay.classList.remove('hidden');
    }

    closeModal() {
        this.modal.overlay.classList.add('hidden');
    }

    addChatMessage(role, text) {
        const container = document.querySelector('.chat-messages');
        const div = document.createElement('div');
        div.className = `message ${role}-message`;

        const avatar = role === 'ai' ? '<div class="avatar"><i class="ph ph-robot"></i></div>' : '';
        div.innerHTML = `
            ${avatar}
            <div class="bubble">${text}</div>
        `;

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    async loadCommonIssues() {
        const container = document.getElementById('issues-list');
        try {
            const res = await fetch('https://opensheet.elk.sh/16Y_-z6ar4Xd_5esJKjEJtVzwKPt8Mnelb4HeJsKZkjw/data');
            const data = await res.json();

            container.innerHTML = '';

            data.forEach(item => {
                if (!item['Part Name']) return;

                const card = document.createElement('div');
                card.className = 'issue-card';
                card.innerHTML = `
                    <div class="card-content">
                         <img src="${item['Part Image (URL)']}" class="issue-img" onerror="this.src='https://via.placeholder.com/300x150'">
                        <div class="issue-name">${item['Part Name']}</div>
                        <div class="issue-list">
                            ${item['Part Common Issue (Seperate by /)'].split('/').slice(0, 2).map(i => `• ${i.trim()}`).join('<br>')}
                        </div>
                    </div>
                `;

                // Click to Open Modal instead of AI directly
                card.addEventListener('click', () => {
                    this.openModal(item);
                });

                container.appendChild(card);
            });
        } catch (e) {
            container.innerHTML = 'Failed to load data.';
        }
    }
}
