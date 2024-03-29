const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController'); 
const cors = require('../middleware/cors');
const authuser = require('../middleware/authuser');
router.use(cors);
router.post('/add',authuser, orderController.createOrder);
router.get('/getall',authuser, orderController.getAllOrders);
router.get('/get/:id',authuser, orderController.getOrderById);

module.exports = router;
