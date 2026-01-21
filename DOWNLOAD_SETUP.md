# PayBox Windows – Download-Setup Anleitung

**Problem:** Die PayBox Setup 1.0.0.exe-Datei wird nicht heruntergeladen.

**Lösung:** Konfiguriere einen Download-Endpunkt auf deinem Server.

---

## 🎯 Option 1: PHP (einfach)

### Schritt 1: Datei bereitstellen

**Variante A – Mit Pfad-Mapping (bevorzugt):**
```bash
# Die Datei befindet sich unter:
C:\Users\locko\OneDrive\Desktop\git_projects\windowsapps#\proj2\dist\PayBox Setup 1.0.0.exe

# Der PHP-Code wird automatisch über den Pfad streamen.
```

**Variante B – Kopie in Webroot:**
```bash
# Kopiere die EXE direkt in deinen Webroot:
cp "C:\Users\locko\OneDrive\Desktop\git_projects\windowsapps#\proj2\dist\PayBox Setup 1.0.0.exe" "C:\xampp\htdocs\paybox\paybox-setup-1.0.0.exe"
```

### Schritt 2: download.php einrichten

```bash
# Kopiere die Datei in den Webroot:
cp download.php /var/www/paybox/download.php
```

### Schritt 3: Nutze den Download-Link

```html
<a href="https://paybox.local/download.php" download>Windows herunterladen</a>
```

### Schritt 4: Update HTML & Widget

Ersetze in `windows-download.html` und `windows-download-widget.js`:
```diff
- href="https://paybox-releases.example.com/PayBox-Setup-1.0.0.exe"
+ href="https://paybox.local/download.php"
```

---

## 🎯 Option 2: Node.js/Express

### Schritt 1: Dependencies installieren

```bash
npm install express
```

### Schritt 2: Server starten

```bash
node download.js
# oder mit PM2 (production):
pm2 start download.js --name "paybox-download"
```

### Schritt 3: Update Download-Link

```html
<a href="http://localhost:3000/download/paybox-windows" download>Windows herunterladen</a>
```

---

## 🎯 Option 3: Statischer File-Server (nginx)

### Schritt 1: Kopiere Datei in Webroot

```bash
cp "PayBox Setup 1.0.0.exe" /var/www/paybox/downloads/paybox-setup-1.0.0.exe
```

### Schritt 2: nginx konfigurieren

```nginx
location /downloads/ {
    alias /var/www/paybox/downloads/;
    add_header Content-Disposition 'attachment; filename="PayBox Setup 1.0.0.exe"';
    add_header Cache-Control 'no-cache, must-revalidate';
}
```

### Schritt 3: Update Link

```html
<a href="https://paybox.local/downloads/paybox-setup-1.0.0.exe" download>Windows herunterladen</a>
```

---

## 🎯 Option 4: CDN / Cloud Storage

### Beispiel: Azure Blob Storage

```bash
# Upload zur Azure CLI:
az storage blob upload --account-name payboxcdn --container-name releases \
  --name "PayBox-Setup-1.0.0.exe" \
  --file "C:\path\to\PayBox Setup 1.0.0.exe"
```

Download-URL:
```
https://payboxcdn.blob.core.windows.net/releases/PayBox-Setup-1.0.0.exe
```

---

## ✅ Schnelltest

Nach dem Setup kannst du testen:

```bash
# Teste den Download (bekommt die Datei?)
curl -I "https://paybox.local/download.php"

# Sollte diese Header zeigen:
# Content-Type: application/octet-stream
# Content-Disposition: attachment; filename="PayBox Setup 1.0.0.exe"
# Content-Length: 76712692
```

---

## 🔒 Sicherheit

1. **SHA256 Check:** Der PHP-Code validiert die Datei-Größe automatisch
2. **No Caching:** `Cache-Control: no-cache` schützt vor Zwickmühle
3. **Logging:** Alle Downloads werden in `error.log` protokolliert
4. **HTTPS:** Stelle sicher, dass der Download über HTTPS erfolgt

---

## 📋 Checklist

- [ ] Wähle Option 1, 2, 3 oder 4
- [ ] Stelle Datei bereit (Kopie oder Mapping)
- [ ] Konfiguriere Endpoint
- [ ] Update URLs in `windows-download.html` + Widget
- [ ] Teste Download im Browser
- [ ] Prüfe Logs auf Fehler
- [ ] GA4 Events sollten `download_click` zeigen

---

## 🆘 Häufige Fehler

**"404 File not found"**
- Prüfe Dateipfad: Existiert die EXE wirklich?
- Prüfe Permissions: Hat der Web-User Lesezugriff?

**"File too large" oder Timeout**
- Nutze Streaming (Option 1 / 2 macht das automatisch)
- Erhöhe `php.ini`: `max_file_uploads = 100M`
- Nutze CDN für große Dateien

**"Chrome blocks download"**
- Das ist normal für unsigned EXEs
- Nach Authenticode-Signatur verschwindet die Warnung
- Nutze `signtool.exe` zum Signieren

**"Event zeigt keine Downloads in GA4"**
- Prüfe GA4 Real-Time Report
- Prüfe Browser-Konsole auf JS-Fehler
- Stelle sicher, dass die Link-URL korrekt ist

---

## 📞 Support

Fragen? Nutze diese URLs zum Debuggen:
- **Download testen:** `https://paybox.local/download.php`
- **Meta-Info:** `https://paybox.local/api/paybox/windows/meta.json`
- **GA4 Real-Time:** `https://analytics.google.com/analytics/web/`

---

**Nächste Schritte:**
1. Wähle eine Option oben (empfohlen: **Option 1 PHP**)
2. Folge den Schritten
3. Teste den Download
4. Aktualisiere die Widget-URLs
5. Starte GA4-Tracking
