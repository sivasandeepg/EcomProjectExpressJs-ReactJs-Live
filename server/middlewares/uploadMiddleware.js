// multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/'); 
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
};

// Initialize multer with file size limit
const upload = multer({
  storage,
  limits: { fileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 5 }, // Default to 5MB limit
  fileFilter,
});

// Error handling middleware for multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: err.message });
  }
  if (err) {
    return res.status(400).send({ message: err.message });
  }
  next();
};

// Exporting upload and error handler
module.exports = {
  upload,
  multerErrorHandler,
};
 