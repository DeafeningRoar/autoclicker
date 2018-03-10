const iohook = require('iohook');
const spawn = require('child_process').spawn;

var start = false;
var child;

iohook.on('keydown', event => {
    if(event.keycode === 1){
        process.exit(0);
    }
})

iohook.on('keydown', event => {
    if(event.keycode === 43){
        start = !start
        if(start){
            child = spawn('node', ['clicker.js']);
            child.on('exit', () => start = false);
        } else {
            child.kill();
            start = false;
        }
    }
});

iohook.start();