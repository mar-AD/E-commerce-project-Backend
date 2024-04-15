const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
const clouName = process.env.CLOUD_NAME;
const clouKey = process.env.CLOUD_API_KEY;
const clouSecret = process.env.CLOUD_API_SECRET;
const app = express();


cloudinary.config({
    cloud_name: clouName,
    api_key: clouKey,
    api_secret: clouSecret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'E-COMERCEimgs', 
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file)=>`product-${Date.now()}`,
    },
});
const upload = multer({ storage: storage, limits: { fieldSize: 1024 * 1024 * 10 } }); 

module.exports = upload