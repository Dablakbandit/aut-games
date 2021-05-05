const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken.js');
const images = require('../data/users');

//@desc authenticating the user & get Token
//@route Post /api/users/login
//@access Public
exports.authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	// console.log(user);

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);

		throw new Error('Invalid Email or password');
	}
});

//@desc get get all user's chips
//@route get /api/users/chips
//@access Public
exports.getAllChips = asyncHandler(async (req, res) => {
	const chips = await User.find({}).select('chips name');

	const chipsArr = chips.map((el) => {
		return { chips: el.chips, name: el.name };
	});

	chipsArr.sort((a, b) => b.chips - a.chips);
	console.log(chipsArr);

	if (chipsArr.length > 0) {
		res.json({
			chips: chipsArr,
		});
	} else {
		res.status(404);
		throw new Error('No players');
	}
});

//@desc registering a new user
//@route Post /api/users/login
//@access Public
exports.registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('Current email is already used');
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid data supplied');
	}
});

//@desc get user profile
//@route Post /api/users/profile
//@access Private
exports.getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			chips: user.chips,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc get user profile
//@route Put /api/users/profile
//@access Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

exports.getImages = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			images: images,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

exports.buyImage = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const image = req.body.image;

	if (user && image) {
		const cost = images[image];

		if (!cost) {
			res.status(400);
			throw new Error('No such image');
		}

		if (user.chips < cost) {
			res.status(400);
			throw new Error('Not enough chips');
		}

		user.chips -= cost;
		user.image = image;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			token: generateToken(updatedUser._id),
			image: image,
			message: 'Image was purchased',
		});
	} else {
		res.status(404);
		throw new Error('Bad request');
	}
});

// export { authUser, registerUser, getUserProfile, updateUserProfile };
