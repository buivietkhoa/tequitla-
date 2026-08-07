const express = require('express');
const { body, param } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('shippingAddress.fullName').trim().notEmpty().withMessage('Vui lòng nhập họ tên'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Vui lòng nhập số điện thoại'),
    body('shippingAddress.city').trim().notEmpty().withMessage('Vui lòng nhập tỉnh/thành phố'),
    body('shippingAddress.detail').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ cụ thể'),
    body('paymentMethod').optional().isIn(['COD', 'VNPAY', 'MOMO']).withMessage('Phương thức thanh toán không hợp lệ'),
  ],
  validate,
  createOrder
);

router.get('/my', getMyOrders);
router.get('/admin/all', admin, getAllOrders);

router.get('/:id', [param('id').isMongoId().withMessage('Mã đơn hàng không hợp lệ')], validate, getOrderById);

router.put(
  '/:id/cancel',
  [param('id').isMongoId().withMessage('Mã đơn hàng không hợp lệ')],
  validate,
  cancelOrder
);

router.put(
  '/:id/status',
  admin,
  [
    param('id').isMongoId().withMessage('Mã đơn hàng không hợp lệ'),
    body('status')
      .isIn(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'])
      .withMessage('Trạng thái không hợp lệ'),
  ],
  validate,
  updateOrderStatus
);

module.exports = router;
