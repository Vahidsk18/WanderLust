const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default:'https://media.istockphoto.com/id/1454842745/photo/tourism.jpg?s=612x612&w=is&k=20&c=M-3TtEilagZ-s2s-tRO6VQE2F5RiAZcK199UHYSNd5s=',
        set: (v) => v === "" ? "https://media.istockphoto.com/id/1454842745/photo/tourism.jpg?s=612x612&w=is&k=20&c=M-3TtEilagZ-s2s-tRO6VQE2F5RiAZcK199UHYSNd5s=" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
})

const Listing = mongoose.model('listing', listingSchema)

module.exports = Listing;