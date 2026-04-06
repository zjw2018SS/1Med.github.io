const chokidar = require('chokidar');
// const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const { debounce } = require('lodash');

// 设置需要监听的文件类型
const fileTypes = ['html', 'js', 'css'];

// 目标目录
const targetDir = path.join(__dirname, '../'); // 替换'your-directory'为你的目录名

// 开发目录
const devDir = path.join(__dirname, './');

// 输出文件
const outputFile = path.join(__dirname, '../dist/chaoxingRedo.js');

console.log(__dirname, targetDir, outputFile);
// 需要排除的文件和文件夹
const excludedItems = [/watch-and-pack/, /pack\.js$/, /dev/, /dist/, /build/, /node_modules/, /test/];

// 防抖函数，延迟700毫秒执行
const debouncedPackFiles = debounce(async () => {
    try {


        const files = await fs.readdir(targetDir);
        let content = '';

        //脚本运行时环境检测
        // 只在最外层运行
        content += `
        if (window.top === window.self) {
            console.log("当前页面在最顶层");
            // 在这里添加你的代码逻辑
        } else {
            console.log("当前页面不是最顶层");
            return;
        }
        `;




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

                    // Todo:html时间替换

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


        let devContent = '';
        const devFiles = await fs.readdir(devDir);
        for (let file of devFiles) {
            if (file.startsWith('dev')) {
                const filePath = path.join(devDir, file);
                let data = await fs.readFile(filePath, 'utf8');
                devContent += data + '\n';
            }
        }

        // 将开发目录的内容添加到最终内容前面
        content = content + devContent;


        // 使用 writeFile 而不是 appendFile 确保覆盖文件
        await fs.writeFile(outputFile, content);
        console.log('Files have been packed into pack.js');
    } catch (error) {
        console.error('Error packing files:', error);
    }
}, 700);

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


// 创建HTTP服务器，端口为3450，将打包后的js文件暴露在上面
/* const server = http.createServer((req, res) => {
    if (req.url === '/chaoxingRedo.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        fs.createReadStream(outputFile).pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3450, () => {
    console.log('HTTP server is running on port 3450');
}); */