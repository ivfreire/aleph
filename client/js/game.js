const Game = {
	init: function() {
		this.state = 0;
		Canvas.init();

		this.socket = io();
		this.socket.on('load', (data) => this.load(data));
		this.socket.on('game-event', (data) => this.events.server(data));

		this.FPS = 60;

		World.init();

		this.state = 1;
	},
	start: function() {
		setInterval(() => {
			this.update(1.0 / this.FPS);
			this.render(Canvas.context)
		}, 1000 / this.FPS, false);
	},
	load: function(data) {
		Player.load(data['player']);
		World.loaders.players(data['players']);
		World.loaders.map(data['map']);
		World.loaders.chunk(data['chunk']);
		this.start();
	},
	update: function(dtime) {
		if (this.state == 1) {
			Player.update(dtime);
		}
	},
	render: function(ctx) {
		Canvas.clear();
		World.render(ctx);
		Player.render(ctx);
	},
	events: {
		handler: function(ev) {
			if (Game.state == 1) {
				if (ev.type == 'keydown' || ev.type == 'keyup' || ev.type == 'mousedown') Player.handler(ev);
			}
		},
		server: function(ev) {
			if (ev.type == 'move') if (ev.player in World.players) World.players[ev.player] = ev.position;
			if (ev.type == 'join') World.join(ev);
			if (ev.type == 'left') World.left(ev);
		}
	}
}