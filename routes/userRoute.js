const express = require('express');
const router = express.Router();

const { wrapAsync } = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user')
const passport = require('passport')
const { saveRedirectUrl } = require('../middlewares/auth')
const { createUser, post_createUser, loginUser, post_loginUser, logoutUser, } = require('../controllers/userController')

//create user (signup)
router.get('/signup', createUser)
router.post('/signup/user', wrapAsync(post_createUser))


// login user (signin)
router.get('/login', loginUser)

router.post('/login/user', saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    post_loginUser
)

//logout user
router.get('/logout', logoutUser)

module.exports = router;