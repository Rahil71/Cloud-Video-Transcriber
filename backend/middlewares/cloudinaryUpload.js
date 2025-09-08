const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'videos', // Folder name in Cloudinary
    resource_type: 'video' // Important for video uploads
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
