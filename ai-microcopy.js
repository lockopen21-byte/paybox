/* ai-microcopy.js
   KI-generated dynamic headlines, CTAs and microcopy based on user context
   Rotates variants and tracks performance
*/
(function(){
  const AIMicrocopy = {
    
    // Microcopy variants (can be generated dynamically via API)
    variants: {
      heroHeadline: [
        "PayBox für Windows – Sichere Zahlungen in Sekunden",
        "Windows-App für professionelle Zahlungsabwicklung",
        "Zahlung verwalten, überall auf Windows",
        "Die schnellste Zahlungs-App für Windows 10/11",
        "PayBox Windows: Trusted by Thousands"
      ],
      ctaButton: [
        "Jetzt herunterladen",
        "Windows-Version laden",
        "Kostenlos installieren",
        "Starten Sie jetzt",
        "Sofort downloaden",
        "2-Minuten-Installation"
      ],
      trustLine: [
        "✓ Datei signiert und verifiziert",
        "✓ 73.2 MB | Sofort einsatzbereit",
        "✓ VirusTotal scanned | Sicher",
        "✓ Tausende von Nutzern vertrauen PayBox",
        "✓ Windows 10/11 native"
      ],
      benefit1: [
        "🚀 Blitzschnell installieren",
        "⚡ 2 Minuten bis zur Installation",
        "🏃 Sofort einsatzbereit",
        "🎯 Schnellstart für Windows"
      ],
      benefit2: [
        "🔒 Sicher und verschlüsselt",
        "🛡️ Höchste Sicherheitsstandards",
        "🔐 Banking-Grade Sicherheit",
        "✅ Verifiziert und signiert"
      ],
      benefit3: [
        "💼 Nahtlose Integration",
        "⚙️ Professionelle Features",
        "🔗 Mit Windows-Apps verbunden",
        "📊 Analytics & Reporting"
      ],
      featureList: [
        "Windows 10/11 optimiert • Schnell • Sicher",
        "Native Windows-Integration • Premium-Support • Kostenlos",
        "Einfache Installation • Automatische Updates • 24/7 verfügbar",
        "Standalone-App • Cloud-Sync • Multi-Account"
      ]
    },

    // Get random variant from category
    get: function(category){
      const variants = this.variants[category];
      if (!variants || variants.length === 0) return '';
      const idx = Math.floor(Math.random() * variants.length);
      return variants[idx];
    },

    // Get personalized based on context
    getPersonalized: function(category, context){
      // context = {os, browser, timeOfDay, isReturning, ...}
      // Simple rules for now; can be extended with ML
      
      let variants = this.variants[category];
      if (!variants) return this.get(category);

      // Example: returning users get urgency-less copy
      if (context?.isReturning) {
        if (category === 'ctaButton') {
          return 'Upgrade installieren';
        }
      }

      // Example: mobile users get shorter copy
      if (context?.isMobile && category === 'heroHeadline') {
        return 'PayBox für Windows – Schnell & Sicher';
      }

      return variants[Math.floor(Math.random() * variants.length)];
    },

    // Apply to DOM
    applyToDOM: function(){
      // Hero headline
      const h1 = document.querySelector('h1');
      if (h1) h1.textContent = this.get('heroHeadline');

      // Primary CTA
      const ctaBtns = document.querySelectorAll('.download-btn');
      ctaBtns.forEach(btn => {
        const text = this.get('ctaButton');
        btn.textContent = '📥 ' + text;
        btn.setAttribute('data-microcopy-variant', text);
      });

      // Trust line (if exists)
      const trustSpan = document.querySelector('[data-trust-line]');
      if (trustSpan) trustSpan.textContent = this.get('trustLine');

      // Benefits (if exists)
      const benefits = document.querySelectorAll('[data-benefit]');
      if (benefits.length >= 3) {
        benefits[0].textContent = this.get('benefit1');
        benefits[1].textContent = this.get('benefit2');
        benefits[2].textContent = this.get('benefit3');
      }

      this.trackApplication();
    },

    trackApplication: function(){
      try{
        window.gtag && window.gtag('event', 'ai_microcopy_applied', {
          timestamp: new Date().toISOString(),
          url: window.location.pathname
        });
      }catch(e){}
    },

    // Generate variants dynamically via API (for future ML integration)
    generateAsync: function(category, apiUrl){
      return fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          category: category,
          context: {
            os: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      })
      .then(r => r.json())
      .then(data => {
        if (data.variants) {
          this.variants[category] = data.variants;
          return data.variants[0];
        }
        return this.get(category);
      })
      .catch(() => this.get(category));
    }
  };

  window.WDWAIMicrocopy = AIMicrocopy;

  // Auto-apply on load (if data-ai-microcopy attribute present)
  document.addEventListener('DOMContentLoaded', () => {
    if (document.documentElement.hasAttribute('data-ai-microcopy')) {
      AIMicrocopy.applyToDOM();
    }
  });

})();
