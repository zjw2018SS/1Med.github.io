const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');
const { debounce } = require('lodash');

// 设置需要监听的文件类型
const fileTypes = ['html', 'js', 'css'];

// 目标目录
const targetDir = path.join(__dirname, './'); // 替换'your-directory'为你的目录名

// 输出文件
const outputFile = path.join(targetDir, 'pack.js');

// 需要排除的文件和文件夹
const excludedItems = [/watch-and-pack/, /pack\.js$/];

// 防抖函数，延迟300毫秒执行
const debouncedPackFiles = debounce(async () => {
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
                    content += `document.body.innerHTML += \`${data}\`;\n`;
                } else if (ext === 'js') {
                    content += `(function() {\n${data}\n})();\n`;
                } else if (ext === 'css') {
                    content += `var style = document.createElement('style');\n`;
                    content += `style.type = 'text/css';\n`;
                    content += `style.appendChild(document.createTextNode(\`${data}\`));\n`;
                    content += `document.head.appendChild(style);\n`;
                }
            }
        }

        // 使用 writeFile 而不是 appendFile 确保覆盖文件
        await fs.writeFile(outputFile, content);
        console.log('Files have been packed into pack.js');
    } catch (error) {
        console.error('Error packing files:', error);
    }
}, 300);

// 初始化监听器，并排除指定文件或目录
const watcher = chokidar.watch(targetDir, {
    ignored: excludedItems, // 排除指定的文件或目录
    persistent: true
});

// 添加事件监听器
watcher
    .on('add', debouncedPackFiles)
    .on('change', debouncedPackFiles)
    .on('unlink', debouncedPackFiles);

console.log(`Watching for changes in ${targetDir}`);
