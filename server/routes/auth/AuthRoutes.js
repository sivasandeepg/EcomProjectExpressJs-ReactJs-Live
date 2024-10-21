const express = require('express');
const router = express.Router();
const GoogleAuthController = require('../../controllers/auth/GoogleAuthController');
const { verifyToken } = require('../../middlewares/authMiddleware');
 

router.get('/login', GoogleAuthController.googleLogin);
router.get('/callback', GoogleAuthController.googleCallback);
router.get('/currentuser', verifyToken, GoogleAuthController.currentUser);

// router.get('/currentuser', GoogleAuthController.currentUser); 
router.get('/logout', GoogleAuthController.logout); 

module.exports = router;