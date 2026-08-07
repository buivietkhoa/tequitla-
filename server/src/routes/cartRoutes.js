const express = require('express');
const { body, param } = require('express-validator');
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getCart);

router.post(
  '/items',
  [
    body('productId').isMongoId().withMessage('productId không hợp lệ'),
    body('variantId').isMongoId().withMessage('variantId không hợp lệ'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Số lượng không hợp lệ'),
  ],
  validate,
  addItem
);

router.put(
  '/items/:itemId',
  [
    param('itemId').isMongoId().withMessage('itemId không hợp lệ'),
    body('quantity').isInt({ min: 0 }).withMessage('Số lượng không hợp lệ'),
  ],
  validate,
  updateItem
);

router.delete(
  '/items/:itemId',
  [param('itemId').isMongoId().withMessage('itemId không hợp lệ')],
  validate,
  removeItem
);

router.delete('/', clearCart);

module.exports = router;
