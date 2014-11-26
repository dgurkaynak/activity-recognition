var io,
    self,
    ActionRecognizer = require('./ActionRecognizer');


/**
 * Socket model constuctor.
 * @constructor
 * @param {Object} opt_server
 */
var SocketModel = function(opt_server) {
    if (self)
        return self;

    self = this;
    this.io = io = require('socket.io')(opt_server);
    this.init();
};


/**
 * Initalize function.
 */
SocketModel.prototype.init = function() {
    var that = this;
    io.on('connection', function (socket) {
        console.log('A connection has arrived!');

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('recognize-action', function (data, fn) {
            fn(ActionRecognizer.runWithSkeleton(data));
        });
    });
};


module.exports = SocketModel;
