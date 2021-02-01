<?php

$hash = sha1(time());

// clear static folder
$files = glob($_SERVER['DOCUMENT_ROOT'] . 'data/static/*');
foreach ($files as $file) {
    if (is_file($file)) {
        unlink($file);
    }
}

// genarate assets and push into static folder
$scripts_dir = $_SERVER['DOCUMENT_ROOT'] . "/data/*.js";
$styles_dir = $_SERVER['DOCUMENT_ROOT'] . "/data/*.css";

$scripts = [];
$styles = [];

foreach (glob($scripts_dir) as $script) {
    array_push($scripts, file_get_contents($script));
}

foreach (glob($styles_dir) as $style) {
    array_push($styles, file_get_contents($style));
}

$js_str = '';
foreach ($scripts as $script) {
    $js_str = $js_str . $script . PHP_EOL;
}

$css_str = '';
foreach ($styles as $style) {
    $css_str = $css_str . $style . PHP_EOL;
}

file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/data/static/$hash.js", $js_str);
file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/data/static/$hash.css", $css_str);

// write script and style tag in html
$delimiter = "<!-- start_assets -->";
$delimiter_end = "<!-- end_assets -->";
$tags = '<link rel="stylesheet" href="data/static/'.$hash.'.css">' . PHP_EOL . '<script defer src="data/static/'.$hash.'.js"></script>';

$html = file_get_contents($_SERVER['DOCUMENT_ROOT'] . "/index.html");
$html = preg_replace("/" . $delimiter ."[\s\S]+?" . $delimiter_end . "/", $delimiter . PHP_EOL . $delimiter_end, $html);
$html = str_replace($delimiter, $delimiter . PHP_EOL . $tags, $html);

file_put_contents($_SERVER['DOCUMENT_ROOT'] . "index.html", $html);

echo htmlspecialchars($tags);