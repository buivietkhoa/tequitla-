const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

function generateOrderCode() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DH${datePart}${randomPart}`;
}

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 500000;

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD' } = req.body;

  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.city || !shippingAddress?.detail) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin giao hàng' });
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Giỏ hàng đang trống' });
  }

  try {
    // Validate stock for every line first so a shortage on one item never leaves
    // an earlier item's stock decremented without an order being created.
    const products = await Promise.all(
      cart.items.map((item) => Product.findById(item.product._id))
    );

    products.forEach((product, idx) => {
      const item = cart.items[idx];
      if (!product || !product.isActive) {
        throw new Error(`Sản phẩm "${item.product.name}" không còn tồn tại`);
      }
      const variant = product.variants.id(item.variantId);
      if (!variant || variant.stock < item.quantity) {
        throw new Error(`Sản phẩm "${product.name}" (${item.size}/${item.color}) không đủ tồn kho`);
      }
    });

    const orderItems = [];
    for (let idx = 0; idx < cart.items.length; idx += 1) {
      const item = cart.items[idx];
      const product = products[idx];
      const variant = product.variants.id(item.variantId);
      variant.stock -= item.quantity;
      product.totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      });
    }

    const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      orderCode: generateOrderCode(),
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Không thể tạo đơn hàng' });
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này' });
  }
  res.json({ order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này' });
  }
  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({ message: 'Đơn hàng không thể hủy ở trạng thái hiện tại' });
  }

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(
        (v) => v.size === item.size && v.color === item.color
      );
      if (variant) {
        variant.stock += item.quantity;
        product.totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
        await product.save();
      }
    }
  }

  order.status = 'cancelled';
  order.cancelReason = req.body.reason || 'Khách hàng hủy đơn';
  await order.save();
  res.json({ order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({ orders, pagination: { page: pageNum, limit: limitNum, total } });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

  order.status = status;
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.isPaid = true;
    order.paidAt = order.paidAt || new Date();
  }
  await order.save();
  res.json({ order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
