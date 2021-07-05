const path = require('path');
const fs = require('fs');

class Map {
	constructor(name, file) {
		this.name = name;
		this.loadMap(JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf-8')));
	}

	loadMap(map) {
		this.width = map.width;
		this.height = map.height;
		this.tilewidth = map.tilewidth;
		this.tileheight = map.titleheight;

		this.chunkwidth = map.width;
		this.chunkheight = map.height;

		this.layers = map.layers;
		this.tilesets = map.tilesets;
	}

	getMap() {
		return {
			name: this.name,
			width: this.width,
			height: this.height,
			tilewidth: this.tilewidth,
			tileheight: this.tileheight,
			chunkwidth: this.chunkwidth,
			chunkheight: this.chunkheight,
			tilesets: this.tilesets
		}
	}

	getChunk(coords) {
		return this.layers;
	}
}

module.exports = Map