const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const progress = require('./progress');

// Avoid sharp keeping a cached handle to the file we are about to overwrite.
sharp.cache(false);

const PNG_RE = /\.png$/i;
const JPG_RE = /\.jpe?g$/i;

const optimisePng = (pipeline) =>
    pipeline
        .png({
            palette: true,
            quality: 60,
            compressionLevel: 9,
            adaptiveFiltering: true
        })
        .toBuffer();

const optimisePngFallback = (pipeline) =>
    pipeline
        .png({
            compressionLevel: 9,
            adaptiveFiltering: true
        })
        .toBuffer();

const optimiseJpeg = (pipeline) =>
    pipeline
        .jpeg({
            quality: 40,
            progressive: true,
            trellisQuantisation: true,
            overshootDeringing: true,
            optimiseScans: true,
            optimiseCoding: true
        })
        .toBuffer();

module.exports = {
    runOptimisation: async (file) => {
        try {
            const input = await fs.readFile(file);
            const ext = path.extname(file);

            let buffer;
            if (PNG_RE.test(ext)) {
                try {
                    buffer = await optimisePng(sharp(input));
                } catch (paletteErr) {
                    // libimagequant may not be available in this libvips build.
                    // Fall back to a plain deflate-only PNG re-encode.
                    buffer = await optimisePngFallback(sharp(input));
                }
            } else if (JPG_RE.test(ext)) {
                buffer = await optimiseJpeg(sharp(input));
            } else {
                return null;
            }

            await fs.writeFile(file, buffer);
            return file;
        } catch (err) {
            progress.log('Error: ' + err);
            return null;
        }
    }
};
