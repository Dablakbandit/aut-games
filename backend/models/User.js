const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
	chips: {
		type: Number,
		default: 1000,
	},
	image: {
		type: String,
		default: '../img/dices.png',
	},
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
