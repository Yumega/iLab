// ==UserScript==
// @name         在新标签页打开链接2.0
// @version      26.5.14
// @description  所有链接在新标签页打开，支持动态加载内容，性能优化
// @author       Max & Gemini
// @match        https://*.scmp.com/*
// @match        https://www.gdqy.gov.cn/*
// @match        https://search.gd.gov.cn/*
// @match        https://selfh.st/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/Yumega/iLab/refs/heads/master/ios/js/OpenInNewtab2.0.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 修改链接的核心函数
     * 使用 :not([target="_blank"]) 过滤掉已经处理过的链接，极大提升性能
     */
    function modifyLinks() {
        const allLinks = document.querySelectorAll('a[href]:not([target="_blank"])');
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href').trim();
            
            // 过滤掉：锚点链接 (#)、JavaScript 脚本链接、以及邮件/电话链接
            if (href && 
                !href.startsWith('#') && 
                !href.startsWith('javascript:') && 
                !href.startsWith('mailto:') && 
                !href.startsWith('tel:')) {
                
                link.setAttribute('target', '_blank');
                // 处于安全考虑，添加 rel 属性
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // --- 执行逻辑 ---

    // 1. 立即尝试运行一次（处理静态 HTML）
    modifyLinks();

    // 2. 使用 MutationObserver 监听后续动态加载的内容
    // 使用 document.documentElement (html) 确保脚本在 body 生成前就能开始监听
    const observer = new MutationObserver((mutations) => {
        // 只有当有新节点加入时才触发处理函数
        modifyLinks();
    });

    // 开始观察
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 3. 针对某些 SPA (单页应用) 路由切换后的补偿处理
    window.addEventListener('load', modifyLinks);

})();
