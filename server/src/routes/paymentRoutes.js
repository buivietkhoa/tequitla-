const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createVnpayPaymentUrl,
  vnpayReturn,
  vnpayIpn,
  createMomoPaymentUrl,
  momoReturn,
  momoIpn,
} = require('../controllers/paymentController');

const router = express.Router();

const orderIdRule = [body('orderId').isMongoId().withMessage('Đơn hàng không hợp lệ')];

router.post('/vnpay/create-payment-url', protect, orderIdRule, validate, createVnpayPaymentUrl);
router.get('/vnpay/return', vnpayReturn);
router.get('/vnpay/ipn', vnpayIpn);

router.post('/momo/create-payment-url', protect, orderIdRule, validate, createMomoPaymentUrl);
router.get('/momo/return', momoReturn);
router.post('/momo/ipn', momoIpn);

module.exports = router;
