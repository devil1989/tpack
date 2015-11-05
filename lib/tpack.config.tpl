var tpack = require("tpack");

// 设置源文件夹。
tpack.srcPath = "";

// 设置目标文件夹。
tpack.destPath = "_dest";

// 设置全局忽略的路径。
tpack.loadIgnoreFile(".gitignore");
tpack.ignore("*~", "*.psd", "*.ai", "*.log", "*.tmp", "*.db", "Desktop.ini", "tpack.*");
