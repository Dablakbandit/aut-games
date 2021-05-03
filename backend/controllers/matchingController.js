const User = require('../models/User');
const asyncHandler = require('express-async-handler');

//@desc get user matches
//@route get /api/matching/
//@access Private
exports.getMatches = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			matchedUsers: user.matchedUsers,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc get user matches
//@route get /api/matching/
//@access Private
exports.searchMatches = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	const allUsers = await User.find({}).select('id');
	const allUsersId = allUsers.map((el) => el._id);

	const likedUsers = user.likedUsers.map((el) => el.user);
	const dislikedUsers = user.dislikedUsers.map((el) => el.user);

	const removeUsers = [...likedUsers, ...dislikedUsers];

	removeUsers.push(user._id);

	//returning all the users that have not been matched yet
	const unmatchedUserId = allUsersId.filter(
		(el) => !removeUsers.find((x) => x.toString() === el.toString())
	);

	const unmatchedUsers = await User.find({
		_id: { $in: unmatchedUserId },
	});

	if (user) {
		res.json({
			_id: req.user._id,
			name: user.name,
			unmatchedUsers: unmatchedUsers,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

exports.addLikedUser = asyncHandler(async (req, res) => {
	const { id } = req.body;

	const user = await User.findById(req.user._id).select(
		'id name age image description role likedUsers likedByUsers matchedUsers'
	);
	const likedUser = await User.findById(id).select(
		'id name age image description role likedUsers likedByUsers matchedUsers'
	);

	if (likedUser) {
		const alreadyLiked = user.likedUsers.find(
			(el) => el.user.toString() === likedUser._id.toString()
		);

		if (alreadyLiked) {
			res.status(400);
			throw new Error('User was already liked');
		}

		if (likedUser._id.toString() === user._id.toString()) {
			res.status(404);
			throw new Error('Cant like yourself');
		}

		const likedUserObj = {
			name: likedUser.name,
			age: likedUser.age,
			user: likedUser._id,
			image: likedUser.image,
			role: likedUser.role,
			description: likedUser.description,
		};

		const userObj = {
			name: user.name,
			age: user.age,
			user: user._id,
			image: user.image,
			role: user.role,
			description: user.description,
		};

		user.likedUsers.push(likedUserObj);
		likedUser.likedByUsers.push(userObj);

		let match = false;
		//check if users already matched
		if (likedUser.likedUsers.find((el) => el.user.toString() === user._id.toString())) {
			console.log('match');

			user.matchedUsers.push(likedUserObj);
			likedUser.matchedUsers.push(userObj);

			match = true;
		}

		await likedUser.save();
		await user.save();

		console.log(match);
		res.status(201).json({
			message: 'User was liked',
			match: match,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

exports.addDislikedUser = asyncHandler(async (req, res) => {
	const { id } = req.body;

	const user = await User.findById(req.user._id).select(
		'id name age image description role dislikedUsers'
	);
	const dislikedUser = await User.findById(id).select('id name age image description role');

	if (dislikedUser) {
		const alreadyDisliked = user.dislikedUsers.find(
			(el) => el.user.toString() === dislikedUser._id.toString()
		);

		if (alreadyDisliked) {
			res.status(400);
			throw new Error('User was already disliked');
		}

		if (dislikedUser._id.toString() === user._id.toString()) {
			res.status(404);
			throw new Error('Cant dislike yourself');
		}

		const dislikedUserObj = {
			name: dislikedUser.name,
			age: dislikedUser.age,
			user: dislikedUser._id,
			image: dislikedUser.image,
			role: dislikedUser.role,
			description: dislikedUser.description,
		};

		user.dislikedUsers.push(dislikedUserObj);

		await user.save();

		res.status(201).json({
			message: 'User was disliked',
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});
