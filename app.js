const iohook = require('iohook');
const spawn = require('child_process').spawn;

var noMove = false;
var freeMove = false;
var child;

console.log("\nPress º to start/pause. Moving the mouse will pause.");
console.log("Press SHIFT + 1 to start/pause. Moving the mouse will NOT pause");
console.log("Press ESC to exit.");

iohook.on('keydown', event => {
    if(event.keycode === 1){
        process.exit(0);
    }
})


iohook.registerShortcut([42, 2], keys => {
    freeMove = !freeMove
    reset('free', child);
    if(freeMove){
        child = spawn('node', ['clickLoop', 'freeMove']);
        child.on('exit', () => freeMove = false);
    } else {
        reset('no', child);
    }
});


iohook.on('keydown', event => {
    if(event.keycode === 43){
        noMove = !noMove
        reset('no', child);
        if(noMove){
            child = spawn('node', ['clickLoop', 'noMove']);
            child.on('exit', () => noMove = false);
        } else {
            reset('free', child);
        }
    }
});


function reset(move, child){
    if(child){
        child.kill();
    }

    if(move === 'free')
    {
        noMove = false;
    } else if(move === 'no'){
        freeMove = false;
    }
}

iohook.start();