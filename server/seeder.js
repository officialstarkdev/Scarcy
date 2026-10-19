import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import PromoCode from './models/PromoCode.js';

dotenv.config();
await connectDB();

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const categories = [
  { name: 'Desi Food', slug: 'desi-food', tagline: 'Handi, karahi & slow-cooked classics', image: img('photo-1631452180519-c014fe946bc7'), sortOrder: 1 },
  { name: 'BBQ & Grill', slug: 'bbq-grill', tagline: 'Charcoal-kissed, straight off the skewer', image: img('photo-1555939594-58d7cb561ad1'), sortOrder: 2 },
  { name: 'Fast Food', slug: 'fast-food', tagline: 'Burgers, wraps & loaded fries', image: img('photo-1568901346375-23c9450c58cd'), sortOrder: 3 },
  { name: 'Chinese', slug: 'chinese', tagline: 'Wok-fired favourites', image: img('photo-1585032226651-759b368d7246'), sortOrder: 4 },
  { name: 'Desserts', slug: 'desserts', tagline: 'A sweet full stop', image: img('photo-1551024506-0bccd828d307'), sortOrder: 5 },
  { name: 'Beverages', slug: 'beverages', tagline: 'Lassi, chai & coolers', image: img('photo-1544145945-f90425340c7e'), sortOrder: 6 },
];

const productsFor = (cat) => ({
  'desi-food': [
    { name: 'Chicken Karahi', description: 'Half-kg chicken tossed in a fiery tomato masala, finished with ginger and green chillies. Served with naan.', price: 1450, image: img('photo-1631452180519-c014fe946bc7'), prepTime: 35, serves: 2, tags: ['spicy', 'bestseller'], isFeatured: true, rating: 4.8, numReviews: 124 },
    { name: 'Mutton Handi', description: 'Slow-cooked mutton in a creamy degh-style gravy, sealed under a blistered naan lid.', price: 1890, image: img('photo-1545247181-516773cae754'), prepTime: 40, serves: 2, tags: ['chef-special'], isFeatured: true, rating: 4.9, numReviews: 86 },
    { name: 'Daal Makhani', description: 'Black lentils simmered overnight with butter and cream. Comfort in a copper pot.', price: 650, image: img('photo-1546833999-b9f581a1996d'), prepTime: 20, serves: 1, tags: ['veg'], rating: 4.6, numReviews: 58 },
    { name: 'Chicken Biryani', description: 'Layered basmati, saffron, and marinated chicken — sealed and steamed the Lahori way.', price: 890, image: img('photo-1563379091339-03b21ab4a4f8'), prepTime: 30, serves: 1, tags: ['spicy', 'bestseller'], isFeatured: true, rating: 4.7, numReviews: 203 },
  ],
  'bbq-grill': [
    { name: 'Seekh Kebab Platter', description: 'Eight hand-pressed beef seekh kebabs over live coals, with mint chutney and kachumber.', price: 1250, image: img('photo-1555939594-58d7cb561ad1'), prepTime: 25, serves: 2, tags: ['spicy', 'bestseller'], isFeatured: true, rating: 4.8, numReviews: 141 },
    { name: 'Chicken Malai Boti', description: 'Cream-and-cheese marinated chicken, grilled soft with a whisper of char.', price: 1100, image: img('photo-1603360946369-dc9bb6258143'), prepTime: 25, serves: 2, tags: ['chef-special'], rating: 4.7, numReviews: 92 },
    { name: 'Grilled Chops', description: 'Mutton chops in a smoked spice rub, flame-finished and glazed.', price: 1990, image: img('photo-1544025162-d76694265947'), prepTime: 30, serves: 2, tags: [], rating: 4.6, numReviews: 44 },
  ],
  'fast-food': [
    { name: 'Smoked Beef Burger', description: 'Double-smashed patties, cheddar, house sauce, brioche. Unapologetically messy.', price: 950, image: img('photo-1568901346375-23c9450c58cd'), prepTime: 15, serves: 1, tags: ['bestseller'], isFeatured: true, rating: 4.7, numReviews: 178 },
    { name: 'Zinger Wrap', description: 'Crunchy fried fillet, garlic mayo, and pickled onions in a toasted tortilla.', price: 620, image: img('photo-1626700051175-6818013e1d4f'), prepTime: 12, serves: 1, tags: ['spicy'], rating: 4.4, numReviews: 96 },
    { name: 'Loaded Fries', description: 'Crisp fries buried under cheese sauce, jalapeños and smoked chicken.', price: 540, image: img('photo-1573080496219-bb080dd4f877'), prepTime: 10, serves: 1, tags: ['new'], rating: 4.5, numReviews: 67 },
    { name: 'Crispy Chicken Bucket', description: 'Nine pieces of double-dredged fried chicken with two dips.', price: 1650, image: img('photo-1626645738196-c2a7c87a8f58'), prepTime: 18, serves: 3, tags: [], rating: 4.5, numReviews: 71 },
  ],
  chinese: [
    { name: 'Chicken Chow Mein', description: 'Wok-tossed noodles with julienned vegetables and soy-sesame glaze.', price: 780, image: img('photo-1585032226651-759b368d7246'), prepTime: 18, serves: 1, tags: [], rating: 4.4, numReviews: 63 },
    { name: 'Dynamite Prawns', description: 'Crisp prawns in a creamy chilli drizzle over shredded lettuce.', price: 1350, image: img('photo-1559847844-5315695dadae'), prepTime: 20, serves: 1, tags: ['spicy', 'new'], isFeatured: true, rating: 4.6, numReviews: 39 },
    { name: 'Vegetable Fried Rice', description: 'Smoky wok-fried rice with egg, spring onion and seasonal vegetables.', price: 590, image: img('photo-1512058564366-18510be2db19'), prepTime: 15, serves: 1, tags: ['veg'], rating: 4.3, numReviews: 51 },
  ],
  desserts: [
    { name: 'Gulab Jamun (4 pcs)', description: 'Warm, rose-scented dumplings soaked in cardamom syrup.', price: 380, image: img('photo-1601303516361-9e7dd7d290e3'), prepTime: 8, serves: 2, tags: ['bestseller'], rating: 4.8, numReviews: 112 },
    { name: 'Molten Lava Cake', description: 'Dark chocolate cake with a flowing centre, served with vanilla ice cream.', price: 560, image: img('photo-1551024506-0bccd828d307'), prepTime: 12, serves: 1, tags: ['chef-special'], isFeatured: true, rating: 4.7, numReviews: 88 },
    { name: 'Kulfi Falooda', description: 'Traditional pistachio kulfi over vermicelli, basil seeds and rose syrup.', price: 450, image: img('photo-1488900128323-21503983a07e'), prepTime: 8, serves: 1, tags: [], rating: 4.6, numReviews: 54 },
  ],
  beverages: [
    { name: 'Lahori Lassi', description: 'Thick sweet lassi churned with malai, served in a clay glass.', price: 320, image: img('photo-1553530666-ba11a7da3888'), prepTime: 5, serves: 1, tags: ['bestseller'], rating: 4.7, numReviews: 97 },
    { name: 'Doodh Patti Chai', description: 'Slow-brewed milk tea, the way the old city makes it.', price: 180, image: img('photo-1544145945-f90425340c7e'), prepTime: 6, serves: 1, tags: [], rating: 4.5, numReviews: 76 },
    { name: 'Mint Margarita', description: 'Crushed ice, fresh mint and lime — sharp, cold, endless refills of joy.', price: 350, image: img('photo-1513558161293-cdaf765ed2fd'), prepTime: 5, serves: 1, tags: ['veg'], rating: 4.4, numReviews: 42 },
  ],
});

const run = async () => {
  try {
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Order.deleteMany(), PromoCode.deleteMany()]);

    await User.create([
      { name: 'Zaiqa Admin', email: 'admin@zaiqa.com', password: 'admin123', isAdmin: true, phone: '0300-0000000' },
      { name: 'Name', email: 'user@zaiqa.com', password: 'user123', phone: '0301-1111111' },
    ]);

    const cats = await Category.insertMany(categories);
    const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c._id]));

    const all = [];
    for (const [slug, items] of Object.entries(productsFor())) {
      items.forEach((p) => all.push({ ...p, category: bySlug[slug] }));
    }
    await Product.insertMany(all);

    await PromoCode.insertMany([
      { code: 'ZAIQA10', type: 'percent', value: 10, maxDiscount: 300, minOrder: 0 },
      { code: 'WELCOME200', type: 'flat', value: 200, minOrder: 1000 },
      { code: 'FEAST15', type: 'percent', value: 15, maxDiscount: 750, minOrder: 3000 },
    ]);

    console.log(`Seeded ${cats.length} categories, ${all.length} dishes, 2 users, 3 promo codes`);
    console.log('Promos → ZAIQA10 (10% up to Rs300) · WELCOME200 (Rs200 off Rs1000+) · FEAST15 (15% up to Rs750 on Rs3000+)');
    console.log('Admin  → admin@zaiqa.com / admin123');
    console.log('User   → user@zaiqa.com  / user123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
