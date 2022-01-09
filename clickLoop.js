const robot = require('robotjs');
const yargs = require('yargs');

const argv = yargs.command('noMove').command('freeMove').command('delay').argv;

const { noMove, freeMove, delay } = argv;
const initialPosition = robot.getMousePos();

robot.setMouseDelay(delay); // Delay in milliseconds

if (noMove && !freeMove) {
  let currentPosition = robot.getMousePos();
  while (initialPosition.x === currentPosition.x && initialPosition.y === currentPosition.y) {
    robot.mouseClick('left');
    currentPosition = robot.getMousePos();
  }
}

if (freeMove && !noMove) {
  while (true) {
    robot.mouseClick('left');
  }
}

process.exit(0);
