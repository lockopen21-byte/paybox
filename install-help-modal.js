/* install-help-modal.js
   Interactive install assistance modal for Windows users
   Shows step-by-step guide, common errors, and help triggers
*/
(function(){
  const InstallHelpModal = {
    html: `
<div id="wdw-install-modal" class="wdw-modal" role="dialog" aria-labelledby="modal-title">
  <div class="wdw-modal-overlay"></div>
  <div class="wdw-modal-content">
    <div class="wdw-modal-header">
      <h2 id="modal-title">PayBox Installation - Hilfe</h2>
      <button class="wdw-modal-close" aria-label="Schließen">&times;</button>
    </div>
    <div class="wdw-modal-body">
      <div class="wdw-modal-tabs">
        <button class="wdw-modal-tab active" data-tab="steps">Schritte</button>
        <button class="wdw-modal-tab" data-tab="errors">Fehler?</button>
        <button class="wdw-modal-tab" data-tab="faq">FAQ</button>
      </div>

      <div id="steps" class="wdw-modal-panel active">
        <h3>Schritt-für-Schritt Anleitung</h3>
        <ol>
          <li><strong>Herunterladen:</strong> Klicken Sie auf "Windows herunterladen". Die Datei wird gespeichert.</li>
          <li><strong>Speicherort prüfen:</strong> Normalerweise im Ordner "Downloads".</li>
          <li><strong>Installer öffnen:</strong> Doppelklick auf "PayBox Setup 1.0.0.exe".</li>
          <li><strong>Nutzerkonten-Kontrolle:</strong> Klicken Sie "Ja" wenn gefragt.</li>
          <li><strong>Lizenzbedingungen:</strong> Lesen und akzeptieren Sie die Bedingungen.</li>
          <li><strong>Zielordner:</strong> Wählen Sie den Installationsort (Standard ist OK).</li>
          <li><strong>Installation:</strong> Klicken Sie "Installieren" und warten Sie.</li>
          <li><strong>Fertig:</strong> Klicken Sie "Fertigstellen". PayBox startet automatisch.</li>
        </ol>
      </div>

      <div id="errors" class="wdw-modal-panel">
        <h3>Häufige Fehler & Lösungen</h3>
        <div class="wdw-error-item">
          <strong>❌ "Windows Defender hat die Datei blockiert"</strong>
          <p>Dies ist normal. Klicken Sie "Weitere Informationen" → "Trotzdem ausführen".</p>
        </div>
        <div class="wdw-error-item">
          <strong>❌ ".NET Runtime fehlt"</strong>
          <p>Installieren Sie <a href="https://dotnet.microsoft.com/en-us/download/dotnet/6.0" target="_blank">.NET 6.0 oder neuer</a>. Der Installer hilft auch.</p>
        </div>
        <div class="wdw-error-item">
          <strong>❌ "Nicht genug Speicherplatz"</strong>
          <p>PayBox benötigt ca. 200 MB. Löschen Sie temporäre Dateien oder erweitern Sie den Speicher.</p>
        </div>
        <div class="wdw-error-item">
          <strong>❌ Administratorrechte erforderlich</strong>
          <p>Rechtsklick auf PayBox Setup → "Als Administrator ausführen".</p>
        </div>
        <div class="wdw-error-item">
          <strong>❌ Antivirus blockiert</strong>
          <p>Temporär deaktivieren oder der Whitelist hinzufügen. SHA256 ist verifizierbar.</p>
        </div>
      </div>

      <div id="faq" class="wdw-modal-panel">
        <h3>Häufig gestellte Fragen</h3>
        <details>
          <summary>Kann ich PayBox auf mehreren Computern installieren?</summary>
          <p>Ja, Sie können PayBox auf jedem Computer mit einer gültigen Lizenz installieren.</p>
        </details>
        <details>
          <summary>Wie kann ich PayBox aktualisieren?</summary>
          <p>Laden Sie einfach die neueste Version herunter und führen Sie den Installer erneut aus. Ihre Einstellungen bleiben erhalten.</p>
        </details>
        <details>
          <summary>Benötigt PayBox Admin-Rechte?</summary>
          <p>Ja, für die Installation. Danach läuft PayBox als Standard-Benutzer.</p>
        </details>
        <details>
          <summary>Wird meine Firewall PayBox blockieren?</summary>
          <p>Möglicherweise. Erlauben Sie PayBox in der Windows Firewall unter "Apps zulassen".</p>
        </details>
      </div>
    </div>

    <div class="wdw-modal-footer">
      <button class="wdw-btn-secondary" id="wdw-modal-support">Kontakt zum Support</button>
      <button class="wdw-btn-primary" id="wdw-modal-close-btn">Schließen</button>
    </div>
  </div>
</div>
    `,

    css: `
.wdw-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;align-items:center;justify-content:center}
.wdw-modal.active{display:flex}
.wdw-modal-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);backdrop-filter:blur(2px)}
.wdw-modal-content{position:relative;background:#fff;border-radius:8px;width:90%;max-width:600px;max-height:80vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.3)}
.wdw-modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #e0e0e0;background:#f9f9f9}
.wdw-modal-header h2{margin:0;font-size:20px;color:#000}
.wdw-modal-close{background:none;border:none;font-size:24px;color:#666;cursor:pointer;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center}
.wdw-modal-close:hover{color:#000}
.wdw-modal-body{padding:20px}
.wdw-modal-tabs{display:flex;gap:8px;border-bottom:2px solid #e0e0e0;margin-bottom:20px}
.wdw-modal-tab{background:none;border:none;padding:10px 16px;cursor:pointer;font-weight:500;color:#666;border-bottom:3px solid transparent;transition:all 0.3s}
.wdw-modal-tab:hover{color:#0078D7}
.wdw-modal-tab.active{color:#0078D7;border-bottom-color:#0078D7}
.wdw-modal-panel{display:none}
.wdw-modal-panel.active{display:block}
.wdw-modal-panel h3{font-size:18px;margin:0 0 15px;color:#000}
.wdw-modal-panel ol{margin-left:20px;line-height:1.8}
.wdw-modal-panel li{margin:10px 0;color:#333}
.wdw-error-item{background:#fff3cd;border-left:4px solid #ffc107;padding:12px;margin:10px 0;border-radius:4px}
.wdw-error-item strong{color:#000}
.wdw-error-item p{margin:8px 0 0;color:#666;font-size:13px}
.wdw-modal-panel details{cursor:pointer;padding:10px;background:#f9f9f9;border-radius:4px;margin:10px 0}
.wdw-modal-panel summary{font-weight:600;color:#0078D7;outline:none}
.wdw-modal-panel details p{margin:10px 0 0;color:#666}
.wdw-modal-footer{display:flex;justify-content:space-between;padding:20px;border-top:1px solid #e0e0e0;background:#f9f9f9}
.wdw-btn-primary{background:#0078D7;color:#fff;padding:10px 16px;border:none;border-radius:6px;cursor:pointer;font-weight:600}
.wdw-btn-primary:hover{background:#005bb5}
.wdw-btn-secondary{background:none;border:1px solid #0078D7;color:#0078D7;padding:10px 16px;border-radius:6px;cursor:pointer;font-weight:600}
.wdw-btn-secondary:hover{background:#f0f8ff}
    `,

    init: function(){
      this.inject();
      this.bindEvents();
    },

    inject: function(){
      const style = document.createElement('style');
      style.textContent = this.css;
      document.head.appendChild(style);

      const div = document.createElement('div');
      div.innerHTML = this.html;
      document.body.appendChild(div.firstElementChild);
    },

    bindEvents: function(){
      const modal = document.getElementById('wdw-install-modal');
      const closeBtn = document.querySelector('.wdw-modal-close');
      const closeBtnFooter = document.getElementById('wdw-modal-close-btn');
      const supportBtn = document.getElementById('wdw-modal-support');
      const tabs = document.querySelectorAll('.wdw-modal-tab');
      const overlay = document.querySelector('.wdw-modal-overlay');

      const close = () => {
        modal.classList.remove('active');
        this.trackEvent('install_help_close');
      };

      closeBtn.addEventListener('click', close);
      closeBtnFooter.addEventListener('click', close);
      overlay.addEventListener('click', close);

      supportBtn.addEventListener('click', () => {
        window.location.href = 'mailto:support@paybox.local';
        this.trackEvent('install_help_support_contact');
      });

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.wdw-modal-panel').forEach(p => p.classList.remove('active'));
          
          tab.classList.add('active');
          const panelId = tab.getAttribute('data-tab');
          document.getElementById(panelId).classList.add('active');
          
          this.trackEvent('install_help_tab_view', {tab: panelId});
        });
      });
    },

    open: function(){
      const modal = document.getElementById('wdw-install-modal');
      modal.classList.add('active');
      this.trackEvent('install_help_open');
    },

    trackEvent: function(name, extra){
      const payload = Object.assign({feature: 'install_help_modal'}, extra);
      try{
        if (window.gtag) {
          window.gtag('event', name, payload);
        } else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(Object.assign({event: name}, payload));
        }
      }catch(e){}
    }
  };

  // Expose globally & auto-init on Windows
  window.WDWInstallHelpModal = InstallHelpModal;
  
  if (/(Windows NT|Win64|WOW64|Windows)/.test(navigator.userAgent)) {
    document.addEventListener('DOMContentLoaded', () => InstallHelpModal.init());
  }

})();
