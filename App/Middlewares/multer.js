const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     // Fixed: uploadPath properly define kiya
    const uploadPath = path.join(__dirname, "../../uploads");
    // Ensure Uploads folder exists
    require('fs').mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);

  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function(err, bytes) {
      if (err) return cb(err);
        const fn = bytes.toString('hex') + path.extname(file.originalname).toLowerCase();
        cb(null, fn)
    });
    
  },
});

// Add file filter for safety
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG and PNG images are allowed'), false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
 
