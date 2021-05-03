const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken.js');

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

//@desc registering a new user
//@route Post /api/users/login
//@access Public
exports.registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, age } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('Current email is already used');
	}

	const user = await User.create({
		name,
		email,
		password,
		age,
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
			age: user.age,
			role: user.role,
			description: user.description,
			image: user.image,
			likedUsers: user.likedUsers,
			dislikedUsers: user.dislikedUsers,
			likedByUsers: user.likedByUsers,
			matchedUsers: user.matchedUsers,
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
		user.role = req.body.role || user.role;
		user.description = req.body.description || user.description;
		user.age = req.body.age || user.age;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			role: user.role,
			description: user.description,
			age: user.age,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// export { authUser, registerUser, getUserProfile, updateUserProfile };
