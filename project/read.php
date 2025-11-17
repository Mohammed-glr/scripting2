<?php
header('Content-Type: application/json');

// Maak verbinding met de database
$db = new SQLite3("memes.db");
$db->busyTimeout(5000);
 
// Selecter maximaal 10 studenten uit de student tabel
// gesorteerd op studentNaam aflopend.
$query = "SELECT * FROM memes";
$result=$db->query($query);

// Doorloop de resultaten en plaats deze in een Array
$jsonArray = [];
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $jsonArray[] = $row;
}

// Encodeer de Array en maak er een JSON encoded string van
$json = json_encode($jsonArray);

// Toon de JSON string op het scherm
echo $json;
exit;

