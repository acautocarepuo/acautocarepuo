export class PanelManager {
    constructor(sceneManager, geminiService) {
        this.sceneManager = sceneManager;
        this.geminiService = geminiService;

        // Navigation Items
        this.navItems = {
            home: document.getElementById('nav-home'),
            aircond: document.getElementById('nav-aircond'),
            issues: document.getElementById('nav-issues'),
            details: document.getElementById('nav-details'),
            ai: document.getElementById('nav-ai')
        };

        // Panels
        this.panels = {
            aircond: document.getElementById('aircond-panel'),
            issues: document.getElementById('issues-panel'),
            details: document.getElementById('details-panel'),
            ai: document.getElementById('ai-panel')
        };

        // Modal Elements
        this.modal = {
            overlay: document.getElementById('detail-modal'),
            title: document.getElementById('modal-title'),
            img: document.getElementById('modal-img'),
            issues: document.getElementById('modal-issues'),
            prevention: document.getElementById('modal-prevention'),
            description: document.getElementById('modal-description'),
            askBtn: document.getElementById('btn-ask-ai')
        };

        this.loader = document.getElementById('transition-loader');

        this.setupEventListeners();
        this.loadAircondGallery();
        this.loadCommonIssues();
        this.loadPartDetails();

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

        this.navItems.aircond.addEventListener('click', () => {
            this.setActiveNav('aircond');
            this.openPanel('aircond');
        });

        this.navItems.issues.addEventListener('click', () => {
            this.setActiveNav('issues');
            this.openPanel('issues');
        });

        this.navItems.details.addEventListener('click', () => {
            this.setActiveNav('details');
            this.openPanel('details');
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
        const issues = (item['Part Common Issue (Seperate by /)'] || '').split('/').map(i => `<p>• ${i.trim()}</p>`).join('');
        this.modal.issues.innerHTML = issues || '<p>No common issues listed.</p>';

        const prevention = (item['Part Prevention Method (Seperate by /)'] || '').split('/').map(i => `<p>• ${i.trim()}</p>`).join('');
        this.modal.prevention.innerHTML = prevention || '<p>No prevention methods listed.</p>';

        // Description
        const description = item['Part Details'] || 'No additional details available.';
        this.modal.description.innerHTML = `<p>${description}</p>`;

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

    loadAircondGallery() {
        const container = document.getElementById('aircond-gallery');
        if (!container) return;

        const images = [
            {
                src: 'https://aienginehelper.netlify.app/ASSETS/Aircond%20Circuit/aircond_3.png',
                title: 'Aircond Circuit 3'
            },
            {
                src: 'https://aienginehelper.netlify.app/ASSETS/Aircond%20Circuit/aircond_4.png',
                title: 'Aircond Circuit 4'
            }
        ];

        container.innerHTML = '';

        images.forEach((image) => {
            const card = document.createElement('div');
            card.className = 'aircond-card';
            card.innerHTML = `
                <img src="${image.src}" alt="${image.title}" class="aircond-img">
                <div class="aircond-meta">
                    <div class="aircond-title">${image.title}</div>
                    <div class="aircond-caption">Reference image for the aircond circuit layout.</div>
                </div>
            `;

            const img = card.querySelector('img');
            img.onerror = () => {
                img.replaceWith(this.createMissingAircondState(image.title));
            };

            container.appendChild(card);
        });
    }

    createMissingAircondState(title) {
        const state = document.createElement('div');
        state.className = 'aircond-missing';
        state.innerHTML = `
            <div class="aircond-missing-icon"><i class="ph ph-image-broken"></i></div>
            <div class="aircond-title">${title}</div>
            <div class="aircond-caption">Add this image to /public/ASSETS/Aircond Circuit/.</div>
        `;
        return state;
    }

    async loadCommonIssues() {
        const container = document.getElementById('issues-list');
        if (!container) return;

        const troubleshootingGuide = [
            {
                problem: 'Unit pemampat tidak hidup',
                causes: [
                    {
                        title: 'Fius terbakar / putus',
                        checks: [
                            'Uji keterusan fius dengan menggunakan multimeter (Ohm).',
                            'Menguji kehadiran arus menggunakan test lamp.',
                            'Jika rosak, gantikan fius.'
                        ]
                    },
                    {
                        title: 'Gegelung magnet terbakar / putus',
                        checks: [
                            'Ujian keterusan gegelung dengan menggunakan multimeter (Ohm).',
                            'Menguji kehadiran arus menggunakan test lamp.',
                            'Jika rosak, gantikan gegelung magnet.'
                        ]
                    },
                    {
                        title: 'Bahan pendingin tidak mencukupi / tiada',
                        checks: [
                            'Memasangkan tolok pancarongga dan dapatkan bacaan tekanan pada sistem.',
                            'Jika kurang bahan pendingin atau tiada bahan pendingin dalam sistem, buat ujian tekanan (nitrogen), cari bahagian yang bocor dan baiki.'
                        ]
                    },
                    {
                        title: 'Thermal amplifier rosak',
                        checks: [
                            'Lakukan pengujian keterusan pada komponen thermal amplifier.',
                            'Ganti thermal amplifier jika rosak.'
                        ]
                    }
                ]
            },
            {
                problem: 'Unit pemampat hidup mati',
                causes: [
                    {
                        title: 'Pemeluwap terlalu panas',
                        checks: [
                            'Periksa sama ada kipas pemeluwap tidak berfungsi.',
                            'Periksa sirip pemeluwap yang mereput atau kotor.',
                            'Pastikan tiada objek yang menghalang pengaliran udara di bahagian pemeluwap.',
                            'Periksa penapis pengering jika tersumbat.',
                            'Gantikan mana-mana komponen berkaitan selepas pemeriksaan dibuat.'
                        ]
                    },
                    {
                        title: 'Suis tekanan bermasalah',
                        checks: [
                            'Uji pendawaian suis tekanan.',
                            'Uji kecekapan suis tekanan.'
                        ]
                    },
                    {
                        title: 'Suis laras suhu bermasalah',
                        checks: [
                            'Periksa terminal penyambungan pada terminal suis laras suhu.',
                            'Periksa keadaan sesentuh pada suis laras suhu.',
                            'Ganti komponen jika keadaan sesentuh bermasalah.'
                        ]
                    }
                ]
            },
            {
                problem: 'Kereta bergerak sejuk berhenti panas',
                causes: [
                    {
                        title: 'Kipas pemeluwap lemah / tidak berfungsi',
                        checks: [
                            'Periksa fius kipas pemeluwap.',
                            'Periksa geganti kipas pemeluwap.',
                            'Periksa motor kipas pemeluwap.',
                            'Ganti komponen yang mengalami kerosakan.'
                        ]
                    }
                ]
            },
            {
                problem: 'Angin dingin dalam kereta tidak kuat',
                causes: [
                    {
                        title: 'Penapis angin kabin kotor',
                        checks: [
                            'Periksa keadaan penapis udara kabin.',
                            'Cuci jika jenis yang boleh dicuci.',
                            'Tukar baru jika cabin filter jenis pakai buang.'
                        ]
                    },
                    {
                        title: 'Sirip penyejat tersumbat dengan habuk kotoran',
                        checks: [
                            'Periksa keadaan sirip penyejat.',
                            'Cuci dengan pencuci kimia jika kekotoran terlalu teruk.',
                            'Tukar penyejat baru bagi kereta yang memerlukan kerja menanggalkan dashboard untuk mengeluarkan penyejat.'
                        ]
                    },
                    {
                        title: 'Kipas penghembus lemah / berhabuk',
                        checks: [
                            'Periksa kelajuan pusingan motor penghembus.',
                            'Periksa keadaan habuk pada bilah kipas penghembus.',
                            'Pastikan tiada objek lain disedut masuk ke dalam motor kipas penghembus.',
                            'Jika putaran kipas penghembus perlahan, gantikan carbon brush baru atau tukar set motor kipas penghembus yang baru.'
                        ]
                    }
                ]
            }
        ];

        container.innerHTML = `
            <section class="issues-hero">
                <div class="issues-kicker">Jadual 3.1</div>
                <h3>Panduan Mengesan Masalah</h3>
                <p>Rujukan pantas untuk semakan kerosakan aircond kereta, lengkap dengan punca biasa dan tindakan pemeriksaan yang boleh dibuat.</p>
            </section>
        `;

        troubleshootingGuide.forEach((section, index) => {
            const card = document.createElement('article');
            card.className = 'diagnostic-card';
            card.innerHTML = `
                <div class="diagnostic-card-top">
                    <div class="diagnostic-badge">Masalah ${index + 1}</div>
                    <h4 class="diagnostic-problem">${section.problem}</h4>
                </div>
                <div class="diagnostic-grid">
                    ${section.causes.map(cause => `
                        <div class="diagnostic-cause-card">
                            <div class="diagnostic-label-row">
                                <span class="diagnostic-label cause">Punca biasa kerosakan</span>
                            </div>
                            <div class="diagnostic-cause-title">${cause.title}</div>
                            <div class="diagnostic-label-row">
                                <span class="diagnostic-label action">Cara mengesan / membaiki</span>
                            </div>
                            <ul class="diagnostic-checklist">
                                ${cause.checks.map(check => `<li>${check}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            `;

            container.appendChild(card);
        });
    }

    async loadPartDetails() {
        const container = document.getElementById('details-list');
        try {
            const res = await fetch('https://opensheet.elk.sh/16Y_-z6ar4Xd_5esJKjEJtVzwKPt8Mnelb4HeJsKZkjw/data');
            const data = await res.json();

            container.innerHTML = '';

            data.forEach(item => {
                if (!item['Part Name']) return;

                const card = document.createElement('div');
                card.className = 'issue-card'; // Reusing issue-card for consistent styling
                card.innerHTML = `
                    <div class="card-content">
                        <img src="${item['Part Image (URL)']}" class="issue-img" onerror="this.src='https://via.placeholder.com/300x150'">
                        <div class="issue-name">${item['Part Name']}</div>
                        <div class="issue-list">
                            ${item['Part Details']}
                        </div>
                    </div>
                `;

                // Click to Open Modal
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
