// ==UserScript==
// @name         链接替换为txtdot（平衡优化版）
// @namespace    http://tampermonkey.net/
// @version      26.5.16
// @description  替换新闻站链接为代理地址（高性能平衡版）
// @match        https://*.ifeng.com/*
// @match        https://*.qq.com/*
// @match        https://*.sina.com.cn/*
// @match        https://*.sohu.com/*
// @match        https://*.toutiao.com/*
// @match        https://*.google.com/*
// @match        https://*.cnn.com/*
// @match        https://*.bbc.com/*
// @match        https://*.foxnews.com/*
// @match        https://*.zaobao.com/*
// @match        https://*.zaobao.com.sg/*
// @match        https://*.channelnewsasia.com/*
// @match        https://*.theguardian.com/*
// @match        https://*.euronews.com/*
// @match        https://*.sky.com/*
// @match        https://*.nbcnews.com/*
// @match        https://*.yahoo.com/*
// @match        https://*.nytimes.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const proxyBase = 'http://192.168.11.2:8080/get?url=';

    const supportedDomains = [
        'ifeng.com',
        'qq.com',
        'sina.com.cn',
        'sina.cn',
        'sohu.com',
        'toutiao.com',
        '163.com',
        'bbc.com',
        'cnn.com',
        'nbcnews.com',
        'nytimes.com',
        'zaobao.com',
        'zaobao.com.sg',
        'channelnewsasia.com',
        'foxnews.com',
        'theguardian.com',
        'euronews.com',
        'sky.com',
        'yahoo.com'
    ];

    const exclusionPatterns = [
        /:\/\/gentie\.ifeng\.com/,
        /:\/\/xw\.qq\.com\/m\/video/,
        /:\/\/view\.inews\.qq\.com\/k\//,
        /:\/\/www\.toutiao\.com\/video\//,
        /:\/\/www\.channelnewsasia\.com\/listen\//,
        /:\/\/[^/]*cnn\.com\/.*\/live-news\//,
        /:\/\/[^/]*cnn\.com\/.*\/video\//,
        /:\/\/[^/]*theguardian\.com\/.*\/gallery\//,
        /:\/\/[^/]*foxnews\.com\/video\//,
        /:\/\/[^/]*nbcnews\.com\/.*\/video\//,
        /:\/\/[^/]*euronews\.com\/video\//,
        /:\/\/news\.sky\.com\/video\//,
        /:\/\/www\.bbc\.com\/news\/videos\//
    ];

    function isExcluded(url) {
        return exclusionPatterns.some(p => p.test(url));
    }

    function shouldReplace(href, baseUrl) {
        if (!href) return false;

        try {
            let url;

            if (href.startsWith('/')) {
                url = new URL(href, baseUrl);
            } else if (href.startsWith('http')) {
                url = new URL(href);
            } else {
                return false;
            }

            const isSupported = supportedDomains.some(d => url.hostname.endsWith(d));
            const depth = url.pathname.split('/').filter(Boolean).length;

            return (
                url.protocol === 'https:' &&
                isSupported &&
                depth >= 2 &&
                !isExcluded(url.href)
            );
        } catch {
            return false;
        }
    }

    function processLink(link) {
        if (!link || link.dataset.txtdot === '1') return;

        const href = link.getAttribute('href');
        if (!shouldReplace(href, location.origin)) return;

        const absoluteUrl = new URL(href, location.origin).href;

        // 防止重复代理（关键优化）
        if (absoluteUrl.startsWith(proxyBase)) return;

        link.href = proxyBase + encodeURIComponent(absoluteUrl);
        link.target = '_blank';
        link.dataset.txtdot = '1';
    }

    function processRoot(root = document) {
        root.querySelectorAll('a[href]:not([data-txtdot])')
            .forEach(processLink);
    }

    // 初始扫描
    processRoot();

    // 增量监听（轻量版）
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;

                if (node.tagName === 'A') {
                    processLink(node);
                } else {
                    processRoot(node);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
