const path = require('path');
const fs=require('fs');

module.exports = {
    imageFiles: Array(),
    reset: function () {
        this.imageFiles = Array();
    },
    scanDir: function (folderpath, filter, options = {}) {
        const recursive = Boolean(options.recursive);
        if (!fs.existsSync(folderpath)) {
            console.log("No Directory exist",folderpath);
            return;
        }
        var files = fs.readdirSync(folderpath);

        for(var i=0; i<files.length; i++) {
            var filename = path.join(folderpath,files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                if (recursive) {
                    this.scanDir(filename, filter, options);
                }
            }
            else if (filter.test(filename)) {
                this.imageFiles.push(filename.toString());
            }
        }
    }
}