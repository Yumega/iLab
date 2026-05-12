// ==UserScript==
// @name         FontRender
// @namespace    FontRender
// @version      26.5.13
// @description  优雅、高性能的字体渲染脚本
// @author       Font
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const macTypeWeight = 0.2;
    const styleId = 'mactype-style';

    const css = `
        html, body, p, span, a, li, td, th, input, textarea, select, h1, h2, h3, h4, h5, h6, pre {
            -webkit-text-stroke: ${macTypeWeight}px !important;
            text-stroke: ${macTypeWeight}px !important;
        }

        [class*="icon"], [class*="fa-"], [class*="iconfont"], svg, i {
            -webkit-text-stroke: 0 !important;
            text-stroke: 0 !important;
        }
    `;

    function tryInject() {
        if (!document.head) return false;
        if (document.getElementById(styleId)) return true;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);

        return true;
    }

    if (tryInject()) return;

    const observer = new MutationObserver((_, obs) => {
        if (tryInject()) obs.disconnect();
    });

    observer.observe(document.documentElement, {
        childList: true
    });

})();
