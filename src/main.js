import './ui/Style.css';
import { SceneManager } from './three/SceneManager.js';
import { SplashScreen } from './ui/Splash.js';
import { PanelManager } from './ui/Panels.js';
import { GeminiService } from './ai/GeminiService.js';

// DOM Structure Injection
document.querySelector('#app').innerHTML = `
    <!-- Splash Screen -->
    <div id="splash-screen">
        <div class="splash-content splash-loader-view">
            <div class="splash-loader-card">
                <img src="/ASSETS/Logo/AC_AUTO_CARE-removebg-preview.png" class="splash-logo" alt="AC Auto Care">
                <div class="loader-container">
                    <div class="loader-progress"></div>
                </div>
                <div class="loading-text">Preparing 3D Viewer...</div>
            </div>
        </div>

        <div class="splash-content splash-entry-view hidden" id="splash-entry-view">
            <div class="entry-shell">
                <div class="entry-hero">
                    <div class="entry-brand-row">
                        <div class="entry-partner-badge">
                            <img src="https://www.puo.edu.my/webportal/wp-content/uploads/2026/03/puo-kpt.png" alt="PUO Logo" class="entry-partner-logo">
                            <div class="entry-partner-copy">
                                <span class="entry-partner-label">Academic Collaboration</span>
                                <strong>Made by AC AUTO CARe PUO</strong>
                            </div>
                        </div>
                    </div>
                    <div class="entry-kicker">AC Auto Care</div>
                    <h1>Professional aircond diagnostics for clearer inspection and learning.</h1>
                    <p>
                        Built around the Proton X50, the platform combines 3D visualization, circuit references, troubleshooting guidance, and AI-assisted support in one environment.
                    </p>
                    <div class="entry-actions">
                        <button class="entry-btn primary" id="btn-continue-app">Continue</button>
                        <button class="entry-btn secondary" id="btn-open-about">About Project</button>
                    </div>
                </div>
                <div class="entry-preview-grid">
                    <div class="entry-preview-glow"></div>
                    <div class="entry-preview-card">
                        <div class="entry-preview-icon"><i class="ph ph-cube"></i></div>
                        <h3>3D system view</h3>
                        <p>Review the vehicle layout visually before moving into component-level checks.</p>
                    </div>
                    <div class="entry-preview-card">
                        <div class="entry-preview-icon"><i class="ph ph-circuitry"></i></div>
                        <h3>Circuit references</h3>
                        <p>Access curated diagrams and embedded repair material in a single workflow.</p>
                    </div>
                    <div class="entry-preview-card">
                        <div class="entry-preview-icon"><i class="ph ph-robot"></i></div>
                        <h3>AI support</h3>
                        <p>Use project-aware assistance grounded in the website’s troubleshooting and part data.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="about-project-view hidden" id="about-project-view">
            <div class="about-project-shell">
                <div class="about-project-topbar">
                    <button class="about-nav-btn" id="btn-back-entry">
                        <i class="ph ph-arrow-left"></i>
                        Back
                    </button>
                    <button class="about-nav-btn primary" id="btn-about-continue">
                        Continue
                        <i class="ph ph-arrow-right"></i>
                    </button>
                </div>

                <section class="about-landing-hero">
                    <div class="about-landing-copy">
                        <div class="about-chip">About Project</div>
                        <h1>AC AUTO CARe rethinks how car aircond systems are explained, explored, and diagnosed.</h1>
                        <p>
                            Designed around the Proton X50, the project brings 3D context, circuit references, practical troubleshooting guidance, component information, and AI-assisted support into one professional experience.
                        </p>
                    </div>
                    <div class="about-landing-meta">
                        <div class="about-meta-row">
                            <span>Focus</span>
                            <strong>Car aircond diagnosis and learning</strong>
                        </div>
                        <div class="about-meta-row">
                            <span>Core tools</span>
                            <strong>3D viewer, circuit media, structured guide, AI</strong>
                        </div>
                        <div class="about-meta-row">
                            <span>Audience</span>
                            <strong>Students, technicians, and car owners</strong>
                        </div>
                    </div>
                </section>

                <section class="about-video-showcase">
                    <div class="about-section-intro">
                        <span>Project Video</span>
                        <h2>A clearer view of the project vision and user experience.</h2>
                        <p>
                            The video highlights the direction of the platform and how the experience brings technical guidance into a more accessible digital format.
                        </p>
                    </div>
                    <div class="about-video-frame wide">
                        <iframe
                            src="https://www.youtube.com/embed/UCEDIEk9JFc"
                            title="About Project Video"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                        ></iframe>
                    </div>
                </section>

                <section class="about-detail-band">
                    <div class="about-section-intro compact">
                        <span>What Makes It Different</span>
                        <h2>One connected workflow instead of scattered technical references.</h2>
                    </div>
                    <div class="about-detail-grid">
                        <div class="about-detail-column">
                            <h3>Visual understanding first</h3>
                            <p>The 3D viewer gives users context before they move into troubleshooting, helping them understand the system in a more intuitive way.</p>
                        </div>
                        <div class="about-detail-column">
                            <h3>Practical diagnostic structure</h3>
                            <p>The troubleshooting guide organizes common failures into causes and actions so users can follow a clearer inspection path.</p>
                        </div>
                        <div class="about-detail-column">
                            <h3>Integrated project knowledge</h3>
                            <p>Reference videos, circuit visuals, component data, and AI support live inside one platform rather than across multiple disconnected tools.</p>
                        </div>
                    </div>
                </section>

                <section class="about-narrative-section">
                    <div class="about-section-intro compact">
                        <span>Project Narrative</span>
                        <h2>Built to bridge technical content and user confidence.</h2>
                    </div>
                    <div class="about-narrative-grid">
                        <div>
                            <span>Problem</span>
                            <h3>Aircond knowledge is usually fragmented</h3>
                            <p>Users often depend on scattered videos, notes, circuit diagrams, and trial-and-error when trying to understand system issues.</p>
                        </div>
                        <div>
                            <span>Approach</span>
                            <h3>Create one modern reference environment</h3>
                            <p>AC Auto Care combines visual learning, guided troubleshooting, and project-aware AI into one consistent experience.</p>
                        </div>
                        <div>
                            <span>Outcome</span>
                            <h3>More clarity, better decision-making</h3>
                            <p>The platform helps users move from uncertainty to understanding with a more structured and polished digital workflow.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <!-- Transition Loader -->
    <div id="transition-loader" class="hidden">
        <div class="spinner"></div>
    </div>

    <!-- 3D Canvas -->
    <div id="canvas-container"></div>

    <!-- App UI Shell -->
    <div id="app-shell" class="hidden">
        <nav class="app-nav">
            <div class="nav-brand">
                <img src="/ASSETS/Logo/AC_AUTO_CARE-removebg-preview.png" alt="Logo">
            </div>
            
            <div class="nav-items">
                <button class="nav-item active" id="nav-home" title="3D View">
                    <span class="icon"><i class="ph ph-cube"></i></span>
                    <span class="label">View</span>
                </button>
                <button class="nav-item mobile-nav-only" id="nav-menu" title="Menu">
                    <span class="icon"><i class="ph ph-squares-four"></i></span>
                    <span class="label">Menu</span>
                </button>
                <button class="nav-item desktop-nav-only" id="nav-aircond" title="Aircond Circuit">
                    <span class="icon"><i class="ph ph-circuitry"></i></span>
                    <span class="label">Aircond</span>
                </button>
                <button class="nav-item desktop-nav-only" id="nav-issues" title="Diagnostics">
                    <span class="icon"><i class="ph ph-warning-circle"></i></span>
                    <span class="label">Issues</span>
                </button>
                <button class="nav-item desktop-nav-only" id="nav-details" title="Part Details">
                    <span class="icon"><i class="ph ph-list-dashes"></i></span>
                    <span class="label">Details</span>
                </button>
                <button class="nav-item" id="nav-ai" title="AI Assistant">
                    <span class="icon"><i class="ph ph-chat-circle-text"></i></span>
                    <span class="label">Ask AI</span>
                </button>
                <button class="nav-item desktop-nav-only" id="nav-about" title="About Project">
                    <span class="icon"><i class="ph ph-info"></i></span>
                    <span class="label">About</span>
                </button>
            </div>
        </nav>

        <main class="app-content">
            <div class="quick-actions">
                <div class="status-chip">
                    <span class="status-dot"></span>
                    <span class="status-text">Interactive 3D Active</span>
                </div>
            </div>

            <div class="panel-container hidden" id="menu-panel">
                <header class="panel-header">
                    <h2>Menu</h2>
                    <button class="close-panel"><i class="ph ph-x"></i></button>
                </header>
                <div class="panel-body">
                    <div class="mobile-menu-intro">
                        Quick access to the rest of the app sections.
                    </div>
                    <div class="mobile-menu-grid">
                        <button class="mobile-menu-card" data-target-panel="aircond">
                            <span class="mobile-menu-icon"><i class="ph ph-circuitry"></i></span>
                            <span class="mobile-menu-title">Aircond</span>
                            <span class="mobile-menu-copy">Circuit references and video guides.</span>
                        </button>
                        <button class="mobile-menu-card" data-target-panel="issues">
                            <span class="mobile-menu-icon"><i class="ph ph-warning-circle"></i></span>
                            <span class="mobile-menu-title">Issues</span>
                            <span class="mobile-menu-copy">Troubleshooting steps and checks.</span>
                        </button>
                        <button class="mobile-menu-card" data-target-panel="details">
                            <span class="mobile-menu-icon"><i class="ph ph-list-dashes"></i></span>
                            <span class="mobile-menu-title">Details</span>
                            <span class="mobile-menu-copy">Components, functions, types, and images.</span>
                        </button>
                        <button class="mobile-menu-card" data-target-panel="about">
                            <span class="mobile-menu-icon"><i class="ph ph-info"></i></span>
                            <span class="mobile-menu-title">About Project</span>
                            <span class="mobile-menu-copy">Project overview and presentation page.</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Issues Panel -->
            <div class="panel-container hidden" id="issues-panel">
                <header class="panel-header">
                    <h2>Panduan Mengesan Masalah</h2>
                    <button class="close-panel"><i class="ph ph-x"></i></button>
                </header>
                <div class="panel-body" id="issues-list">
                    <div class="skeleton-loader"></div>
                </div>
            </div>

            <!-- Aircond Circuit Panel -->
            <div class="panel-container hidden" id="aircond-panel">
                <header class="panel-header">
                    <h2>Aircond Circuit</h2>
                    <button class="close-panel"><i class="ph ph-x"></i></button>
                </header>
                <div class="panel-body">
                    <div class="aircond-gallery-intro">
                        Aircond wiring references and video guides.
                    </div>
                    <div class="aircond-video-list">
                        <div class="aircond-video-card">
                            <div class="aircond-video-frame">
                                <iframe
                                    src="https://www.youtube.com/embed/nm0vXRiLTqs"
                                    title="Aircond Video Guide 1"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                ></iframe>
                            </div>
                            <div class="aircond-meta">
                                <div class="aircond-title">Video Guide 1</div>
                                <div class="aircond-caption">Embedded repair reference video.</div>
                            </div>
                        </div>
                        <div class="aircond-video-card">
                            <div class="aircond-video-frame">
                                <iframe
                                    src="https://www.youtube.com/embed/_mIVKDBd8ts"
                                    title="Aircond Video Guide 2"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                ></iframe>
                            </div>
                            <div class="aircond-meta">
                                <div class="aircond-title">Video Guide 2</div>
                                <div class="aircond-caption">Embedded repair reference video.</div>
                            </div>
                        </div>
                    </div>
                    <div class="aircond-gallery" id="aircond-gallery"></div>
                </div>
            </div>

            <!-- Details Panel -->
            <div class="panel-container hidden" id="details-panel">
                <header class="panel-header">
                    <h2>Part Details</h2>
                    <button class="close-panel"><i class="ph ph-x"></i></button>
                </header>
                <div class="panel-body" id="details-list">
                    <div class="skeleton-loader"></div>
                </div>
            </div>

            <!-- AI Panel -->
            <div class="panel-container hidden" id="ai-panel">
                <header class="panel-header">
                    <h2>AI Mechanic</h2>
                    <button class="close-panel"><i class="ph ph-x"></i></button>
                </header>
                <div class="chat-interface">
                    <div class="chat-messages">
                        <div class="message ai-message">
                            <div class="avatar"><i class="ph ph-robot"></i></div>
                            <div class="bubble">
                                Hello! I'm ready to help you diagnose any car issues.
                            </div>
                        </div>
                    </div>
                    <div class="chat-input-wrapper">
                        <input type="text" placeholder="Type your question..." class="chat-input">
                        <button class="chat-send">
                            <i class="ph ph-paper-plane-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Details Modal Overlay -->
    <div id="detail-modal" class="modal-overlay hidden">
        <div class="modal-card">
            <header class="modal-header">
                <h3 id="modal-title">Part Name</h3>
                <button class="close-modal"><i class="ph ph-x"></i></button>
            </header>
            <div class="modal-body">
                <img id="modal-img" src="" alt="">
                <div id="modal-gallery" class="modal-gallery"></div>
                <div class="modal-info">
                    <h4>Fungsi</h4>
                    <div id="modal-issues"></div>
                    
                    <h4>Jenis</h4>
                    <div id="modal-prevention"></div>

                    <h4>Ringkasan</h4>
                    <div id="modal-description"></div>
                </div>
            </div>
            <footer class="modal-footer">
                <div class="modal-action-stack">
                    <button class="btn-secondary close-modal-btn">Close</button>
                    <button class="btn-primary" id="btn-ask-ai">
                        <i class="ph ph-sparkle"></i> Diagnose with AI
                    </button>
                    <button class="btn-secondary btn-about-project" id="btn-go-about-project">
                        <i class="ph ph-info"></i> About Project
                    </button>
                </div>
            </footer>
        </div>
    </div>
`;

// Initialize Application
async function initApp() {
    const splash = new SplashScreen();
    window.splashScreen = splash;
    const gemini = new GeminiService();
    const sceneManager = new SceneManager(document.getElementById('canvas-container'));

    // Initialize UI
    const panels = new PanelManager(sceneManager, gemini);

    try {
        await sceneManager.loadAssets((msg, percent) => {
            splash.updateProgress(msg, percent);
        });
        splash.hide();
    } catch (e) {
        console.error("Startup failed", e);
        splash.updateProgress("Error - Reload Page", 0);
    }
}

initApp();
