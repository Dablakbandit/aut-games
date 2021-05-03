const express = require('express');
const {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
} = require('../controllers/userController.js');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/login', authUser);
router.route('/').post(registerUser);

router.route('/profile').put(protect, updateUserProfile);

router.route('/profile/:id').get(protect, getUserProfile);

module.exports = router;
