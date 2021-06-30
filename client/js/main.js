const Canvas = {
	resize: function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};

const Player = {
	dynamics: {
		position: [ 0, 0 ],
		velocity: [ 0, 0 ],
		acceleration: [ 0, 0 ],
	},
	size: [ 50, 50 ],
	speed: 300,
	load: function(data) {
		this.dynamics.position = data;
	},
	update: function(dtime) {
		this.dynamics.position[0] += this.dynamics.velocity[0] * dtime;
		this.dynamics.position[1] += this.dynamics.velocity[1] * dtime;
		Game.socket.emit('game-event', { type: 'move', position: Player.dynamics.position });
	},
	render: function(ctx) {
		ctx.fillStyle = 'black';
		ctx.fillRect(this.dynamics.position[0], this.dynamics.position[1], this.size[0], this.size[1]);
	},
	handler: function(ev) {
		if (ev.type == 'keydown') {
			if (ev.key == 'w') this.dynamics.velocity[1] = -this.speed;
			if (ev.key == 'a') this.dynamics.velocity[0] = -this.speed;
			if (ev.key == 's') this.dynamics.velocity[1] = this.speed;
			if (ev.key == 'd') this.dynamics.velocity[0] = this.speed;
		} else if (ev.type == 'keyup') {
			if (ev.key == 'w') this.dynamics.velocity[1] = 0;
			if (ev.key == 'a') this.dynamics.velocity[0] = 0;
			if (ev.key == 's') this.dynamics.velocity[1] = 0;
			if (ev.key == 'd') this.dynamics.velocity[0] = 0;
		}
	}
}

const World = {
	init: function() {
		this.players = {};
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
				if (player != Game.username)
					World.players[player] = data[player];
		}
	},
	join: function(data) {
		this.players[data.player] = data.position;
	}
}

const Game = {
	init: function() {
		this.state = 0;
		Canvas.canvas = document.getElementsByTagName('canvas')[0];
		Canvas.context = Canvas.canvas.getContext('2d');
		Canvas.resize();

		this.socket = io();
		this.socket.on('load', (data) => this.load(data));
		this.socket.on('game-event', (data) => this.events.server(data));

		this.FPS = 60;

		World.init();

		this.state = 1;
		setInterval(() => {
			this.update(1.0 / this.FPS);
			this.render(Canvas.context)
		}, 1000 / this.FPS, false);
	},
	load: function(data) {
		if ('player' in data) Player.load(data['player']);
		if ('players' in data) World.loaders.players(data['players']);
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
				if (ev.type == 'keydown' || ev.type == 'keyup') Player.handler(ev);
			}
		},
		server: function(ev) {
			if (ev.type == 'move')
				if (ev.player in World.players) World.players[ev.player] = ev.position;
			if (ev.type == 'join')
				World.join(ev);
		}
	}
}

window.onload = () => {
	Game.init();
	console.log('Game has started!');
}

window.onkeydown = Game.events.handler;
window.onkeyup = Game.events.handler;