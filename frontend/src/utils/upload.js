// utils/upload.js
const multer = require('multer');
const path = require('path');

// Configure the file storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the file extension
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`; // Create a unique filename
    cb(null, filename); // Use the unique filename
  }
});

// File filter (optional) to only allow certain file types like PDFs, images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb('Invalid file type. Only JPG, PNG, and PDF are allowed.');
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
