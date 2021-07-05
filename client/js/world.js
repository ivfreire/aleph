const World = {
	init: function() {
		this.players = {};
		this.camera = [ 0, 0, 0, 0 ];
	},
	render: function(ctx) {
		ctx.fillStyle = 'red';
		for (player in this.players) {
			ctx.font = '16px Arial';
			ctx.fillText(player, this.players[player][0], this.players[player][1]);
			ctx.fillRect(this.players[player][0], this.players[player][1], 50, 50);
		}
	},
	loaders: {
		players: function(data) {
			for (const player in data)
				if (player != Player.username)
					World.players[player] = data[player];
		},
		map: function(map) {
			World.map = map;
			this.tilesets(map.tilesets);
		},
		chunk: function(chunk) {
			World.map.layers = chunk;
		},
		tilesets: function(tilesets) {
			tilesets.forEach(tileset => {
				
			});
		}
	},
	join: function(data) {
		this.players[data.player] = data.position;
	},
	left: function(data) {
		if (data.player in this.players) delete this.players[data.player];
	}
}