const EventEmitter = require('events');
const fs = require('fs');

// event
const logger = new EventEmitter();

// create event listener
logger.on('logged', (e) => {
    // write to the text file
    fs.appendFile('middleware/logger.txt', `\nLogged on: ${e}`, (err) => {
        if (err) throw err;
    });
    console.log(`Logged: ${e}`);
});

// emit the event
logger.emit('logged', getLogDate());

// getLogDate() function gets the current date
function getLogDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    var today = `${month}/${day}/${year} ${hour}:${minutes}:${seconds}:${milliseconds}`;
    return today;
}

module.exports = logger;