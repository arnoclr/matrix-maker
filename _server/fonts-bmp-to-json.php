<?php
$fonts = [];
$fontFiles = glob("fonts\\churafont++ *x*.oft");

foreach ($fontFiles as $font) {
    $fontText = file_get_contents($font);
    $fontData = explode(PHP_EOL, getBetween('[newfont]', '[char]', $fontText), -2);
    $fontHeight = $fontData[4];
    $fontHorizontalGap = $fontData[5];
    $fontName = $fontData[1];
    $fontChars = explode('[char]', $fontText);
    array_shift($fontChars);
    $fontBmpName = str_replace('.oft', '.bmp', $font);
    $fontBmp = imagecreatefrombmp($fontBmpName);
    // echo "<img src='$fontBmpName'><br>";
    if(!empty($fontBmp)) {
        $fonts[$fontName]['charSpacing'] = $fontHorizontalGap;
        foreach ($fontChars as $char) {
            $props = explode(PHP_EOL, $char, -2);
            $fonts[$fontName][$props[1]]['ascent'] = $fontHeight;
            $fonts[$fontName][$props[1]]['glyph'] = [];
            $lines = [];
            if (!empty($props[4])) {
                for ($y = $props[4]; $y <= $props[4] + $fontHeight ; $y++) {
                    $string = '';
                    for ($x = $props[2]; $x <= $props[3]; $x++) { 
                        $color = imagecolorat($fontBmp, $x, $y);
                        if($color == 0) { // if pixel is black
                            $string = $string . '.';
                        } else {
                            $string = $string . '#';
                        }
                    }
                    array_push($lines, $string);
                }
                $fonts[$fontName][$props[1]]['glyph'] = $lines;
            }
        }
    }
}

$json = [];
foreach ($fonts as $name => $font) {
    $json[$name] = $font;
    $json = mb_convert_encoding($json, 'UTF-8');
    dd(json_encode($json));
    $fp = fopen($_SERVER['DOCUMENT_ROOT'] . "bitmapFonts/$name.json", "wb");
    fwrite($fp, json_encode($json));
    fclose($fp);
    $json = [];
}

function getBetween($start, $end, $input) {
    return explode($end, explode($start, $input)[1])[0];
}

function dd($var) {
    echo "<pre>";
    print_r($var); // or var_dump($data);
    echo "</pre>";
}