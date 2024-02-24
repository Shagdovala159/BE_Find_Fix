const multer = require('multer');

// Konfigurasi multer
const storage = multer.diskStorage({
    destination: function (req, photo, cb) {
      // Tentukan direktori penyimpanan file
      cb(null, 'uploads/');
    },
    filename: function (req, photo, cb) {
        const name = `${Date.now()}_${photo.originalname}`;
      cb(null, name);
    }
  });
  
  // Membuat instance multer
  const upload = multer({ storage: storage });

module.exports = upload.single('photo');