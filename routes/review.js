const express = require('express');
const router = express.Router();

const { wrapAsync } = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../joiSchema');
const { isLoggedIn, isReviewAuthor } = require('../middlewares/auth')

const { postReview, deleteReview } = require('../controllers/reviewController')

// ================= VALIDATION =================

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};

//for reviews------------------------
router.post('/list/:id/reviews', isLoggedIn, validateReview, wrapAsync(postReview))

//for delete review
router.delete('/list/:id/reviews/:reviewid', isLoggedIn, isReviewAuthor, wrapAsync(deleteReview))


module.exports = router;