const express = require('express');
const { body, param } = require('express-validator');
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const categoryBodyRules = [
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên danh mục'),
  body('gender').isIn(['nam', 'nu', 'unisex']).withMessage('Giới tính không hợp lệ'),
];

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

router.post('/', protect, admin, categoryBodyRules, validate, createCategory);

router.put(
  '/:id',
  protect,
  admin,
  [param('id').isMongoId().withMessage('Danh mục không hợp lệ'), ...categoryBodyRules],
  validate,
  updateCategory
);

router.delete('/:id', protect, admin, [param('id').isMongoId()], validate, deleteCategory);

module.exports = router;
