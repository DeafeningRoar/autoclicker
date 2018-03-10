const robot  = require('robotjs');

robot.setMouseDelay(5);
var mouseCoords = robot.getMousePos();

while(JSON.stringify(mouseCoords) === JSON.stringify(robot.getMousePos())){
    robot.mouseClick('left');
}

process.exit(0);