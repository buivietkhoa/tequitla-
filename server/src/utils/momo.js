const crypto = require('crypto');
const axios = require('axios');

function sign(rawSignature) {
  return crypto
    .createHmac('sha256', process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');
}

// orderId must be unique per payment attempt — Momo sandbox rejects re-using
// the same orderId, so we suffix with a timestamp (mirrors the VNPay helper).
async function createPaymentUrl({ orderCode, amount, orderInfo }) {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const requestId = `${orderCode}-${Date.now()}`;
  const momoOrderId = requestId;
  const redirectUrl = process.env.MOMO_REDIRECT_URL;
  const ipnUrl = process.env.MOMO_IPN_URL;
  const requestType = 'captureWallet';
  const extraData = '';

  const rawSignature =
    `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
    `&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = sign(rawSignature);

  const { data } = await axios.post(process.env.MOMO_ENDPOINT, {
    partnerCode,
    partnerName: 'SHMILY',
    storeId: 'SHMILY',
    requestId,
    amount: String(Math.round(amount)),
    orderId: momoOrderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: 'vi',
    requestType,
    autoCapture: true,
    extraData,
    signature,
  });

  if (!data.payUrl) {
    throw new Error(data.message || 'Momo không trả về payUrl');
  }
  return data.payUrl;
}

function verifySignature(params) {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = params;

  if (!signature) return false;

  const rawSignature =
    `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData || ''}` +
    `&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}` +
    `&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}` +
    `&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  return sign(rawSignature) === signature;
}

// Momo orderId is "{orderCode}-{timestamp}" (see createPaymentUrl) — strip the
// suffix back off to recover the orderCode we stored on the Order document.
function orderCodeFromMomoOrderId(momoOrderId) {
  return momoOrderId.includes('-') ? momoOrderId.slice(0, momoOrderId.lastIndexOf('-')) : momoOrderId;
}

module.exports = { createPaymentUrl, verifySignature, orderCodeFromMomoOrderId };
