// download.js - Simple Node.js/Express Download Handler
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Konfiguration
const EXE_PATH = path.join(__dirname, '../../../git_projects/windowsapps#/proj2/dist/PayBox Setup 1.0.0.exe');
const EXPECTED_SHA256 = '356D3CEBEFE69F10F98BCEF2A55527A8ACC94A187A54C3A99743CE0D2A6296A7';

// Download-Endpoint
app.get('/download/paybox-windows', (req, res) => {
  // Überprüfe, ob Datei existiert
  if (!fs.existsSync(EXE_PATH)) {
    res.status(404).json({ error: 'File not found', path: EXE_PATH });
    return;
  }

  // Logging
  console.log(`[PayBox Download] IP=${req.ip}, UA=${req.get('user-agent')?.substring(0, 50)}`);

  // Streaming
  const fileStream = fs.createReadStream(EXE_PATH);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="PayBox Setup 1.0.0.exe"');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  fileStream.on('error', (err) => {
    console.error('Stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  });

  fileStream.pipe(res);
});

// Meta-Endpoint
app.get('/api/paybox/windows/meta.json', (req, res) => {
  const stats = fs.statSync(EXE_PATH);
  res.json({
    fileName: 'PayBox Setup 1.0.0.exe',
    fileSize: stats.size,
    sha256: EXPECTED_SHA256,
    vtReport: 'https://www.virustotal.com/gui/file/356d3cebefe69f10f98bcef2a55527a8acc94a187a54c3a99743ce0d2a6296a7',
    downloadUrl: '/download/paybox-windows',
    version: '1.0.0',
    releaseDate: '2026-01-21'
  });
});

app.listen(3000, () => console.log('PayBox Download Server running on :3000'));
