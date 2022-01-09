const iohook = require('iohook');
const { spawn, execFile } = require('child_process');

const isDevelopment = process.env.NODE_ENV === 'development';

const printMenu = ({ listeningToDelayChange, noMove, freeMove, currentDelay, previousDelay }) => {
  console.clear();
  console.log(`Current clicking delay is ${currentDelay}ms (Default=10ms). ${listeningToDelayChange ? '[*]' : ''}\n`);
  console.log(`Press º to start or pause. Moving the mouse will pause. [${noMove ? 'ON' : 'OFF'}]`);
  console.log(`Press SHIFT + 1 to start or pause. Moving the mouse will NOT pause. [${freeMove ? 'ON' : 'OFF'}]`);
  console.log(`Press SHIFT + 2 to input new clicking delay, press ENTER or SHIFT + 2 to save.`);
  console.log('Press ESC to exit.');

  if (listeningToDelayChange) {
    console.log('\nNew mouse delay:', currentDelay);
  }
};

function initialize() {
  let noMove = false;
  let freeMove = false;
  let child;
  let listeningToDelayChange = false;
  let currentDelay = 10;

  const menuWrapper = () => printMenu({ listeningToDelayChange, noMove, freeMove, currentDelay });
  menuWrapper();

  try {
    /**
     *
     * @param {'free'|'no'} move - Determines type of clicking loop. 'free' = mouse move does not stop clicking loop
     * @param {any} child - Nodejs child process
     */
    function reset(move, child) {
      if (child) {
        child.kill();
      }

      if (move === 'free') {
        noMove = false;
      } else if (move === 'no') {
        freeMove = false;
      }
    }

    function delayChangeListener() {
      currentDelay = listeningToDelayChange ? Number(currentDelay) : '';
      if (listeningToDelayChange && (!`${currentDelay}`.length || currentDelay === 0)) {
        currentDelay = 10;
      }

      listeningToDelayChange = !listeningToDelayChange;
      menuWrapper();
    }

    /**
     * Shift + 1 Key listener
     * Executes clicking loop, doesn't stop on mouse move
     */
    iohook.registerShortcut([42, 2], () => {
      freeMove = !freeMove;
      reset('free', child);
      if (freeMove) {
        child = isDevelopment
          ? spawn('node', ['clickLoop', '--freeMove', '--delay', currentDelay])
          : execFile('clickLoop', ['--freeMove', '--delay', currentDelay]);
        child.on('exit', () => {
          freeMove = false;
        });
        child.on('error', err => console.error(err));
      } else {
        reset('no', child);
      }

      menuWrapper();
    });

    iohook.on('keydown', event => {
      // Delay change key events
      if (!event.shiftKey && listeningToDelayChange) {
        // ENTER key
        if (event.keycode === 28) {
          delayChangeListener();
        }

        // BACKSPACE
        if (event.keycode === 14) {
          currentDelay = currentDelay.length === 1 ? '' : [...currentDelay].slice(0, currentDelay.length - 1).join();
          menuWrapper();
        }

        // Numbers from 0 to 9
        if (event.keycode >= 2 && event.keycode <= 11) {
          currentDelay = `${currentDelay}${event.keycode === 11 ? 0 : Number(event.keycode) - 1}`;
          menuWrapper();
        }
      }

      // ESC key
      if (event.keycode === 1) {
        if (child) {
          child.kill();
        }

        console.log('\nExiting process...');
        process.exit(0);
      }

      // º Key
      if (event.keycode === 43) {
        noMove = !noMove;
        reset('no', child);
        if (noMove) {
          child = isDevelopment
            ? spawn('node', ['clickLoop', '--noMove', '--delay', currentDelay])
            : execFile('clickLoop', ['--noMove', '--delay', currentDelay]);
          child.on('exit', () => {
            noMove = false;
            menuWrapper();
          });
          child.on('error', err => console.error('err', err));
        } else {
          reset('free', child);
        }

        menuWrapper();
      }
    });

    /**
     * Mouse delay change
     */
    iohook.registerShortcut([42, 3], delayChangeListener);

    iohook.start();
  } catch (error) {
    if (child) {
      child.kill();
    }

    console.error(error);
    process.exit(1);
  }
}

process.on('uncaughtException', function (err) {
  fs.writeFileSync('log.txt', err);
});
initialize();
