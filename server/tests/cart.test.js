require('./setup');
const { request, app, registerAndLogin } = require('./helpers');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

async function createProduct(stock) {
  const category = await Category.create({ name: 'Quần', gender: 'nam' });
  return Product.create({
    name: 'Quần test',
    category: category._id,
    gender: 'nam',
    price: 100000,
    images: ['https://example.com/a.jpg'],
    variants: [{ size: 'L', color: 'Xanh', stock }],
  });
}

describe('Cart', () => {
  test('rejects adding more than available stock', async () => {
    const { cookie } = await registerAndLogin();
    const product = await createProduct(2);

    const res = await request(app)
      .post('/api/cart/items')
      .set('Cookie', cookie)
      .send({ productId: product._id.toString(), variantId: product.variants[0]._id.toString(), quantity: 5 })
      .expect(400);
    expect(res.body.message).toMatch(/tồn kho/);
  });

  test('rejects a malformed productId before touching the database', async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app)
      .post('/api/cart/items')
      .set('Cookie', cookie)
      .send({ productId: 'not-an-id', variantId: 'also-not-an-id', quantity: 1 })
      .expect(400);
    expect(res.body.errors).toBeDefined();
  });

  test('adding the same variant twice increases quantity instead of duplicating the line', async () => {
    const { cookie } = await registerAndLogin();
    const product = await createProduct(5);
    const body = { productId: product._id.toString(), variantId: product.variants[0]._id.toString(), quantity: 1 };

    await request(app).post('/api/cart/items').set('Cookie', cookie).send(body).expect(201);
    const res = await request(app).post('/api/cart/items').set('Cookie', cookie).send(body).expect(201);

    expect(res.body.cart.items).toHaveLength(1);
    expect(res.body.cart.items[0].quantity).toBe(2);
  });

  test('requires authentication', async () => {
    await request(app).get('/api/cart').expect(401);
  });
});
