const express = require('express');
const { body, param } = require('express-validator');
const {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  addReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const productBodyRules = [
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm'),
  body('category').isMongoId().withMessage('Danh mục không hợp lệ'),
  body('gender').isIn(['nam', 'nu', 'unisex']).withMessage('Giới tính không hợp lệ'),
  body('price').isFloat({ min: 0 }).withMessage('Giá không hợp lệ'),
  body('salePrice').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Giá khuyến mãi không hợp lệ'),
];

router.get('/', getProducts);
router.get('/admin/all', protect, admin, getAdminProducts);
router.get('/admin/detail/:id', protect, admin, [param('id').isMongoId()], validate, getProductById);
router.get('/:slug', getProductBySlug);

router.post('/', protect, admin, productBodyRules, validate, createProduct);

router.post(
  '/:id/reviews',
  protect,
  [
    param('id').isMongoId().withMessage('Sản phẩm không hợp lệ'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Đánh giá phải từ 1 đến 5 sao'),
    body('comment').optional({ checkFalsy: true }).isString(),
  ],
  validate,
  addReview
);

router.put(
  '/:id',
  protect,
  admin,
  [param('id').isMongoId().withMessage('Sản phẩm không hợp lệ'), ...productBodyRules],
  validate,
  updateProduct
);

router.delete('/:id', protect, admin, [param('id').isMongoId()], validate, deleteProduct);

module.exports = router;
