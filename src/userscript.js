// ==UserScript==
// @name          discobolus
// @author        Jeremie Jarosh
// @namespace     http://trejeraos.com/
// @description   A third party add-on for the web site dcbservice.com
// @version       0.1.3-rc
// @include       http://dcbservice.com/*
// @include       http://www.dcbservice.com/*
// @include       https://dcbservice.com/*
// @include       https://www.dcbservice.com/*
// ==/UserScript==

var htmlClass = "discobolus"

var elmHead = document.head;
var elmHtml = document.body.parentElement;
var elmStyle;
var elmScript;

var stylesDataUrl = "{{data:text/css;charset=utf-8;file,../dist/main.css}}";
var scriptDataUrl = "{{data:text/javascript;charset=utf-8;file,../dist/main.js}}";

function appendToHead(elm, attr, dataUrl) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", dataUrl, true);
    oReq.responseType = "blob";

    oReq.onload = function(oEvent) {
        var blob = oReq.response;
        var objectURL = URL.createObjectURL(blob);

        elm.setAttribute(attr, objectURL);
        elmHead.appendChild(elm);
    };

    oReq.send();
}

// add Class to html for easier css overrides
elmHtml.classList.add(htmlClass);

// add style to the head
elmStyle = document.createElement("link");
elmStyle.setAttribute('type', "text/css");
elmStyle.setAttribute('rel', "stylesheet");
elmStyle.setAttribute('title', htmlClass);
//elmStyle.setAttribute('href', stylesDataUrl);
//elmHead.appendChild(elmStyle);
appendToHead(elmStyle, "href", stylesDataUrl);

// add javascript to the head
elmScript = document.createElement("script");
elmScript.setAttribute('type','text/javascript');
elmScript.setAttribute('title', htmlClass);
//elmScript.setAttribute('src', scriptDataUrl);
//elmHead.appendChild(elmScript);
appendToHead(elmScript, "src", scriptDataUrl);
