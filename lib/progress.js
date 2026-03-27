const readline = require('readline');
const _colors = require('colors');

const BAR_WIDTH = 40;

let total = 0;
let value = 0;
let active = false;

const getProgressLine = () => {
    const ratio = total === 0 ? 0 : value / total;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const completeWidth = Math.round(clampedRatio * BAR_WIDTH);
    const incompleteWidth = BAR_WIDTH - completeWidth;
    const percentage = Math.round(clampedRatio * 100);
    const bar = _colors.green('█'.repeat(completeWidth)) + '░'.repeat(incompleteWidth);

    return `Optimisation |${bar}| ${percentage}% completed | ${value}/${total} files optimised`;
};

const render = () => {
    if (!active) {
        return;
    }

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(getProgressLine());
};

module.exports = {
    start: (newTotal, start = 0) => {
        total = newTotal;
        value = start;
        active = true;
        render();
    },
    increment: () => {
        value += 1;
        render();
    },
    log: (message) => {
        if (!active) {
            console.log(message);
            return;
        }

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${message}\n`);
        render();
    },
    stop: () => {
        if (!active) {
            return;
        }

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${getProgressLine()}\n`);
        active = false;
    }
}