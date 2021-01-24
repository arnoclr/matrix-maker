<?php
// Adam

header("content-type: application/json");
$dir = $_SERVER['DOCUMENT_ROOT'] . "/bitmapFonts/*";

$fonts = [];

foreach (glob($dir) as $path) {
    $fonts[] =[
        "label"=>basename($path, ".json"),
        "value"=>basename($path, ".json")
    ];
}

echo json_encode($fonts, 128);
file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/data/fonts.json", json_encode($fonts, 128));