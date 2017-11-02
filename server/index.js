import express from 'express';
import http from 'http';
import io from 'socket.io';
import * as socketLib from './sockets/sockets';
import trends from './routes/trends';
import path from 'path';

let app = express();
let httpServer = http.Server(app);
let socketConn = io(httpServer);

app.use('/',express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
	res.sendFile('dist/index.html', { root : __dirname });
})

// app.get('/', (req, res) => {
// 	res.send('Welcome!');
// });
// app.use((req, res) => {
// 	console.log("called => ", req);
// })
app.use('/trends', trends)

httpServer.listen(3333, () => {
	console.log("node server listening on port 3333");
});

socketLib.init(socketConn);