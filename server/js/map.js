const path = require('path');
const fs = require('fs');

class Map {
	constructor(file) {
		const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../maps/test.json'), 'utf-8'));
	}
}

module.exports = Map