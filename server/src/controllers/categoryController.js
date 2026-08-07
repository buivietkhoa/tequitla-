const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

const getCategories = asyncHandler(async (req, res) => {
  const { gender } = req.query;
  const filter = { isActive: true };
  if (gender) filter.gender = gender;
  const categories = await Category.find(filter).sort({ name: 1 });
  res.json({ categories });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  res.json({ category });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  res.json({ category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  res.json({ message: 'Đã xóa danh mục' });
});

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
