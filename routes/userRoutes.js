// routes/itemRoutes.js
const express = require('express');
const userController = require('../controller/userController');
const cors = require('../middleware/cors');
const router = express.Router();
const authalluser = require('../middleware/authalluser');
const authuser = require('../middleware/authuser');
const upload = require('../middleware/upload');



router.use(cors);
//endpoint register
router.post('/register', userController.registerUser);
//endpoint login
router.post('/login', userController.loginUserAuth);


module.exports = router;