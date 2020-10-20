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

new Vue({
    el: '#app',
    data: {
        canvas: '',
        previewCanvas: '',
        ctx: '',
        previewCtx: '',
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
                    console.log(this.fonts[font])
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
                var dims = this.bitmapTextDims(splitedText[1], this.current.front.font);
                this.fillBitmapTextDraw(this.ctx, splitedText[1], Math.round(textWidth-(dims.width/2)), Math.round(24+(dims.height/2)), this.current.front.font, this.current.front.color, ()=>{});
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
            this.fillBitmapTextDraw(this.ctx, this.current.side.text, Math.round(145-(dims.width/2)), Math.round(48+(dims.height/2)), this.current.side.font, this.current.front.color, ()=>{});
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

        // refresh matrix
        refreshMatrix: function() {
            this.writeFrontText();
            this.writeSideText();
            this.writeLineText();
            this.renderCanvas(this.ctx, this.previewCtx);
            this.saveCurrentIntoDests();
        },

        // utils
        renderCanvas: function(ctx, previewCtx) {
            previewCtx.drawImage(this.canvas, 0, 0, 1024, 256);
            previewCtx.drawImage(overlayImage, 0, 0, 1024, 256);
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
        
        // dest logic
        addDest: function(code) {
            this.current = {
                code: code,
                name: '',
                front: {
                    font: '',
                    text: 'FRONT',
                    line: true,
                    color: '#FF6A00',
                },
                line: {
                    font: '',
                    text: code,
                    back: '#FF0000',
                    fore: '#FFFFFF',
                    outl: '#000000',
                },
                side: {
                    font: '',
                    text: 'SIDE',
                    color: '#FF6A00',
                },
            }
            this.dests.push(this.current);
            this.$toast(code + ' added in dests');
        },
        deleteDest: function() {
            this.$confirm(`Are you sure to delete ${this.current.code} ? (${this.current.index})`).then((r) => {
                if (r) {
                    this.dests.splice(this.current.index, 1);
                    this.$toast(this.current.code + ' deleted from dests');
                    this.current.code = null;
                }
            })
        },
        selectCurrent: function(index) {
            this.current = this.dests[index];
            this.current.index = index;
            if (this.current.front.color == null) {
                this.current.front.color = '#FF4400';
            }
            this.refreshMatrix();
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
                });
            }
            this.fonts[font] = JSON.parse(localStorage[font]);
            this.refreshMatrix();
            this.$toast(font + ' loaded');
        }
    },
    mounted() {
        // init data
        if(localStorage.data) {
            this.dests = JSON.parse(localStorage.data)
        }

        this.canvas = document.getElementById("canvas");
        this.previewCanvas = document.getElementById("previewCanvas");
        this.ctx = this.canvas.getContext('2d');
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.overlayImage = document.getElementById('overlayImage');

        this.previewCtx.imageSmoothingEnabled = false;
        this.ctx.fillBitmapTextDraw = this.fillBitmapTextDraw;
        this.ctx.bitmapTextDims = this.bitmapTextDims;
        this.ctx.fillStyle = "#800000";
        this.ctx.fillRect(230, 0, 26, 64);
        this.ctx.fillRect(50, 32, 10, 32);

        //window.onunload = this.saveDestsInLocalStorage();
    }
})
Vue.config.devtools = true