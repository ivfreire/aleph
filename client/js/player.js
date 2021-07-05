const Player = {
	dynamics: {
		position: [ 0, 0 ],
		velocity: [ 0, 0 ],
		acceleration: [ 0, 0 ],
	},
	size: [ 50, 50 ],
	speed: 300,
	load: function(data) {
		this.username = data.username;
		this.dynamics.position = data.position;
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