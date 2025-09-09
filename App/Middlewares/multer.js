const multer = require('multer');
const path = require('path');
const crypto = require('crypto');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));

  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function(err, bytes) {
        const fn = bytes.toString('hex') + path.extname(file.originalname);
        cb(null, fn)
    })
    
  }
})

module.exports = multer({ storage: storage });  
// const upload = multer({ storage: storage });
// module.exports = upload;

// module.exports = multer({ dest: 'uploads/' });

// const upload = multer({ dest: 'uploads/' });
// module.exports = upload;     
