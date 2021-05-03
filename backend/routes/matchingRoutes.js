const express = require('express');
const protect = require('../middleware/auth');

const router = express.Router();
const {
	getMatches,
	searchMatches,
	addLikedUser,
	addDislikedUser,
} = require('../controllers/matchingController');

router.route('/likedUsers').put(protect, addLikedUser);
router.route('/dislikedUsers').put(protect, addDislikedUser);
router.route('/').get(protect, getMatches);
router.route('/search').get(protect, searchMatches);

module.exports = router;
