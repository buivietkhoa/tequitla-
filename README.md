# FashionHub — Website thời trang Nam & Nữ

Stack: **Next.js 16 (App Router)** cho frontend (SSR/ISR để tối ưu SEO và tốc độ) + **Node.js/Express** làm REST API riêng (headless) + **MongoDB** (Mongoose).

```
Tequitla/
├── client/   # Next.js frontend (React, Tailwind CSS v4)
└── server/   # Express REST API + MongoDB
```

## Vì sao chọn kiến trúc này

- **Next.js** render sẵn HTML (SSR/SSG/ISR) nên Google index được ngay, không phải chờ JavaScript chạy như SPA thuần — quan trọng cho SEO của trang thương mại điện tử.
- Trang chủ, danh mục Nam/Nữ, chi tiết sản phẩm dùng cache `revalidate: 300s` (ISR) — phục vụ từ cache nên rất nhanh, tự làm mới dữ liệu mỗi 5 phút mà không cần rebuild.
- `next/image` tự động tối ưu, resize, lazy-load ảnh sản phẩm.
- Express API tách riêng để có thể scale độc lập, hoặc tái sử dụng cho app di động sau này.

## Yêu cầu môi trường

- Node.js 20.9+ (dự án dùng Next.js 16, yêu cầu tối thiểu Node 20.9)
- MongoDB (local hoặc [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

## Cài đặt

### 1. Server (API)

```bash
cd server
npm install
cp .env.example .env
# Sửa MONGO_URI trong .env nếu dùng Atlas thay vì MongoDB local
npm run seed   # Tạo danh mục + sản phẩm mẫu + tài khoản admin
npm run dev    # Chạy tại http://localhost:5000
```

Tài khoản admin mẫu sau khi seed: `admin@fashionhub.vn` / `Admin@123`

### 2. Client (Next.js)

```bash
cd client
npm install
cp .env.local.example .env.local   # giá trị mặc định đã trỏ đúng về localhost:5000
npm run dev    # Chạy tại http://localhost:3000
```

### 3. MongoDB local nhanh bằng Docker (tuỳ chọn)

Nếu chưa cài MongoDB, có thể chạy tạm bằng Docker:

```bash
docker run -d --name fashionhub-mongo -p 27017:27017 mongo:7
```

## Các tính năng đã có

- **Khách hàng**: duyệt sản phẩm Nam/Nữ theo danh mục, lọc theo size/giá, tìm kiếm, xem chi tiết sản phẩm (chọn size/màu), giỏ hàng, thanh toán (COD), lịch sử đơn hàng, hủy đơn, đánh giá sản phẩm.
- **Tài khoản**: đăng ký / đăng nhập (JWT lưu trong httpOnly cookie).
- **Admin** (`/admin`, cần tài khoản role `admin`): CRUD sản phẩm (kèm upload ảnh, biến thể size/màu/tồn kho), CRUD danh mục, xem & cập nhật trạng thái đơn hàng.
- **SEO**: `generateMetadata` cho từng trang (title/description/OG/Twitter card), JSON-LD (`Organization`, `Product`), `sitemap.xml` và `robots.txt` tự sinh, URL tiếng Việt không dấu thân thiện (`/nam/ao-thun-nam`, `/san-pham/...`).

## Giới hạn hiện tại / việc cần làm tiếp nếu lên production

- Thanh toán mới hỗ trợ COD (thanh toán khi nhận hàng). Tích hợp cổng thanh toán thật (VNPay/Momo/Stripe) cần thêm ở `server/src/controllers/orderController.js` và `paymentMethod`.
- Ảnh sản phẩm khi seed dùng ảnh thời trang từ Unsplash; ảnh admin upload qua form được lưu ở `server/uploads` (đĩa cục bộ) — khi deploy thật nên chuyển sang S3/Cloudinary để có CDN và không mất ảnh khi redeploy.
- `sitemap.xml` hiện lấy tối đa 48 sản phẩm mới nhất; nếu shop có nhiều sản phẩm hơn, cần dùng `generateSitemaps` của Next.js để chia nhiều sitemap.
- Giỏ hàng yêu cầu đăng nhập (chưa hỗ trợ giỏ hàng khách vãng lai/localStorage).
- Chưa có test tự động (unit/e2e).

## Build production

```bash
cd client && npm run build && npm start
cd server && npm start   # nhớ export NODE_ENV=production
```
