const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const matchUser = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: 'None',
	},
	role: {
		type: String,
		default: 'Unknown',
	},
	description: {
		type: String,
		default: '',
	},
	age: {
		type: Number,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
});

const User = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		default: 'img/users/1.jpg',
		// required: true,
	},
	role: {
		type: String,
		default: 'Unknown',
	},
	description: {
		type: String,
		default: '',
	},

	likedUsers: [matchUser],
	dislikedUsers: [matchUser],
	likedByUsers: [matchUser],
	matchedUsers: [matchUser],
});

//USER AUTHENTICATION METHOD
User.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

//HASHING PASSWORD BEFORE SAVING USER DETAILS
User.pre('save', async function (next) {
	//if password is the same go next
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', User);
