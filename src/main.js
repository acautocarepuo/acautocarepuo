import './ui/Style.css';
import { SceneManager } from './three/SceneManager.js';
import { SplashScreen } from './ui/Splash.js';
import { PanelManager } from './ui/Panels.js';
import { GeminiService } from './ai/GeminiService.js';

// DOM Structure Injection
document.querySelector('#app').innerHTML = `
    <!-- Splash Screen -->
    <div id="splash-screen">
        <div class="splash-content">
            <img src="/ASSETS/Logo/AC_AUTO_CARE-removebg-preview.png" class="splash-logo" alt="AC Auto Care">
            <div class="loader-container">
                <div class="loader-progress"></div>
            </div>
            <div class="loading-text">Preparing 3D Viewer...</div>
        </div>
    </div>

    <!-- Transition Loader -->
    <div id="transition-loader" class="hidden">
        <div class="spinner"></div>
    </div>

    <!-- 3D Canvas -->
    <div id="canvas-container"></div>

    <!-- App UI Shell -->
    <div id="app-shell">
        <nav class="app-nav">
            <div class="nav-brand">
                <img src="/ASSETS/Logo/AC_AUTO_CARE-removebg-preview.png" alt="Logo">
            </div>
            
            <div class="nav-items">
                <button class="nav-item active" id="nav-home" title="3D View">
                    <span class="icon"><i class="ph ph-cube"></i></span>
                    <span class="label">View</span>
                </button>
                <button class="nav-item" id="nav-aircond" title="Aircond Circuit">
                    <span class="icon"><i class="ph ph-circuitry"></i></span>
                    <span class="label">Aircond</span>
                </button>
                <button class="nav-item" id="nav-issues" title="Diagnostics">
                    <span class="icon"><i class="ph ph-warning-circle"></i></span>
                    <span class="label">Issues</span>
                </button>
                <button class="nav-item" id="nav-details" title="Part Details">
                    <span class="icon"><i class="ph ph-list-dashes"></i></span>
                    <span class="label">Details</span>
                </button>
                <button class="nav-item" id="nav-ai" title="AI Assistant">
                    <span class="icon"><i class="ph ph-chat-circle-text"></i></span>
                    <span class="label">Ask AI</span>
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

            <!-- Issues Panel -->
            <div class="panel-container hidden" id="issues-panel">
                <header class="panel-header">
                    <h2>Common Issues</h2>
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
                        Four aircond circuit reference images live in <code>/public/ASSETS/Aircond Circuit/</code>.
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
                <div class="modal-info">
                    <h4>Common Issues</h4>
                    <div id="modal-issues"></div>
                    
                    <h4>Prevention</h4>
                    <div id="modal-prevention"></div>

                    <h4>Description</h4>
                    <div id="modal-description"></div>
                </div>
            </div>
            <footer class="modal-footer">
                <button class="btn-secondary close-modal-btn">Close</button>
                <button class="btn-primary" id="btn-ask-ai">
                    <i class="ph ph-sparkle"></i> Diagnose with AI
                </button>
            </footer>
        </div>
    </div>
`;

// Initialize Application
async function initApp() {
    const splash = new SplashScreen();
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
