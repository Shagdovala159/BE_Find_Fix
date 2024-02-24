const express = require('express');
const cors = require('../middleware/cors');
const router = express.Router();
const upload = require('../middlewares/multer');
const productController = require('../controllers/productController');

router.use(cors);
router.post('/product', upload.single('image'), productController.createProduct);

module.exports = router;
