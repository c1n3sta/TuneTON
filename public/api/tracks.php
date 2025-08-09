<?php
// Set headers first to ensure proper content type
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Disable error display to prevent HTML in JSON output
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Function to send JSON response and exit
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Path to audio directory - adjust this to match your server's directory structure
$possibleAudioPaths = [
    '/www/tuneton.space/audio',  // Full server path
    __DIR__ . '/../../audio',    // Relative path from api directory
    __DIR__ . '/../../../audio', // Alternative relative path
    '/audio',                    // Web root relative path
    './audio'                    // Current directory relative path
];

$audioDir = '';
foreach ($possibleAudioPaths as $path) {
    if (is_dir($path)) {
        $audioDir = $path;
        break;
    }
}

// If no valid directory found, try to find audio directory by scanning parent directories
if (empty($audioDir)) {
    $currentDir = __DIR__;
    for ($i = 0; $i < 5; $i++) {
        $checkPath = $currentDir . '/audio';
        if (is_dir($checkPath)) {
            $audioDir = $checkPath;
            break;
        }
        $currentDir = dirname($currentDir);
    }
}

// Debug output
$debugInfo = [
    'php_version' => phpversion(),
    'current_dir' => __DIR__,
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Not set',
    'audio_dir' => $audioDir,
    'audio_dir_exists' => is_dir($audioDir) ? 'true' : 'false',
    'audio_dir_readable' => is_readable($audioDir) ? 'true' : 'false',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Not set',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Not set',
];

$tracks = [];
$id = 1;

try {
    if (empty($audioDir) || !is_dir($audioDir)) {
        throw new Exception('Audio directory not found or not accessible');
    }

    $files = scandir($audioDir);
    if ($files === false) {
        throw new Exception('Failed to scan directory: ' . $audioDir);
    }
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        
        $filePath = $audioDir . '/' . $file;
        $fileExt = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        
        // Only process audio files
        if (in_array($fileExt, ['mp3', 'wav', 'ogg', 'm4a', 'flac'])) {
            // Extract title and artist from filename if in format "artist - title.ext"
            $fileName = pathinfo($file, PATHINFO_FILENAME);
            $parts = explode(' - ', $fileName, 2);
            
            $artist = count($parts) > 1 ? $parts[0] : 'Unknown Artist';
            $title = count($parts) > 1 ? $parts[1] : $fileName;
            
            // Get file duration (this is a simple implementation)
            $duration = 180; // Default duration in seconds
            
            // Build the correct paths
            $audioUrl = '/audio/' . rawurlencode($file);
            $fullPath = $audioDir . '/' . $file;  // Use the audio directory we found earlier
            $fileExists = file_exists($fullPath);
            $isReadable = is_readable($fullPath);
            
            // For debugging - list the actual files in the directory
            $dirContents = [];
            if (is_dir($audioDir)) {
                $dirContents = array_diff(scandir($audioDir), ['.', '..']);
            }
            
            $tracks[] = [
                'id' => (string)$id++,
                'title' => $title,
                'artist' => $artist,
                'duration' => $duration,
                'playCount' => 0,
                'audioUrl' => $audioUrl,
                '_debug' => [
                    'file_exists' => $fileExists,
                    'is_readable' => $isReadable,
                    'full_path' => $fullPath,
                    'directory_contents' => $dirContents,
                    'audio_dir' => $audioDir
                ]
            ];
            
            // Log any issues with the file
            if (!$fileExists || !$isReadable) {
                error_log('Audio file issue - File: ' . $file . 
                         ', Exists: ' . ($fileExists ? 'Yes' : 'No') . 
                         ', Readable: ' . ($isReadable ? 'Yes' : 'No') .
                         ', Path: ' . $fullPath);
            }
        }
    }
    
    // Return the tracks as JSON
    sendJsonResponse([
        'success' => true,
        'count' => count($tracks),
        'tracks' => $tracks,
        'debug' => $debugInfo
    ]);
    
} catch (Throwable $e) {
    error_log('API Error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    
    $debugInfo['error'] = $e->getMessage();
    
    sendJsonResponse([
        'success' => false,
        'error' => 'Internal server error',
        'message' => $e->getMessage(),
        'debug' => array_merge($debugInfo, [
            'tried_paths' => $possibleAudioPaths,
            'current_dir' => __DIR__,
            'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Not set'
        ])
    ], 500);
}
