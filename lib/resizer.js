const sharp = require('sharp');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const fsp = fs.promises;
const sizeOf = require('image-size');

const optimiser = require('./optimiser');
const progress = require('./progress');


module.exports = {
    doResizeAndOptimise: async (files, width) => {
        progress.start(files.length, 0);

        const format = (num, decimals) => num.toLocaleString('en-US', {
            minimumFractionDigits: 0,      
            maximumFractionDigits: 2,
         });

        sharp.cache(false)

        for (const file of files){
            const fileDimension = sizeOf(file)
            if (fileDimension.width > width) {
                try {
                    var pfileStats = fs.statSync(file)
                    var relPath = file.split(path.basename(process.cwd())).pop()
                    const buffer = await sharp(file)
                    .resize({ width: width })
                    .toBuffer()

                    await fsp.writeFile(file, buffer)

                    const optimisedFile = await optimiser.runOptimisation(file)
                    if (optimisedFile) {
                        var fileStats = fs.statSync(optimisedFile)
                        var percent = format(100 - (fileStats['size'] * 100/pfileStats['size']))
                        progress.log(chalk.green('Resized & Optimised: ') + chalk.blueBright(path.basename(process.cwd()) + relPath) + chalk.green(' -----> Savings of ' + percent + '%'))
                        progress.increment();
                    }
                }
                catch (err) {
                    progress.log('Error: ' + err);
                }
            }
            else {
                var pfileStats = fs.statSync(file)
                var relPath = file.split(path.basename(process.cwd())).pop()
                const optimisedFile = await optimiser.runOptimisation(file)
                if (optimisedFile) {
                    var fileStats = fs.statSync(optimisedFile)
                    var percent = format(100 - (fileStats['size'] * 100/pfileStats['size']))
                    progress.log(chalk.green('Image optimised (Width less than specified): ') + chalk.blueBright(path.basename(process.cwd()) + relPath) + chalk.green(' -----> Savings of ' + percent + '%'))
                    progress.increment();
                }

            }
            
        }
        progress.stop();
        
    },
    runOptimisationOnly: async (files) => {
        progress.start(files.length, 0)

        const format = (num, decimals) => num.toLocaleString('en-US', {
            minimumFractionDigits: 0,      
            maximumFractionDigits: 2,
         });

        for (const file of files){
            var pfileStats = fs.statSync(file)
            var relPath = file.split(path.basename(process.cwd())).pop()
            const optimisedFile = await optimiser.runOptimisation(file)
            if (optimisedFile) {
                
                var fileStats = fs.statSync(optimisedFile)
                var percent = format(100 - (fileStats['size'] * 100/pfileStats['size']))
                progress.log(chalk.green('Image optimised: ') + chalk.blueBright(path.basename(process.cwd()) + relPath) + chalk.green(' -----> Savings of ' + percent + '%'))

                progress.increment();
            }
            
        }
        progress.stop();
        console.log(chalk.green('All optimisations done.'))
    }
}