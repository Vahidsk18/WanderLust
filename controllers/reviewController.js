const Listing = require('../models/listing');
const Review = require('../models/review');

async function postReview(req, res) {
    const listId = req.params.id;
    const { rating, comment } = req.body;
    let review = await Review({
        rating, comment
    })
    review.author = req.user._id;
    await review.save()
    // console.log(review);

    let updateListReview = await Listing.findById(listId);
    updateListReview.reviews.push(review)
    await updateListReview.save()

    res.redirect(`/viewlist/${listId}`)

}

async function deleteReview(req, res) {
    const listId = req.params.id;
    const reviewId = req.params.reviewid;

    await Listing.findByIdAndUpdate(listId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted Successfully")
    res.redirect(`/viewlist/${listId}`)
}

module.exports = {
    postReview,
    deleteReview,
}