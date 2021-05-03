const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const player = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	score: {
		type: Number,
		default: 0,
	},
});

const Game = mongoose.Schema({
	gameName: {
		type: String,
		required: true,
	},
	scores: [player],
});

module.exports = mongoose.model('Game', Game);
