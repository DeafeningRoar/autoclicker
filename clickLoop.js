const robot  = require('robotjs');
const yargs = require('yargs');

robot.setMouseDelay(5);
var mouseCoords = robot.getMousePos();

const argv = yargs.command('noMove').command('freeMove').argv;

var command = argv._[0];

if(command === 'noMove'){
    while(JSON.stringify(mouseCoords) === JSON.stringify(robot.getMousePos())){
        robot.mouseClick('left');
    }
} else if(command === 'freeMove'){
    while(true){
        robot.mouseClick('left');
    }
}



process.exit(0);