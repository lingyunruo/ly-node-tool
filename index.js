const fs = require('fs');
const path = require('path');
const { join } = require('path');
const { spawnSync, execSync } = require('child_process');
const which = require('which');

// 判断是否对一个路径有读写权限
function fsExistSync(path) {
	try {
		fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
	}
	catch(e) {
		return false;
	}

	return true;
}

// 删除一个目录
function rmDirSync(dir) {
	try {
		let dirList = fs.readdirSync(dir);

		if (dirList.length === 0) {
			fs.rmdirSync(dir);
		} else {
			dirList.map(filedir => {

				let stats = fs.statSync(join(dir, filedir));

				if (stats.isFile()) {
					fs.unlinkSync(join(dir, filedir));
				} else if (stats.isDirectory()) {
					rmDir(join(dir, filedir));
				}
			});

			fs.rmdirSync(dir);
		}
	}
	catch(e) {
		console.error(e.message);
	}
}

// 复制一个文件
function copyFileSync(src, dst) {
	try {
		let resdStream = fs.createReadStream(src);
		let writeStream = fs.createWriteStream(dst);

		resdStream.pipe(writeStream);
	} catch (e) {
		console.log('copy Error', e);
	}
}

// 复制一个目录
function copyDirSync(src, dst, ignoreList) {
	if(ignoreList === undefined) {
		ignoreList = [];
	}

	try {
		let demoFiles = fs.readdirSync(src);

		demoFiles.map(file => {
			if (ignoreList.indexOf(file) < 0) {
				let fileDir = join(src, file);
				let tarDir = join(dst, file);
				let stat = fs.statSync(fileDir);

				if (stat.isFile()) {
					copyFile(fileDir, tarDir);
				} else if (stat.isDirectory()) {
					fs.mkdirSync(tarDir);
					copyDirSync(fileDir, tarDir);
				}
			}
		});
		return true;
	} catch (e) {
		console.error(e.message);
		// rmDir(dst);
		return false;
	}
}

module.exports = {
	fsExistSync: fsExistSync,
	rmDirSync: rmDirSync,
	copyFileSync: copyFileSync,
	copyDirSync: copyDirSync
};