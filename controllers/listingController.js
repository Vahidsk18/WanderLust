const Listing = require('../models/listing');
const cloudinary = require('cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// GET ALL
async function getAllList(req, res) {
    const lists = await Listing.find({});
    res.render('listings/index', { lists });
}
// GET SINGLE
async function getSingleList(req, res) {
    const { id } = req.params;
    const list = await Listing.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('owner');

    if (!list) {
        req.flash("error", "List Not Found!")
        return res.redirect('/listings')
    }
    // console.log("list ", list);
    res.render('listings/list', {
        list,
        userLoggedIn: req.isAuthenticated(),
    });
}

//create form
async function createListForm(req, res) {
    res.render('listings/createlist');
}
// CREATE POST ROUTE
async function createList(req, res) {
    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();

    if (!req.file) {
        req.flash('error', 'Provide Image');
        return res.redirect('/listing/new');
    }
    const list = new Listing(req.body);
    list.image = {
        url: req.file.path,
        filename: req.file.filename
    }
    list.owner = req.user._id;
    list.geometry = coordinates.body.features[0].geometry;
    let savedList = await list.save();
    // console.log(savedList);
    req.flash("success", "New Listing Created!")
    res.redirect('/listings');
}

//Edit List
async function editList(req, res) {
    const { id } = req.params;
    const list = await Listing.findById(id);

    if (!list) {
        req.flash("error", "List Not Found!")
        return res.redirect('/listings')
    }

    let originalImageUrl = list.image.url;
    originalImageUrl.replace('/uploads', '/uploads/h_200,w_250') //for low quality img 
    res.render('listings/updatelist', { list, originalImageUrl });
}

//Update List
async function updateList(req, res) {
    const { id } = req.params;

    const beforeListing = await Listing.findById(id);
    const updatedList = { ...req.body };

    //update img
    if (req.file) {
        await cloudinary.uploader.destroy(beforeListing.image.filename); //delete old img

        updatedList.image = {
            url: req.file.path,
            filename: req.file.filename
        }
    }

    //update location
    if (req.body.location && req.body.location !== beforeListing.location) {
        let coordinates = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send();

        if (!coordinates.body.features.length) {
            req.flash("error", "Invalid location provided");
            return res.redirect(`/editlist/${id}`);
        }
        updatedList.geometry = coordinates.body.features[0].geometry;

    }

    await Listing.findByIdAndUpdate(id, updatedList, { new: true });

    req.flash("success", "List Edited!")
    res.redirect(`/viewlist/${id}`);

}

//Delete List
async function deleteList(req, res) {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!")
    res.redirect('/listings');
}



module.exports = {
    getAllList,
    getSingleList,
    createListForm,
    createList,
    editList,
    updateList,
    deleteList,
}