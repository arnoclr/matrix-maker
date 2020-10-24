const fontList = [
    {
        label: 'luBS08',
        value: 'luBS08'
    },
    {
        label: 'luRS08',
        value: 'luRS08'
    },
    {
        label: '6x12',
        value: '6x12'
    }
]

const iconList = [
    {
        label: 'none',
        value: null
    },
    {
        label: 'GARE',
        value: 'icons/gare.png'
    },
    {
        label: 'PR',
        value: 'icons/pr.png'
    },
    {
        label: 'RER',
        value: 'icons/rer.png'
    }
]

var vm = new Vue({
    el: '#app',
    data: {
        canvas: '',
        previewCanvas: '',
        ctx: '',
        previewCtx: '',
        iconCanvas: '',
        iconCtx: '',
        overlayImage: '',
        dests: [],
        addDestCode: '',
        current: {
            front: {},
            line: {},
            side: {},
        },
        fonts: {},
        fontList,
        iconList,
        downloadMenu: false,
        shareDialogOpen: false,
        frontDialogOpen: false,
        lineDialogOpen: false,
        sideDialogOpen: false,
        iconDialogOpen: false,
        downloadDialogOpen: false,
        destSettingsDialogOpen: false,
        licenceDrawerOpen: false,
        shurl: null,
        qrurl: null,
        hofName: null,
        rot: 0,
        isMobile: window.matchMedia('only screen and (max-width: 760px)').matches,
    },
    methods: {
        // Matrix
        fillBitmapTextDraw: function(ctx, text, x, y, font, fillStyle) {
            if (localStorage[font]) {
                var curX = x;
                for (var i = 0; i < text.length; i++) {
                    var char = text.substr(i, 1);
                    var cData = [];
                    if (this.fonts[font][font][char] != null) {
                        cData = this.fonts[font][font][char];
                    } else {
                        this.$toast("Character '" + char + "' Not Found in font: '" + font + "'!");
                    }
                    this.bitmapDrawCharacter(ctx, curX, y, cData, fillStyle);
                    curX = curX + cData.glyph[0].length + this.fonts[font][font].charSpacing;
                }
            } else {
                this.$toast(font + ': is not usable');
                this.loadFont(font);
            }
        },
        bitmapDrawCharacter: function(ctx, curX, y, cData, fillStyle) {
            var offY = 0;
            cData.glyph.forEach((row)=>{
                for (var i = 0; i < row.length; i++) {
                    var char = row.substr(i, 1);
                    if(char==="#") {
                        var fs = ctx.fillStyle;
                        ctx.fillStyle = fillStyle;
                        ctx.fillRect(curX+i,y+offY-cData.ascent, 1, 1);
                        ctx.fillStyle = fs;
                    }
                }
                offY++;
            });
        },
        bitmapTextDims: function(text, font) {
            if (localStorage[font]) {
                var width = 0;
                var height = 0;
                for (var i = 0; i < text.length; i++) {
                    var char = text.substr(i, 1);
                    var cData = [];
                    // load font
                    if (!this.fonts[font]) {
                        this.loadFont(font);
                    }
                    // if (char !== " ") {
                    if (this.fonts[font][font][char] != null) {
                        cData = this.fonts[font][font][char];
                    } else {
                        this.$toast("Character '" + char + "' Not Found in font: '" + font + "'!");
                    }
                    width = width + cData.glyph[0].length + this.fonts[font][font].charSpacing;
                    if (height<cData.glyph.length) {
                        height=cData.glyph.length;
                    }
                }
                return {
                    "width": width,
                    "height": height
                };
            } else {
                return {
                    "width": 0,
                    "height": 0
                };
            }
        },
        drawIcon: function(iconCode, matrix, showLine, invert = false, hex = '#ffffff') {
            if(!iconCode) {
                return null;
            }
            this.iconCtx.fillStyle = hex;
            this.iconCtx.fillRect(0, 0, 32, 32);
            var matrW = 0;
            var Xoff = 0;
            if (showLine) {
                if (matrix === 0) {
                    matrW = 230
                    Xoff = Xoff + 50;
                }
                if (matrix === 1) {
                    matrW = 170;
                    Xoff = Xoff + 32;
                }
            }
            this.iconCtx.width = 32;
            this.iconCtx.height = 32;
            this.iconCanvas.style.width = "32px";
            this.iconCanvas.style.height = "32px";
            this.iconCtx.fillStyle = '#000000';
            this.iconCtx.fillRect(0, 0, 32, 32);
            var img = new Image();
            img.onload = function() {
                var evt = new CustomEvent("iconLoaded");
                window.dispatchEvent(evt);
                function drawIconPX(x, y, matrix, hex) {
                    switch (matrix) {
                        case 0:
                            if (x >= 0 && x < 230 && y >= 0 && y < 32) {
                            } else {
                                x = y = -99;
                            }
                            break;
                        case 1:
                            if (x >= 0 && x < 170 && y >= 0 && y < 32) {
                                x = (x+60);
                                y = (y+32);
                            } else {
                                x = y = -99;
                            }
                            break;
                        case 2:
                            if (x >= 0 && x < 50 && y >= 0 && y < 32) {
                                y = (y+32);
                            } else {
                                x = y = -99;
                            }
                            break;
                    }
                    var canvas = document.getElementById("canvas");
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = hex;
                    ctx.fillRect(x, y, 1, 1);
                };
                var iconCanvas = document.getElementById("iconLoader");
                var iconCtx = iconCanvas.getContext('2d');
                iconCtx.drawImage(img, 1, 1);
                for (var y = 0; y < 33; y++) {
                    for (var x = 0; x < 33; x++) {
                        if ((iconCtx.getImageData(x, y, 1, 1).data)[0] > 128) {
                            drawIconPX(x + Xoff, y, matrix, hex);
                        } else {
                            drawIconPX(x + Xoff, y, matrix, '#000000');
                        }
                    }
                }
            }
            img.src = iconCode;
        },

        // front
        writeFrontText: function() {
            this.ctx.fillStyle = "#000000";
            var tlx = (this.current.front.line) ? 50 : 0;
            var textWidth = (this.current.front.line) ? 140 : 115;
            this.ctx.fillRect(tlx, 0, 230, 32);
            // 1/2 lines
            if (this.current.front.text.includes('\n')) {
                var splitedText = this.current.front.text.split('\n');
                var dims = this.bitmapTextDims(splitedText[0], this.current.front.font);
                this.fillBitmapTextDraw(this.ctx, splitedText[0], Math.round(textWidth-(dims.width/2)), Math.round(8+(dims.height/2)), this.current.front.font, this.current.front.color, ()=>{});
                var dims = this.bitmapTextDims(splitedText[1], this.current.front.fontb);
                this.fillBitmapTextDraw(this.ctx, splitedText[1], Math.round(textWidth-(dims.width/2)), Math.round(24+(dims.height/2)), this.current.front.fontb, this.current.front.color, ()=>{});
            } else {
                var dims = this.bitmapTextDims(this.current.front.text, this.current.front.font);
                this.fillBitmapTextDraw(this.ctx, this.current.front.text, Math.round(textWidth-(dims.width/2)), Math.round(16+(dims.height/2)), this.current.front.font, this.current.front.color, ()=>{});
            }
            this.renderCanvas(this.ctx, this.previewCtx);
        },

        // side
        writeSideText: function() {
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(60, 32, 170, 32);
            var dims = this.bitmapTextDims(this.current.side.text, this.current.side.font);
            this.fillBitmapTextDraw(this.ctx, this.current.side.text, Math.round(145-(dims.width/2)), Math.round(48+(dims.height/2)), this.current.side.font, this.current.side.color, ()=>{});
            this.renderCanvas(this.ctx, this.previewCtx);
        },

        // line
        writeLineText: function() {
            // background
            this.ctx.fillStyle = this.current.line.back;
            this.ctx.fillRect(0, 0, 50, 64);
            var dims = this.bitmapTextDims(this.current.line.text, this.current.line.font);
            // outline
            var pxpy = [[24, 16], [25, 15], [26, 16], [25, 17], [24, 48], [25, 47], [26, 48], [25, 49]]
            for (array of pxpy) {
                this.fillBitmapTextDraw(this.ctx, this.current.line.text, Math.round(array[0]-(dims.width/2)), Math.round(array[1]+(dims.height/2)), this.current.line.font, this.current.line.outl, ()=>{});
            }
            // text
            this.fillBitmapTextDraw(this.ctx, this.current.line.text, Math.round(25-(dims.width/2)), Math.round(16+(dims.height/2)), this.current.line.font, this.current.line.fore, ()=>{});
            this.fillBitmapTextDraw(this.ctx, this.current.line.text, Math.round(25-(dims.width/2)), Math.round(48+(dims.height/2)), this.current.line.font, this.current.line.fore, ()=>{});
        },

        // write icon at top and bottom
        writeIcon: function() {
            if(this.current.front.iconUrl) {
                this.drawIcon(this.current.front.iconUrl, 0, this.current.front.line, false, this.current.front.iconHex);
            }
            if(this.current.side.iconUrl) {
                this.drawIcon(this.current.side.iconUrl, 1, this.current.side.line, false, this.current.side.iconHex);
            }
        },
        iconSubmitted: function(event) {
            var file = event.srcElement.files[0];
            if(file.size < 300) {
                var reader = new FileReader();
                reader.readAsBinaryString(file);

                reader.onload = () => {
                    var base64icon = 'data:image/png;base64,' + btoa(reader.result);
                    if(event.srcElement.id == 'frontIconInput') {
                        this.current.front.iconUrl = base64icon;
                    } else if(event.srcElement.id == 'sideIconInput') {
                        this.current.side.iconUrl = base64icon;
                    }
                    this.refreshMatrix();
                };
                reader.onerror = function() {
                    this.$toast('error encountered while sending');
                };
            } else {
                this.$toast(`File too big (${file.size}), max size allowed : 300o`);
            }
        },

        refreshMatrix: function() {
            document.querySelector('#btn-spinning').style = 'transform: rotate('+this.rot+'deg)';
            this.rot+=360;
            this.writeLineText();
            this.writeFrontText();
            this.writeSideText();
            this.writeIcon();
            this.drawRedPattern();
            this.renderCanvas(this.ctx, this.previewCtx);
            this.saveCurrentIntoDests();
        },

        // utils
        renderCanvas: function(ctx, previewCtx) {
            previewCtx.drawImage(this.canvas, 0, 0, 1024, 256);
            previewCtx.drawImage(overlayImage, 0, 0, 1024, 256);
        },
        drawRedPattern: function() {
            this.ctx.fillStyle = "#800000";
            this.ctx.fillRect(230, 0, 26, 64);
            this.ctx.fillRect(50, 32, 10, 32);
            // website url
            $('canvas').drawText({
                fillStyle: '#fff',
                x: 220, y: 27,
                fontSize: '7pt',
                fontFamily: 'Verdana',
                text: 'kpp.genav.ch',
                fromCenter: false,
                rotate: 90
            });
            // dest code
            if(this.current.code) {
                $('canvas').drawText({
                    fillStyle: '#fff',
                    x: 230, y: 52,
                    fontSize: '7pt',
                    fontFamily: 'Verdana',
                    text: this.current.code,
                    fromCenter: false,
                });
            }
        },
        downloadCanvas: function() {
            let downloadLink = document.createElement('a');
            var imgName = `kpp.genav.ch.${this.current.code}.${this.current.name}.png`;
            downloadLink.setAttribute('download', imgName);
            let canvas = document.querySelector('canvas');
            let dataURL = canvas.toDataURL('image/png');
            let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
            downloadLink.setAttribute('href', url);
            downloadLink.click();
            this.$toast(`${imgName} downloaded`);
        },
    
        drawPX: function(previewCtx, color, x, y) {
            var c = hexToRgb(color)
            var r = c.r;
            var b = c.b;
            var g = c.g;
            if (r === 0 && g === 0 && b === 0) {
                r = g = b = 0.05*255;
            }
            previewCtx.fillStyle = 'rgb(' + r*0.1 + ', ' + g*0.1 + ', ' + b*0.1 + ')';
            previewCtx.fillRect(x*4, y*4, 4, 4);
            previewCtx.fillStyle = 'rgb(' + r*0.75 + ', ' + g*0.75 + ', ' + b*0.75 + ')';
            previewCtx.fillRect(x*4+1, y*4, 2, 4);
            previewCtx.fillRect(x*4, y*4+1, 4, 2);
            previewCtx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            previewCtx.fillRect(x*4+1, y*4+1, 2, 2);
    
        },
        rgbToHex: function(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        hexToRgb: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        
        // download menu
        onSelected(data) {
            if(data.index == 0) {
                this.current.code ? this.downloadCanvas() : this.$toast('No matrix selected');
            }
            if(data.index == 1) {
                this.$balmUI.onOpen('downloadDialogOpen');
            }
        },

        // ui
        pickerTextColor: function(color) {
            if(color) {
                var r = parseInt(color.substr(1,2),16);
                var g = parseInt(color.substr(3,2),16);
                var b = parseInt(color.substr(4,2),16);
                var yiq = ((r*299)+(g*587)+(b*114))/1000;
                // Return white if to dark, else return black
                return (yiq < 40) ? 'white' : 'black';
            } else {
                return 'black';
            }
        },
        
        // dest logic
        addDest: function(code) {
            if(isNumber(code) && code > 0) {
                destBuffer = {
                    code: code,
                    name: '',
                    front: {
                        font: '6x12',
                        fontb: '6x12',
                        text: 'FRONT',
                        line: true,
                        color: '#FF6A00',
                        iconHex: '#FF6A00',
                    },
                    line: {
                        font: '6x12',
                        text: code,
                        back: '#26c6da',
                        fore: '#FFFFFF',
                        outl: '#000000',
                    },
                    side: {
                        font: '6x12',
                        text: 'SIDE',
                        color: '#FF6A00',
                        iconHex: '#FF6A00',
                    },
                }
                this.dests.push(destBuffer);
                this.addDestCode = null;
                this.$toast(code + ' added in dests');
            } else {
                this.$toast('invalid code');
            }
        },
        deleteDest: function() {
            if(this.current.code) {
                this.$confirm(`Are you sure to delete ${this.current.code} ? (${this.current.index})`).then((r) => {
                    if (r) {
                        this.dests.splice(this.current.index, 1);
                        this.$toast(this.current.code + ' deleted from dests');
                        this.current.code = null;
                        document.title = 'Select a destination or create it';
                    }
                })
            } else {
                this.$toast('No selected destination to delete');
            }
        },
        selectCurrent: function(index) {
            this.current = this.dests[index];
            if (!this.current.code) {
                this.current.code = prompt('please enter a new code');
            }
            this.current.index = index;
            if (this.current.front.color == null) {
                this.current.front.color = '#FF4400';
            }
            this.refreshMatrix();
            document.title = this.current.code + ' - ' + this.current.name;
        },
        saveCurrentIntoDests: function() {
            this.dests.splice(this.current.index, 1, this.current);
        },
        saveDestsInLocalStorage: function() {
            this.saveCurrentIntoDests();
            localStorage.data = JSON.stringify(this.dests);
            this.$toast('Destinations saved in localStorage');
        },
        loadFont: function(font) {
            if(font) {
                if(!localStorage[font]) {
                    fetch('./bitmapFonts/'+font+'.json')
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            this.$toast(`(${font}) error: ${response.status}`);
                        }
                    })
                    .then((json) => {
                        localStorage[font] = JSON.stringify(json);
                        this.pushFont(font);
                    });
                } else {
                    this.pushFont(font);
                }
            } else {
                this.$toast('empty font requested');
            }
        },
        pushFont: function(font) {
            this.fonts[font] = JSON.parse(localStorage[font]);
            this.refreshMatrix();
            this.$toast(font + ' loaded');
        },
        shareCurrent: function() {
            this.shurl = window.location.href.replace(/#+/, '') + '?share=' + base64_url_encode(JSON.stringify(this.current));
            this.qrurl = 'https://api.qrserver.com/v1/create-qr-code/?data=' + this.shurl;
            this.$balmUI.onOpen('shareDialogOpen');
        },

        // generate hof
        generateHof: function() {
            if(!this.hofName) {
                return this.$toast('Name is empty');
            }
            var hofName = this.hofName;
            var folderName = "KPPMaker-" + this.uuidv4();
            var zip = new JSZip();
            var codeBook = new AsciiTable('DESTINATION CODES');

            //zip.file(folderName + ".hof", generateHOF(folderName, hofName));
            zip.file(folderName + ".hof", this.generateHOF2(folderName, hofName));

            var vehicles = zip.folder("vehicles");
            var Anzeigen = vehicles.folder("Anzeigen");
            var Krueger = Anzeigen.folder("Krueger");
            var f230x32 = Krueger.folder("230x32");
            var img = f230x32.folder(folderName);
            var lastCode = this.current ? this.current.code : 0;
            codeBook.setHeading("CODE", "NAME", "LINE TEXT", "FRONT TEXT", "SIDE TEXT");
            for (dest in this.dests) {
                curCode = this.dests[dest].code;
                this.selectCurrent(dest);
                img.file(dest + ".png", $("#canvas").getCanvasImage().substr(22), {base64: true});
                codeBook.addRow(dest, this.dests[dest].name, this.dests[dest].line.text, this.dests[dest].front.text.replace(/\n+/g, '-'), this.dests[dest].side.text.replace(/\n+/g, '-'));
            }
            zip.file("codebook.txt", codeBook.toString());
            curCode = lastCode;
            zip.generateAsync({type:"blob"}).then(function(content) {
                saveFile(`${hofName}-kpp.genav.ch.zip`, "application/zip", content);
            });
            this.current = null;
            this.$toast(`${hofName}-kpp.genav.ch.zip has been downloaded`);
        },
        uuidv4: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        generateHOF2: function(dir, name) {
            var terminus_list = "";
            for (var dest in this.dests) {
                terminus_list += "\t" + dest + "\t" + (this.dests[dest].name != ""?this.dests[dest].name:"NO NAME") + "\t" + (this.dests[dest].name != ""?this.dests[dest].name:"NO NAME") + "\t" + this.dests[dest].front.text.replace(/\n+/g, '-') + "\t\t" + this.dests[dest].side.text.replace(/\n+/g, '-') + "\t\t" + this.dests[dest].name + "\t\t" + dir + "\\" + dest + ".png\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\r\n";
            }
            var rtn = "HOF AND IMAGES GENERATED WITH SIMPLE OMSI K++ MAKER\r\n" +
                "https://kpp.genav.ch/\r\n" +
                "\r\n" +
                "\r\n" +
                "[name]\r\n" +
                name + "\r\n" +
                "\r\n" +
                "[servicetrip]\r\n" +
                (this.dests[Object.keys(this.dests)[0]].name != ""?this.dests[Object.keys(this.dests)[0]].name:"NO NAME") + "\r\n" +
                "\r\n" +
                "[global_strings]\r\n" +
                "6\r\n" +
                name + "\r\n" +
                name + "\r\n" +
                name + "\r\n" +
                "\r\n" +
                "\r\n" +
                "\r\n" +
                "\r\n" +
                "stringcount_terminus\r\n" +
                "26\r\n" +
                "\r\n" +
                "stringcount_busstop\r\n" +
                "9\r\n" +
                "\r\n" +
                "\r\n" +
                "[addterminus_list]\r\n" +
                terminus_list +
                "[end]\r\n" +
                "\r\n" +
                "\r\n" +
                "[addbusstop_list]\r\n" +
                "STOP List\t\t\t\t\t\t\t\t\r\n" +
                "[end]\r\n" +
                "\r\n" +
                "\n";
            return this.downloadUtf16(rtn);
        },
        downloadUtf16: function(str) {
        
            // ref: https://stackoverflow.com/q/6226189
            var charCode, byteArray = [];
            byteArray.push(255, 254);
        
            for (var i = 0; i < str.length; ++i) {
                charCode = str.charCodeAt(i);
                byteArray.push(charCode & 0xff);
                byteArray.push(charCode / 256 >>> 0);
            }
        
            return new Blob([new Uint8Array(byteArray)], {type:'text/plain;charset=UCS-2LE;'});
        },
        copyToClipboard: function(text) {
            const elem = document.createElement('textarea');
            elem.value = text;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
            this.$toast('text copied to clipboard');
        }

    },
    mounted() {
        // grey / cyan theme
        this.$theme.primary = '#607d8b';
        this.$theme.secondary = '#26c6da';

        // init data
        // with local storage or url share parameter
        var url_string = window.location.href;
        var url = new URL(url_string);
        var s = url.searchParams.get("share");
        if(s) {
            this.dests.push(JSON.parse(base64_url_decode(s)));
            this.$toast(`${this.dests[0].code} imported`);
        }
        else if(localStorage.data) {
            this.dests = JSON.parse(localStorage.data)
            // retro compatibility for data of v1.x
            if (this.dests.constructor === ({}).constructor) {
                this.$toast('Old data detected, some options will be missing')
                var arrayBuffer = [];
                for(var i in this.dests)
                    arrayBuffer.push(this.dests[i]);
                this.dests = arrayBuffer;
            }
        }

        this.canvas = document.getElementById("canvas");
        this.previewCanvas = document.getElementById("previewCanvas");
        this.ctx = this.canvas.getContext('2d');
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.overlayImage = document.getElementById('overlayImage');
        this.iconCanvas = document.getElementById("iconLoader");
        this.iconCtx = this.iconCanvas.getContext('2d');

        this.previewCtx.imageSmoothingEnabled = false;
        this.ctx.fillBitmapTextDraw = this.fillBitmapTextDraw;
        this.ctx.bitmapTextDims = this.bitmapTextDims;
        this.drawRedPattern();

        $('#preloader').fadeOut();
    }
})
//Vue.config.devtools = true

var previewCanvas = document.getElementById("previewCanvas");
var previewCtx = previewCanvas.getContext('2d');
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function saveFile(name, type, data) {
    if (data != null && navigator.msSaveBlob)
        return navigator.msSaveBlob(new Blob([data], { type: type }), name);
    var a = $("<a style='display: none;'/>");
    var url = window.URL.createObjectURL(new Blob([data], {type: type}));
    a.attr("href", url);
    a.attr("download", name);
    $("body").append(a);
    a[0].click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

function base64_url_encode(input) {
    return encodeURI(btoa(input));
}
function base64_url_decode(input) {
    return atob(decodeURI(input));
}

// icons preview rerender after loading
window.addEventListener("iconLoaded", function() {
    setTimeout(() => {
        previewCtx.drawImage(canvas, 0, 0, 1024, 256);
        previewCtx.drawImage(overlayImage, 0, 0, 1024, 256);
    }, 250);
}, false);