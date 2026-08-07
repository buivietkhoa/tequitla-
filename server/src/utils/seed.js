require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Áo thun nam', gender: 'nam' },
  { name: 'Áo sơ mi nam', gender: 'nam' },
  { name: 'Quần jean nam', gender: 'nam' },
  { name: 'Áo khoác nam', gender: 'nam' },
  { name: 'Đầm nữ', gender: 'nu' },
  { name: 'Áo kiểu nữ', gender: 'nu' },
  { name: 'Chân váy nữ', gender: 'nu' },
  { name: 'Quần jean nữ', gender: 'nu' },
];

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = [
  { color: 'Đen', hex: '#111111' },
  { color: 'Trắng', hex: '#f5f5f5' },
  { color: 'Xám', hex: '#9ca3af' },
];

function randomVariants() {
  const variants = [];
  SIZES.forEach((size) => {
    COLORS.forEach(({ color, hex }) => {
      variants.push({
        size,
        color,
        colorHex: hex,
        stock: Math.floor(Math.random() * 30) + 5,
        sku: `${size}-${color}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase(),
      });
    });
  });
  return variants;
}

const FASHION_IMAGES = {
  nu: [
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1520975682031-a6dd7e5f8f04?auto=format&fit=crop&w=900&q=85',
  ],
  nam: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1506629905607-d9e297d4b9db?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=900&q=85',
  ],
};

function getFashionImage(gender, index) {
  const pool = FASHION_IMAGES[gender] || [...FASHION_IMAGES.nu, ...FASHION_IMAGES.nam];
  return pool[index % pool.length];
}

async function run() {
  await connectDB();

  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
  ]);

  const createdCategories = await Category.insertMany(categories);
  console.log(`Đã tạo ${createdCategories.length} danh mục`);

  const productNames = {
    'Áo thun nam': ['Áo thun basic', 'Áo thun in họa tiết', 'Áo thun oversize'],
    'Áo sơ mi nam': ['Sơ mi trắng công sở', 'Sơ mi caro', 'Sơ mi linen'],
    'Quần jean nam': ['Quần jean slimfit', 'Quần jean ống suông', 'Quần jean rách gối'],
    'Áo khoác nam': ['Áo khoác bomber', 'Áo khoác denim', 'Áo khoác dạ'],
    'Đầm nữ': ['Đầm maxi hoa', 'Đầm công sở', 'Đầm suông basic'],
    'Áo kiểu nữ': ['Áo kiểu tay bồng', 'Áo kiểu lụa', 'Áo kiểu cổ vuông'],
    'Chân váy nữ': ['Chân váy xếp ly', 'Chân váy chữ A', 'Chân váy bút chì'],
    'Quần jean nữ': ['Quần jean ống loe', 'Quần jean skinny', 'Quần jean lưng cao'],
  };

  const products = [];
  let productImageIndex = 0;
  for (const category of createdCategories) {
    const names = productNames[category.name] || [];
    for (const baseName of names) {
      const price = (Math.floor(Math.random() * 15) + 5) * 10000 + 190000;
      const onSale = Math.random() > 0.6;
      products.push({
        name: `${baseName} ${category.gender === 'nam' ? 'Nam' : 'Nữ'}`,
        description: `${baseName} chất liệu cao cấp, form dáng chuẩn, phù hợp mặc đi làm và đi chơi.`,
        shortDescription: `${baseName} - chất lượng, giá tốt`,
        category: category._id,
        gender: category.gender,
        brand: 'SHMILY',
        price,
        salePrice: onSale ? Math.round((price * 0.8) / 1000) * 1000 : null,
        images: [getFashionImage(category.gender, productImageIndex++)],
        variants: randomVariants(),
        isFeatured: Math.random() > 0.7,
        tags: [category.gender, baseName.split(' ')[0].toLowerCase()],
        seo: {
          metaTitle: `${baseName} ${category.gender === 'nam' ? 'Nam' : 'Nữ'} | SHMILY`,
          metaDescription: `Mua ${baseName.toLowerCase()} chính hãng, giá tốt tại SHMILY.`,
        },
      });
    }
  }

  const createdProducts = await Product.insertMany(products);
  console.log(`Đã tạo ${createdProducts.length} sản phẩm`);

  const adminEmail = 'admin@shmily.vn';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`Đã tạo tài khoản admin: ${adminEmail} / Admin@123`);
  }

  console.log('Seed dữ liệu hoàn tất');
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed thất bại:', err);
  process.exit(1);
});
