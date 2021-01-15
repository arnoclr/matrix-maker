# Matrix maker

Website to simply create colored matrix and generate the corresponding .hof file for [OMSI2](https://store.steampowered.com/app/252530/OMSI_2_Steam_Edition/) game.
https://kpp.genav.ch

![screenshot](https://i.imgur.com/pGCVOK5.png)

## Features

* #### Text options

    Edit color and font of line, front and side section. Multi lines text is supported

    ![Text dialog](https://i.imgur.com/mMAPNeO.png)

* #### Icons

    Choose an icon or import a custom icon (black & white, .png, max 300o). Gare, Aeroport or Tram icons are included.

    ![Icon dialog](https://i.imgur.com/bsGvVyv.png)

* #### Multi destinations support

    Use the left side drawer to add, or switch destinations. You can drag elements to order your destinations.

    ![left drawer](https://i.imgur.com/uWGuTR2.png)

* #### Sharing

    Share current matrix with unique link, or QR code. Link shortener will be added soon. The current matrix will be imported and added to the list already present on the new device.

    ![share menu](https://i.imgur.com/ZQVggZl.png)

* #### Download

    You can download the current preview in png file.

    ![current matrix](https://i.imgur.com/qV5tbi1.png)
   
    Or choose a name, and zip file with .hof, matrix images and codebook will be generated. 

    ![Download example](https://i.imgur.com/3WEY0Gq.png)

    Also, you can backup current session in json file, and open it in new browser or device, simply by dragging and dropping the file on the page.
    
    Codebook example :
    
    ```
    .----------------------------------------------------------------------------------------.
    |                                   DESTINATION CODES                                    |
    |----------------------------------------------------------------------------------------|
    | CODE |       NAME       | LINE TEXT |            FRONT TEXT             |  SIDE TEXT   |
    |------|------------------|-----------|-----------------------------------|--------------|
    | 0    | Retour Depot     | 52        | CE BUS NE PREND PLUS DE-PASSAGERS | RETOUR DEPOT |
    | 1    | Place de Toscane | 45        | FRONT                             | SIDE         |
    '----------------------------------------------------------------------------------------'
    ```

## Authors

Arno Cellarier : https://github.com/Aryqs-Ipsum
Adam Mathieson : https://github.com/winer222

## Dependencies

* https://material.balmjs.com/#/ : Balmui material design interface
* https://vuejs.org/ : dynamic ui
* https://jquery.com/ : ajax and DOM
* https://projects.calebevans.me/jcanvas/ : canvas (matrix)
* https://stuk.github.io/jszip/ : .zip compression