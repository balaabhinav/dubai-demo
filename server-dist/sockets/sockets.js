'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = undefined;

var _trends = require('../lib/trends');

var socketConn = null;

var socketRoomTable = [];

var init = exports.init = function init(socket) {
	socketConn = socket;
	socket.on('connection', attachListeners);
};

var attachListeners = function attachListeners(clientSocket) {
	console.log('client connected');
	// Logic to join rooms and add listeners
	clientSocket.on('fetch-trending', function (data) {
		return fetchTrending(data, clientSocket);
	});
	clientSocket.on('leave-trending', function (data) {
		return leaveTrending(data, clientSocket);
	});
};

var fetchTrending = function fetchTrending(req, socket) {
	// Join room based on data
	if (socketRoomTable.indexOf(req.name) !== -1) {
		// If room already exists, join room
		socket.join(req.name);
	} else {
		// Else invoke the stream api and join the room
		// This is to prevent multiple listener instantiation for the same tweet stream filter
		socketRoomTable.push(req.name);
		(0, _trends.streamTrend)(req.name, socketConn);
		socket.join(req.name);
	}
	console.log("fetchTrending => ", req);
};

var leaveTrending = function leaveTrending(req, socket) {
	// Leave the room based on data
	socket.leave(req.name);
	console.log("leave trending => ", req);
};