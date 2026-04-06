// 1. 引入你的变更配置文件
const config = require('./all_changes.js');

const fs = require('fs-extra');
const path = require('path');

// 设置需要监听的文件类型
const fileTypes = ['html', 'js', 'css'];

// 目标目录
const targetDir = path.join(__dirname, '../'); // 替换'your-directory'为你的目录名

// 输出文件
const outputFile = path.join(__dirname, '../dist/chaoxingRedo.js');

console.log(__dirname, targetDir, outputFile);

// 需要排除的文件和文件夹
const excludedItems = [/watch-and-pack/, /pack\.js$/, /dev/, /dist/, /build/, /node_modules/, /test/];



(async () => {
    try {
        const files = await fs.readdir(targetDir);
        let content = '';

        for (let file of files) {
            // 检查文件是否在排除列表中
            if (excludedItems.some(pattern => pattern.test(file))) {
                continue;
            }

            const ext = path.extname(file).slice(1);
            if (fileTypes.includes(ext)) {
                const filePath = path.join(targetDir, file);
                let data = await fs.readFile(filePath, 'utf8');
                if (ext === 'html') {
                    // 提取 <body> 标签的内容
                    const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                    if (bodyMatch && bodyMatch[1]) {
                        data = bodyMatch[1].trim();
                    } else {
                        data = '';
                    }
                    
                    content += `
                    var divElement = document.createElement("div");
                    divElement.innerHTML = \`${data}\`;
                    document.body.appendChild(divElement);
                    `;
                    // content += `document.body.innerHTML += \`${data}\`;\n`;
                } else if (ext === 'js') {
                    content += ` {\n${data}\n};\n`;
                    // content += `(function() {\n${data}\n})();\n`;
                } else if (ext === 'css') {
                    content += `var style = document.createElement('style');\n`;
                    content += `style.type = 'text/css';\n`;
                    content += `style.appendChild(document.createTextNode(\`${data}\`));\n`;
                    content += `document.head.appendChild(style);\n`;
                }
            }
        }

        // --- 1. 处理日期格式 (26/4/7) ---
        const now = new Date();
        const dateStr = `${now.getFullYear().toString().slice(-2)}/${now.getMonth() + 1}/${now.getDate()}`;

        // B. 替换使用教程中的占位符 (@data@ 和 @version@)
        // 使用 /g 全局替换，确保代码和 HTML 中所有地方都被换掉
        const processText = (content) => {
            return content
                .replace(/@data@/g, dateStr)
                .replace(/@version@/g, config.version);
        }
        content =processText(content)
        // 使用 writeFile 而不是 appendFile 确保覆盖文件
        // B. 自动替换逻辑代码中的网址
        if (config.oldUrl != config.newUrl) {
            // 使用 replaceAll 确保替换掉 main.js 中所有的旧网址
            content = content.split(config.oldUrl).join(config.newUrl);
        }
        await fs.writeFile(outputFile, content);
        console.log('Files have been packed into pack.js');
    } catch (error) {
        console.error('Error packing files:', error);
    }
})();
