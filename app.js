const robot  = require('robotjs');
const iohook = require('iohook');
const { click } = require('./clicker');

var mouseCoords;
var start = false;



iohook.on('keydown', event => {
    if(event.keycode === 1){
        process.exit(0);
    }
})

iohook.on('keydown', event => {
    if(event.keycode === 43){
        start = !start;
        mouseCoords = robot.getMousePos();
        if(start){
            start = click(start, mouseCoords);
        }
    }
});

iohook.start();