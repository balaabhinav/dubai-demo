import express from 'express';
import http from 'http';
import twit from twit;


let app = express();
let httpServer = http.Server(app);

app.get('/', (req, res) => {
	res.send('Welcome!');
});

httpServer.listen(3333, () => {
	console.log("node server listening on port 3333");
});

