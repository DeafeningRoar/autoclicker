const robot  = require('robotjs');

robot.setMouseDelay(5);
const click = function(start, mouseCoords){
    while(start){
        if(JSON.stringify(mouseCoords) != JSON.stringify(robot.getMousePos())){
            break;
        }
        robot.mouseClick('left');
    }
    return false;
}

module.exports = { click };