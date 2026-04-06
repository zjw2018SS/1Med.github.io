require("./build_pack.js")
// 1. 引入你的变更配置文件
const config = require('./all_changes.js');

const fs = require('fs');
const path = require('path');





// 1. 配置：定义你要拼接的文件路径
const filesToMerge = {
    header: '../油猴脚本头部模板.txt',      // 存放油猴那堆 // ==UserScript== 的东西
    // style: '../index.css',        // 你的 CSS
    // template: '../index.html',    // 你的 HTML
    // 为了让生成的脚本更健壮，我们需要处理一个隐藏的坑：如果你的 HTML 或 CSS 中包含了 ${ }（模板字符串占位符），Node.js 在生成 finalContent 时会报错或产生意外结果。
    // 核心改进：不仅转义反引号 `，还要转义 ${} 以防 Node 误解析
/*     const safeCss = css.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const safeHtml = html.replace(/`/g, '\\`').replace(/\$/g, '\\$'); */
    logic: '../dist/chaoxingRedo.js'           // 你的主要 JS 逻辑
};





const outputPath = path.join(__dirname, '../dist/release.js'); // 输出文件
// console.log("发布版", __dirname, filesToMerge.header, path.join(__dirname, filesToMerge.header),outputPath);




try {
    // 2. 读取各个文件的内容
    let header = fs.readFileSync(path.join(__dirname, filesToMerge.header), 'utf8');
/*     const css = fs.readFileSync(path.join(__dirname, filesToMerge.style), 'utf8');
    const html = fs.readFileSync(path.join(__dirname, filesToMerge.template), 'utf8'); */
    let logic = fs.readFileSync(path.join(__dirname, filesToMerge.logic), 'utf8');




    // --- 核心逻辑：自动化替换 ---

    // A. 自动更新版本号 (利用正则匹配 // @version 后面的内容)
    // 匹配 // @version 后面跟着的任何字符直到行尾
    header = header.replace(/\/\/ @version\s+.*/, `// @version      ${config.version}`);


    // 3. 核心逻辑：将 CSS 和 HTML 包装成 JS 字符串，方便在脚本中调用
    // 使用反引号 (Template Literals) 包装，并简单处理内部的反引号转义
    const finalContent = `
${header}

(function() {
    'use strict';

    // 你的业务代码开始
${logic}

})();
    `.trim();
/*      const finalContent = `
${header}

(function() {
    'use strict';

    // 自动注入的样式
    const CSS_CONTENT = \`${css.replace(/`/g, '\\`')}\`;
    const HTML_CONTENT = \`${html.replace(/`/g, '\\`')}\`;

    // 将 CSS 注入页面
    const styleTag = document.createElement('style');
    styleTag.innerHTML = CSS_CONTENT;
    document.head.appendChild(styleTag);

    // 你的业务代码开始
${logic}

})();
    `.trim();
 */
    // 4. 写入输出文件
    fs.writeFileSync(outputPath, finalContent, 'utf8');
    console.log('✅ 拼接成功！文件已生成至:', outputPath);

} catch (err) {
    console.error('❌ 拼接失败:', err.message);
}