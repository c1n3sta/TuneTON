<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests for actual playback updates
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get track ID from URL
$trackId = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$trackId) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Track ID is required']);
    exit();
}

// In a real application, you would update the play count in a database
// For this example, we'll just return a success response
$response = [
    'trackId' => (string)$trackId,
    'playCount' => 1, // In a real app, this would be fetched from the database
    'totalPlaybacks' => 1 // In a real app, this would be the total play count
];

echo json_encode($response);
