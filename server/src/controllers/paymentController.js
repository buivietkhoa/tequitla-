const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const vnpay = require('../utils/vnpay');
const momo = require('../utils/momo');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

async function markOrderPaid(order, paymentId) {
  if (order.isPaid) return; // already confirmed, keep callbacks idempotent
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = { id: paymentId, status: 'success', updateTime: new Date().toISOString() };
  await order.save();
}

async function loadOwnUnpaidOrder(req, res) {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    return null;
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: 'Bạn không có quyền thanh toán đơn hàng này' });
    return null;
  }
  if (order.isPaid) {
    res.status(400).json({ message: 'Đơn hàng đã được thanh toán' });
    return null;
  }
  return order;
}

const createVnpayPaymentUrl = asyncHandler(async (req, res) => {
  const order = await loadOwnUnpaidOrder(req, res);
  if (!order) return;

  const paymentUrl = vnpay.createPaymentUrl({
    orderCode: order.orderCode,
    amount: order.totalPrice,
    orderInfo: `Thanh toan don hang ${order.orderCode}`,
    ipAddr: req.ip,
  });

  res.json({ paymentUrl });
});

// VNPay redirects the customer's browser here after payment. We verify the
// signature, update the order, then forward the browser to the order page —
// this endpoint is on the SERVER (see VNPAY_RETURN_URL in .env.example).
const vnpayReturn = asyncHandler(async (req, res) => {
  const valid = vnpay.verifySignature(req.query);
  const orderCode = vnpay.orderCodeFromTxnRef(req.query.vnp_TxnRef || '');
  const order = orderCode ? await Order.findOne({ orderCode }) : null;

  if (!valid || !order) {
    return res.redirect(`${CLIENT_URL}/thanh-toan?payment=invalid`);
  }

  if (req.query.vnp_ResponseCode === '00') {
    await markOrderPaid(order, req.query.vnp_TransactionNo);
    return res.redirect(`${CLIENT_URL}/tai-khoan/don-hang/${order._id}?payment=success`);
  }

  res.redirect(`${CLIENT_URL}/tai-khoan/don-hang/${order._id}?payment=failed`);
});

// VNPay calls this server-to-server to confirm payment; must reply with the
// exact { RspCode, Message } shape VNPay's docs specify.
const vnpayIpn = asyncHandler(async (req, res) => {
  const valid = vnpay.verifySignature(req.query);
  if (!valid) {
    return res.json({ RspCode: '97', Message: 'Invalid signature' });
  }

  const orderCode = vnpay.orderCodeFromTxnRef(req.query.vnp_TxnRef || '');
  const order = orderCode ? await Order.findOne({ orderCode }) : null;
  if (!order) {
    return res.json({ RspCode: '01', Message: 'Order not found' });
  }

  if (Number(req.query.vnp_Amount) !== Math.round(order.totalPrice) * 100) {
    return res.json({ RspCode: '04', Message: 'Amount mismatch' });
  }

  if (order.isPaid) {
    return res.json({ RspCode: '02', Message: 'Order already confirmed' });
  }

  if (req.query.vnp_ResponseCode === '00') {
    await markOrderPaid(order, req.query.vnp_TransactionNo);
  }

  res.json({ RspCode: '00', Message: 'Confirm Success' });
});

const createMomoPaymentUrl = asyncHandler(async (req, res) => {
  const order = await loadOwnUnpaidOrder(req, res);
  if (!order) return;

  try {
    const paymentUrl = await momo.createPaymentUrl({
      orderCode: order.orderCode,
      amount: order.totalPrice,
      orderInfo: `Thanh toan don hang ${order.orderCode}`,
    });
    res.json({ paymentUrl });
  } catch (err) {
    res.status(502).json({ message: 'Không thể tạo yêu cầu thanh toán Momo' });
  }
});

// Momo redirects the customer's browser here after payment (server URL, same
// reasoning as vnpayReturn above).
const momoReturn = asyncHandler(async (req, res) => {
  const valid = momo.verifySignature(req.query);
  const orderCode = momo.orderCodeFromMomoOrderId(req.query.orderId || '');
  const order = orderCode ? await Order.findOne({ orderCode }) : null;

  if (!valid || !order) {
    return res.redirect(`${CLIENT_URL}/thanh-toan?payment=invalid`);
  }

  if (req.query.resultCode === '0') {
    await markOrderPaid(order, req.query.transId);
    return res.redirect(`${CLIENT_URL}/tai-khoan/don-hang/${order._id}?payment=success`);
  }

  res.redirect(`${CLIENT_URL}/tai-khoan/don-hang/${order._id}?payment=failed`);
});

// Momo's authoritative server-to-server confirmation.
const momoIpn = asyncHandler(async (req, res) => {
  const valid = momo.verifySignature(req.body);
  if (!valid) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const orderCode = momo.orderCodeFromMomoOrderId(req.body.orderId || '');
  const order = orderCode ? await Order.findOne({ orderCode }) : null;
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!order.isPaid && req.body.resultCode === 0) {
    await markOrderPaid(order, req.body.transId);
  }

  res.json({ message: 'success' });
});

module.exports = {
  createVnpayPaymentUrl,
  vnpayReturn,
  vnpayIpn,
  createMomoPaymentUrl,
  momoReturn,
  momoIpn,
};
