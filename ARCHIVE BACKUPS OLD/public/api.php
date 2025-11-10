<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$path = $_GET['path'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Simple router
switch ("$method $path") {
    case 'GET tracks':
        echo json_encode([
            ['id' => '1', 'title' => 'Sample Track 1', 'artist' => 'Artist 1', 'duration' => 180, 'playCount' => 0, 'audioUrl' => '/audio/sample1.mp3'],
            ['id' => '2', 'title' => 'Sample Track 2', 'artist' => 'Artist 2', 'duration' => 210, 'playCount' => 0, 'audioUrl' => '/audio/sample2.mp3']
        ]);
        break;
        
    case 'POST playbacks/1':
    case 'POST playbacks/2':
        echo json_encode(['trackId' => explode('/', $path)[1], 'playCount' => 1, 'totalPlaybacks' => 1]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}
