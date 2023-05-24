const Review = require("./models/review");
const Spot = require("./models/spot");
const ExpressError = require('./utilities/ExpressError')
const { spotSchema } = require('./schemas.js');
const { reviewSchema } = require('./schemas.js');
// const spot = require("./models/spot");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store thr URL they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateSpot = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const spot = await Spot.findById(id)
    // console.log(Inventory)
    // console.log(inventory.author)
    // console.log(req.user._id)
    if (!spot.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission')
        return res.redirect(`/list/${spot._id}`)
    }
     next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}



module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user.id)) {
        req.flash('error', 'You do not have such permission')
        return res.redirect(`list/${id}`)
    }
    next();
}

// module.exports.cart = async () => {
//     const carts = await Cart.find().populate({
//         path: "shops._id",
//         select: "name price"
//     });
//     return carts[0];
// }

// module.exports.addCart = async (req, res, next) => {
//     const newCart = await Cart.create(inventory);
//     return newCart
// }