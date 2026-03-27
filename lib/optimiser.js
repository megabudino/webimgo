const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const path = require('path');
const progress = require('./progress');

module.exports = {
    runOptimisation: async (file) => {
        const dest = path.dirname(file);
        let optimisedFile;

        try {
            optimisedFile = await imagemin(
                [file],
                {
                    destination: dest,
                    plugins: [
                        imageminMozjpeg({quality: 40}),
                        imageminPngquant({quality: [0.4, 0.6]}, {strip: true})
                    ]
                }
            );
        }
        catch (err) {
            progress.log('Error: ' + err);
            return null;
        }

        if (optimisedFile && optimisedFile[0] && optimisedFile[0].destinationPath){
            return file;
        }
        else {
            return null;
        }
        
    }
}