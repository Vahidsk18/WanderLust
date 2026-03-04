const Listing = require('../models/listing');
const Review = require('../models/review');

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Be Login!")
        return res.redirect('/login')
    }
    return next();
}

function saveRedirectUrl(req, res, next) {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;   // ← clean up so it doesn't persist
    }
    next();
}

async function isOwnerForListing(req, res, next) {
    const { id } = req.params;
    let listid = await Listing.findById(id)
    // console.log(listid.owner)
    // console.log(req.user._id)

    if (!listid.owner.equals(req.user._id)) {
        req.flash("error", "You Don't Have Access!")
        return res.redirect('/listings')
    }
    next()
}


async function isReviewAuthor(req, res, next) {
    const { reviewid } = req.params;

    const review = await Review.findById(reviewid);

    if (!review) {
        req.flash("error", "Review Not Found!");
        return res.redirect(`/listings/${reviewid}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You Don't Have Permission To Delete This Review!");
        return res.redirect(`/listings/${reviewid}`);
    }

    next();
}


module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwnerForListing,
    isReviewAuthor,
}