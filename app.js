const iohook = require('iohook');
const exec = require('child_process').execFile;

var start = false;
var child;

console.log("\nPress º (Key left of 1) to start/pause.");
console.log("Moving the mouse will also pause.");
console.log("Press ESC to exit.");

iohook.on('keydown', event => {
    if(event.keycode === 1){
        process.exit(0);
    }
})

iohook.on('keydown', event => {
    if(event.keycode === 43){
        start = !start
        if(start){
            child = exec('clickLoop');
            child.on('exit', () => start = false);
        } else {
            child.kill();
            start = false;
        }
    }
});

iohook.start();