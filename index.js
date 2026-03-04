require("dotenv").config();

const { MongoDB } = require('./config')
const { data } = require('./init/data')
const Listing = require('./models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//DB 
MongoDB().then(() => console.log("Db connected"))
    .catch(err => console.log(err));


const initDB = async () => {
    await Listing.deleteMany({});
    console.log("Data was Deleted");

    for (let obj of data) {

        const response = await geocodingClient.forwardGeocode({
            query: obj.location,
            limit: 1
        }).send();

        const newListing = new Listing({
            ...obj,
            owner: '69a83bce72765a5a38d4b67e',
            geometry: response.body.features[0].geometry
        });

        await newListing.save();
    }

    console.log("Data was added with geometry");
}

initDB();



module.exports = {
    initDB,
}