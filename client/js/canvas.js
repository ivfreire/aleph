const Canvas = {
	init: function () {
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.context = Canvas.canvas.getContext('2d');
		this.resize();
	},
	resize: function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};