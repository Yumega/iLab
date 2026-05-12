// ==UserScript==
// @name         FontRender
// @namespace    FontRender
// @version      26.5.13
// @description  Render font for ios
// @author       Font
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    var macTypeWeight = 0.2;

    var macTypeCss = [
        'html, body, input, textarea, select, button, div, p, span, iframe, h1, h2, h3, h4, h5, h6, pre {' +
        '-webkit-text-stroke:' + macTypeWeight + 'px !important;' +
        'text-stroke:' + macTypeWeight + 'px !important;' +
        '}'
    ];

    var macTypeWhiteList = [];

    function injectStyle() {
        if (macTypeWhiteList.includes(location.host)) return;
        if (document.getElementById('mactype-style')) return;

        var style = document.createElement('style');
        style.id = 'mactype-style';
        style.textContent = macTypeCss.join('\n');
        (document.head || document.documentElement).appendChild(style);
    }

    injectStyle();

    new MutationObserver(function () {
        injectStyle();
    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})(); 
