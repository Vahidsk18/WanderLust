const express = require('express');
const router = express.Router();

const { wrapAsync } = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const { listingSchema } = require('../joiSchema')
const { isLoggedIn, isOwnerForListing } = require('../middlewares/auth')
const { getAllList, getSingleList, createListForm, createList, editList, updateList, deleteList } = require('../controllers/listingController')
const multer = require('multer')
const { storage } = require('../cloudConfig')
const upload = multer({ storage })

// ================= VALIDATION =================

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};

// ================= LISTING ROUTES =================

// GET ALL
router.get('/listings', wrapAsync(getAllList));

// GET SINGLE
router.get('/viewlist/:id', wrapAsync(getSingleList));

// CREATE FORM
router.get('/listing/new', isLoggedIn, createListForm);

// CREATE
router.post('/create/new/list', upload.single('image'), validateListing, wrapAsync(createList));

// EDIT FORM
router.get('/editlist/:id', isLoggedIn, wrapAsync(editList));

// UPDATE
router.put('/edit/list/:id', isLoggedIn, isOwnerForListing, upload.single('image'), validateListing, wrapAsync(updateList));

// DELETE LISTING (Cascade will run here)
router.delete('/deletelist/:id', isLoggedIn, isOwnerForListing, wrapAsync(deleteList));



module.exports = router;