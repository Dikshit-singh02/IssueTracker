const express = require('express');
const auth = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.use(auth);

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
