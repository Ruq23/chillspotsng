const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')
const users = require('../controllers/users')


router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login)


router.get('/logout', users.logout)




module.exports = router