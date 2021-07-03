const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

const sessionMiddleware = session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false
	}
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
io.use((socket, next) => sessionMiddleware(socket.request, socket.request.res || {}, next));
app.use(sessionMiddleware);
app.use('/client', express.static(path.join(__dirname, '../..', 'client')));


const Aleph = require('./aleph');


io.on('connection', (socket) => {
	Aleph.join(socket, socket.request.session.username);
	socket.on('game-event', (data) => Aleph.events.handler(socket, data, socket.request.session.username));
	socket.on('disconnect', () => Aleph.left(socket, socket.request.session.username));
});


app.get('/', (req, res) => {
	if ('username' in req.session) res.sendFile(path.join(__dirname, '../../client/game.html'));
	else res.sendFile(path.join(__dirname, '../../client/index.html'));
});

app.post('/login', (req, res) => {
	const username = req.body['username'];
	const password = req.body['password'];
	if (password != '') req.session['username'] = username;
	res.redirect('/');
});

app.get('/logout', (req, res) => {
	if ('username' in req.session) delete req.session['username'];
	res.redirect('/');
});

app.get('/whoami', (req, res) => {
	if ('username' in req.session)
		res.send({ id: req.session.id, username: req.session['username'] });
});

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}/`);
	Aleph.init();
});