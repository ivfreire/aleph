window.onload = () => {
	Game.init();
	console.log('Game has started!');
}

window.onkeydown = Game.events.handler;
window.onkeyup = Game.events.handler;
window.onmousedown = Game.events.handler;

window.onresize = () => Canvas.resize();