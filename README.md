# Matrix maker

Website to simply create colored matrix and generate the corresponding .hof file for [OMSI2](https://store.steampowered.com/app/252530/OMSI_2_Steam_Edition/) game.
https://kpp.genav.ch

![screenshot](https://i.imgur.com/szRCIZm.png)

## Features

* #### Edition

    Edit color and font of line, front and side section. Multi lines text is supported

    Choose an icon or import a custom icon (black & white, .png, max 300o). Gare, Aeroport or Tram icons are included.

    Create multiples matrix at once, and switch between all messages with a delay.

    ![Alternating matrix](https://i.imgur.com/pwaxQN9.gif)

* #### Multi destinations support

    Use the left side drawer to add, or switch destinations. You can drag elements to order your destinations.
    Delete, duplicate and create destinations.

    ![left drawer](https://i.imgur.com/Oceg6sq.gif)

* #### Sharing

    Share current matrix with unique link, or QR code. Link shortener will be added soon. The current matrix will be imported and added to the list already present on the new device.
    Generated links look like this : `https://kpp.genav.ch/?s=eyJjb2RlIj...=`

    ![share menu](https://i.imgur.com/ZQVggZl.png)

* #### Download

    You can download the current preview in png file.
   
    Or choose a name, and zip file with .hof, matrix images and codebook will be generated. 

    Also, you can backup current session in json file, and open it in new browser or device, simply by dragging and dropping the file on the page.
    
    Codebook example :
    
    ```
    .------------------------------------------------------------------------------------------.
    |                                    DESTINATION CODES                                     |
    |------------------------------------------------------------------------------------------|
    | CODE |      NAME      | LINE TEXT |             FRONT TEXT              |   SIDE TEXT    |
    |------|----------------|-----------|-------------------------------------|----------------|
    | 0004 | Perly          | 4         | PERLY                               | PERLY          |
    | 1004 | Perly          | 4         | PERLY                               | PERLY          |
    | 061  | Moulon         | 91.06C    | CAMPUS MOULON↵via Plateau du Moulon | MOULON         |
    | 06   | Massy          | 91.06C    | MASSY GARE↵via Plateau du Moulon    | MASSY GARE     |
    | 61   | Annemasse Gare | 61        | ANNEMASSE GARE↵RIEU -- CHENE-BOURG  | ANNEMASSE GARE |
    '------------------------------------------------------------------------------------------'
    ```

## Support

Chat with us on our discord server. Submit ideas, search for help and stay tuned of new features : https://kpp.genav.ch/discord

## Contribute

Submit new fonts : https://forms.gle/DcYYG9u63hQnE8e67

To run the site locally, open `index.html` file.

If you want to edit css and js files, run at first `npm install` to install librairies. After, you need to compile assets with `npm run dev` command.

## Authors

Arno Cellarier : https://github.com/Aryqs-Ipsum
Adam Mathieson : https://github.com/winer222

## Dependencies

* https://material.balmjs.com/#/ : Balmui material design interface
* https://vuejs.org/ : dynamic ui
* https://jquery.com/ : ajax and DOM
* https://projects.calebevans.me/jcanvas/ : canvas (matrix)
* https://stuk.github.io/jszip/ : .zip compression