const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken, setTokenCookie } = require('../utils/generateToken');
const { sendMail } = require('../utils/email');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên, email và mật khẩu' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Email đã được sử dụng' });
  }

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Đã đăng xuất' });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      addresses: req.user.addresses,
    },
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, addresses } = req.body;
  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (addresses !== undefined) req.user.addresses = addresses;
  await req.user.save();
  res.json({ user: req.user });
});

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 phút

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Vui lòng nhập email' });
  }

  // Always respond with the same generic message whether or not the email
  // exists, so this endpoint can't be used to check which emails are registered.
  const genericResponse = {
    message: 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu',
  };

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.json(genericResponse);
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/dat-lai-mat-khau/${rawToken}`;

  await sendMail({
    to: user.email,
    subject: 'Đặt lại mật khẩu SHMILY',
    html: `
      <p>Xin chào ${user.name},</p>
      <p>Bấm vào liên kết dưới đây để đặt lại mật khẩu. Liên kết có hiệu lực trong 30 phút.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `,
  });

  res.json(genericResponse);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    return res.status(400).json({ message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Đặt lại mật khẩu thành công, vui lòng đăng nhập' });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
};
