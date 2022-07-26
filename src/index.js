import $ from "jquery";
import Vue from 'vue';
import { changelogParse } from './changelogParser';
import { rrs } from './readable-random-string';
import { settingsLanguages, translatePage } from './translate';

import './style.css';

import BalmUI from 'balm-ui'; // Official Google Material Components
import BalmUIPlus from 'balm-ui/dist/balm-ui-plus'; // BalmJS Team Material Components

Vue.use(BalmUI); // Mandatory
Vue.use(BalmUIPlus); // Optional

Vue.config.productionTip = false;

// first is main domain
const HOSTNAMES = ['kpp.genav.ch', 'beta-kpp.genav.ch', 'kpp.omsi-gpm.fr', 'beta-kpp.omsi-gpm.fr'];
const IS_BETA = true;

const iconList = [
    {
        label: '',
        value: 0,
    },
    {
        label: 'Aeroport',
        value: 'matrix_icons/aero.png'
    },
    {
        label: 'Gare',
        value: 'matrix_icons/gare.png'
    },
    {
        label: 'Hopital',
        value: 'matrix_icons/hopital.png'
    },
    {
        label: 'Metro',
        value: 'matrix_icons/m.png'
    },
    {
        label: 'Parking',
        value: 'matrix_icons/p.png'
    },
    {
        label: 'PR',
        value: 'matrix_icons/pr.png'
    },
    {
        label: 'RER',
        value: 'matrix_icons/rer.png'
    },
    {
        label: 'SCO',
        value: 'matrix_icons/sco.png'
    },
    {
        label: 'Tramway',
        value: 'matrix_icons/t.png'
    },
    {
        label: 'Mask (by Gg bus 49)',
        value: 'matrix_icons/mask_ggbus49.png'
    },
    // customs icons
    {
        label: 'custom left front', // -4
        value: null
    },
    {
        label: 'custom right front', // -3
        value: null
    },
    {
        label: 'custom left side', // -2
        value: null
    },
    {
        label: 'custom right side', // -1
        value: null
    }
];

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
        alternatesDests: [],
        addDestCode: '',
        current: {
            front: {},
            line: {},
            side: {},
            scroll: {},
        },
        tinycurrent: {},
        fonts: {},
        fontList: [],
        iconList,
        downloadMenu: false,
        shareDialogOpen: false,
        newDialogOpen: false,
        frontDialogOpen: false,
        lineDialogOpen: false,
        sideDialogOpen: false,
        iconsDialogOpen: false,
        scrollDialogOpen: false,
        downloadDialogOpen: false,
        downloadProgressDialogOpen: false,
        destSettingsDialogOpen: false,
        statusDialogOpen: false,
        licenceDialogOpen: false,
        presentationDialogOpen: false,
        changelogDialogOpen: false,
        settingsSectionOpen: false,
        actualSlide: 0,
        toolsMenuOpen: false,
        shurl: null,
        shurlcb: false,
        qrurl: null,
        hofName: '',
        autosave: false,
        isScrolling: false,
        scrollingOffset: 0,
        searchDest: '',
        dragfrom: 0,
        dragto: 0,
        ondrag: false,
        indexdl: 0,
        rot: 0,
        multiplesDestWithSameName: false,
        headerShadow: 2,
        syncStatus: true,
        progressAltPreview: 0,
        progressAltIndex: 0,
        fileOnDrop: false,
        isMobile: window.matchMedia('only screen and (max-width: 618px)').matches,
        lastIndex: 0,
        settings: {
            highContrast: false,
        },
        changelog: null,
        appData: {
            version: '',
            date: ''
        },
        settingsLanguages,
        selectedLanguage: null
    },
    methods: {
        // Matrix
        fillBitmapTextDraw: function (ctx, text, x, y, font, fillStyle) {
            if (localStorage[font]) {
                var curX = x;
                for (var i = 0; i < text.length; i++) {
                    var char = text.substr(i, 1);
                    var cData = [];
                    if (this.fonts[font][font][char] != null) {
                        cData = this.fonts[font][font][char];
                    } else {
                        cData = this.fonts[font][font][' '];
                        this.$toast("Character '" + char + "' Not Found in font: '" + font + "'!");
                    }
                    this.bitmapDrawCharacter(ctx, curX, y, cData, fillStyle);
                    curX = curX + cData.glyph[0].length + parseInt(this.fonts[font][font].charSpacing);
                }
            } else {
                this.$toast(font + ': is not usable');
                this.loadFont(font);
            }
        },
        bitmapDrawCharacter: function (ctx, curX, y, cData, fillStyle) {
            var offY = 0;
            cData.glyph.forEach((row) => {
                for (var i = 0; i < row.length; i++) {
                    var char = row.substr(i, 1);
                    if (char == "#") {
                        var fs = ctx.fillStyle;
                        ctx.fillStyle = fillStyle;
                        ctx.fillRect(curX + i, y + offY - cData.ascent, 1, 1);
                        ctx.fillStyle = fs;
                    }
                }
                offY++;
            });
        },
        bitmapTextDims: function (text, font) {
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
                    if (this.fonts[font][font][char] == null || this.fonts[font][font][char].glyph.length == 0) {
                        cData = this.fonts[font][font][' '];
                        this.$toast("Character '" + char + "' Not Found in font: '" + font + "'!");
                    } else {
                        cData = this.fonts[font][font][char];
                    }
                    width = width + parseInt(cData.glyph[0].length) + parseInt(this.fonts[font][font].charSpacing);
                    if (height < cData.glyph.length) {
                        height = cData.glyph.length;
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
        drawIcon: async function (iconCode, matrix, showLine, invert = false, hex = '#ffffff') {
            if (!iconCode) {
                return null;
            }
            this.iconCtx.fillStyle = hex;
            this.iconCtx.fillRect(0, 0, 32, 32);
            var Xoff = 0;
            var Yoff = 0;
            switch (matrix) {
                case 0:
                    Xoff += 50;
                    break;
                case 1:
                    Xoff += 198;
                    break;
                case 2:
                    Xoff += 60;
                    Yoff += 32;
                    break;
                case 3:
                    Xoff += 198;
                    Yoff += 32;
                    break;
            }
            Xoff = (!showLine && matrix === 0) ? 0 : Xoff;
            this.iconCtx.width = 32;
            this.iconCtx.height = 32;
            this.iconCanvas.style.width = "32px";
            this.iconCanvas.style.height = "32px";
            this.iconCtx.fillStyle = '#000000';
            this.iconCtx.fillRect(0, 0, 32, 32);
            const img = await loadImage(iconCode);

            function drawIconPX(x, y, matrix, hex) {
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = hex;
                ctx.fillRect(x, y, 1, 1);
            }

            var iconCanvas = document.getElementById("iconLoader");
            var iconCtx = iconCanvas.getContext('2d');
            iconCtx.drawImage(img, 1, 1);
            for (var y = 0; y < 32; y++) {
                for (var x = 0; x < 32; x++) {
                    if ((iconCtx.getImageData(x, y, 1, 1).data)[0] > 128) {
                        drawIconPX(x + Xoff, y + Yoff, matrix, hex);
                    } else {
                        drawIconPX(x + Xoff, y + Yoff, matrix, '#000000');
                    }
                }
            }
        },

        // text margin
        // return margin top & bottom
        setMarginText: function (topDims, bottomDims) {
            var middle = 32 - topDims - bottomDims;
            var margin = Math.round((middle - 2) / 2);
            return (margin === 0) ? 1 : margin;
        },

        // front
        writeFrontText: function () {
            let frontBack, frontColor;
            if (this.current.front.invert) {
                frontBack = this.current.front.color;
                frontColor = '#000000';
            } else {
                frontBack = '#000000';
                frontColor = this.current.front.color;
            }
            this.ctx.fillStyle = frontBack;
            var tlx = (this.current.front.line) ? 50 : 0;
            var textWidth = (this.current.front.line) ? 140 : 115;
            // center text if L/R icon selected
            if (this.current.front.iconUrlL) {
                textWidth += 15;
            }
            if (this.current.front.iconUrlR) {
                textWidth -= 15;
            }
            this.ctx.fillRect(tlx, 0, 230, 32);
            // 1/2 lines
            if (this.current.front.text.includes('\n')) {
                var splitedText = this.current.front.text.split('\n');
                var dimsTop = this.bitmapTextDims(splitedText[0], this.current.front.font);
                var dimsBottom = this.bitmapTextDims(splitedText[1], this.current.front.fontb);
                let margin = this.setMarginText(dimsTop.height, dimsBottom.height);
                this.fillBitmapTextDraw(this.ctx, splitedText[0], Math.round(textWidth - (dimsTop.width / 2)), dimsTop.height + margin, this.current.front.font, frontColor, () => { });
                this.fillBitmapTextDraw(this.ctx, splitedText[1], Math.round(textWidth - (dimsBottom.width / 2)), 32 - margin, this.current.front.fontb, frontColor, () => { });
            } else {
                var dims = this.bitmapTextDims(this.current.front.text, this.current.front.font);
                this.fillBitmapTextDraw(this.ctx, this.current.front.text, Math.round(textWidth - (dims.width / 2)), Math.round(16 + (dims.height / 2)), this.current.front.font, frontColor, () => { });
            }
            this.renderCanvas(this.ctx, this.previewCtx);
        },

        // side
        writeSideText: function () {
            let sideBack, sideColor;
            if (this.current.side.invert) {
                sideBack = this.current.side.color;
                sideColor = '#000000';
            } else {
                sideBack = '#000000';
                sideColor = this.current.side.color;
            }
            this.ctx.fillStyle = sideBack;
            this.ctx.fillRect(60, 32, 170, 32);
            var textWidth = 145;
            // center text if L/R icon selected
            if (this.current.side.iconUrlL) {
                textWidth += 15;
            }
            if (this.current.side.iconUrlR) {
                textWidth -= 15;
            }
            // 1/2 lines
            if (this.current.side.text.includes('\n')) {
                var splitedText = this.current.side.text.split('\n');
                var dimsTop = this.bitmapTextDims(splitedText[0], this.current.side.font);
                var dimsBottom = this.bitmapTextDims(splitedText[1], this.current.side.fontb);
                let margin = this.setMarginText(dimsTop.height, dimsBottom.height);
                this.fillBitmapTextDraw(this.ctx, splitedText[0], Math.round(textWidth - (dimsTop.width / 2)), 32 + dimsTop.height + margin, this.current.side.font, sideColor, () => { });
                this.fillBitmapTextDraw(this.ctx, splitedText[1], Math.round(textWidth - (dimsBottom.width / 2)), 64 - margin, this.current.side.fontb, sideColor, () => { });
            } else {
                var dims = this.bitmapTextDims(this.current.side.text, this.current.side.font);
                this.fillBitmapTextDraw(this.ctx, this.current.side.text, Math.round(textWidth - (dims.width / 2)), Math.round(48 + (dims.height / 2)), this.current.side.font, sideColor, () => { });
                this.renderCanvas(this.ctx, this.previewCtx);
            }
        },

        cropScrollCanvas: function () {
            // remove black margin
            var heights = [];
            for (let y = 0; y <= 32; y++) {
                // TODO: stop at end of text
                for (let x = 0; x <= 512; x++) {
                    let color = this.scrollCtx.getImageData(x, y, 1, 1).data;
                    if (color[3] == 255) {
                        heights.push(y);
                        break;
                    }
                }
            }
            // keep transparent areas
            this.scrollPreviewCtx.clearRect(0, 0, 4096, heights[0] * 8);
            this.scrollPreviewCtx.clearRect(0, (heights[heights.length - 1] + 1) * 8, 4096, 256);

            // create transmap
            this.scrollTransmapCtx.fillStyle = '#ffffff';
            this.scrollTransmapCtx.fillRect(0, 0, 512, 32);
            this.scrollTransmapCtx.clearRect(0, 0, 512, heights[0]);
            this.scrollTransmapCtx.clearRect(0, (heights[heights.length - 1] + 1), 512, 32);
            if (!this.current.scroll.index.includes('13')) {
                this.scrollTransmapCtx.clearRect(0, 0, 50, 32);
            }
        },

        // scroll
        writeScrollText: function () {
            // clear canvas
            this.scrollCtx.clearRect(0, 0, 512, 32);
            this.scrollPreviewCtxOver.clearRect(0, 0, 4096, 128);
            this.scrollPreviewCtx.fillStyle = '#000000';
            this.scrollPreviewCtx.fillRect(0, 0, 4096, 256);
            // write
            let textColor = this.current.front.color;
            var dims = this.bitmapTextDims(this.current.scroll.text, this.current.scroll.font);
            this.fillBitmapTextDraw(this.scrollCtx, this.current.scroll.text, 0, parseInt(this.current.scroll.mt) + dims.height, this.current.scroll.font, textColor, () => { });
            // render big canvas
            this.scrollPreviewCtx.drawImage(this.scrollCanvas, 0, 0, 4096, 256);

            this.cropScrollCanvas();
            this.scrollPreviewCtxOver.drawImage(this.scrollPreviewCanvas, 0, 0, 2048, 128);
            this.scrollPreviewCtxOver.drawImage(this.scrollPreviewCanvas, 2048, 0, 2048, 128);
            setTimeout(() => {
                this.renderScroll();
            }, 250);
        },

        // line
        writeLineText: function () {
            // background
            // black
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, 50, 64);
            // color
            this.ctx.fillStyle = this.current.line.back;
            if (this.current.line.partial) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(50, 0);
                this.ctx.lineTo(0, 32);
                this.ctx.lineTo(50, 32);
                this.ctx.lineTo(0, 64);
                this.ctx.fill();
                // remove anti-aliasing
                for (let x = 0; x <= 50; x++) {
                    for (let y = 0; y <= 64; y++) {
                        let color = this.ctx.getImageData(x, y, 1, 1).data;
                        if (color[0] == 0 && color[1] == 0 && color[2] == 0) {

                        } else {
                            this.ctx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            } else {
                this.ctx.fillRect(0, 0, 50, 64);
            }
            var dims = this.bitmapTextDims(this.current.line.text, this.current.line.font);
            // outline
            var pxpy = [[24, 16], [25, 15], [26, 16], [25, 17], [24, 48], [25, 47], [26, 48], [25, 49]];
            for (let array of pxpy) {
                this.fillBitmapTextDraw(this.ctx, this.current.line.text, Math.round(array[0] - (dims.width / 2)), Math.round(array[1] + (dims.height / 2)), this.current.line.font, this.current.line.outl, () => { });
            }
            // text
            this.fillBitmapTextDraw(this.ctx, this.current.line.text, Math.round(25 - (dims.width / 2)), Math.round(16 + (dims.height / 2)), this.current.line.font, this.current.line.fore, () => { });
            this.fillBitmapTextDraw(this.ctx, this.current.line.text, Math.round(25 - (dims.width / 2)), Math.round(48 + (dims.height / 2)), this.current.line.font, this.current.line.fore, () => { });
        },

        // write icon at top and bottom
        writeIcon: async function () {
            if (this.current.front.iconUrlL) {
                await this.drawIcon(this.current.front.iconUrlL, 0, this.current.front.line, false, this.current.front.iconHex);
            }
            if (this.current.front.iconUrlR) {
                await this.drawIcon(this.current.front.iconUrlR, 1, this.current.front.line, false, this.current.front.iconHex);
            }
            if (this.current.side.iconUrlL) {
                await this.drawIcon(this.current.side.iconUrlL, 2, this.current.side.line, false, this.current.side.iconHex);
            }
            if (this.current.side.iconUrlR) {
                await this.drawIcon(this.current.side.iconUrlR, 3, this.current.side.line, false, this.current.side.iconHex);
            }
            return;
        },
        iconSubmitted: function (event) {
            var file = event.target.files[0];
            if (file.size < 300) {
                var reader = new FileReader();
                reader.readAsBinaryString(file);

                reader.onload = () => {
                    var base64icon = 'data:image/png;base64,' + btoa(reader.result);
                    if (event.target.id === 'frontIconInputL') {
                        iconList.splice(iconList.length - 4, 1, {
                            label: 'custom left front',
                            value: base64icon,
                        });
                        this.current.front.iconUrlL = base64icon;
                    } else if (event.target.id === 'frontIconInputR') {
                        iconList.splice(iconList.length - 3, 1, {
                            label: 'custom right front',
                            value: base64icon,
                        });
                        this.current.front.iconUrlR = base64icon;
                    } else if (event.target.id === 'sideIconInputL') {
                        iconList.splice(iconList.length - 2, 1, {
                            label: 'custom left side',
                            value: base64icon,
                        });
                        this.current.side.iconUrlL = base64icon;
                    } else if (event.target.id === 'sideIconInputR') {
                        iconList.splice(iconList.length - 1, 1, {
                            label: 'custom right side',
                            value: base64icon,
                        });
                        this.current.side.iconUrlR = base64icon;
                    }
                    this.refreshMatrix();
                };
                reader.onerror = function () {
                    vm.$toast('error encountered while sending');
                };
            } else {
                this.$toast(`File too big (${file.size}), max size allowed : 300o`);
            }
        },
        // trigger when icons are loaded
        iconLoaded: function () {
            this.renderCanvas(this.ctx, this.previewCtx);
        },

        refreshMatrix: async function (textOnly = false, part = false, universalPreview = false) {
            if (!this.current) return;
            document.querySelector('#btn-spinning').style = 'transform: rotate(' + this.rot + 'deg)';
            this.rot += 360;
            switch (part) {
                case 'front':
                    this.writeFrontText();
                    break;
                case 'line':
                    this.writeLineText();
                    break;
                case 'side':
                    this.writeSideText();
                    break;
                default:
                    this.writeLineText();
                    this.writeFrontText();
                    this.writeSideText();
                    break;
            }
            if (!textOnly) {
                await this.writeIcon();
                if (this.current.scroll && !universalPreview) {
                    this.writeScrollText();
                }
                this.saveCurrentIntoDests();
                if (this.autosave) {
                    this.saveDestsInLocalStorage();
                }
                this.syncStatusRefresh();
            }
            this.drawRedPattern();
            this.renderCanvas(this.ctx, this.previewCtx);
            return;
        },
        refreshUi: function () {
            this.qrurl = '';
            this.headerShadow = (document.getElementById('dest-container').offsetHeight > window.innerHeight - 203) ? 2 : 0;
        },
        syncStatusRefresh: function () {
            if (localStorage.data == JSON.stringify(this.dests)) {
                this.syncStatus = true;
            } else {
                this.syncStatus = false;
            }
        },
        renderScroll: function () {
            if (this.isScrolling) {
                setTimeout(() => {
                    if (this.scrollingOffset <= 2048) {
                        this.scrollingOffset += 4;
                    } else {
                        this.scrollingOffset = 0;
                    }
                    // duplicate current preview
                    this.writeScrollTextOnPreview(this.scrollingOffset);
                    this.renderScroll();
                }, 10);
            } else {
                this.writeScrollTextOnPreview(0);
            }
        },
        writeScrollTextOnPreview: function (off) {
            // crop part of scrolling band and paste into sections of preview
            // 920x if line + front, 720x front only
            if (this.current.scroll.index.includes('11')) {
                let frontWidth = this.current.scroll.index.includes('13') ? 920 : 720;
                let frontScrollPos = cropCanvas(this.scrollPreviewCanvasOver, off, 0, frontWidth, 128);
                this.previewCtx.drawImage(frontScrollPos, 920 - frontWidth, 0);
            }
            // side
            if (this.current.scroll.index.includes('12')) {
                let sideWidth = this.current.scroll.index.includes('13') ? 920 : 680;
                let sideScrollPos = cropCanvas(this.scrollPreviewCanvasOver, off, 0, sideWidth, 128);
                this.previewCtx.drawImage(sideScrollPos, 920 - sideWidth, 128);
                this.previewCtx.fillStyle = "#800000";
                this.previewCtx.fillRect(200, 128, 40, 128);
            }
        },
        scrollButton: function () {
            if (this.isScrolling) {
                $('#scrollButton').addClass('morphed');
                this.isScrolling = false;
                this.refreshMatrix();
            } else {
                $('#scrollButton').removeClass('morphed');
                this.isScrolling = true;
                this.renderScroll();
            }
        },

        // utils
        exportAsJson: function () {
            saveFile(new Date().toISOString().slice(0, 10) + '-KPP-backup.json', 'text/json', JSON.stringify(this.dests));
        },
        renderCanvas: function (ctx, previewCtx) {
            previewCtx.drawImage(this.canvas, 0, 0, 1024, 256);
            // previewCtx.drawImage(overlayImage, 0, 0, 1024, 256);
        },
        drawRedPattern: function () {
            this.ctx.fillStyle = "#800000";
            this.ctx.fillRect(230, 0, 26, 64);
            this.ctx.fillRect(50, 32, 10, 32);
            import('jcanvas').then(moduleCanvas => {
                var JCanvas = moduleCanvas.default;
                JCanvas($, window);

                $('#canvas').drawText({
                    fillStyle: '#fff',
                    x: 220, y: 27,
                    fontSize: '7pt',
                    fontFamily: 'Verdana',
                    text: 'kpp.genav.ch',
                    fromCenter: false,
                    rotate: 90
                });
                // dest code
                if (this.current.code) {
                    $('#canvas').drawText({
                        fillStyle: '#fff',
                        x: 230, y: 52,
                        fontSize: '7pt',
                        fontFamily: 'Verdana',
                        text: this.current.code,
                        fromCenter: false,
                    });
                }
            });
        },
        downloadCanvas: function () {
            let downloadLink = document.createElement('a');
            var imgName = `kpp.genav.ch.${this.current.code}.${this.current.name}.png`;
            downloadLink.setAttribute('download', imgName);
            let canvas = document.querySelector('canvas');
            let dataURL = canvas.toDataURL('image/png');
            let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
            downloadLink.setAttribute('href', url);
            downloadLink.click();
            this.$toast(`${imgName} downloaded`);
        },

        drawPX: function (previewCtx, color, x, y) {
            var c = hexToRgb(color);
            var r = c.r;
            var b = c.b;
            var g = c.g;
            if (r === 0 && g === 0 && b === 0) {
                r = g = b = 0.05 * 255;
            }
            previewCtx.fillStyle = 'rgb(' + r * 0.1 + ', ' + g * 0.1 + ', ' + b * 0.1 + ')';
            previewCtx.fillRect(x * 4, y * 4, 4, 4);
            previewCtx.fillStyle = 'rgb(' + r * 0.75 + ', ' + g * 0.75 + ', ' + b * 0.75 + ')';
            previewCtx.fillRect(x * 4 + 1, y * 4, 2, 4);
            previewCtx.fillRect(x * 4, y * 4 + 1, 4, 2);
            previewCtx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            previewCtx.fillRect(x * 4 + 1, y * 4 + 1, 2, 2);

        },
        rgbToHex: function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        hexToRgb: function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        resetLocalStorage: function () {
            this.$confirm('Reset app storage ? this action is irreversible').then(r => {
                if (r) {
                    window.localStorage.clear();
                    window.location.reload();
                };
            });
        },
        openSettings: function (open = true) {
            if (open) {
                this.writeUrl('settings');
                this.settingsSectionOpen = true;
            } else {
                this.writeUrl();
                this.settingsSectionOpen = false;
            }
        },
        saveSettings: function () {
            setTimeout(() => {
                let jsonSettings = JSON.stringify(this.settings);
                localStorage.setItem('settings', jsonSettings);
                this.$toast('Settings saved');
            }, 100);
        },

        // download menu
        onSelected(data) {
            switch (data.index) {
                case 0:
                    this.current.code ? this.downloadCanvas() : this.$toast('No matrix selected');
                    break;
                case 1:
                    vm.downloadDialogOpen = true;
                    this.writeUrl('download');
                    break;
                case 2:
                    this.exportAsJson();
                    break;
            }
        },
        // tools menu
        onSelectedTools(data) {
            switch (data.index) {
                case 0:
                    this.shareCurrent();
                    break;
                case 1:
                    this.refreshMatrix();
                    break;
                case 2:
                    this.$balmUI.onOpen('destSettingsDialogOpen');
                    this.writeUrl('destSettings');
                    break;
                case 3:
                    this.$balmUI.onOpen('iconsDialogOpen');
                    this.writeUrl('icons');
                    break;
                case 4:
                    if (this.current.scroll) {
                        this.$balmUI.onOpen('scrollDialogOpen');
                        this.writeUrl('scroll');
                    } else {
                        this.addScroll();
                    }
                    break;
                case 5:
                    this.duplicateDest();
                    break;
                case 6:
                    this.deleteDest();
                    break;
                case 7:
                    this.refreshMatrix(false, false, true);
                    break;
            }
        },

        // ui
        onLangSelect: function (event) {
            if (!this.settingsSectionOpen) return;
            localStorage.setItem('lang', event.value);
            if (event.value == 'auto') {
                localStorage.removeItem('lang');
            }
            window.location.reload();
        },
        pickerTextColor: function (color) {
            if (color) {
                var r = parseInt(color.substr(1, 2), 16);
                var g = parseInt(color.substr(3, 2), 16);
                var b = parseInt(color.substr(4, 2), 16);
                var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                // Return white if to dark, else return black
                return (yiq < 40) ? 'white' : 'black';
            } else {
                return 'black';
            }
        },
        debugInfos: function () {
            let txt = '';
            for (var a in localStorage) {
                txt = txt + a + ',';
            }
            this.$alert(txt);
        },
        previewAlternate: function () {
            $('#main-hover').fadeIn();
            $('.alt-progress-hover').fadeIn();
            $('.demo-app-bar').addClass('preview');
            $('.canvasBox').addClass('no-events');
            this.$toast('start of preview');
            this.alternatesDests.forEach((d, i) => {
                setTimeout(() => {
                    this.selectCurrent(d.index);
                    this.progressAltPreview = (i + 1) / this.alternatesDests.length;
                    this.progressAltIndex = i + 1;
                    console.log(this.alternatesDests.length, i);
                    if (this.alternatesDests.length - 1 == i) {
                        setTimeout(() => {
                            $('#main-hover').fadeOut();
                            $('.alt-progress-hover').fadeOut();
                            $('.demo-app-bar').removeClass('preview');
                            $('.canvasBox').removeClass('no-events');
                            this.$toast('end of preview');
                            this.selectCurrent(this.alternatesDests[0].index);
                        }, 2200);
                    }
                }, 2200 * i);
            });
        },
        writeUrl: function (segment = false) {
            let a = $('<a style="display:none"></a>');
            let href = (this.current ? (this.current.index == undefined ? '' : this.current.index) : '') + '/' + (segment ? segment : '');
            a.attr('href', '#' + href);
            $('body').append(a);
            a[0].click();
            a.remove();
        },
        anchorTrigger: function (string) {
            let modals = ['front', 'line', 'side', 'icons', 'destSettings', 'download', 'licence', 'status', 'scroll', 'new', 'changelog'];
            if (modals.includes(string)) {
                this.$balmUI.onOpen(string + 'DialogOpen');
            }
            switch (string) {
                case 'preview':
                    setTimeout(() => {
                        this.previewAlternate();
                    }, 1000);
                    break;
                case 'share':
                    setTimeout(() => {
                        this.shareCurrent();
                    }, 1000);
                    break;
                case 'settings':
                    setTimeout(() => {
                        this.openSettings();
                    }, 1000);
                    break;
            }
        },

        // hof importation
        // this.fileOnDrop = true;
        hofDragover: function (event) {
            event.preventDefault();
            this.fileOnDrop = true;
        },
        hofDragleave: function (event) {
            this.fileOnDrop = false;
        },
        hofDrop: function (event) {
            event.preventDefault();
            this.fileOnDrop = false;
            var file = event.dataTransfer.files[0],
                readerJson = new FileReader(),
                readerHof = new FileReader();
            // analyze and import json backup
            readerJson.onload = function (event) {
                vm.dests = JSON.parse(event.target.result);
                vm.$toast('Dests imported');
            };
            // open hof file
            readerHof.onload = function (event) {
                let hofDataText = event.target.result;
                let hofDestsText = hofDataText.split('[addterminus_list]').pop().split('[end]')[0];
                if (hofDestsText !== null) {
                    vm.dests = [];
                    let hofDests = hofDestsText.split('\n');
                    hofDests.pop();
                    hofDests.forEach((dest, index) => {
                        group = dest.split(/	/);
                        line = group[1];
                        dest = (group[2] == null) ? 'undefined' : group[2];
                        text = (group[3] == null) ? 'undefined' : group[3];
                        if (isNumber(line)) {
                            vm.addDest(line, dest, text, line, text);
                        }
                    });
                    vm.$alert('hof import feature is not finished, it will be improved soon');
                } else {
                    vm.$alert('this hof is not compatible');
                }
            };
            if (file.name.match(/(.+)(.json)/)) {
                this.$confirm('Import json data and delete actual destinations ?').then((r) => {
                    if (r) readerJson.readAsText(file);
                });
            } else if (file.name.match(/(.+)(.hof)/)) {
                this.$confirm('Import hof data and delete actual destinations ?').then((r) => {
                    if (r) readerHof.readAsText(file);
                });
            } else {
                this.$alert('Invalid file format');
            }
        },

        // drag and drop drawer
        destDragStart: function (event) {
            this.dragfrom = event.target.dataset.drag;
            this.ondrag = true;
        },
        destDropOver: function (event) {
            event.preventDefault();
            this.dragto = event.target.dataset.drag;
            $('.nav-item').removeClass('hover');
            $('#' + this.dragto + '-nav-item').addClass('hover');
        },
        destDropEnd: function (event) {
            this.ondrag = false;
            $('.nav-item').removeClass('hover');
        },
        destDropLeave: function (event) {
            $('.nav-item').removeClass('hover');
        },
        destDropped: function (event) {
            $('.nav-item').removeClass('hover');
            this.ondrag = false;
            this.dragto = event.target.dataset.drag;
            this.moveItem(this.dragfrom, this.dragto);
            this.refreshAlternates(this.dragto);
            this.selectCurrent(this.dragto);
            this.refreshAlternates(this.current.index - this.current.alternates);
        },

        addDestFocus: function () {
            $('#search-dest').focus();
        },

        moveItem: function (from, to) {
            console.log(from, to);
            if (to !== undefined) {
                this.dests.splice(to, 0, this.dests.splice(from, 1)[0]);
            }
        },
        refreshAlternates: function (id) {
            // loop over 10 alternates possibles codes
            id = parseInt(id); // dragto
            let dragfromcode = parseInt(this.dests[id].code);
            for (let index = 1; index <= 9; index++) {
                // loop over dests and find match
                let moved = false;
                this.dests.forEach((dest, i) => {
                    if (dest.code > 999 && dest.code == dragfromcode + 1000 * index) {
                        // if dragto is before or after actual dest
                        if (!moved) {
                            if (id > i) {
                                this.moveItem(i, id);
                                moved = true;
                            } else {
                                this.moveItem(i, id + index);
                                moved = true;
                            }
                        }
                    }
                });
            }
        },

        // dest logic
        addDest: function (code, name = '', front = '', line = '', side = '') {
            if (isNumber(code) && code > 0) {
                let destBuffer = {
                    code: code,
                    name: name,
                    front: {
                        font: 'luRS12',
                        fontb: 'luRS08',
                        text: (front !== '') ? front : 'FRONT',
                        line: true,
                        color: '#FF6A00',
                        iconHex: '#FF6A00',
                        iconUrlL: 0,
                        iconUrlR: 0,
                    },
                    line: {
                        font: 'luRS12',
                        text: (line !== '') ? line : code,
                        back: '#26c6da',
                        fore: '#FFFFFF',
                        outl: '#000000',
                    },
                    side: {
                        font: 'luRS12',
                        fontb: 'luRS08',
                        text: (side !== '') ? side : 'SIDE',
                        color: '#FF6A00',
                        iconHex: '#FF6A00',
                        iconUrlL: 0,
                        iconUrlR: 0,
                    },
                };
                this.dests.push(destBuffer);
                this.searchDest = '';
                this.$toast(code + ' added in dests');
                this.selectCurrent(this.dests.length - 1);
            } else {
                this.$toast('invalid code');
            }
        },
        addScroll: function () {
            var scroll = {
                font: 'luRS12',
                text: '',
                mt: 0,
                index: ['11'],
            };
            this.current = { ...this.current, scroll };
        },
        removeScroll: function () {
            this.$confirm('Remove scrolling matrix ?').then((r) => {
                if (r) delete this.current.scroll;
            });
        },
        addAlternate: function () {
            var lastAlt = this.alternatesDests.pop(),
                code = parseInt(lastAlt.code) + 1000;
            this.duplicateDest();
            this.dests[this.dests.length - 1].code = code;
            this.moveItem(this.dests.length - 1, parseInt(lastAlt.index) + 1);
            this.selectCurrent(parseInt(lastAlt.index) + 1);
        },
        deleteDest: function () {
            if (this.current.code) {
                this.$confirm(`Are you sure to delete ${this.current.code} ? (${this.current.index})`).then((r) => {
                    if (r) {
                        this.dests.splice(this.current.index, 1);
                        this.$toast(this.current.code + ' deleted from dests');
                        if (this.current.index >= 0) {
                            this.selectCurrent(this.current.index - 1);
                        }
                    }
                });
            } else {
                this.$toast('No selected destination to delete');
            }
        },
        duplicateDest: function () {
            let currentBuffer = JSON.parse(JSON.stringify(this.current));
            currentBuffer.code = parseInt(currentBuffer.code) + 1;
            this.dests.push(currentBuffer);
            this.$toast(`${this.current.code} duplicated`);
        },
        selectCurrent: async function (index) {
            this.isScrolling = false;
            if (this.dests[index] == undefined) {
                return this.$alert(`Destination n°${index} don't exist`);
            }
            this.current = this.dests[index];
            this.alternatesDests = [];
            var codes = [];
            if (this.current.code == undefined) {
                this.current.code = prompt('please enter a new code');
            }
            this.dests.forEach((dest, arrayIndex) => {
                if (dest != undefined && parseInt(dest.code) == parseInt(vm.current.code) + 1000 * (arrayIndex - index)) {
                    vm.dests[arrayIndex].index = arrayIndex;
                    vm.alternatesDests.push(vm.dests[arrayIndex]);
                }
                codes.push(dest.code);
            });
            this.multiplesDestWithSameName = codes.some((val, i) => codes.indexOf(val) !== i);
            this.dests[index].alternates = this.alternatesDests.length;
            // import icon base64 value in select if custom icon detected
            if (this.current.front.iconUrlL) {
                if (this.current.front.iconUrlL.match(/data:image+/)) {
                    iconList.splice(iconList.length - 4, 1, {
                        label: 'custom left front',
                        value: this.current.front.iconUrlL,
                    });
                }
            }
            if (this.current.front.iconUrlR) {
                if (this.current.front.iconUrlR.match(/data:image+/)) {
                    iconList.splice(iconList.length - 3, 1, {
                        label: 'custom right front',
                        value: this.current.front.iconUrlR,
                    });
                }
            }
            if (this.current.side.iconUrlL) {
                if (this.current.side.iconUrlL.match(/data:image+/)) {
                    iconList.splice(iconList.length - 2, 1, {
                        label: 'custom left side',
                        value: this.current.side.iconUrlL,
                    });
                }
            }
            if (this.current.side.iconUrlR) {
                if (this.current.side.iconUrlR.match(/data:image+/)) {
                    iconList.splice(iconList.length - 1, 1, {
                        label: 'custom right side',
                        value: this.current.side.iconUrlR,
                    });
                }
            }
            this.current.index = index;
            if (this.current.front.color == null) {
                this.current.front.color = '#FF4400';
            }
            await this.refreshMatrix();
            this.refreshUi();
            document.title = this.current.code + ' → ' + this.current.name;
            this.$theme.secondary = (this.current.line.back) ? (this.current.line.back != '#ffffff' ? this.current.line.back : '#bbbbbb') : '#26c6da';
            return;
        },
        saveCurrentIntoDests: function () {
            this.dests.splice(this.current.index, 1, this.current);
        },
        saveDestsInLocalStorage: function () {
            this.saveCurrentIntoDests();
            localStorage.data = JSON.stringify(this.dests);
            this.syncStatusRefresh();
            this.$toast('Destinations saved in localStorage');
        },
        loadFont: function (font) {
            if (font) {
                if (!localStorage[font]) {
                    fetch('./bitmapFonts/' + font + '.json')
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
        pushFont: function (font) {
            let json = localStorage[font];
            if (json == undefined || json == 'undefined') return;
            this.fonts[font] = JSON.parse(json);
            this.refreshMatrix();
            this.$toast(font + ' loaded');
        },
        shareCurrent: function () {
            // this.tinycurrent.a = this.current.code;
            // this.tinycurrent.b = this.current.name;
            let domain;
            if (HOSTNAMES.includes(window.location.hostname)) {
                domain = window.location.hostname;
            } else {
                domain = IS_BETA ? HOSTNAMES[1] : HOSTNAMES[0];
            }
            this.shurl = 'https://' + domain + '/?s=' + base64_url_encode(JSON.stringify(this.current));
            this.$balmUI.onOpen('shareDialogOpen');
            this.writeShareUrl();
            this.writeUrl('share');
        },
        reduceShareUrl: function () {
            let long_url = this.shurl;
            fetch('https://kpp.omsi-g.pm/new?name=KPP&key=KppKey&url=' + long_url)
                .then((response) => response.json())
                //Then with the data from the response in JSON...
                .then((data) => {
                    if (data.Status != 200) {
                        this.$toast(data.Message);
                        this.shurl = long_url;
                        this.writeShareUrl();
                    } else {
                        this.shurl = data.shortURL;
                        this.writeShareUrl();
                    }
                })
                //Then with the error genereted...
                .catch((error) => {
                    console.log(error);
                    this.$toast(error);
                    this.shurl = long_url;
                    this.writeShareUrl();
                });
        },
        writeShareUrl: function () {
            this.shurlcb = false;
            this.qrurl = 'https://api.qrserver.com/v1/create-qr-code/?data=' + this.shurl;
        },
        autosavePersist: function () {
            if (this.autosave) {
                localStorage.autosave = this.autosave;
            } else {
                localStorage.removeItem('autosave');
            }
        },

        // generate hof
        generateHof: function () {
            window.selected = vm.current.index;
            vm.downloadDialogOpen = false;
            vm.downloadProgressDialogOpen = true;
            if (!this.hofName) {
                return this.$toast('Name is empty');
            }
            var hofName = this.hofName;
            var folderName = "KPPMaker-" + this.uuidv4();
            // lazy load ascii-table and JSZip modules
            Promise.all([import('jszip'), import('ascii-table')]).then(async ([moduleZip, moduleTable]) => {
                let JSZip = moduleZip.default;
                var zip = new JSZip();

                let AsciiTable = moduleTable.default;
                var codeBook = new AsciiTable('DESTINATION CODES');

                zip.file(folderName + ".hof", this.generateHOF2(folderName, hofName));

                var vehicles = zip.folder("vehicles");
                var Anzeigen = vehicles.folder("Anzeigen");
                var Krueger = Anzeigen.folder("Krueger");
                var f230x32 = Krueger.folder("230x32");
                var img = f230x32.folder(folderName);
                var scrollMatrix = f230x32.folder('scrollMatrix');
                var scrollImg = scrollMatrix.folder(folderName);
                codeBook.setHeading("CODE", "NAME", "LINE TEXT", "FRONT TEXT", "SIDE TEXT");
                for (let dest in this.dests) {
                    // noinspection JSUnfilteredForInLoop
                    codeBook.addRow(this.dests[dest].code, this.dests[dest].name, this.dests[dest].line.text, this.dests[dest].front.text.replace(/\n+/g, '↵'), this.dests[dest].side.text.replace(/\n+/g, '↵'));
                }
                this.indexdl = 0;
                this.selectCurrentForZip(img, scrollImg, zip, hofName);
                zip.file("codebook.txt", codeBook.toString());
            });
        },
        selectCurrentForZip: async function (img, scrollImg, zip, hofName) {
            if (this.indexdl < this.dests.length) {
                await this.selectCurrent(this.indexdl);
                vm.indexdl++;
                img.file(vm.dests[vm.indexdl - 1].code + ".png", $("#canvas").getCanvasImage().substr(22), { base64: true });
                if (vm.current.scroll) {
                    // draw scroll overlay at export time
                    this.scrollPreviewCtx.drawImage(this.overlayScroll, 0, 0, 4096, 256);
                    this.cropScrollCanvas();
                    scrollImg.file(vm.dests[vm.indexdl - 1].code + ".png", $("#scrollPreviewCanvas").getCanvasImage().substr(22), { base64: true });
                    scrollImg.file(vm.dests[vm.indexdl - 1].code + ".transmap.png", $("#scrollTransmapCanvas").getCanvasImage().substr(22), { base64: true });
                }
                vm.selectCurrentForZip(img, scrollImg, zip, hofName);
            } else {
                zip.generateAsync({ type: "blob" }).then(function (content) {
                    saveFile(`${hofName}-kpp.genav.ch.zip`, "application/zip", content);
                    vm.downloadProgressDialogOpen = false;
                    vm.$toast(`${hofName}-kpp.genav.ch.zip has been downloaded`);
                    vm.selectCurrent(window.selected);
                });
            }
        },
        uuidv4: function () {
            return rrs(4) + Math.floor(Math.random() * 90 + 10);
        },
        generateHOF2: function (dir, name) {
            var terminus_list = "";
            for (var dest in this.dests) {
                // noinspection JSUnfilteredForInLoop
                terminus_list += "\t" + this.dests[dest].code +
                    "\t" + (this.dests[dest].name !== "" ? this.dests[dest].name : "NO NAME") +
                    "\t" + (this.dests[dest].name !== "" ? this.dests[dest].name : "NO NAME") +
                    "\t" + this.dests[dest].front.text.replace(/\n+/g, '-') +
                    "\t\t" + this.dests[dest].side.text.replace(/\n+/g, '-') +
                    "\t\t" + this.dests[dest].name +
                    "\t\t" + dir + "\\" + this.dests[dest].code + ".png";
                // add scroll index
                if (this.dests[dest].scroll) {
                    const sFront = this.dests[dest].scroll.index.includes('11');
                    const sSide = this.dests[dest].scroll.index.includes('12');
                    const sLine = this.dests[dest].scroll.index.includes('13');
                    terminus_list += "\t\t\t" +
                        "\t" + (sFront ? dir + "\\" + this.dests[dest].code + ".png" : "") +
                        "\t" + (sSide ? dir + "\\" + this.dests[dest].code + ".png" : "") +
                        "\t" + (sLine ? dir + "\\" + this.dests[dest].code + ".png" : "") +
                        "\t" +
                        (sLine ? "\t\t" : dir + "\\" + this.dests[dest].code + ".transmap.png\t") +
                        "\t\t\t\t\t\t\t";
                } else {
                    terminus_list += "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
                }
                terminus_list += "\r\n";
            }
            var rtn = "HOF AND IMAGES GENERATED WITH SIMPLE OMSI K++ MAKER\r\n" +
                "https://kpp.genav.ch/\r\n" +
                "\r\n" +
                "[name]\r\n" +
                name + "\r\n" +
                "\r\n" +
                "[servicetrip]\r\n" +
                (this.dests[Object.keys(this.dests)[0]].name !== "" ? this.dests[Object.keys(this.dests)[0]].name : "NO NAME") + "\r\n" +
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
                "26\n" +
                "\r\n" +
                "stringcount_busstop\r\n" +
                "9\n" +
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
                "\n###########\t  ###########\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n###########   B   ###########\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n###########  \t  ###########\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n[infosystem_trip]\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n199\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\nBetriebsfahrt  >>  Betriebsfahrt\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n99\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\nB\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n................\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n[infosystem_busstop_list]\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n2\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\nBetriebsfahrt\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\nBetriebsfahrt\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n";
            return this.downloadUtf16(rtn);
        },
        downloadUtf16: function (str) {

            // ref: https://stackoverflow.com/q/6226189
            var charCode, byteArray = [];
            byteArray.push(255, 254);

            for (var i = 0; i < str.length; ++i) {
                charCode = str.charCodeAt(i);
                byteArray.push(charCode & 0xff);
                byteArray.push(charCode / 256 >>> 0);
            }

            return new Blob([new Uint8Array(byteArray)], { type: 'text/plain;charset=UCS-2LE;' });
        },
        copyToClipboard: function (text) {
            const elem = document.createElement('textarea');
            elem.value = text;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
            this.$toast('text copied to clipboard');
        }

    },
    async mounted() {
        // grey / cyan theme
        this.$theme.primary = '#607d8b';
        this.$theme.secondary = '#26c6da';

        // autosave init
        if (localStorage.autosave) {
            this.autosave = localStorage.autosave;
        }

        // init data
        // with local storage or url share parameter
        var url_string = window.location.href;
        var url = new URL(url_string);
        var s = (url.searchParams.get("share") || url.searchParams.get("s"));
        if (localStorage.data) {
            this.dests = JSON.parse(localStorage.data);
            // retro compatibility for data of v1.x
            if (this.dests.constructor === ({}).constructor) {
                this.$toast('Old data detected, some options will be missing');
                var arrayBuffer = [];
                for (var i in this.dests) { // noinspection JSUnfilteredForInLoop
                    arrayBuffer.push(this.dests[i]);
                }
                this.dests = arrayBuffer;
            }
        }
        if (s) {
            let jsonImport = JSON.parse(base64_url_decode(s));
            this.dests.push(jsonImport);
            this.$toast(`${jsonImport.code} → ${jsonImport.name} imported`);
            history.pushState("", document.title, window.location.pathname);
        }

        if (localStorage.settings) this.settings = JSON.parse(localStorage.settings);

        // define canvas
        this.canvas = document.getElementById("canvas");
        this.previewCanvas = document.getElementById("previewCanvas");
        this.scrollCanvas = document.getElementById("scrollCanvas");
        this.scrollPreviewCanvas = document.getElementById("scrollPreviewCanvas");
        this.scrollPreviewCanvasOver = document.getElementById("scrollPreviewCanvasOver");
        this.scrollTransmapCanvas = document.getElementById("scrollTransmapCanvas");
        this.iconCanvas = document.getElementById("iconLoader");

        // contexts
        this.ctx = this.canvas.getContext('2d');
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.scrollCtx = this.scrollCanvas.getContext('2d');
        this.iconCtx = this.iconCanvas.getContext('2d');
        this.scrollPreviewCtx = this.scrollPreviewCanvas.getContext('2d');
        this.scrollPreviewCtxOver = this.scrollPreviewCanvasOver.getContext('2d');
        this.scrollTransmapCtx = this.scrollTransmapCanvas.getContext('2d');

        // overlays
        this.overlayImage = document.getElementById('overlayImage');
        this.overlayScroll = document.getElementById('overlayScroll');

        this.previewCtx.imageSmoothingEnabled = false;
        this.scrollPreviewCtx.imageSmoothingEnabled = false;
        this.scrollPreviewCtxOver.imageSmoothingEnabled = false;
        this.ctx.fillBitmapTextDraw = this.fillBitmapTextDraw;
        this.ctx.bitmapTextDims = this.bitmapTextDims;

        $.get('/data/fonts.json', (data) => {
            vm.fontList = data;
        });

        $(window).bind('load', () => {
            // detect if matrix is selected in link
            if (location.href.indexOf("#") != -1) {
                let anchor = location.href.split('#').pop().split('/');
                let id = anchor[0];
                if (id) {
                    setTimeout(() => {
                        this.selectCurrent(id);
                    }, 250);
                }
                if (anchor[1] != undefined) {
                    let action = anchor[1].split('?').shift();
                    this.anchorTrigger(action);
                }
            }
            if (window.matchMedia('only screen and (min-width: 1200px)').matches) {
                $('#nav-menu').click();
            }
            translatePage();
            $('#preloader').fadeOut();
        });

        // presentation modal
        if (localStorage.presentation == null) {
            // this.$balmUI.onOpen('presentationDialogOpen');
            // localStorage.presentation = true;
        }

        // changelog
        changelogParse('../changelog.md').then(changelog => {
            let latestClient = localStorage.getItem('changelog');
            vm.appData.version = changelog.latest;
            vm.appData.date = changelog.date;
            vm.changelog = changelog[changelog.latest];
            if (latestClient != changelog.latest) {
                localStorage.setItem('changelog', changelog.latest);
                vm.writeUrl('changelog');
                vm.changelogDialogOpen = true;
            }
        });

        //listen for window resize event
        window.addEventListener('resize', function (event) {
            vm.isMobile = window.matchMedia('only screen and (max-width: 618px)').matches;
        });

        // disclaimers
        if (IS_BETA) {
            $('#nav-title-text').text('Kpp Maker - Beta');
            this.$alert('This is a beta version of the site, which may contain bugs. Please report any malfunctions you encounter.');
        }

        // detect adblock
        const googleAdUrl = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        const googleAdRequest = await fetch(googleAdUrl, {
            method: 'HEAD',
        });

        if (googleAdRequest.status !== 200 || googleAdRequest.redirected) {
            document.getElementById('adblock-banner').style.display = 'block';
        }
    }
});

window.vm = vm;

var previewCanvas = document.getElementById("previewCanvas");
var previewCtx = previewCanvas.getContext('2d');
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function saveFile(name, type, data) {
    if (data != null && navigator.msSaveBlob)
        return navigator.msSaveBlob(new Blob([data], { type: type }), name);
    var a = $("<a style='display: none;'/>");
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
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

// ref: https://stackoverflow.com/a/8306028/11651419
function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

// ref: https://stackoverflow.com/a/54555834/11651419
const cropCanvas = (sourceCanvas, left, top, width, height) => {
    let destCanvas = document.createElement('canvas');
    destCanvas.width = width;
    destCanvas.height = height;
    destCanvas.getContext("2d").drawImage(
        sourceCanvas,
        left, top, width, height,  // source rect with content to crop
        0, 0, width, height);      // newCanvas, same size as source rect
    return destCanvas;
};

// ref: https://stackoverflow.com/a/52060802/11651419
const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
});

// before unload
$(window).bind('beforeunload', function () {
    if (!vm.syncStatus) {
        return 'Exit app without save data ?';
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}