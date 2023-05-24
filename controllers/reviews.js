const Review = require('../models/review');
const Spot = require('../models/spot');



module.exports.newReview =  async(req, res) => {
    const spot = await Spot.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    spot.reviews.push(review)
    await review.save()
    await spot.save()
    req.flash('success', 'Created a new review for this product')
    res.redirect(`/list/${spot._id}`)
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Spot.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted Successfully!')
    res.redirect(`/list/${id}`)

}