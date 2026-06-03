<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$jsonFile = __DIR__ . '/../data/gallery.json';

if (!file_exists($jsonFile)) {
    echo '[]';
    exit;
}

echo file_get_contents($jsonFile);