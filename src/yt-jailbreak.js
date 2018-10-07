// youtube jailbroken
// by nununoisy
// upgraded to ES6

// space optimization (yay)
const q = se => document.querySelector(se);

var label = q(".header-bar-content.non-search-mode.cbox .title");
//var link = q("ytm-app#app ytm-header-bar header.header-bar.cbox a.header-bar-endpoint.cbox");
var video = q("video");

var aria = "aria-label";
var jail = "Jailbroken";

if (label.getAttribute(aria).indexOf(jail) !== -1) {
    throw new Error("Already jailbroken");
}

if (!/m.youtube.com/.test(window.location)) {
    throw new Error("Not yt");
}

function setLabelText() {
    if (label.getAttribute(aria).indexOf(jail) === -1) label.setAttribute(aria, label.getAttribute(aria) + " (Jailbroken)");
    if (label.innerHTML.indexOf(jail) === -1) label.innerHTML = label.getAttribute(aria);
}

function addMenuItems() {
    var list = q(".menu-container .menu-content");
    var videovisible = (!!video && video.getAttribute("title") != null);
    var notAlreadyAdded = !q("#jvsc");
    if (notAlreadyAdded && !!list && videovisible) {
        var toAdd = '<a href="javascript:void(0);" id="jvsc"><ytm-menu-item><button class="menu-item-button">Video Speed (Jailbreak)</button></ytm-menu-item></a>';
        list.innerHTML += toAdd;
        q("#jvsc").addEventListener("click",() => { 
            var speed = parseFloat(prompt("Speed:"));
            if (isNaN(speed)) return;
            video.playbackRate = speed;
        });
    }
}

function changeSpeedBoxSize() {
    var text = q('.jst');
    var context = document.createElement("canvas").getContext("2d");
	context.font = "22px Roboto";
	var width = Math.ceil(context.measureText(text.value).width);
    text.style.width = width + "px";
}

function addSpeedController() {
    var counter = q(".ytp-time-display");
    var videovisible = (!!video && video.getAttribute("title") != null && !!counter);
    if (!q('.jst') && videovisible) {
        var toAdd = '<span class="jx" style="display: none;">(<input class="jst" type="number" value="1" style="background-color: #fff; margin: 0px 2px; height: 3rem; padding: 10px 2px;">x)</span>';
        q('.ytp-time-separator').innerHTML += toAdd;
        var text = q('.jst');
        var xspan = q('.jx');
        ['input', 'propertychange', 'paste'].forEach(evtname => {
            text.addEventListener(evtname,() => {
                video.pause();
                changeSpeedBoxSize();
                video.playbackRate = parseFloat(text.value);
            });
        });
        const xdisp = on => xspan.style.display = (on ? "inline-block" : "none");
        text.addEventListener('focusout',() => {
            xdisp(false);
        });
        counter.addEventListener('click',() => {
            video.pause();
            changeSpeedBoxSize();
            xdisp(true);
            text.focus();
            text.select();
            text.setSelectionRange(0, text.value.length);
        });
    }
}

function changeFullscreenEvent() {
    var button = q(".ytp-fullscreen-button.ytp-button");
    if (!!button) {
        button.addEventListener("click", event => {
            event.stopPropagation();
            video.webkitEnterFullScreen();
        });
    }
}

function speedUpdate() {
    var counter = q(".ytp-time-duration");
    if (!!counter) {
        var regex = /\([0-9.]+x\) /g;
        counter.innerHTML = counter.innerHTML.replace(regex, '');
        var xspan = q('.jx');
        if (video.playbackRate == 1 || (!!xspan && xspan.style.display === "inline-block")) return;
        counter.innerHTML = '(' + video.playbackRate + 'x) ' + counter.innerHTML;
    }
}

function adDetect() {
    var adon = !!q("div.ytp-ad-text");
    if (adon) {
        video.play();
        video.currentTime = video.duration - 0.05;
        video.play();
    }
}
//        /iPhone|iPod/
//        /iPh?o(ne|d)/
//        /iPh?o/
var iOS = /iPh?o/.test(navigator.userAgent);
setInterval(() => {
    video = q("video");
    adDetect();
    if (iOS) addMenuItems();
    changeFullscreenEvent();
    addSpeedController();
    speedUpdate();
    setLabelText();
}, 100);
//link.setAttribute("aria-label", label.innerHTML);