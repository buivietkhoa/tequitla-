const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// Cloudinary is used whenever it's configured (persists across redeploys, has a CDN).
// Local disk stays as the fallback for dev environments without Cloudinary env vars set.
const storage = cloudinaryConfigured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '');
        cb(null, `${base}-${Date.now()}${ext}`);
      },
    });

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh JPEG, PNG, WEBP hoặc AVIF'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'shmily/products' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

router.post('/', protect, admin, upload.array('images', 8), async (req, res) => {
  const files = req.files || [];

  if (!cloudinaryConfigured) {
    return res.status(201).json({ urls: files.map((file) => `/uploads/${file.filename}`) });
  }

  try {
    const results = await Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer)));
    res.status(201).json({ urls: results.map((result) => result.secure_url) });
  } catch (err) {
    res.status(500).json({ message: 'Tải ảnh lên Cloudinary thất bại' });
  }
});

module.exports = router;
