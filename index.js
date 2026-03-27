#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const os = require('os');
const path = require('path');
const readline = require('readline');

const pkgJson = require('./package.json');
const file = require('./lib/file');
const resizer = require('./lib/resizer');

const argv = require('yargs')
.usage('Usage: $0 <command> [options]')
.command('webimgo', 'Batch width resize and optimise images')
.example('$0 optimg -w 500', 'Resize images width to 500px and optimise')
.alias('w', 'width')
.nargs('w', 1)
.describe('w', 'Provide resize width in pixels')
.option('recursive', {
  alias: 'r',
  type: 'boolean',
  default: false,
  describe: 'Scan subdirectories recursively'
})
.option('force', {
  alias: 'f',
  type: 'boolean',
  default: false,
  describe: 'Allow running in high-risk directories'
})
.number('width')
.help('h')
.alias('h', 'help')
.argv

const IMAGE_FILE_FILTER = /\.(jpe?g|png)$/i;

const getHighRiskDirectories = () => {
  return ['/', '/Users', '/home', os.homedir()]
    .filter(Boolean)
    .map((dir) => path.resolve(dir));
};

const isHighRiskDirectory = (targetDir) => {
  const normalisedTarget = path.resolve(targetDir);
  return getHighRiskDirectories().includes(normalisedTarget);
};

const getRelativePath = (targetDir, filepath) => {
  const relativePath = path.relative(targetDir, filepath);
  return relativePath || path.basename(filepath);
};

const getConfirmationSummary = (targetDir, files, width, recursive) => {
  const sampleSize = Math.min(files.length, 5);
  const sampleFiles = files
    .slice(0, sampleSize)
    .map((filepath) => `- ${getRelativePath(targetDir, filepath)}`);

  return [
    `Target: ${targetDir}`,
    `Recursive: ${recursive ? 'yes' : 'no'}`,
    `Mode: ${width ? `resize to ${width}px and optimise` : 'optimise only'}`,
    `Files found: ${files.length}`,
    '',
    'Sample files:',
    ...(sampleFiles.length ? sampleFiles : ['- No files found'])
  ].join('\n');
};

const promptForConfirmation = (summary) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`${summary}\n\nProceed? [y/N] `, (answer) => {
      rl.close();
      const normalisedAnswer = answer.trim().toLowerCase();
      resolve(normalisedAnswer === 'y' || normalisedAnswer === 'yes');
    });
  });
};

clear();

console.log(
  chalk.white(
    figlet.textSync('WebIMGo', { horizontalLayout: 'full' })
  )
);

console.log('\nVersion: ' + pkgJson.version + '\n');

const run = async () => {
  const targetDir = path.resolve(process.cwd());
  const widthProvided = argv.width != null;

  if (widthProvided && (!Number.isInteger(argv.width) || argv.width <= 0)) {
    console.log(chalk.yellowBright('Width provided is not a positive integer!'));
    return;
  }

  if (isHighRiskDirectory(targetDir) && !argv.force) {
    console.log(chalk.redBright(`Refusing to run in high-risk directory: ${targetDir}`));
    console.log(chalk.yellowBright('Use --force to override this safety check.'));
    return;
  }

  try{
    file.reset();
    file.scanDir(targetDir, IMAGE_FILE_FILTER, { recursive: argv.recursive });
  }
  catch(err){
    console.log('Error: '+ err)
    return;
  }
  
  if (file.imageFiles.length !=0){
      const summary = getConfirmationSummary(targetDir, file.imageFiles, argv.width, argv.recursive);
      const confirmed = await promptForConfirmation(summary);

      if (!confirmed) {
        console.log(chalk.yellowBright('Operation cancelled.'));
        return;
      }

      if (widthProvided){
        await resizer.doResizeAndOptimise(file.imageFiles, argv.width);
      }
      else{
        await resizer.runOptimisationOnly(file.imageFiles);
      }
  }
  else {
      console.log(chalk.yellowBright('No JPG/PNG files found!'))
  }
}

run();
