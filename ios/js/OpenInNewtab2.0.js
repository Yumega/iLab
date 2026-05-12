// ==UserScript==
// @name         在新标签页打开链接2.0
// @version      26.5.13
// @description  所有链接在新标签页打开（平衡版）
// @author       Max
// @match        https://*.scmp.com/*
// @match        https://selfh.st/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    function processLink(link) {
        if (!link || link.target === '_blank') return;

        const href = link.getAttribute('href');
        if (!href) return;

        const url = href.trim();

        if (
            url.startsWith('#') ||
            url.startsWith('javascript:') ||
            url.startsWith('mailto:') ||
            url.startsWith('tel:')
        ) return;

        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    function processAll(root = document) {
        root.querySelectorAll('a[href]').forEach(processLink);
    }

    processAll();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                if (node.tagName === 'A') {
                    processLink(node);
                } else {
                    processAll(node);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
