/**
 * PayBox Download Manager
 * Intelligentes Error-Handling für Netzwerkprobleme
 */

class PayBoxDownloadManager {
    constructor() {
        this.downloadUrl = './PayBox Setup 1.0.0.exe';
        this.fallbackUrls = [
            '/PayBox Setup 1.0.0.exe',
            '/download.php',
            'http://localhost:8080/PayBox Setup 1.0.0.exe'
        ];
        this.maxRetries = 3;
        this.timeout = 30000; // 30 Sekunden
        this.retryCount = 0;
        this.init();
    }

    init() {
        // Überschreibe alle Download-Links mit Fehler-Handling
        document.addEventListener('DOMContentLoaded', () => {
            this.setupDownloadHandlers();
        });

        // Wenn bereits geladen
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupDownloadHandlers();
            });
        } else {
            this.setupDownloadHandlers();
        }
    }

    setupDownloadHandlers() {
        const downloadLinks = document.querySelectorAll('a[href*=".exe"], a[href*="download"]');
        
        downloadLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Normale Links erlauben, nur bei Problemen eingreifen
                // Browser-Download hat Vorrang
            });
        });

        // Fallback: Wenn HTML-Download nicht funktioniert
        this.addDownloadFallback();
    }

    addDownloadFallback() {
        // Injiziere versteckten Download-Manager
        const manager = document.createElement('div');
        manager.id = 'paybox-download-manager';
        manager.style.display = 'none';
        
        manager.innerHTML = `
            <div id="download-error-modal" style="
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    max-width: 500px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                ">
                    <h2 id="error-title">⚠️ Download-Fehler</h2>
                    <p id="error-message">Der Download konnte nicht gestartet werden. Versuchen Sie folgende Lösungen:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <h3 style="margin-top: 0;">Lösungsmöglichkeiten:</h3>
                        <ol style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>Seite neu laden:</strong> F5 oder Ctrl+Shift+R (Cache löschen)</li>
                            <li><strong>Browser wechseln:</strong> Versuchen Sie Chrome, Firefox oder Edge</li>
                            <li><strong>Direkter Download:</strong> 
                                <a id="direct-download-btn" href="./PayBox Setup 1.0.0.exe" download style="
                                    color: #0078D7;
                                    font-weight: bold;
                                    text-decoration: underline;
                                ">Hier klicken</a>
                            </li>
                            <li><strong>Netzwerk überprüfen:</strong> Stellen Sie sicher, dass Sie online sind</li>
                            <li><strong>Admin-Rechte:</strong> Führen Sie den Browser als Administrator aus</li>
                        </ol>
                    </div>

                    <div style="background: #fffbeb; border-left: 4px solid #fed7aa; padding: 12px; border-radius: 4px; margin: 15px 0;">
                        <strong>💡 Tipp:</strong> Wenn der Download weiterhin fehlschlägt, laden Sie die Datei später erneut herunter oder kontaktieren Sie den Support.
                    </div>

                    <div style="text-align: right;">
                        <button id="close-error-btn" style="
                            background: #0078D7;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Schließen</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(manager);

        // Event Listener
        document.getElementById('close-error-btn')?.addEventListener('click', () => {
            document.getElementById('download-error-modal').style.display = 'none';
        });
    }

    showError(message) {
        const modal = document.getElementById('download-error-modal');
        const messageEl = document.getElementById('error-message');
        
        if (modal) {
            messageEl.textContent = message;
            modal.style.display = 'flex';
        }
    }

    async checkServerHealth() {
        try {
            const response = await fetch('./', { 
                method: 'HEAD',
                timeout: 5000 
            });
            return response.ok;
        } catch (e) {
            console.error('Server Health Check failed:', e);
            return false;
        }
    }

    async testDownloadPath() {
        try {
            const response = await fetch('./PayBox Setup 1.0.0.exe', {
                method: 'HEAD',
                timeout: 10000
            });
            return response.ok;
        } catch (e) {
            console.warn('Download path check failed:', e);
            return false;
        }
    }

    logDownloadAttempt(success, error = null) {
        const logData = {
            timestamp: new Date().toISOString(),
            success: success,
            error: error,
            url: this.downloadUrl,
            retryCount: this.retryCount,
            userAgent: navigator.userAgent
        };

        // Sende an Analytics
        if (window.gtag) {
            gtag('event', success ? 'download_success' : 'download_error', {
                error_message: error,
                retry_count: this.retryCount
            });
        }

        console.log('Download Log:', logData);
    }
}

// Initialisiere beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PayBoxDownloadManager();
    });
} else {
    new PayBoxDownloadManager();
}

// Globale Fehlerbehandlung
window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('download')) {
        console.error('Download Error caught:', event);
        if (window.downloadManager) {
            window.downloadManager.logDownloadAttempt(false, event.message);
        }
    }
});
