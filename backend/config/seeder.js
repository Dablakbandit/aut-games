const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('../data/users');
const User = require('../models/User');
const connectDB = require('./db.js');

dotenv.config();

connectDB();

const importData = async () => {
	try {
		await User.deleteMany();

		await User.insertMany(users);

		console.log('Data Imported');
		process.exit();
	} catch (err) {
		console.log(`${err}`);
		process.exit(1);
	}
};
const destroyData = async () => {
	try {
		await User.deleteMany();

		console.log('Data destroyed');
		process.exit();
	} catch (err) {
		console.log(`${error}`);
		process.exit(1);
	}
};

if (process.argv[2] === '-d') {
	destroyData();
} else {
	importData();
}
