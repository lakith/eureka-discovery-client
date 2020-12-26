const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter {
};

const eventEmitter = new MyEventEmitter();

module.exports = eventEmitter;