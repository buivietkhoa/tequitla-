const crypto = require('crypto');
const qs = require('qs');

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

function sign(params) {
  const sorted = sortObject(params);
  const signData = qs.stringify(sorted, { encode: false });
  return crypto
    .createHmac('sha512', process.env.VNPAY_HASH_SECRET)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');
}

// orderCode must be unique per payment attempt (vnp_TxnRef) — VNPay sandbox
// rejects re-using the same TxnRef, so we suffix with a timestamp.
function createPaymentUrl({ orderCode, amount, orderInfo, ipAddr }) {
  const now = new Date();
  const txnRef = `${orderCode}-${now.getTime()}`;

  let params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: process.env.VNPAY_TMN_CODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: Math.round(amount) * 100,
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
    vnp_IpAddr: ipAddr || '127.0.0.1',
    vnp_CreateDate: formatDate(now),
  };

  params = sortObject(params);
  params.vnp_SecureHash = sign(params);

  return `${process.env.VNPAY_URL}?${qs.stringify(params, { encode: false })}`;
}

function verifySignature(query) {
  const params = { ...query };
  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  if (!secureHash) return false;
  return sign(params) === secureHash;
}

// vnp_TxnRef is "{orderCode}-{timestamp}" (see createPaymentUrl) — strip the
// suffix back off to recover the orderCode we stored on the Order document.
function orderCodeFromTxnRef(txnRef) {
  return txnRef.includes('-') ? txnRef.slice(0, txnRef.lastIndexOf('-')) : txnRef;
}

module.exports = { createPaymentUrl, verifySignature, orderCodeFromTxnRef };
