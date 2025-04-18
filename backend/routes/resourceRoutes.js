// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db'); // MySQL connection

// Configure multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`; // Create unique filename
    cb(null, filename); // Set unique filename
  }
});

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

// Resource upload route (POST)
router.post('/upload', upload.single('file'), async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  
    const { title, description, tags, uploaderId } = req.body;
  
    if (!title || !uploaderId) {
      return res.status(400).json({ message: 'Title and uploaderId are required.' });
    }
  
    const filePath = req.file.path;
    const fileName = req.file.filename;
  
    const query = 'INSERT INTO resources (title, description, tags, file_name, file_path, uploader_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [title, description, tags, fileName, filePath, uploaderId];
  
    db.query(query, values, (error, results) => {
      if (error) {
        console.error("DB Error:", error);
        return res.status(500).json({ message: 'Error saving resource to database' });
      }
      res.status(200).json({ message: 'File uploaded successfully', data: results });
    });
  });
  

module.exports = router;
