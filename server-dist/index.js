'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _sockets = require('./sockets/sockets');

var socketLib = _interopRequireWildcard(_sockets);

var _trends = require('./routes/trends');

var _trends2 = _interopRequireDefault(_trends);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var httpServer = _http2.default.Server(app);
var socketConn = (0, _socket2.default)(httpServer);

app.use('/', _express2.default.static(_path2.default.join(__dirname, 'dist')));
app.get('/', function (req, res) {
	res.sendFile('dist/index.html', { root: __dirname });
});

// app.get('/', (req, res) => {
// 	res.send('Welcome!');
// });
// app.use((req, res) => {
// 	console.log("called => ", req);
// })
app.use('/trends', _trends2.default);

httpServer.listen(3333, function () {
	console.log("node server listening on port 3333");
});

socketLib.init(socketConn);