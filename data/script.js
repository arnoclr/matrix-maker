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
        dests: '',
        addDestCode: '',
        current: {
            front: {},
            line: {},
            side: {},
        },
        fonts: {},
        selectedFont: '',
        fontList,
        frontText: '',
    },
    methods: {
        // Matrix
        fillBitmapTextDraw: function(ctx, text, x, y, font,fillStyle) {
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
        // write
        writeFrontText: function() {
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(0, 0, 230, 32);
            var dims = this.bitmapTextDims(document.getElementById("frontText").value, this.selectedFont);
            this.fillBitmapTextDraw(this.ctx, document.getElementById("frontText").value, Math.round(115-(dims.width/2)), Math.round(16+(dims.height/2)), this.selectedFont, "#FF5500", ()=>{});
            this.renderCanvas(this.ctx, this.previewCtx);
        },
        // refresh matrix
        refreshMatrix: function() {
            this.writeFrontText();
        },

        // utils
        renderCanvas: function(ctx, previewCtx) {
            previewCtx.drawImage(canvas, 0, 0, 1024, 256);
            previewCtx.drawImage(overlayImage, 0, 0, 1024, 256);
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
        
        addDest: function(code) {
            dest = {code: code, front: {}};
            this.$set(this.dests, code, dest)
            this.selectCurrent(code);
            this.$toast(code + ' added in dests');
        },
        deleteDest: function(code) {
            this.$confirm('delete ' + code).then((r) => {
                if(r) {
                    delete this.dests[this.current.code];
                    this.current.code = '';
                    this.$toast(code + ' deleted from dests');
                }
            })
        },
        selectCurrent: function(dest) {
            this.current = dest
            this.refreshMatrix();
        },
        saveCurrentIntoDests: function() {
            this.dests[this.current.code] = this.current;
        },
        saveDestsInLocalStorage: function() {
            localStorage.data = JSON.stringify(this.dests);
        },
        loadFont: function(font) {
            if(!localStorage[font]) {
                fetch('./bitmapFonts/'+font+'.json')
                .then((response) => {
                    return response.json();
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

        window.onunload = this.saveDestsInLocalStorage();
    }
})