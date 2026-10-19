# 🌾 Zaiqa — Taste of Lahore

A full-stack (MERN) restaurant ordering platform with a dark, gold-accented editorial design — slow-turning plated dishes, script typography, flour-grain texture, and buttery Framer Motion transitions throughout.

## What's inside

**Customer experience**
- Animated home page: hero with a floating dish on a rotating gold ring, category cards, chef's signatures, free-delivery banner, testimonials
- Menu with animated category pills (shared-layout pill slide), live search, and sorting (rating / price / newest)
- Slide-in cart drawer with quantity controls and a free-delivery progress hint (free over Rs 2,500)
- Checkout with delivery address + rider notes, and two payment methods: **Cash on Delivery** and **Card via Stripe Checkout**
- Live order tracking — a kitchen-ticket timeline (Placed → Confirmed → In the kitchen → On the way → Delivered) that auto-refreshes every 15s
- Order history, JWT auth (login/register)
- **Dish detail pages** (`/dish/:id`) — floating plate hero, quantity picker, tag chips, and a full **reviews UI**: interactive star picker, comment box, one review per user, live rating recompute
- **Promo codes at checkout** — apply a code, see the discount line update, auto-re-validates if the cart changes (try `ZAIQA10`, `WELCOME200`, `FEAST15` from the seeder)

**Admin (Back of House)**
- Dashboard: revenue, active orders, customers, and an animated 7-day revenue chart
- Order console: filter by status, expand for full ticket + address, one-select status updates (COD orders auto-mark paid on delivery)
- Menu manager: add/edit/delete dishes in a modal, availability toggle ("sold out today"), tags (spicy / veg / bestseller / new / chef-special), featured flag
- **Image uploads** — upload dish photos straight from your device (multer, served from `/uploads`, live circular preview), or paste a URL
- **Promo code manager** — create percent or flat-Rs codes with min order, max discount cap, usage limits, expiry dates, and an on/off toggle; usage counts tracked automatically

**Engineering**
- Prices **and promo discounts are recomputed server-side** on order creation (cart totals and discounts can't be tampered with); promo usage counts increment atomically
- Card payments include the discount via a one-off Stripe coupon, so the Stripe receipt matches the order exactly
- Stripe session verification on redirect marks orders paid + confirmed
- Role-guarded routes on both API (protect/admin middleware) and client (route guards)
- Responsive down to mobile, `prefers-reduced-motion` respected, keyboard-focus styles on all controls

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios, react-hot-toast, lucide-react |
| Backend | Node.js, Express, Mongoose (MongoDB), JWT, bcrypt, Stripe |

## Getting started

### 1. Backend
```bash
cd server
cp .env.example .env        # then edit values
npm install
npm run seed                # seeds categories, 20 dishes, demo users
npm run dev                 # http://localhost:5000
```

`.env` values:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zaiqa   # or your MongoDB Atlas URI
JWT_SECRET=some_long_random_string
STRIPE_SECRET_KEY=sk_test_...               # from dashboard.stripe.com (test mode)
CLIENT_URL=http://localhost:5173
DELIVERY_FEE=150
FREE_DELIVERY_ABOVE=2500
```

### 2. Frontend
```bash
cd client
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :5000)
```

### Demo accounts (from the seeder)
| Role | Email | Password |
|---|---|---|
| Admin | admin@zaiqa.com | admin123 |
| Customer | user@zaiqa.com | user123 |

### Testing card payments
Use Stripe test mode with card `4242 4242 4242 4242`, any future expiry, any CVC. After paying you're redirected back to the order page and the ticket flips to **Confirmed / Paid**.
> Note: Stripe support for PKR can vary by account; if your test account rejects `pkr`, change the `currency` in `server/routes/payment.js` to `usd` for testing.

## API overview

```
POST   /api/auth/register | /login        GET /api/auth/me
GET    /api/categories                    POST/PUT/DELETE (admin)
GET    /api/products?category=&search=&featured=&sort=
GET    /api/products/:id                  POST /api/products/:id/reviews
POST/PUT/DELETE /api/products (admin)
POST   /api/orders                        GET /api/orders/mine
GET    /api/orders (admin)                PUT /api/orders/:id/status (admin)
POST   /api/payment/create-checkout-session
GET    /api/payment/verify/:sessionId
POST   /api/promos/validate                { code, subtotal }
GET/POST/PUT/DELETE /api/promos (admin)
POST   /api/upload (admin, multipart "image") → { url }
GET    /api/admin/stats (admin)
```

## Ideas for extending further
- **Rider tracking on a map** — the status pipeline already emits `out_for_delivery`; plug in a maps SDK
- **Favorites / reorder-in-one-tap**, **email/SMS notifications** on status change
- Swap local disk uploads for **Cloudinary/S3** in `server/routes/upload.js` if you deploy to a host with ephemeral storage

## Project structure
```
zaiqa/
├─ server/            Express API
│  ├─ models/         User, Category, Product (with reviews), Order (with status history)
│  ├─ routes/         auth, categories, products, orders, payment (Stripe), promos, upload, admin stats
│  ├─ middleware/     JWT protect + admin guard
│  └─ seeder.js       demo data
└─ client/            React app
   ├─ src/components/ Navbar, CartDrawer, ProductCard, tracking timeline, etc.
   ├─ src/pages/      Home, Menu, Dish (detail + reviews), Checkout, Orders, OrderDetail, auth
   └─ src/pages/admin Dashboard, Orders console, Menu manager, Promo codes
```
