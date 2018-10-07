// youtube jailbroken
// by nununoisy

// space optimization (yay)
function q(se) {
    return document.querySelector(se);
}

var label = q("div.header-bar-content.non-search-mode.cbox h1.title");
//var link = q("ytm-app#app ytm-header-bar header.header-bar.cbox a.header-bar-endpoint.cbox");
var video = q("video");

if (label.getAttribute("aria-label").indexOf("Jailbroken") !== -1) {
    throw new Error("Already jailbroken");
}

function setLabelText() {
    if (label.getAttribute("aria-label").indexOf("Jailbroken") === -1) label.setAttribute("aria-label", label.getAttribute("aria-label") + " (Jailbroken)");
    if (label.innerHTML.indexOf("Jailbroken") === -1) label.innerHTML = label.getAttribute("aria-label");
}

function addMenuItems() {
    var list = q("div.menu-container div.menu-content");
    var videovisible = (!!video && video.getAttribute("title") != null);
    var notAlreadyAdded = !q("#ytj-vidspdctrl");
    if (notAlreadyAdded && !!list && videovisible) {
        var toAdd = '<a href="javascript:void(0);" id="ytj-vidspdctrl"><ytm-menu-item><button class="menu-item-button">Video Speed (Jailbreak)</button></ytm-menu-item></a>';
        list.innerHTML += toAdd;
        q("#ytj-vidspdctrl").addEventListener("click", function() { 
            var speed = parseFloat(prompt("Speed:"));
            if (isNaN(speed)) return;
            video.playbackRate = speed;
        });
    }
}

function changeSpeedBoxSize() {
    var text = q('.ytj-speed-text');
    var context = document.createElement("canvas").getContext("2d");
	context.font = "20.1977px Roboto";
	var width = Math.ceil(context.measureText(text.value).width) + 5;
    text.style.width = width + "px";
}

function addSpeedController() {
    var counter = q(".ytp-time-display");
    var videovisible = (!!video && video.getAttribute("title") != null && !!counter);
    if (!q('.ytj-speed-text') && videovisible) {
        var toAdd = '<span class="ytj-x" style="display: none;">(<input class="ytj-speed-text" type="number" value="1" style="background-color: white; margin: 0px 2px; height: 3rem; width: 60px; padding: 10px 2px;">x) </span>';
        q('.ytp-time-separator').innerHTML += toAdd;
        var text = q('.ytj-speed-text');
        var xspan = q('.ytj-x');
        ['input', 'propertychange', 'paste'].forEach(function (evtname) {
            text.addEventListener(evtname, function() {
                video.pause();
                changeSpeedBoxSize();
                video.playbackRate = parseFloat(text.value);
            });
        });
        text.addEventListener('focusout', function() {
            xspan.style.display = "none";
        });
        counter.addEventListener('click', function() {
            video.pause();
            changeSpeedBoxSize();
            xspan.style.display = "inline-block";
            text.focus();
            text.select();
            text.setSelectionRange(0, text.value.length);
        });
    }
}

function changeFullscreenEvent() {
    var button = q(".ytp-fullscreen-button.ytp-button");
    if (!!button) {
        button.addEventListener("click", function(event) {
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
        var xspan = q('.ytj-x');
        if (video.playbackRate == 1 || (!!xspan && xspan.style.display === "inline-block")) return;
        counter.innerHTML = '(' + video.playbackRate.toString() + 'x) ' + counter.innerHTML;
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
var iOS = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
setInterval(function() {
    video = q("video");
    adDetect();
    if (iOS) addMenuItems();
    changeFullscreenEvent();
    addSpeedController();
    speedUpdate();
    setLabelText();
}, 100);
//link.setAttribute("aria-label", label.innerHTML);