const Aleph = {
	players: {},
	init: function() {
	},
	join: function(socket, username) {
		this.players[username] = [ 0, 0 ];
		socket.emit('load', { 
			player: Aleph.players[socket.request.session.username],
			players: Aleph.players
		});
		socket.broadcast.emit('game-event', { type: 'join', player: username, position: this.players[username] });
	},
	left: function(username) {
		if (username in this.players) delete this.players[username];
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