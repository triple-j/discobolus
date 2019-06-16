// ==UserScript==
// @name          discobolus
// @author        Jeremie Jarosh
// @namespace     http://trejeraos.com/
// @description   A third party add-on for the website dcbservice.com
// @version       0.1.3a
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

// add Class to html for easier css overrides
elmHtml.classList.add(htmlClass);

// add style to the head
elmStyle = document.createElement("link");
elmStyle.setAttribute('type', "text/css");
elmStyle.setAttribute('rel', "stylesheet");
elmStyle.setAttribute('title', htmlClass);
elmStyle.setAttribute('href', stylesDataUrl);
elmHead.appendChild(elmStyle);

// add javascript to the head
elmScript = document.createElement("script");
elmScript.setAttribute('type','text/javascript');
elmScript.setAttribute('title', htmlClass);
elmScript.setAttribute('src', scriptDataUrl);
elmHead.appendChild(elmScript);
