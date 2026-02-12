const mongoose = require('mongoose')

const { MongoDB } = require('./config')
const { data } = require('./init/data')
const Listing = require('./models/listing')


//DB 
MongoDB().then(() => console.log("Db connected"))
    .catch(err => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({})
    await Listing.insertMany(data)
    console.log("data was added")
}

initDB()
module.exports = {
    initDB,
}