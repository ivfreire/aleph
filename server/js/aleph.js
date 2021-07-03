const Map = require('./map.js');

const Aleph = {
	players: {},
	init: function() {
		this.map = new Map('maps/test.json');
	},
	join: function(socket, username) {
		this.players[username] = [ 200, 200 ];
		socket.emit('load', { 
			player: {
				username: username,
				position: Aleph.players[username]
			},
			players: Aleph.players
		});
		socket.broadcast.emit('game-event', { type: 'join', player: username, position: this.players[username] });
	},
	left: function(socket, username) {
		if (username in this.players) delete this.players[username];
		socket.broadcast.emit('game-event', { type: 'left', player: username });
	},
	events: {
		handler: function(socket, ev, username) {
			if (ev.type == 'move') { 
				Aleph.players[username] = ev.position;
				socket.broadcast.emit('game-event', { type: 'move', player: username, position: Aleph.players[username] });
			}
		}
	}
}

module.exports = Aleph