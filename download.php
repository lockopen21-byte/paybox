<?php
/**
 * PayBox Windows Download Handler – ROBUST VERSION
 * Versucht mehrere Pfade automatisch zu finden
 */

error_reporting(E_ALL);
ini_set('display_errors', 0); // Fehler nicht anzeigen, nur loggen

// ========== KONFIGURATION ==========
$EXPECTED_SHA256 = '356D3CEBEFE69F10F98BCEF2A55527A8ACC94A187A54C3A99743CE0D2A6296A7';
$FILENAME = 'PayBox Setup 1.0.0.exe';
$LOG_FILE = __DIR__ . '/paybox-downloads.log';

// Versuche verschiedene Pfade automatisch zu finden
$possible_paths = [
    __DIR__ . '/PayBox Setup 1.0.0.exe',                    // Im gleichen Verzeichnis
    __DIR__ . '/PayBox Setup 1.0.0.exe',                    // Mit Escape
    dirname(__DIR__) . '/PayBox Setup 1.0.0.exe',           // Parent Directory
    'c:\\Users\\locko\\OneDrive\\Desktop\\web seite pay box\\windows-download-widget\\PayBox Setup 1.0.0.exe',  // Absoluter Pfad
];

$EXE_PATH = null;
foreach ($possible_paths as $path) {
    if (file_exists($path)) {
        $EXE_PATH = $path;
        break;
    }
}

// ========== VALIDIERUNG ==========
// Überprüfe, ob Datei gefunden wurde
if (!$EXE_PATH || !file_exists($EXE_PATH)) {
    error_log("PayBox Download Error: File not found. Tried: " . implode('; ', $possible_paths), 0);
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'File not found in any location',
        'tried_paths' => $possible_paths,
        'debug_dir' => __DIR__
    ]);
    exit;
}

// Berechne SHA256 (optional, kann bei großen Dateien langsam sein)
$actual_sha256 = strtoupper(hash_file('sha256', $EXE_PATH));
if ($actual_sha256 !== $EXPECTED_SHA256) {
    error_log("PayBox SHA256 Warning: expected {$EXPECTED_SHA256}, got {$actual_sha256}", 0);
    // Warnung protokollieren, aber Download dennoch erlauben
    // Entferne die Zeile unten wenn SHA256 Mismatch als Fehler gelten soll
    // http_response_code(412); // Precondition Failed
    // exit;
}

// ========== LOGGING ==========
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$timestamp = date('Y-m-d H:i:s');
$log_entry = "[{$timestamp}] IP={$ip} | UA={$user_agent}\n";
error_log($log_entry, 3, $LOG_FILE);

// ========== DOWNLOAD-HEADERS ==========
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $FILENAME . '"');
header('Content-Length: ' . filesize($EXE_PATH));
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: public');
header('X-Content-Type-Options: nosniff');
header('X-Download-Options: noopen');
header('X-Frame-Options: DENY');

// Optionales Caching (nur wenn Sie möchten, dass Browser die Datei cacht)
// header('Cache-Control: public, max-age=86400');

// ========== STREAMING ==========
// Streame die Datei in Chunks (speichert RAM)
$file = fopen($EXE_PATH, 'rb');
if (!$file) {
    error_log("PayBox Download Error: Could not open file {$EXE_PATH}", 0);
    http_response_code(500);
    echo 'Error: Could not open file for download';
    exit;
}

// Streame in 8MB Chunks
$chunk_size = 8 * 1024 * 1024;
while (!feof($file)) {
    echo fread($file, $chunk_size);
    flush();
}
fclose($file);

exit;
?>

