<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    $_POST = json_decode(file_get_contents("php://input"), true);
    
    if (!$_POST) {
        throw new Exception('Invalid JSON input');
    }

    $title = $_POST['name'] ?? '';
    $year = $_POST['year'] ?? '';
    $url = $_POST['url'] ?? '';
    $description = $_POST['caption'] ?? '';
    $tags = $_POST['tags'] ?? '';

    if (empty($title) || empty($url)) {
        throw new Exception('Title and URL are required');
    }

    $db = new SQLite3("memes.db");
    $db->busyTimeout(5000);
    $db->enableExceptions(true);
    

    $stmt = $db->prepare('INSERT INTO memes (title, year, url, description, tags) VALUES (:title, :year, :url, :description, :tags)');
    $stmt->bindValue(':title', $title, SQLITE3_TEXT);
    $stmt->bindValue(':year', $year, SQLITE3_TEXT);
    $stmt->bindValue(':url', $url, SQLITE3_TEXT);
    $stmt->bindValue(':description', $description, SQLITE3_TEXT);
    $stmt->bindValue(':tags', $tags, SQLITE3_TEXT);
    
    $result = $stmt->execute();

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Meme added successfully', 'id' => $db->lastInsertRowID()]);
    } else {
        throw new Exception('Failed to execute query');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage(), 'error' => $e->getMessage()]);
}

