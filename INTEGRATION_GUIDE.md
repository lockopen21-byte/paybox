# Windows Download Optimization – Vollständiger Integrationsguide

Alle Dateien und Module für eine umfassende Windows-Download-Steigerung.

## Dateien im Kit

| Datei | Zweck |
|-------|-------|
| `windows-download-widget.js` | Hauptwidget: OS-Erkennung, CTA-Button, Download-Tracking |
| `windows-download-widget.css` | Stilke für Widget & Modal |
| `ab-test-manager.js` | A/B-Test-Variant-Assignment & Event-Tracking |
| `install-help-modal.js` | Pop-up mit Installationsanleitung, Fehler-FAQ, Support |
| `ai-microcopy.js` | Dynamische Headlines, CTAs, Microcopy-Rotation |
| `analytics-events.js` | Umfassendes Funnel-Tracking (Impressions, Clicks, Scroll, Session) |
| `windows-download.html` | Fertige Landing-Page (Vorlage) |
| `paybox-windows-meta.json` | Datei-Metadaten (SHA256, Größe, VirusTotal-Link) |

## Integration – Schritt für Schritt

### 1. CSS & JS einbinden

Füge in deine Website/App folgendes ein:

```html
<!-- CSS -->
<link rel="stylesheet" href="/assets/windows-download-widget/windows-download-widget.css">

<!-- Scripts (laden in dieser Reihenfolge mit defer) -->
<script src="/assets/windows-download-widget/windows-download-widget.js" defer></script>
<script src="/assets/windows-download-widget/ab-test-manager.js" defer></script>
<script src="/assets/windows-download-widget/install-help-modal.js" defer></script>
<script src="/assets/windows-download-widget/ai-microcopy.js" defer></script>
<script src="/assets/windows-download-widget/analytics-events.js" defer></script>

<!-- GA4 (replace with your ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA4_ID');
</script>
```

### 2. HTML Struktur (Minimal)

```html
<div class="hero" 
     data-download-url="/downloads/PayBox-Setup-1.0.0.exe" 
     data-file-name="PayBox Setup 1.0.0.exe"
     data-file-size="76712692" 
     data-sha256="356D3CEBEFE69F10F98BCEF2A55527A8ACC94A187A54C3A99743CE0D2A6296A7"
     data-ai-microcopy>
  <h1>Lade PayBox herunter</h1>
  <p>Windows 10 & 11 App für sichere Zahlungen</p>
  <a href="/downloads/PayBox-Setup-1.0.0.exe" download class="download-btn">
    Jetzt herunterladen
  </a>
</div>
```

### 3. A/B-Tests konfigurieren

```html
<script>
  document.addEventListener('DOMContentLoaded', function(){
    window.WDWABTestManager.init({
      'cta-text': {
        active: true,
        variants: ['Jetzt herunterladen', 'Kostenlos installieren', 'Windows-Version laden'],
        weights: [33, 33, 34],
        conversionEvent: 'download_click'
      },
      'cta-color': {
        active: true,
        variants: ['blue', 'green'],
        weights: [50, 50],
        conversionEvent: 'download_click'
      },
      'hero-image': {
        active: true,
        variants: ['screenshot-1', 'screenshot-2', 'video-preview'],
        weights: [33, 33, 34],
        conversionEvent: 'download_impression'
      }
    });

    // Abrufen und anwenden von Test-Varianten
    const ctaVariant = window.WDWABTestManager.getVariant('cta-text');
    console.log('A/B Test Variant:', ctaVariant);
    
    // In deinen DOM einbauen und trackConversion() aufrufen
  });
</script>
```

### 4. KI-Microcopy aktivieren

Füge `data-ai-microcopy` zum Hero-Div hinzu:

```html
<div class="hero" data-ai-microcopy>
  <!-- Headlines, CTAs, Benefits werden dynamisch generiert -->
</div>
```

Optional: Verwende in deinem JS:

```javascript
// Statisch
const headline = window.WDWAIMicrocopy.get('heroHeadline');
document.querySelector('h1').textContent = headline;

// Personalisiert
const personalized = window.WDWAIMicrocopy.getPersonalized('ctaButton', {
  isReturning: true,
  isMobile: window.innerWidth < 768
});
```

### 5. Install-Help-Modal öffnen

Das Modal wird automatisch auf Windows-Geräten injiziert. Benutzer öffnen es mit:

```html
<button data-install-help>Hilfe bei der Installation?</button>
```

Oder programmgesteuert:

```javascript
window.WDWInstallHelpModal.open();
```

### 6. Benutzerdefinierte Events tracken

```javascript
// Manuell
window.WDWAnalyticsEvents.trackEvent('custom_event', {
  key: 'value'
});

// Funnel-Tracking
window.WDWAnalyticsEvents.trackFunnel('cta_click', {
  variant: 'test-a'
});
```

## A/B Test – Beispiele & Auswertung

### Test-Szenario: CTA-Farbe

```javascript
// Setup
const config = {
  'cta-color': {
    active: true,
    variants: ['#0078D7', '#00a4ef'], // blue, light-blue
    weights: [50, 50],
    conversionEvent: 'download_click'
  }
};

// Abrufen des zugeordneten Varianten
const variant = window.WDWABTestManager.getVariant('cta-color');
document.querySelector('.download-btn').style.background = variant;

// Tracking
// → Automatisch per event 'download_click' + 'test'-Parameter

// Analyse in GA4:
// Events: download_impression (Kontrolle) vs. download_click (Conversion)
// Dimensionen: test_name, variant
// Bericht: Conversion Rate % pro Variante
```

### Test-Szenario: CTA-Text

```javascript
const texts = [
  'Jetzt herunterladen',       // Control
  'Kostenlos installieren',    // Variant A: Emphasize price
  'Schnellstart – 2 Minuten'   // Variant B: Emphasize speed
];

// → Segmentiere Conversion-Rate per Text-Variante
// → Statistisch signifikant ab ~100 Konversionen pro Variante
```

### Statistische Signifikanz (Quick Check)

Nutze diesen Calc für Stichprobengröße:
- Baseline Conversion Rate: z. B. 2%
- Minimum Detectable Effect: 20% (relative), = 0.4% absolut
- Signifikanz-Level: 95% (α = 0.05)
- Power: 80%
- **Benötigte Samples pro Variante: ~2500 Impressionen** → ~50 Konversionen

## Monitoring & Analytics Dashboard

### GA4 Events zu tracken

| Event | Param | Beschreibung |
|-------|-------|-------------|
| `page_view` | os, url, title | Seite geladen |
| `download_impression` | os, location, file | CTA sichtbar |
| `download_hover` | element | CTA-Hover |
| `download_click` | file, href, test, variant | Download gestartet |
| `scroll_depth` | depth_percent | 25%, 50%, 75%, 100% |
| `install_help_open` | - | Modal geöffnet |
| `install_help_tab_view` | tab | Error/FAQ/Steps geklickt |
| `install_help_support_contact` | - | Support-Link geklickt |
| `ab_test_impression` | test, variant | A/B-Test Impres sion |
| `ab_test_conversion` | test, variant | A/B-Test Konversion |
| `ai_microcopy_applied` | - | Microcopy geladen |
| `page_session_complete` | duration_seconds, download_clicked, install_help_opened | Session-Abschluss |

### GA4 Dashboard-Anfragen

**1. Download-Konversionsrate nach OS:**
```
Event: download_click
Dimensionen: os
Metriken: Event Count, Users
Ergebnis: % Windows vs. Other
```

**2. Funnel-Analyse:**
```
Sequenz: page_view → download_impression → download_click
Segmentiert nach: Variant (A/B-Test)
```

**3. Zeitliche Trends:**
```
Event: download_click
Timeline: Täglich
Vergleich: Test-Variant A vs. B
```

**4. Help Modal Nutzung:**
```
Event: install_help_open → install_help_tab_view → install_help_support_contact
Erkennung: Wo brechen Nutzer ab?
```

**5. Scroll-Tiefe & Engagement:**
```
Event: scroll_depth
Segments: Windows-Users
Filter: download_clicked = true/false
Insicht: Engagieren sich sichtende Nutzer mehr?
```

## Server-Endpoints (Optional)

### Meta-Datei-Endpoint

```
GET /api/paybox/windows/meta.json
Response:
{
  "fileName": "PayBox Setup 1.0.0.exe",
  "fileSize": 76712692,
  "sha256": "356D3CEBEFE69F10F98BCEF2A55527A8ACC94A187A54C3A99743CE0D2A6296A7",
  "vtReport": "https://www.virustotal.com/gui/file/...",
  "downloadUrl": "/downloads/PayBox-Setup-1.0.0.exe",
  "version": "1.0.0"
}
```

### KI-Microcopy-Endpoint (Future)

```
POST /api/paybox/windows/microcopy
Body: {category: "heroHeadline", context: {...}}
Response: {variants: [...]}
```

### Analytics-Log-Endpoint

```
POST /api/paybox/windows/events
Body: {event: "download_click", data: {...}}
Response: {ok: true}
```

## Sicherheit & Signatur

### SHA256 Verifikation (PowerShell)

```powershell
$file = "PayBox Setup 1.0.0.exe"
$expected = "356D3CEBEFE69F10F98BCEF2A55527A8ACC94A187A54C3A99743CE0D2A6296A7"
$actual = (Get-FileHash $file -Algorithm SHA256).Hash
if ($actual -eq $expected) { Write-Host "OK" } else { Write-Host "MISMATCH" }
```

### Authenticode-Signatur (Optional – benötigt Zertifikat)

```powershell
signtool sign /fd SHA256 /a /tr http://timestamp.digicert.com /td SHA256 "PayBox Setup 1.0.0.exe"
Get-AuthenticodeSignature "PayBox Setup 1.0.0.exe"
```

### VirusTotal-Upload

Manuell: https://www.virustotal.com/gui/home/upload

API (mit Token):
```powershell
curl -X POST "https://www.virustotal.com/api/v3/files" \
  -H "x-apikey: YOUR_API_KEY" \
  -F "file=@PayBox Setup 1.0.0.exe"
```

## Nächste Optimierungen

1. **Heatmap-Tracking** (Hotjar/Crazy Egg) → Wo klicken Nutzer?
2. **Session Replay** → Wie verhalten sich Nutzer?
3. **Email Retargeting** → Nutzer, die CTA sahen, aber nicht klickten
4. **SEO Strukturierte Daten** (JSON-LD `SoftwareApplication`)
5. **Dynamischer Download-Link** (geolokalisierte Mirrors/CDN)
6. **Social Proof** (Bewertungen, User-Count, Reviews)
7. **Video-Demo** (screencast installation / use-case)

## Support

- Support-E-Mail: support@paybox.local
- GitHub Issues: [github.com/paybox/windows-download](https://github.com)
- Dokumentation: [paybox.local/docs/windows](https://paybox.local)
