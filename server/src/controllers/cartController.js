const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name slug images price salePrice variants'
  );
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json({ cart });
});

const addItem = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  const variant = product.variants.id(variantId);
  if (!variant) {
    return res.status(404).json({ message: 'Không tìm thấy phân loại sản phẩm' });
  }
  if (variant.stock < quantity) {
    return res.status(400).json({ message: 'Số lượng tồn kho không đủ' });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const price = product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId && item.variantId.toString() === variantId
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: productId,
      variantId,
      size: variant.size,
      color: variant.color,
      quantity,
      price,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name slug images price salePrice variants');
  res.status(201).json({ cart });
});

const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });

  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name slug images price salePrice variants');
  res.json({ cart });
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

  const item = cart.items.id(req.params.itemId);
  if (item) item.deleteOne();

  await cart.save();
  await cart.populate('items.product', 'name slug images price salePrice variants');
  res.json({ cart });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: 'Đã xóa giỏ hàng' });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
