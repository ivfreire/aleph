const fs = require('fs');

function main(config) {
	const express	= require('express'),
		session		= require('express-session'),
		http		= require('http'),
		socketio	= require('socket.io'),
		path		= require('path'),
		bodyParser	= require('body-parser'),
		Aleph		= require('./aleph');

	const app		= express(),
		server		= http.Server(app),
		io			= socketio(server);
	
	app.use(session({
		secret: config.secret,
		resave: true,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 2 * 3600
		}
	}));

	app.use(bodyParser.urlencoded({ extended: true }));

	Aleph.init(config);

	io.on('connection', Aleph.events.io);

	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../../client', 'index.html'));
	});
	
	server.listen(config.port, () => console.log(`Server has started on http://localhost:${config.port}/`));
}

function loadConfigFile(path, callback) {
	fs.readFile(path, 'utf-8', function(err, data) {
		if (err) {
			console.error(`Could not load config file: ${err.path}`);
			callback(null);
		} else {
			callback(JSON.parse(data));
		}
	});
}

const configPath = './server/config.json';

loadConfigFile(configPath, function (config) {
	if (config) {
		main(config);
	} else {
		console.error('Server cannot start without any config file.');
		process.exit(1);
	}
});