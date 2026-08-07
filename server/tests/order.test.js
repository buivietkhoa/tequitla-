require('./setup');
const { request, app, registerAndLogin } = require('./helpers');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

let categoryCounter = 0;

async function createProduct(overrides = {}) {
  categoryCounter += 1;
  const category = await Category.create({ name: `Áo thun ${categoryCounter}`, gender: 'nam' });
  return Product.create({
    name: 'Áo thun test',
    category: category._id,
    gender: 'nam',
    price: 200000,
    images: ['https://example.com/a.jpg'],
    variants: [{ size: 'M', color: 'Đen', stock: 3 }],
    ...overrides,
  });
}

describe('Order flow', () => {
  test('creates an order, decrements stock, and clears the cart', async () => {
    const { cookie } = await registerAndLogin();
    const product = await createProduct();
    const variantId = product.variants[0]._id.toString();

    await request(app)
      .post('/api/cart/items')
      .set('Cookie', cookie)
      .send({ productId: product._id.toString(), variantId, quantity: 2 })
      .expect(201);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({
        shippingAddress: { fullName: 'A', phone: '0123456789', city: 'HCM', detail: '123 abc' },
        paymentMethod: 'COD',
      })
      .expect(201);

    expect(orderRes.body.order.itemsPrice).toBe(400000);
    expect(orderRes.body.order.totalPrice).toBe(400000 + 30000); // under free-ship threshold

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.variants[0].stock).toBe(1);

    const cartRes = await request(app).get('/api/cart').set('Cookie', cookie).expect(200);
    expect(cartRes.body.cart.items).toHaveLength(0);
  });

  test('rejects order when stock drops after add-to-cart, without touching other items', async () => {
    const { cookie } = await registerAndLogin();
    const plentiful = await createProduct({ name: 'Đủ hàng' }); // stock 3
    const scarce = await createProduct({
      name: 'Sắp hết',
      variants: [{ size: 'M', color: 'Đen', stock: 2 }],
    });

    await request(app)
      .post('/api/cart/items')
      .set('Cookie', cookie)
      .send({ productId: plentiful._id.toString(), variantId: plentiful.variants[0]._id.toString(), quantity: 2 })
      .expect(201);
    await request(app)
      .post('/api/cart/items')
      .set('Cookie', cookie)
      .send({ productId: scarce._id.toString(), variantId: scarce.variants[0]._id.toString(), quantity: 2 })
      .expect(201);

    // Simulate another customer buying the last unit between add-to-cart and checkout.
    await Product.updateOne(
      { _id: scarce._id, 'variants._id': scarce.variants[0]._id },
      { $set: { 'variants.$.stock': 1 } }
    );

    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ shippingAddress: { fullName: 'A', phone: '0123456789', city: 'HCM', detail: '123 abc' } })
      .expect(400);
    expect(res.body.message).toMatch(/không đủ tồn kho/);

    const plentifulAfter = await Product.findById(plentiful._id);
    expect(plentifulAfter.variants[0].stock).toBe(3); // untouched — no partial decrement
  });

  test('cancelling an order restores stock', async () => {
    const { cookie } = await registerAndLogin();
    const product = await createProduct(); // stock 3

    await request(app)
      .post('/api/cart/items')
      .set('Cookie', cookie)
      .send({ productId: product._id.toString(), variantId: product.variants[0]._id.toString(), quantity: 2 })
      .expect(201);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ shippingAddress: { fullName: 'A', phone: '0123456789', city: 'HCM', detail: '123 abc' } })
      .expect(201);

    expect((await Product.findById(product._id)).variants[0].stock).toBe(1);

    await request(app)
      .put(`/api/orders/${orderRes.body.order._id}/cancel`)
      .set('Cookie', cookie)
      .expect(200);

    expect((await Product.findById(product._id)).variants[0].stock).toBe(3);
  });

  test('requires authentication to create an order', async () => {
    await request(app)
      .post('/api/orders')
      .send({ shippingAddress: { fullName: 'A', phone: '0123456789', city: 'HCM', detail: '123 abc' } })
      .expect(401);
  });

  test('rejects order creation with missing shipping fields', async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ shippingAddress: {} })
      .expect(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
