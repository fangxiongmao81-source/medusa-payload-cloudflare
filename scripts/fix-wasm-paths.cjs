const fs = require('fs');
const path = require('path');

// 锁定 OpenNext 生成的服务函数文件
const handlerPath = path.join(process.cwd(), '.open-next', 'server-functions', 'default', 'handler.mjs');

if (fs.existsSync(handlerPath)) {
    let content = fs.readFileSync(handlerPath, 'utf8');

    // 核心手术：
    // 寻找所有以 "/opt/buildhome/repo" 开头的绝对路径导入
    // 将其更正为相对于 handler.mjs 的正确位置
    const regex = /from\s*["']\/opt\/buildhome\/repo\/\.open-next\/server-functions\/default\/(.*?)["']/g;
    const fixedContent = content.replace(regex, (match, p1) => {
        console.log(`🔧 Correcting path: ${match} -> from "./${p1}"`);
        return `from "./${p1}"`;
    });

    if (content !== fixedContent) {
        fs.writeFileSync(handlerPath, fixedContent);
        console.log('✅ [Success] Successfully corrected absolute paths in handler.mjs');
    } else {
        console.log('ℹ️ [Info] No problematic absolute paths found, file is clean.');
    }
} else {
    console.log('⚠️ [Warning] handler.mjs not found at standard path. Skipping correction.');
}
