const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust',
        allowed_formats: ['png', 'jpg', 'jpeg'],
        transformation: [{ width: 1200, crop: "limit" }],
    },
});


module.exports = {
    cloudinary,
    storage,
}