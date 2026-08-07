const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau' },
});

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Vui lòng nhập tên'),
    body('email').trim().isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('phone').optional({ checkFalsy: true }).isString(),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').trim().isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
  ],
  validate,
  login
);

router.post('/logout', logout);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').trim().isEmail().withMessage('Email không hợp lệ')],
  validate,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  authLimiter,
  [
    param('token').notEmpty(),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  ],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
