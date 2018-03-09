const robot  = require('robotjs');
const iohook = require('iohook');

var mouseCoords;
var start = false;

// Exit the program
iohook.on('keydown', event => {
    // Keycode 1 is ESC
    if(event.keycode === 1){
        process.exit(0);
    }
})

// Set auto click coordinates
iohook.on('keydown', event => {
    // Keycode 43 is º(Key left of 1)
    if(event.keycode === 43){
        start = !start;
        mouseCoords = robot.getMousePos();
        if(start){
            click();
        }
    }
});

// Click until current coordinate != auto click coordinates.
function click(){
    robot.setMouseDelay(4);
    while(start && JSON.stringify(mouseCoords) === JSON.stringify(robot.getMousePos())){
        robot.mouseClick('left');
    }
    start = false;
}


iohook.start();