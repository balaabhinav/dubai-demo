import { streamTrend } from '../lib/trends';
let socketConn = null;

let socketRoomTable = [];

export const init = (socket) => {
	socketConn = socket;
	socket.on('connection', attachListeners)
}

const attachListeners = (clientSocket) => {
	console.log('client connected');
	// Logic to join rooms and add listeners
	clientSocket.on('fetch-trending', (data) => fetchTrending(data, clientSocket))
	clientSocket.on('leave-trending', (data) => leaveTrending(data, clientSocket))
}

const fetchTrending = (req, socket) => {
	// Join room based on data
	if(socketRoomTable.indexOf(req.name)!==-1){
		// If room already exists, join room
		socket.join(req.name);
	}
	else{
		// Else invoke the stream api and join the room
		// This is to prevent multiple listener instantiation for the same tweet stream filter
		socketRoomTable.push(req.name);
		streamTrend(req.name, socketConn)
		socket.join(req.name);
	}
	console.log("fetchTrending => ", req);
}

const leaveTrending = (req, socket) => {
	// Leave the room based on data
	socket.leave(req.name);
	console.log("leave trending => ", req);
}
