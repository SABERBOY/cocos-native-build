/**
 * @author Quixn
 * @description
 * 快速导出压缩包 需要安装依赖 npm install archiver -D
 * 这个库的文档地址 https://github.com/archiverjs/node-archiver
 * 可以在 package.json 中配置 script 命令 npm run build 之后直接 进行 导出 zip 压缩包
 * @example  将需要导出的目录添加到target数组中 命令行执行 node export-zip.js 即可
 * @version 20220622
 */
const fs = require('fs');
const archiver = require('archiver');

const homedir = __dirname;// 这里是当前目录路径

// const timeString = new Date().toLocaleDateString().replace(/\//g, '-'); // 日期充当hash值防止覆盖之前的压缩包

const jsbLinkPath = "build/jsb-link/"

// 配置要打包的路径列表,需要打包某些目录，添加到数组里面即可 相对路径
const target = [`${jsbLinkPath}/assets`, `${jsbLinkPath}/jsb-adapter`, `${jsbLinkPath}/src`, `${jsbLinkPath}/main.js`, `${jsbLinkPath}/project.json`]

const file = `/build/${(new Date().toLocaleString()).replaceAll('/', '-')}.zip`
// 默认在当前目录路径生成此文件 dist.zip
const output = fs.createWriteStream(homedir + file);
const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
});

archive.on('error', (err) => {
    throw err;
});

output.on('close', () => {
    console.log(`
     --------- ---------压缩完毕--------- ---------
     生成文件大小${(archive.pointer() / 1024 / 1024).toFixed(1)}MB
     系统路径为 ${homedir + file}
     ---------如需配置生成路径或文件名,请配置output---------
     `);
});

archive.pipe(output);
for (let i of target) {
    if (fs.lstatSync(i).isDirectory()) {
        archive.directory(i, i.replace(jsbLinkPath, ""))
    } else {
        archive.file(i, { name: i.replace(jsbLinkPath, "") })
    }
}
archive.finalize();