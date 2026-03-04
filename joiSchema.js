const Joi = require('joi');

//validation for listiig schema
const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0)
})

//validation for review schema
const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5).required(),
    comment: Joi.string().required(),
})

module.exports = {
    listingSchema,
    reviewSchema,
}