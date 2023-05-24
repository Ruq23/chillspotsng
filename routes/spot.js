const express = require('express');
const catchAsync = require('../utilities/catchAsync')
const Spot = require('../models/spot');
const { validateSpot } = require('../middleware');
const { isLoggedIn } = require('../middleware');
const { isAuthor } = require('../middleware');
const router = express.Router();
const spots = require('../controllers/spot')
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })



router.route('/')
    .get(catchAsync(spots.index))
    .post(isLoggedIn, upload.array('image'), validateSpot, catchAsync(spots.newProduct))


router.get('/new', isLoggedIn, spots.newProductForm)

router.route('/:id')
    .get(catchAsync(spots.showProduct))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSpot, catchAsync(spots.editProduct))
    .delete(isLoggedIn, isAuthor, catchAsync(spots.destroy))


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(spots.editProductForm))



module.exports = router;