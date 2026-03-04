require('dotenv').config()
const mongoose = require('mongoose')

async function MongoDB() {
    await mongoose.connect(process.env.MongoUrl);

}

module.exports = {
    MongoDB,
}