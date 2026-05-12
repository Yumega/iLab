// ==UserScript==
// @name         在新标签页打开链接2.0
// @version      26.5.13
// @description  all links open in a new tab
// @author       Max
// @match        https://*.scmp.com/*
// @match        https://www.gdqy.gov.cn/*
// @match        https://search.gd.gov.cn/*  
// @match        https://selfh.st/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Yumega/iLab/refs/heads/master/ios/js/OpenInNewtab2.0.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyLinks() {
        const allLinks = document.querySelectorAll('a[href]');
        allLinks.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // Modify links on initial load
    modifyLinks();

    // Also observe dynamically added content (infinite scroll, etc.)
    const observer = new MutationObserver(modifyLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
