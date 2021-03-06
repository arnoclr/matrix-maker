/*! For license information please see 658.c6396f944e79773dd40a.js.LICENSE.txt */
(self.webpackChunkmatrix_maker=self.webpackChunkmatrix_maker||[]).push([[658],{658:function(e){!function(t,r,n){"use strict";"object"==typeof e.exports?e.exports=function(e,t){return n(e,t)}:n(t,r)}("undefined"!=typeof window?window.jQuery:{},"undefined"!=typeof window?window:this,(function(e,t){"use strict";var r,n=t.document,a=t.Image,o=t.Array,i=t.getComputedStyle,s=t.Math,l=t.Number,u=t.parseFloat,h=e.extend,d=e.inArray,c=function(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()},f=e.isPlainObject,g=s.PI,v=s.round,p=s.abs,y=s.sin,m=s.cos,w=s.atan2,x=o.prototype.slice,b=e.event.fix,_={},k={dataCache:{},propCache:{},imageCache:{}},C={rotate:0,scaleX:1,scaleY:1,translateX:0,translateY:0,masks:[]},L={},T=["mousedown","mousemove","mouseup","mouseover","mouseout","touchstart","touchmove","touchend"];function S(e){var t;for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&(this[t]=e[t]);return this}var O,R={events:{},eventHooks:{},future:{}};function P(){h(this,P.baseDefaults)}function X(e){return"string"===c(e)}function Y(e){return"function"===c(e)}function D(e){return!isNaN(l(e))&&!isNaN(u(e))}function j(e){return e&&e.getContext?e.getContext("2d"):null}function A(e){var t,r;for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&(r=e[t],"string"===c(r)&&D(r)&&"text"!==t&&(e[t]=u(r)));void 0!==e.text&&(e.text=String(e.text))}function W(e){return(e=h({},e)).masks=e.masks.slice(0),e}function z(e,t){var r;e.save(),r=W(t.transforms),t.savedTransforms.push(r)}function H(e,t){0===t.savedTransforms.length?t.transforms=W(C):(e.restore(),t.transforms=t.savedTransforms.pop())}function E(e,t,r,n){r[n]&&(Y(r[n])?t[n]=r[n].call(e,r):t[n]=r[n])}function G(e,t,r){E(e,t,r,"fillStyle"),E(e,t,r,"strokeStyle"),t.lineWidth=r.strokeWidth,r.rounded?t.lineCap=t.lineJoin="round":(t.lineCap=r.strokeCap,t.lineJoin=r.strokeJoin,t.miterLimit=r.miterLimit),r.strokeDash||(r.strokeDash=[]),t.setLineDash&&t.setLineDash(r.strokeDash),t.webkitLineDash=r.strokeDash,t.lineDashOffset=t.webkitLineDashOffset=t.mozDashOffset=r.strokeDashOffset,t.shadowOffsetX=r.shadowX,t.shadowOffsetY=r.shadowY,t.shadowBlur=r.shadowBlur,t.shadowColor=r.shadowColor,t.globalAlpha=r.opacity,t.globalCompositeOperation=r.compositing,r.imageSmoothing&&(t.imageSmoothingEnabled=r.imageSmoothing)}function I(e,t,r){r.mask&&(r.autosave&&z(e,t),e.clip(),t.transforms.masks.push(r._args))}function F(e,t){t._transformed&&e.restore()}function B(e,t,r){r.closed&&t.closePath(),r.shadowStroke&&0!==r.strokeWidth?(t.stroke(),t.fill(),t.shadowColor="transparent",t.shadowBlur=0,t.stroke()):(t.fill(),"transparent"!==r.fillStyle&&(t.shadowColor="transparent"),0!==r.strokeWidth&&t.stroke()),r.closed||t.closePath(),F(t,r),r.mask&&I(t,M(e),r)}function N(e,t,r,n,a){r._toRad=r.inDegrees?g/180:1,r._transformed=!0,t.save(),r.fromCenter||r._centered||void 0===n||(void 0===a&&(a=n),r.x+=n/2,r.y+=a/2,r._centered=!0),r.rotate&&fe(t,r,null),1===r.scale&&1===r.scaleX&&1===r.scaleY||ge(t,r,null),(r.translate||r.translateX||r.translateY)&&ve(t,r,null)}function M(t){var r,n=k.dataCache;return n._canvas===t&&n._data?r=n._data:((r=e.data(t,"jCanvas"))||(r={canvas:t,layers:[],layer:{names:{},groups:{}},eventHooks:{},intersecting:[],lastIntersected:null,cursor:e(t).css("cursor"),drag:{layer:null,dragging:!1},event:{type:null,x:null,y:null},events:{},transforms:W(C),savedTransforms:[],animating:!1,animated:null,pixelRatio:1,scaled:!1,redrawOnMousemove:!1},e.data(t,"jCanvas",r)),n._canvas=t,n._data=r),r}function J(e,t,r){var n;for(n in R.events)Object.prototype.hasOwnProperty.call(R.events,n)&&(r[n]||r.cursors&&r.cursors[n])&&Q(e,t,r,n);t.events.mouseout||(e.bind("mouseout.jCanvas",(function(){var r,n=t.drag.layer;for(n&&(t.drag={},ne(e,t,n,"dragcancel")),r=0;r<t.layers.length;r+=1)(n=t.layers[r])._hovered&&e.triggerLayerEvent(t.layers[r],"mouseout");e.drawLayers()})),t.events.mouseout=!0)}function q(e,t,r,n){R.events[n](e,t),r._event=!0}function Q(e,t,r,n){q(e,t,r,n),"mouseover"!==n&&"mouseout"!==n&&"mousemove"!==n||(t.redrawOnMousemove=!0)}function $(e,t,r){var n,a;if(r.draggable||r.cursors){for(n=["mousedown","mousemove","mouseup"],a=0;a<n.length;a+=1)q(e,t,r,n[a]);r._event=!0}}function U(e,t,r,n){var a=t.layer.names;n?void 0!==n.name&&X(r.name)&&r.name!==n.name&&delete a[r.name]:n=r,X(n.name)&&(a[n.name]=r)}function V(e,t,r,n){var a,o,i,s,l,u=t.layer.groups;if(n){if(void 0!==n.groups&&null!==r.groups)for(i=0;i<r.groups.length;i+=1)if(a=u[o=r.groups[i]]){for(l=0;l<a.length;l+=1)if(a[l]===r){s=l,a.splice(l,1);break}0===a.length&&delete u[o]}}else n=r;if(void 0!==n.groups&&null!==n.groups)for(i=0;i<n.groups.length;i+=1)(a=u[o=n.groups[i]])||((a=u[o]=[]).name=o),void 0===s&&(s=a.length),a.splice(s,0,r)}function K(e){var t,r,n;for(t=null,r=e.intersecting.length-1;r>=0;r-=1)if((t=e.intersecting[r])._masks){for(n=t._masks.length-1;n>=0;n-=1)if(!t._masks[n].intersects){t.intersects=!1;break}if(t.intersects&&!t.intangible)break}return t&&t.intangible&&(t=null),t}function Z(e,t,r,n){r&&r.visible&&r._method&&(r._next=n||null,r._method&&r._method.call(e,r))}function ee(e,t,r){var n,a,o,i,s,l,u,h,d,c;if(s=(a=(i=t.drag).layer)&&a.dragGroups||[],n=t.layers,"mousemove"===r||"touchmove"===r){if(i.dragging||(i.dragging=!0,a.dragging=!0,a.bringToFront&&(n.splice(a.index,1),a.index=n.push(a)),a._startX=a.x,a._startY=a.y,a._endX=a._eventX,a._endY=a._eventY,ne(e,t,a,"dragstart")),i.dragging)for(d=a._eventX-(a._endX-a._startX),c=a._eventY-(a._endY-a._startY),a.updateDragX&&(d=a.updateDragX.call(e[0],a,d)),a.updateDragY&&(c=a.updateDragY.call(e[0],a,c)),a.dx=d-a.x,a.dy=c-a.y,"y"!==a.restrictDragToAxis&&(a.x=d),"x"!==a.restrictDragToAxis&&(a.y=c),ne(e,t,a,"drag"),h=0;h<s.length;h+=1)if(u=s[h],l=t.layer.groups[u],a.groups&&l)for(o=0;o<l.length;o+=1)l[o]!==a&&("y"!==a.restrictDragToAxis&&"y"!==l[o].restrictDragToAxis&&(l[o].x+=a.dx),"x"!==a.restrictDragToAxis&&"x"!==l[o].restrictDragToAxis&&(l[o].y+=a.dy))}else"mouseup"!==r&&"touchend"!==r||(i.dragging&&(a.dragging=!1,i.dragging=!1,t.redrawOnMousemove=t.originalRedrawOnMousemove,ne(e,t,a,"dragstop")),t.drag={})}function te(e,t){e.css({cursor:t.cursor})}function re(e,t,r,n,a){n[r]&&t._running&&!t._running[r]&&(t._running[r]=!0,n[r].call(e[0],t,a),t._running[r]=!1)}function ne(t,r,n,a,o){(function(t,r){return!(t.disableEvents||t.intangible&&-1!==e.inArray(r,T))})(n,a)&&("mouseout"!==a&&function(t,r,n){var a;r.cursors&&(a=r.cursors[n]),-1!==e.inArray(a,L.cursors)&&(a=L.prefix+a),a&&t.css({cursor:a})}(t,n,a),re(t,n,a,n,o),re(t,n,a,r.eventHooks,o),re(t,n,a,R.eventHooks,o))}function ae(t,r,n,a){var o,i,s,l=r._layer?n:r;return r._args=n,(r.draggable||r.dragGroups)&&(r.layer=!0,r.draggable=!0),r._method||(a?r._method=a:r.method?r._method=e.fn[r.method]:r.type&&(r._method=e.fn[_.drawings[r.type]])),r.layer&&!r._layer?(o=e(t),s=(i=M(t)).layers,(null===l.name||X(l.name)&&void 0===i.layer.names[l.name])&&(A(r),(l=new S(r)).canvas=t,l.layer=!0,l._layer=!0,l._running={},null!==l.data?l.data=h({},l.data):l.data={},null!==l.groups?l.groups=l.groups.slice(0):l.groups=[],U(0,i,l),V(0,i,l),J(o,i,l),$(o,i,l),r._event=l._event,l._method===e.fn.drawText&&o.measureText(l),null===l.index&&(l.index=s.length),s.splice(l.index,0,l),r._args=l,ne(o,i,l,"add"))):r.layer||A(r),l}function oe(e){var t,r;for(r=0;r<L.props.length;r+=1)e[t=L.props[r]]=e["_"+t]}function ie(e,t){var r,n;for(n=0;n<L.props.length;n+=1)void 0!==e[r=L.props[n]]&&(e["_"+r]=e[r],L.propsObj[r]=!0,t&&delete e[r])}function se(e,t,r){var n,a,o,i;for(n in r)if(Object.prototype.hasOwnProperty.call(r,n)&&(Y(a=r[n])&&(r[n]=a.call(e,t,n)),"object"===c(a)&&f(a))){for(o in a)Object.prototype.hasOwnProperty.call(a,o)&&(i=a[o],void 0!==t[n]&&(t[n+"."+o]=t[n][o],r[n+"."+o]=i));delete r[n]}return r}function le(e){var t;for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&-1!==t.indexOf(".")&&delete e[t]}function ue(t){var r,a,o=[],i=1;return"transparent"===t?t="rgba(0, 0, 0, 0)":t.match(/^([a-z]+|#[0-9a-f]+)$/gi)&&(r=(a=n.head).style.color,a.style.color=t,t=e.css(a,"color"),a.style.color=r),t.match(/^rgb/gi)&&(o=t.match(/(\d+(\.\d+)?)/gi),t.match(/%/gi)&&(i=2.55),o[0]*=i,o[1]*=i,o[2]*=i,void 0!==o[3]?o[3]=u(o[3]):o[3]=1),o}function he(e){var t,r=3;for("array"!==c(e.start)&&(e.start=ue(e.start),e.end=ue(e.end)),e.now=[],1===e.start[3]&&1===e.end[3]||(r=4),t=0;t<r;t+=1)e.now[t]=e.start[t]+(e.end[t]-e.start[t])*e.pos,t<3&&(e.now[t]=v(e.now[t]));1!==e.start[3]||1!==e.end[3]?e.now="rgba("+e.now.join(",")+")":(e.now.slice(0,3),e.now="rgb("+e.now.join(",")+")"),e.elem.nodeName?e.elem.style[e.prop]=e.now:e.elem[e.prop]=e.now}function de(e){R.events[e]=function(t,r){var n,a,o;function i(e){o.x=e.offsetX,o.y=e.offsetY,o.type=n,o.event=e,("mousemove"!==e.type||r.redrawOnMousemove||r.drag.dragging)&&t.drawLayers({resetFire:!0}),e.preventDefault()}o=r.event,a=function(e){return _.touchEvents[e]&&(e=_.touchEvents[e]),e}(n="mouseover"===e||"mouseout"===e?"mousemove":e),r.events[n]||(a!==n?t.bind(n+".jCanvas "+a+".jCanvas",i):t.bind(n+".jCanvas",i),r.events[n]=!0)}}function ce(e,t,r){var n,a,o,i,s,l,u,h;(n=r._args)&&(null!==(o=(a=M(e)).event).x&&null!==o.y&&(l=o.x*a.pixelRatio,u=o.y*a.pixelRatio,i=t.isPointInPath(l,u)||t.isPointInStroke&&t.isPointInStroke(l,u)),s=a.transforms,n.eventX=o.x,n.eventY=o.y,n.event=o.event,h=a.transforms.rotate,l=n.eventX,u=n.eventY,0!==h?(n._eventX=l*m(-h)-u*y(-h),n._eventY=u*m(-h)+l*y(-h)):(n._eventX=l,n._eventY=u),n._eventX/=s.scaleX,n._eventY/=s.scaleY,i&&a.intersecting.push(n),n.intersects=Boolean(i))}function fe(e,t,r){t._toRad=t.inDegrees?g/180:1,e.translate(t.x,t.y),e.rotate(t.rotate*t._toRad),e.translate(-t.x,-t.y),r&&(r.rotate+=t.rotate*t._toRad)}function ge(e,t,r){1!==t.scale&&(t.scaleX=t.scaleY=t.scale),e.translate(t.x,t.y),e.scale(t.scaleX,t.scaleY),e.translate(-t.x,-t.y),r&&(r.scaleX*=t.scaleX,r.scaleY*=t.scaleY)}function ve(e,t,r){t.translate&&(t.translateX=t.translateY=t.translate),e.translate(t.translateX,t.translateY),r&&(r.translateX+=t.translateX,r.translateY+=t.translateY)}function pe(e){for(;e<0;)e+=2*g;return e}function ye(e,t){return e.x+e.radius*m(t)}function me(e,t){return e.y+e.radius*y(t)}function we(e,t,r,n){var a,o,i,s,l;r===n?(i=0,s=0):(i=r.x,s=r.y),n.inDegrees||360!==n.end||(n.end=2*g),n.start*=r._toRad,n.end*=r._toRad,n.start-=g/2,n.end-=g/2,l=g/180,n.ccw&&(l*=-1),be(0,t,r,n,ye(n,n.start+l),me(n,n.start+l),ye(n,n.start),me(n,n.start)),t.arc(n.x+i,n.y+s,n.radius,n.start,n.end,n.ccw),a=ye(n,n.end+l),o=me(n,n.end+l),_e(0,t,r,n,ye(n,n.end),me(n,n.end),a,o)}function xe(e,t,r,n,a,o,i,s){var l,u,h,d,c,f,v;n.arrowRadius&&!r.closed&&(v=w(s-o,i-a),v-=g,c=r.strokeWidth*m(v),f=r.strokeWidth*y(v),l=i+n.arrowRadius*m(v+n.arrowAngle/2),u=s+n.arrowRadius*y(v+n.arrowAngle/2),h=i+n.arrowRadius*m(v-n.arrowAngle/2),d=s+n.arrowRadius*y(v-n.arrowAngle/2),t.moveTo(l-c,u-f),t.lineTo(i-c,s-f),t.lineTo(h-c,d-f),t.moveTo(i-c,s-f),t.lineTo(i+c,s+f),t.moveTo(i,s))}function be(e,t,r,n,a,o,i,s){n._arrowAngleConverted||(n.arrowAngle*=r._toRad,n._arrowAngleConverted=!0),n.startArrow&&xe(0,t,r,n,a,o,i,s)}function _e(e,t,r,n,a,o,i,s){n._arrowAngleConverted||(n.arrowAngle*=r._toRad,n._arrowAngleConverted=!0),n.endArrow&&xe(0,t,r,n,a,o,i,s)}function ke(e,t,r,n){var a,o,i;for(a=2,be(0,t,r,n,n.x2+r.x,n.y2+r.y,n.x1+r.x,n.y1+r.y),void 0!==n.x1&&void 0!==n.y1&&t.moveTo(n.x1+r.x,n.y1+r.y);o=n["x"+a],i=n["y"+a],void 0!==o&&void 0!==i;)t.lineTo(o+r.x,i+r.y),a+=1;_e(0,t,r,n,n["x"+((a-=1)-1)]+r.x,n["y"+(a-1)]+r.y,n["x"+a]+r.x,n["y"+a]+r.y)}function Ce(e,t,r,n){var a,o,i,s,l;for(a=2,be(0,t,r,n,n.cx1+r.x,n.cy1+r.y,n.x1+r.x,n.y1+r.y),void 0!==n.x1&&void 0!==n.y1&&t.moveTo(n.x1+r.x,n.y1+r.y);o=n["x"+a],i=n["y"+a],s=n["cx"+(a-1)],l=n["cy"+(a-1)],void 0!==o&&void 0!==i&&void 0!==s&&void 0!==l;)t.quadraticCurveTo(s+r.x,l+r.y,o+r.x,i+r.y),a+=1;_e(0,t,r,n,n["cx"+((a-=1)-1)]+r.x,n["cy"+(a-1)]+r.y,n["x"+a]+r.x,n["y"+a]+r.y)}function Le(e,t,r,n){var a,o,i,s,l,u,h,d;for(a=2,o=1,be(0,t,r,n,n.cx1+r.x,n.cy1+r.y,n.x1+r.x,n.y1+r.y),void 0!==n.x1&&void 0!==n.y1&&t.moveTo(n.x1+r.x,n.y1+r.y);i=n["x"+a],s=n["y"+a],l=n["cx"+o],u=n["cy"+o],h=n["cx"+(o+1)],d=n["cy"+(o+1)],void 0!==i&&void 0!==s&&void 0!==l&&void 0!==u&&void 0!==h&&void 0!==d;)t.bezierCurveTo(l+r.x,u+r.y,h+r.x,d+r.y,i+r.x,s+r.y),a+=1,o+=2;a-=1,_e(0,t,r,n,n["cx"+(1+(o-=2))]+r.x,n["cy"+(o+1)]+r.y,n["x"+a]+r.x,n["y"+a]+r.y)}function Te(e,t,r){return t*=e._toRad,r*m(t-=g/2)}function Se(e,t,r){return t*=e._toRad,r*y(t-=g/2)}function Oe(e,t,r,n){var a,o,i,s,l,u,h,d,c,f,g;for(r===n?(s=0,l=0):(s=r.x,l=r.y),a=1,u=d=f=n.x+s,h=c=g=n.y+l,be(0,t,r,n,u+Te(r,n.a1,n.l1),h+Se(r,n.a1,n.l1),u,h),void 0!==n.x&&void 0!==n.y&&t.moveTo(u,h);o=n["a"+a],i=n["l"+a],void 0!==o&&void 0!==i;)d=f,c=g,f+=Te(r,o,i),g+=Se(r,o,i),t.lineTo(f,g),a+=1;_e(0,t,r,n,d,c,f,g)}function Re(e,t,r){isNaN(l(r.fontSize))||(r.fontSize+="px"),t.font=r.fontStyle+" "+r.fontSize+" "+r.fontFamily}function Pe(t,r,n,a){var o,i,s,l=k.propCache;if(l.text===n.text&&l.fontStyle===n.fontStyle&&l.fontSize===n.fontSize&&l.fontFamily===n.fontFamily&&l.maxWidth===n.maxWidth&&l.lineHeight===n.lineHeight)n.width=l.width,n.height=l.height;else{for(n.width=r.measureText(a[0]).width,s=1;s<a.length;s+=1)(i=r.measureText(a[s]).width)>n.width&&(n.width=i);o=t.style.fontSize,t.style.fontSize=n.fontSize,n.height=u(e.css(t,"fontSize"))*a.length*n.lineHeight,t.style.fontSize=o}}function Xe(e,t){var r,n,a,o,i,s,l=String(t.text),u=t.maxWidth,h=l.split("\n"),d=[];for(a=0;a<h.length;a+=1){if(r=[],n="",1===(i=(o=h[a]).split(" ")).length||e.measureText(o).width<u)r=[o];else{for(s=0;s<i.length;s+=1)e.measureText(n+i[s]).width>u&&(""!==n&&r.push(n),n=""),n+=i[s],s!==i.length-1&&(n+=" ");r.push(n)}d=d.concat(r.join("\n").replace(/((\n))|($)/gi,"$2").split("\n"))}return d}P.baseDefaults={align:"center",arrowAngle:90,arrowRadius:0,autosave:!0,baseline:"middle",bringToFront:!1,ccw:!1,closed:!1,compositing:"source-over",concavity:0,cornerRadius:0,count:1,cropFromCenter:!0,crossOrigin:null,cursors:null,disableEvents:!1,draggable:!1,dragGroups:null,groups:null,data:null,dx:null,dy:null,end:360,eventX:null,eventY:null,fillStyle:"transparent",fontStyle:"normal",fontSize:"12pt",fontFamily:"sans-serif",fromCenter:!0,height:null,imageSmoothing:!0,inDegrees:!0,intangible:!1,index:null,letterSpacing:null,lineHeight:1,layer:!1,mask:!1,maxWidth:null,miterLimit:10,name:null,opacity:1,r1:null,r2:null,radius:0,repeat:"repeat",respectAlign:!1,restrictDragToAxis:null,rotate:0,rounded:!1,scale:1,scaleX:1,scaleY:1,shadowBlur:0,shadowColor:"transparent",shadowStroke:!1,shadowX:0,shadowY:0,sHeight:null,sides:0,source:"",spread:0,start:0,strokeCap:"butt",strokeDash:null,strokeDashOffset:0,strokeJoin:"miter",strokeStyle:"transparent",strokeWidth:1,sWidth:null,sx:null,sy:null,text:"",translate:0,translateX:0,translateY:0,type:null,visible:!0,width:null,x:0,y:0},r=new P,S.prototype=r,R.extend=function(t){return t.name&&(t.props&&h(r,t.props),e.fn[t.name]=function e(r){var n,a,o,i,s=this;for(a=0;a<s.length;a+=1)(o=j(n=s[a]))&&(ae(n,i=new S(r),r,e),G(n,o,i),t.fn.call(n,o,i));return s},t.type&&(_.drawings[t.type]=t.name)),e.fn[t.name]},e.fn.getEventHooks=function(){var e={};return 0!==this.length&&(e=M(this[0]).eventHooks),e},e.fn.setEventHooks=function(e){var t,r,n=this;for(t=0;t<n.length;t+=1)r=M(n[t]),h(r.eventHooks,e);return n},e.fn.getLayers=function(e){var t,r,n,a,o=[];if(0!==this.length)if(r=M(t=this[0]).layers,Y(e))for(a=0;a<r.length;a+=1)n=r[a],e.call(t,n)&&o.push(n);else o=r;return o},e.fn.getLayer=function(e){var t,r,n,a,o;if(0!==this.length)if(r=(t=M(this[0])).layers,o=c(e),e&&e.layer)n=e;else if("number"===o)e<0&&(e=r.length+e),n=r[e];else if("regexp"===o){for(a=0;a<r.length;a+=1)if(X(r[a].name)&&r[a].name.match(e)){n=r[a];break}}else n=t.layer.names[e];return n},e.fn.getLayerGroup=function(e){var t,r,n,a,o=c(e);if(0!==this.length)if(t=this[0],"array"===o)a=e;else if("regexp"===o){for(n in r=M(t).layer.groups)if(n.match(e)){a=r[n];break}}else a=M(t).layer.groups[e];return a},e.fn.getLayerIndex=function(e){var t=this.getLayers(),r=this.getLayer(e);return d(r,t)},e.fn.setLayer=function(t,r){var n,a,o,i,s,l,d,g=this;for(a=0;a<g.length;a+=1)if(n=e(g[a]),o=M(g[a]),i=e(g[a]).getLayer(t)){for(s in U(0,o,i,r),V(0,o,i,r),A(r),r)Object.prototype.hasOwnProperty.call(r,s)&&(l=r[s],"object"===(d=c(l))&&f(l)?(i[s]=h({},l),A(i[s])):"array"===d?i[s]=l.slice(0):"string"===d?0===l.indexOf("+=")?i[s]+=u(l.substr(2)):0===l.indexOf("-=")?i[s]-=u(l.substr(2)):!isNaN(l)&&D(l)&&"text"!==s?i[s]=u(l):i[s]=l:i[s]=l);J(n,o,i),$(n,o,i),!1===e.isEmptyObject(r)&&ne(n,o,i,"change",r)}return g},e.fn.setLayers=function(t,r){var n,a,o,i,s=this;for(a=0;a<s.length;a+=1)for(o=(n=e(s[a])).getLayers(r),i=0;i<o.length;i+=1)n.setLayer(o[i],t);return s},e.fn.setLayerGroup=function(t,r){var n,a,o,i,s=this;for(a=0;a<s.length;a+=1)if(o=(n=e(s[a])).getLayerGroup(t))for(i=0;i<o.length;i+=1)n.setLayer(o[i],r);return s},e.fn.moveLayer=function(t,r){var n,a,o,i,s,l=this;for(a=0;a<l.length;a+=1)n=e(l[a]),i=(o=M(l[a])).layers,(s=n.getLayer(t))&&(s.index=d(s,i),i.splice(s.index,1),i.splice(r,0,s),r<0&&(r=i.length+r),s.index=r,ne(n,o,s,"move"));return l},e.fn.removeLayer=function(t){var r,n,a,o,i,s=this;for(n=0;n<s.length;n+=1)r=e(s[n]),a=M(s[n]),o=r.getLayers(),(i=r.getLayer(t))&&(i.index=d(i,o),o.splice(i.index,1),delete i._layer,U(0,a,i,{name:null}),V(0,a,i,{groups:null}),ne(r,a,i,"remove"));return s},e.fn.removeLayers=function(t){var r,n,a,o,i,s,l=this;for(n=0;n<l.length;n+=1){for(r=e(l[n]),a=M(l[n]),o=r.getLayers(t).slice(0),s=0;s<o.length;s+=1)i=o[s],r.removeLayer(i);a.layer.names={},a.layer.groups={}}return l},e.fn.removeLayerGroup=function(t){var r,n,a,o,i=this;if(void 0!==t)for(n=0;n<i.length;n+=1)if(a=(r=e(i[n])).getLayerGroup(t))for(a=a.slice(0),o=0;o<a.length;o+=1)r.removeLayer(a[o]);return i},e.fn.addLayerToGroup=function(t,r){var n,a,o,i=this,s=[r];for(a=0;a<i.length;a+=1)(o=(n=e(i[a])).getLayer(t)).groups&&(s=o.groups.slice(0),-1===d(r,o.groups)&&s.push(r)),n.setLayer(o,{groups:s});return i},e.fn.removeLayerFromGroup=function(t,r){var n,a,o,i,s=this,l=[];for(a=0;a<s.length;a+=1)(o=(n=e(s[a])).getLayer(t)).groups&&-1!==(i=d(r,o.groups))&&((l=o.groups.slice(0)).splice(i,1),n.setLayer(o,{groups:l}));return s},L.cursors=["grab","grabbing","zoom-in","zoom-out"],L.prefix=(O=i(n.documentElement,""),"-"+(x.call(O).join("").match(/-(moz|webkit|ms)-/)||""===O.OLink&&["","o"])[1]+"-"),e.fn.triggerLayerEvent=function(t,r){var n,a,o,i=this;for(a=0;a<i.length;a+=1)n=e(i[a]),o=M(i[a]),(t=n.getLayer(t))&&ne(n,o,t,r);return i},e.fn.drawLayer=function(t){var r,n,a,o=this;for(r=0;r<o.length;r+=1)n=e(o[r]),j(o[r])&&(a=n.getLayer(t),Z(n,0,a));return o},e.fn.drawLayers=function(t){var r,n,a,o,i,s,l,u,h,d,c,f,g,v=this,p=t||{};for((l=p.index)||(l=0),n=0;n<v.length;n+=1)if(r=e(v[n]),j(v[n])){for(h=M(v[n]),!1!==p.clear&&r.clearCanvas(),p.complete&&(h.drawLayersComplete=p.complete),a=h.layers,s=l;s<a.length;s+=1)if((o=a[s]).index=s,p.resetFire&&(o._fired=!1),Z(r,0,o,s+1),o._masks=h.transforms.masks.slice(0),o._method===e.fn.drawImage&&o.visible){f=!0;break}if(f)continue;u=s,p.complete&&(p.complete.call(v[n]),delete h.drawLayersComplete),o=K(h),c=(d=h.event).type,h.drag.layer&&ee(r,h,c),null===(i=h.lastIntersected)||o===i||!i._hovered||i._fired||h.drag.dragging||(h.lastIntersected=null,i._fired=!0,i._hovered=!1,ne(r,h,i,"mouseout"),te(r,h)),o&&(o[c]||(g=c,_.mouseEvents[g]&&(g=_.mouseEvents[g]),c=g),o._event&&o.intersects&&(h.lastIntersected=o,(o.mouseover||o.mouseout||o.cursors)&&!h.drag.dragging&&(o._hovered||o._fired||(o._fired=!0,o._hovered=!0,ne(r,h,o,"mouseover"))),o._fired||(o._fired=!0,d.type=null,ne(r,h,o,c)),!o.draggable||o.disableEvents||"mousedown"!==c&&"touchstart"!==c||(h.drag.layer=o,h.originalRedrawOnMousemove=h.redrawOnMousemove,h.redrawOnMousemove=!0))),null!==o||h.drag.dragging||te(r,h),u===a.length&&(h.intersecting.length=0,h.transforms=W(C),h.savedTransforms.length=0)}return v},e.fn.addLayer=function(e){var t,r,n=this;for(t=0;t<n.length;t+=1)j(n[t])&&((r=new S(e)).layer=!0,ae(n[t],r,e));return n},L.props=["width","height","opacity","lineHeight"],L.propsObj={},e.fn.animateLayer=function(){var t,r,n,a,o,i=this,s=x.call(arguments,0);function l(e,t,r){return function(){oe(r),le(r),t.animating&&t.animated!==r||e.drawLayers(),r._animating=!1,t.animating=!1,t.animated=null,s[4]&&s[4].call(e[0],r),ne(e,t,r,"animateend")}}function u(e,t,r){return function(n,a){var o,i,l,u=!1;"_"===a.prop[0]&&(u=!0,a.prop=a.prop.replace("_",""),r[a.prop]=r["_"+a.prop]),-1!==a.prop.indexOf(".")&&(i=(o=a.prop.split("."))[0],l=o[1],r[i]&&(r[i][l]=a.now)),r._pos!==a.pos&&(r._pos=a.pos,r._animating||t.animating||(r._animating=!0,t.animating=!0,t.animated=r),t.animating&&t.animated!==r||e.drawLayers()),s[5]&&s[5].call(e[0],n,a,r),ne(e,t,r,"animate",a),u&&(a.prop="_"+a.prop)}}for("object"===c(s[2])?(s.splice(2,0,s[2].duration||null),s.splice(3,0,s[3].easing||null),s.splice(4,0,s[4].complete||null),s.splice(5,0,s[5].step||null)):(void 0===s[2]?(s.splice(2,0,null),s.splice(3,0,null),s.splice(4,0,null)):Y(s[2])&&(s.splice(2,0,null),s.splice(3,0,null)),void 0===s[3]?(s[3]=null,s.splice(4,0,null)):Y(s[3])&&s.splice(3,0,null)),r=0;r<i.length;r+=1)t=e(i[r]),j(i[r])&&(n=M(i[r]),(a=t.getLayer(s[0]))&&a._method!==e.fn.draw&&(o=h({},s[1]),ie(o=se(i[r],a,o),!0),ie(a),a.style=L.propsObj,e(a).animate(o,{duration:s[2],easing:e.easing[s[3]]?s[3]:null,complete:l(t,n,a),step:u(t,n,a)}),ne(t,n,a,"animatestart")));return i},e.fn.animateLayerGroup=function(t){var r,n,a,o,i=this,s=x.call(arguments,0);for(n=0;n<i.length;n+=1)if(a=(r=e(i[n])).getLayerGroup(t))for(o=0;o<a.length;o+=1)s[0]=a[o],r.animateLayer.apply(r,s);return i},e.fn.delayLayer=function(t,r){var n,a,o,i,s=this;for(r=r||0,a=0;a<s.length;a+=1)n=e(s[a]),o=M(s[a]),(i=n.getLayer(t))&&(e(i).delay(r),ne(n,o,i,"delay"));return s},e.fn.delayLayerGroup=function(t,r){var n,a,o,i,s,l=this;for(r=r||0,a=0;a<l.length;a+=1)if(o=(n=e(l[a])).getLayerGroup(t))for(s=0;s<o.length;s+=1)i=o[s],n.delayLayer(i,r);return l},e.fn.stopLayer=function(t,r){var n,a,o,i,s=this;for(a=0;a<s.length;a+=1)n=e(s[a]),o=M(s[a]),(i=n.getLayer(t))&&(e(i).stop(r),ne(n,o,i,"stop"));return s},e.fn.stopLayerGroup=function(t,r){var n,a,o,i,s,l=this;for(a=0;a<l.length;a+=1)if(o=(n=e(l[a])).getLayerGroup(t))for(s=0;s<o.length;s+=1)i=o[s],n.stopLayer(i,r);return l},function(t){var r;for(r=0;r<t.length;r+=1)e.fx.step[t[r]]=he}(["color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","fillStyle","outlineColor","strokeStyle","shadowColor"]),_.touchEvents={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"},_.mouseEvents={touchstart:"mousedown",touchend:"mouseup",touchmove:"mousemove"},function(e){var t;for(t=0;t<e.length;t+=1)de(e[t])}(["click","dblclick","mousedown","mouseup","mousemove","mouseover","mouseout","touchstart","touchmove","touchend","pointerdown","pointermove","pointerup","contextmenu"]),e.event.fix=function(t){var r,n,a;if(n=(t=b.call(e.event,t)).originalEvent)if(a=n.changedTouches,void 0!==t.pageX&&void 0===t.offsetX)try{(r=e(t.currentTarget).offset())&&(t.offsetX=t.pageX-r.left,t.offsetY=t.pageY-r.top)}catch(e){}else if(a)try{(r=e(t.currentTarget).offset())&&(t.offsetX=a[0].pageX-r.left,t.offsetY=a[0].pageY-r.top)}catch(e){}return t},_.drawings={arc:"drawArc",bezier:"drawBezier",ellipse:"drawEllipse",function:"draw",image:"drawImage",line:"drawLine",path:"drawPath",polygon:"drawPolygon",slice:"drawSlice",quadratic:"drawQuadratic",rectangle:"drawRect",text:"drawText",vector:"drawVector",save:"saveCanvas",restore:"restoreCanvas",rotate:"rotateCanvas",scale:"scaleCanvas",translate:"translateCanvas"},e.fn.draw=function e(t){var r,n,a=this,o=new S(t);if(_.drawings[o.type]&&"function"!==o.type)a[_.drawings[o.type]](t);else for(r=0;r<a.length;r+=1)(n=j(a[r]))&&(o=new S(t),ae(a[r],o,t,e),o.visible&&o.fn&&o.fn.call(a[r],n,o));return a},e.fn.clearCanvas=function e(t){var r,n,a=this,o=new S(t);for(r=0;r<a.length;r+=1)(n=j(a[r]))&&(null===o.width||null===o.height?(n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,a[r].width,a[r].height),n.restore()):(ae(a[r],o,t,e),N(a[r],n,o,o.width,o.height),n.clearRect(o.x-o.width/2,o.y-o.height/2,o.width,o.height),F(n,o)));return a},e.fn.saveCanvas=function e(t){var r,n,a,o,i,s=this;for(r=0;r<s.length;r+=1)if(n=j(s[r]))for(o=M(s[r]),a=new S(t),ae(s[r],a,t,e),i=0;i<a.count;i+=1)z(n,o);return s},e.fn.restoreCanvas=function e(t){var r,n,a,o,i,s=this;for(r=0;r<s.length;r+=1)if(n=j(s[r]))for(o=M(s[r]),a=new S(t),ae(s[r],a,t,e),i=0;i<a.count;i+=1)H(n,o);return s},e.fn.rotateCanvas=function e(t){var r,n,a,o,i=this;for(r=0;r<i.length;r+=1)(n=j(i[r]))&&(o=M(i[r]),a=new S(t),ae(i[r],a,t,e),a.autosave&&z(n,o),fe(n,a,o.transforms));return i},e.fn.scaleCanvas=function e(t){var r,n,a,o,i=this;for(r=0;r<i.length;r+=1)(n=j(i[r]))&&(o=M(i[r]),a=new S(t),ae(i[r],a,t,e),a.autosave&&z(n,o),ge(n,a,o.transforms));return i},e.fn.translateCanvas=function e(t){var r,n,a,o,i=this;for(r=0;r<i.length;r+=1)(n=j(i[r]))&&(o=M(i[r]),a=new S(t),ae(i[r],a,t,e),a.autosave&&z(n,o),ve(n,a,o.transforms));return i},e.fn.drawRect=function e(t){var r,n,a,o,i,s,l,u,h,d=this;for(r=0;r<d.length;r+=1)(n=j(d[r]))&&(a=new S(t),ae(d[r],a,t,e),a.visible&&(N(d[r],n,a,a.width,a.height),G(d[r],n,a),n.beginPath(),a.width&&a.height&&(o=a.x-a.width/2,i=a.y-a.height/2,(u=p(a.cornerRadius))?(s=a.x+a.width/2,l=a.y+a.height/2,a.width<0&&(h=o,o=s,s=h),a.height<0&&(h=i,i=l,l=h),s-o-2*u<0&&(u=(s-o)/2),l-i-2*u<0&&(u=(l-i)/2),n.moveTo(o+u,i),n.lineTo(s-u,i),n.arc(s-u,i+u,u,3*g/2,2*g,!1),n.lineTo(s,l-u),n.arc(s-u,l-u,u,0,g/2,!1),n.lineTo(o+u,l),n.arc(o+u,l-u,u,g/2,g,!1),n.lineTo(o,i+u),n.arc(o+u,i+u,u,g,3*g/2,!1),a.closed=!0):n.rect(o,i,a.width,a.height)),ce(d[r],n,a),B(d[r],n,a)));return d},e.fn.drawArc=function e(t){var r,n,a,o=this;for(r=0;r<o.length;r+=1)(n=j(o[r]))&&(a=new S(t),ae(o[r],a,t,e),a.visible&&(N(o[r],n,a,2*a.radius),G(o[r],n,a),n.beginPath(),we(o[r],n,a,a),ce(o[r],n,a),B(o[r],n,a)));return o},e.fn.drawEllipse=function e(t){var r,n,a,o,i,s=this;for(r=0;r<s.length;r+=1)(n=j(s[r]))&&(a=new S(t),ae(s[r],a,t,e),a.visible&&(N(s[r],n,a,a.width,a.height),G(s[r],n,a),o=a.width*(4/3),i=a.height,n.beginPath(),n.moveTo(a.x,a.y-i/2),n.bezierCurveTo(a.x-o/2,a.y-i/2,a.x-o/2,a.y+i/2,a.x,a.y+i/2),n.bezierCurveTo(a.x+o/2,a.y+i/2,a.x+o/2,a.y-i/2,a.x,a.y-i/2),ce(s[r],n,a),a.closed=!0,B(s[r],n,a)));return s},e.fn.drawPolygon=function e(t){var r,n,a,o,i,s,l,u,h,d,c=this;for(r=0;r<c.length;r+=1)if((n=j(c[r]))&&(a=new S(t),ae(c[r],a,t,e),a.visible)){for(N(c[r],n,a,2*a.radius),G(c[r],n,a),o=(s=(i=2*g/a.sides)/2)+g/2,l=a.radius*m(s),n.beginPath(),d=0;d<a.sides;d+=1)u=a.x+a.radius*m(o),h=a.y+a.radius*y(o),n.lineTo(u,h),a.concavity&&(u=a.x+(l+-l*a.concavity)*m(o+s),h=a.y+(l+-l*a.concavity)*y(o+s),n.lineTo(u,h)),o+=i;ce(c[r],n,a),a.closed=!0,B(c[r],n,a)}return c},e.fn.drawSlice=function e(t){var r,n,a,o,i,s,l=this;for(r=0;r<l.length;r+=1)(n=j(l[r]))&&(a=new S(t),ae(l[r],a,t,e),a.visible&&(N(l[r],n,a,2*a.radius),G(l[r],n,a),a.start*=a._toRad,a.end*=a._toRad,a.start-=g/2,a.end-=g/2,a.start=pe(a.start),a.end=pe(a.end),a.end<a.start&&(a.end+=2*g),o=(a.start+a.end)/2,i=a.radius*a.spread*m(o),s=a.radius*a.spread*y(o),a.x+=i,a.y+=s,n.beginPath(),n.arc(a.x,a.y,a.radius,a.start,a.end,a.ccw),n.lineTo(a.x,a.y),ce(l[r],n,a),a.closed=!0,B(l[r],n,a)));return l},e.fn.drawLine=function e(t){var r,n,a,o=this;for(r=0;r<o.length;r+=1)(n=j(o[r]))&&(a=new S(t),ae(o[r],a,t,e),a.visible&&(N(o[r],n,a),G(o[r],n,a),n.beginPath(),ke(o[r],n,a,a),ce(o[r],n,a),B(o[r],n,a)));return o},e.fn.drawQuadratic=function e(t){var r,n,a,o=this;for(r=0;r<o.length;r+=1)(n=j(o[r]))&&(a=new S(t),ae(o[r],a,t,e),a.visible&&(N(o[r],n,a),G(o[r],n,a),n.beginPath(),Ce(o[r],n,a,a),ce(o[r],n,a),B(o[r],n,a)));return o},e.fn.drawBezier=function e(t){var r,n,a,o=this;for(r=0;r<o.length;r+=1)(n=j(o[r]))&&(a=new S(t),ae(o[r],a,t,e),a.visible&&(N(o[r],n,a),G(o[r],n,a),n.beginPath(),Le(o[r],n,a,a),ce(o[r],n,a),B(o[r],n,a)));return o},e.fn.drawVector=function e(t){var r,n,a,o=this;for(r=0;r<o.length;r+=1)(n=j(o[r]))&&(a=new S(t),ae(o[r],a,t,e),a.visible&&(N(o[r],n,a),G(o[r],n,a),n.beginPath(),Oe(o[r],n,a,a),ce(o[r],n,a),B(o[r],n,a)));return o},e.fn.drawPath=function e(t){var r,n,a,o,i,s=this;for(r=0;r<s.length;r+=1)if((n=j(s[r]))&&(a=new S(t),ae(s[r],a,t,e),a.visible)){for(N(s[r],n,a),G(s[r],n,a),n.beginPath(),o=1;void 0!==(i=a["p"+o]);)"line"===(i=new S(i)).type?ke(s[r],n,a,i):"quadratic"===i.type?Ce(s[r],n,a,i):"bezier"===i.type?Le(s[r],n,a,i):"vector"===i.type?Oe(s[r],n,a,i):"arc"===i.type&&we(s[r],n,a,i),o+=1;ce(s[r],n,a),B(s[r],n,a)}return s},e.fn.drawText=function e(t){var r,n,a,o,i,s,l,h,d,c,f,v,p,y=this;for(r=0;r<y.length;r+=1)if((n=j(y[r]))&&(a=new S(t),ae(y[r],a,t,e),a.visible)){if(n.textBaseline=a.baseline,n.textAlign=a.align,Re(y[r],n,a),o=null!==a.maxWidth?Xe(n,a):a.text.toString().split("\n"),Pe(y[r],n,a,o),N(y[r],n,a,a.width,a.height),G(y[r],n,a),v=a.x,"left"===a.align?a.respectAlign?a.x+=a.width/2:v-=a.width/2:"right"===a.align&&(a.respectAlign?a.x-=a.width/2:v+=a.width/2),a.radius)for(l=u(a.fontSize),null===a.letterSpacing&&(a.letterSpacing=l/500),s=0;s<o.length;s+=1){for(n.save(),n.translate(a.x,a.y),i=o[s],a.flipArcText&&((d=i.split("")).reverse(),i=d.join("")),h=i.length,n.rotate(-g*a.letterSpacing*(h-1)/2),f=0;f<h;f+=1)c=i[f],0!==f&&n.rotate(g*a.letterSpacing),n.save(),n.translate(0,-a.radius),a.flipArcText&&n.scale(-1,-1),n.fillText(c,0,0),"transparent"!==a.fillStyle&&(n.shadowColor="transparent"),0!==a.strokeWidth&&n.strokeText(c,0,0),n.restore();a.radius-=l,a.letterSpacing+=l/(1e3*g),n.restore()}else for(s=0;s<o.length;s+=1)i=o[s],p=a.y+s*a.height/o.length-(o.length-1)*a.height/o.length/2,n.shadowColor=a.shadowColor,n.fillText(i,v,p),"transparent"!==a.fillStyle&&(n.shadowColor="transparent"),0!==a.strokeWidth&&n.strokeText(i,v,p);p=0,"top"===a.baseline?p+=a.height/2:"bottom"===a.baseline&&(p-=a.height/2),a._event&&(n.beginPath(),n.rect(a.x-a.width/2,a.y-a.height/2+p,a.width,a.height),ce(y[r],n,a),n.closePath()),F(n,a)}return k.propCache=a,y},e.fn.measureText=function(e){var t,r,n,a=this;return(!(r=a.getLayer(e))||r&&!r._layer)&&(r=new S(e)),(t=j(a[0]))&&(Re(a[0],t,r),n=null!==r.maxWidth?Xe(t,r):r.text.split("\n"),Pe(a[0],t,r,n)),r},e.fn.drawImage=function t(r){var n,o,i,s,l,u,h,d,c,f=this,g=k.imageCache;function v(t,r,n,a,o){return function(){var i=e(t);if(function(e,t,r,n,a){null===n.width&&null===n.sWidth&&(n.width=n.sWidth=h.width),null===n.height&&null===n.sHeight&&(n.height=n.sHeight=h.height),a&&(a.width=n.width,a.height=n.height),null!==n.sWidth&&null!==n.sHeight&&null!==n.sx&&null!==n.sy?(null===n.width&&(n.width=n.sWidth),null===n.height&&(n.height=n.sHeight),n.cropFromCenter&&(n.sx+=n.sWidth/2,n.sy+=n.sHeight/2),n.sy-n.sHeight/2<0&&(n.sy=n.sHeight/2),n.sy+n.sHeight/2>h.height&&(n.sy=h.height-n.sHeight/2),n.sx-n.sWidth/2<0&&(n.sx=n.sWidth/2),n.sx+n.sWidth/2>h.width&&(n.sx=h.width-n.sWidth/2),N(0,t,n,n.width,n.height),G(e,t,n),t.drawImage(h,n.sx-n.sWidth/2,n.sy-n.sHeight/2,n.sWidth,n.sHeight,n.x-n.width/2,n.y-n.height/2,n.width,n.height)):(N(0,t,n,n.width,n.height),G(e,t,n),t.drawImage(h,n.x-n.width/2,n.y-n.height/2,n.width,n.height)),t.beginPath(),t.rect(n.x-n.width/2,n.y-n.height/2,n.width,n.height),ce(e,t,n),t.closePath(),F(t,n),I(t,r,n)}(t,r,n,a,o),a.layer?ne(i,n,o,"load"):a.load&&a.load.call(i[0],o),a.layer&&(o._masks=n.transforms.masks.slice(0),a._next)){var s=n.drawLayersComplete;delete n.drawLayersComplete,i.drawLayers({clear:!1,resetFire:!0,index:a._next,complete:s})}}}for(o=0;o<f.length;o+=1)n=f[o],(i=j(f[o]))&&(s=M(f[o]),l=new S(r),u=ae(f[o],l,r,t),l.visible&&(d=(c=l.source).getContext,c.src||d?h=c:c&&(g[c]&&g[c].complete?h=g[c]:(h=new a,c.match(/^data:/i)||(h.crossOrigin=l.crossOrigin),h.src=c,g[c]=h)),h&&(h.complete||d?v(n,i,s,l,u)():(h.onload=v(n,i,s,l,u),h.src=h.src))));return f},e.fn.createPattern=function(t){var r,n,o,i,s,l,u=this;function h(){s=r.createPattern(o,n.repeat),n.load&&n.load.call(u[0],s)}return(r=j(u[0]))?Y(l=(n=new S(t)).source)?((o=e("<canvas />")[0]).width=n.width,o.height=n.height,i=j(o),l.call(o,i),h()):(i=l.getContext,l.src||i?o=l:(o=new a,l.match(/^data:/i)||(o.crossOrigin=n.crossOrigin),o.src=l),o.complete||i?h():(o.onload=h,o.src=o.src)):s=null,s},e.fn.createGradient=function(e){var t,r,n,a,o,i,s,l,u,h,d=[];if(r=new S(e),t=j(this[0])){for(r.x1=r.x1||0,r.y1=r.y1||0,r.x2=r.x2||0,r.y2=r.y2||0,n=null!==r.r1&&null!==r.r2?t.createRadialGradient(r.x1,r.y1,r.r1,r.x2,r.y2,r.r2):t.createLinearGradient(r.x1,r.y1,r.x2,r.y2),s=1;void 0!==r["c"+s];s+=1)void 0!==r["s"+s]?d.push(r["s"+s]):d.push(null);for(a=d.length,null===d[0]&&(d[0]=0),null===d[a-1]&&(d[a-1]=1),s=0;s<a;s+=1){if(null!==d[s]){for(u=1,h=0,o=d[s],l=s+1;l<a;l+=1){if(null!==d[l]){i=d[l];break}u+=1}o>i&&(d[l]=d[s])}else null===d[s]&&(h+=1,d[s]=o+h*((i-o)/u));n.addColorStop(d[s],r["c"+(s+1)])}}else n=null;return n},e.fn.setPixels=function e(t){var r,n,a,o,i,s,l,u,h,d,c=this;for(n=0;n<c.length;n+=1)if(a=j(r=c[n]),o=M(c[n]),a&&(ae(r,i=new S(t),t,e),N(c[n],a,i,i.width,i.height),null!==i.width&&null!==i.height||(i.width=r.width,i.height=r.height,i.x=i.width/2,i.y=i.height/2),0!==i.width&&0!==i.height)){if(d=(u=(l=a.getImageData((i.x-i.width/2)*o.pixelRatio,(i.y-i.height/2)*o.pixelRatio,i.width*o.pixelRatio,i.height*o.pixelRatio)).data).length,i.each)for(h=0;h<d;h+=4)s={r:u[h],g:u[h+1],b:u[h+2],a:u[h+3]},i.each.call(r,s,i),u[h]=s.r,u[h+1]=s.g,u[h+2]=s.b,u[h+3]=s.a;a.putImageData(l,(i.x-i.width/2)*o.pixelRatio,(i.y-i.height/2)*o.pixelRatio),a.restore()}return c},e.fn.getCanvasImage=function(e,t){var r,n=null;return 0!==this.length&&(r=this[0]).toDataURL&&(void 0===t&&(t=1),n=r.toDataURL("image/"+e,t)),n},e.fn.detectPixelRatio=function(e){var r,n,a,o,i,s,l,u=this;for(n=0;n<u.length;n+=1)a=j(r=u[n]),(l=M(u[n])).scaled||(1!=(o=(t.devicePixelRatio||1)/(a.webkitBackingStorePixelRatio||a.mozBackingStorePixelRatio||a.msBackingStorePixelRatio||a.oBackingStorePixelRatio||a.backingStorePixelRatio||1))&&(i=r.width,s=r.height,r.width=i*o,r.height=s*o,r.style.width=i+"px",r.style.height=s+"px",a.scale(o,o)),l.pixelRatio=o,l.scaled=!0,e&&e.call(r,o));return u},R.clearCache=function(){var e;for(e in k)Object.prototype.hasOwnProperty.call(k,e)&&(k[e]={})},e.support.canvas=void 0!==e("<canvas />")[0].getContext,h(R,{defaults:r,setGlobalProps:G,transformShape:N,detectEvents:ce,closePath:B,setCanvasFont:Re,measureText:Pe}),e.jCanvas=R,e.jCanvasObject=S}))}}]);