// ==UserScript==
// @name         Hook Debugger Bypass Simple
// @namespace    42
// @version      0.1
// @author       vx:KeeCTh
// @description  Simple and stable debugger bypass
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('[Debugger Bypass] Simple version loaded');
    
    // 保存原始函数
    const originalFunction = window.Function;
    const originalEval = window.eval;
    
    // Hook Function 构造函数
    window.Function = function(...args) {
        if (args.length > 0) {
            const code = args[args.length - 1];
            if (typeof code === 'string' && /debugger\s*[;\n\r]?/i.test(code)) {
                console.log('[Debugger Bypass] Blocked Function with debugger');
                // 替换 debugger 语句
                args[args.length - 1] = code.replace(/debugger\s*[;\n\r]?/gi, '/* debugger removed */;');
            }
        }
        return originalFunction.apply(this, args);
    };
    
    // 复制原始Function的属性
    Object.setPrototypeOf(window.Function, originalFunction);
    Object.defineProperty(window.Function, 'prototype', {
        value: originalFunction.prototype,
        writable: false
    });
    
    // Hook eval 函数
    window.eval = function(code) {
        if (typeof code === 'string' && /debugger\s*[;\n\r]?/i.test(code)) {
            console.log('[Debugger Bypass] Blocked eval with debugger');
            code = code.replace(/debugger\s*[;\n\r]?/gi, '/* debugger removed */;');
        }
        return originalEval.call(this, code);
    };
    
    // 拦截动态添加的script标签
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                    if (node.textContent && /debugger\s*[;\n\r]?/i.test(node.textContent)) {
                        console.log('[Debugger Bypass] Cleaning script tag with debugger');
                        node.textContent = node.textContent.replace(/debugger\s*[;\n\r]?/gi, '/* debugger removed */;');
                    }
                }
            });
        });
    });
    
    // 等待DOM准备好再开始观察
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
    } else {
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
    
    // 重写 debugger 关键字（尝试性的）
    try {
        // 在全局作用域中定义一个 debugger 函数
        window.debugger = function() {
            console.log('[Debugger Bypass] debugger statement bypassed');
        };
    } catch (e) {
        // 如果失败就忽略
    }
    
    // Hook常见的定时器函数（简化版本）
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    
    window.setTimeout = function(func, delay, ...args) {
        if (typeof func === 'string' && /debugger\s*[;\n\r]?/i.test(func)) {
            console.log('[Debugger Bypass] Blocked setTimeout with debugger');
            func = func.replace(/debugger\s*[;\n\r]?/gi, '/* debugger removed */;');
        }
        return originalSetTimeout.call(this, func, delay, ...args);
    };
    
    window.setInterval = function(func, delay, ...args) {
        if (typeof func === 'string' && /debugger\s*[;\n\r]?/i.test(func)) {
            console.log('[Debugger Bypass] Blocked setInterval with debugger');
            func = func.replace(/debugger\s*[;\n\r]?/gi, '/* debugger removed */;');
        }
        return originalSetInterval.call(this, func, delay, ...args);
    };
    
    console.log('[Debugger Bypass] Simple hooks installed successfully');
    
})();