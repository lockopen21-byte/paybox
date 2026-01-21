# Code-Signing Guide für PayBox Setup 1.0.0.exe

## Problem
Windows SmartScreen zeigt Warnung: "Konnte nicht heruntergeladen werden" 
→ Diese Warnung verschwindet **nur mit Authenticode-Signatur**

## Lösung: Digitale Signatur (Code-Signing)

### Schritt 1: Authenticode-Zertifikat kaufen (7-40€)

**Empfohlene Anbieter (schnell & günstig):**
- **Sectigo (GlobalSign)**: https://www.sectigo.com/ssl-certificates-tls/code-signing
  - Preis: ~€99/Jahr
  - Lieferzeit: 5-10 Minuten
  - Format: .pfx oder .spc+.pvk
  
- **Thawte (DigiCert)**: https://www.thawte.com/digital-certificates/code-signing/index.html
  - Preis: ~€159/Jahr
  - Lieferzeit: 1-2 Stunden

- **Comodo**: https://www.instantssl.com/code-signing-certificates
  - Preis: ~€49-79/Jahr
  - Lieferzeit: Sofort (automatisch)

### Schritt 2: Zertifikat herunterladen
Nach Kauf erhältst du: **yourname.pfx** oder **yourname.p12**
→ Speichern in: `c:\Users\locko\OneDrive\Desktop\web seite pay box\windows-download-widget\`

### Schritt 3: Windows SDK installieren (falls nicht vorhanden)
```powershell
# Downloaden von:
# https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/

# Oder via Package Manager (schneller):
choco install windows-sdk-10-version-2104-all -y
```

### Schritt 4: EXE signieren
```powershell
cd "c:\Users\locko\OneDrive\Desktop\web seite pay box\windows-download-widget"

# Zertifikat vorbereiten (wenn .pfx vorhanden):
signtool sign /fd SHA256 /a /f "yourname.pfx" /p "YOUR_PASSWORD" /tr http://timestamp.digicert.com /td SHA256 "PayBox Setup 1.0.0.exe"

# ODER (wenn .spc + .pvk vorhanden):
signtool sign /fd SHA256 /a /spc "yourname.spc" /k "yourname.pvk" /tr http://timestamp.digicert.com /td SHA256 "PayBox Setup 1.0.0.exe"
```

**Parameter erklärung:**
- `/fd SHA256` = SHA256 Fingerprint (moderner Standard)
- `/a` = Automatisch das beste Zertifikat wählen
- `/f` = Zertifikat-Datei (.pfx)
- `/p` = Passwort für Zertifikat
- `/tr` = Timestamp Server (verhindert Ablauf)
- `/td SHA256` = Timestamp mit SHA256

### Schritt 5: Signatur überprüfen
```powershell
signtool verify /pa "PayBox Setup 1.0.0.exe"

# Output sollte sein:
# Successfully verified: PayBox Setup 1.0.0.exe
```

### Schritt 6: SmartScreen-Warnung überprüfen
- Installers Anwendung herunterladen und ausführen
- Windows sollte **KEINE Warnung** mehr zeigen
- Falls noch Warnung: Neustarten oder Cache löschen

---

## Kosten & Zeit

| Aktion | Kosten | Zeit |
|--------|--------|------|
| Zertifikat kaufen | €49-160/Jahr | 5 Min - 2h |
| SDK installieren | Kostenlos | 10 Min |
| EXE signieren | Kostenlos | 2 Min |
| SmartScreen-Update | - | 24-48h |
| **TOTAL** | **~€50-160/Jahr** | **~20 Min** |

---

## Alternative: Self-Signed Certificate (Kostenlos, aber weniger Vertrauen)

```powershell
# Selbst-signiertes Zertifikat erstellen:
$cert = New-SelfSignedCertificate -DnsName "PayBox" -Type CodeSigningCert -CertStoreLocation cert:\CurrentUser\My

# Zertifikat exportieren:
Export-PfxCertificate -Cert $cert -FilePath "paybox-selfsigned.pfx" -Password (ConvertTo-SecureString -String "password123" -AsPlainText -Force)

# EXE signieren:
signtool sign /fd SHA256 /f "paybox-selfsigned.pfx" /p "password123" /tr http://timestamp.digicert.com /td SHA256 "PayBox Setup 1.0.0.exe"
```

⚠️ **Nachteil:** Nutzer sehen trotzdem Warnung, da Zertifikat nicht vertrauenswürdig ist
✅ **Vorteil:** Kostenlos, schnell

---

## Best Practice: Beides kombinieren

1. **Jetzt:** VirusTotal-Links + SICHERHEIT.txt (✅ Schon implementiert)
2. **Nächste Woche:** €50 Zertifikat kaufen → EXE signieren → SmartScreen verschwindet
3. **Result:** 100% vertrauenswürdig, 0 Warnungen

---

## Fragen?

Support: support@paybox.local

