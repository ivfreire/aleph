module.exports = {
	init: function(config) {

	},
	events: {
		io: function(socket) {
			socket.on('disconnect', () => console.log('disconnected'));
			console.log(`new user connected: ${socket.id}`);
		}
	}
}