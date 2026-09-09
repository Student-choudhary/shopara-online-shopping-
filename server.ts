import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory product database (matches user's initial state & seeded catalog)
let products: any[] = [
  {
    id: 'prod-1',
    name: 'Classic Urban Sneakers',
    price: 1499,
    originalPrice: 2499,
    emoji: '👟',
    category: 'Fashion',
    description: 'Ultra-comfortable breathable running and streetwear sneakers with cushioned memory sole.',
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-2',
    name: 'Aura Pulse Smart Watch',
    price: 2999,
    originalPrice: 4999,
    emoji: '⌚',
    category: 'Electronics',
    description: 'High-definition AMOLED display with 24/7 heart rate monitor, SpO2 sensor, and 14-day battery.',
    rating: 4.9,
    reviewsCount: 289,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-3',
    name: 'Parisienne Vegan Handbag',
    price: 1899,
    originalPrice: 3299,
    emoji: '👜',
    category: 'Fashion',
    description: 'Handcrafted premium faux leather tote bag with gold-tone hardware and spacious compartments.',
    rating: 4.7,
    reviewsCount: 96,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-4',
    name: 'Studio Wireless Headphones',
    price: 2499,
    originalPrice: 3999,
    emoji: '🎧',
    category: 'Electronics',
    description: 'Active noise cancelling wireless over-ear headphones with deep bass and 40-hour playback.',
    rating: 4.8,
    reviewsCount: 310,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-5',
    name: 'Radiance Glow Facial Oil',
    price: 1199,
    originalPrice: 1699,
    emoji: '✨',
    category: 'Beauty',
    description: 'Infused with cold-pressed rosehip seed and 24k gold flakes for a luminous natural complexion.',
    rating: 4.9,
    reviewsCount: 84,
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-6',
    name: 'Royal Oud Eau De Parfum',
    price: 3499,
    originalPrice: 4999,
    emoji: '🧴',
    category: 'Beauty',
    description: 'A luxurious fragrance blend of smoky amber, Damascus rose, and rare royal agarwood.',
    rating: 4.9,
    reviewsCount: 118,
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-7',
    name: 'Artisan Ceramic Table Lamp',
    price: 2199,
    originalPrice: 2899,
    emoji: '🏺',
    category: 'Home & Living',
    description: 'Hand-thrown terracotta base with natural textured linen drum shade, soft warm lighting.',
    rating: 4.6,
    reviewsCount: 65,
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-8',
    name: 'Plush Velvet Cushion Trio',
    price: 1099,
    originalPrice: 1599,
    emoji: '🛋️',
    category: 'Home & Living',
    description: 'Set of 3 opulent golden-accented velvet cushion covers with invisible zipper closures.',
    rating: 4.7,
    reviewsCount: 52,
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-9',
    name: 'Retro Round UV Sunglasses',
    price: 1299,
    originalPrice: 1999,
    emoji: '🕶️',
    category: 'Fashion',
    description: 'Polarized scratch-resistant lenses with gold-plated stainless steel slim frames.',
    rating: 4.8,
    reviewsCount: 174,
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-10',
    name: 'BassPro Portable Bluetooth Speaker',
    price: 1799,
    originalPrice: 2699,
    emoji: '🔊',
    category: 'Electronics',
    description: 'Waterproof IPX7 outdoor speaker with 360-degree surround sound and rich acoustic bass.',
    rating: 4.7,
    reviewsCount: 203,
    inStock: true,
    featured: false,
  }
];

let orders: any[] = [
  {
    id: 'SHOPORA-928410',
    customer: {
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      address: 'Flat 402, Golden Palms, Bandra West',
      city: 'Mumbai',
      pincode: '400050',
      paymentMethod: 'upi',
    },
    items: [
      { productId: 'prod-1', name: 'Classic Urban Sneakers', price: 1499, quantity: 1, emoji: '👟' },
      { productId: 'prod-2', name: 'Aura Pulse Smart Watch', price: 2999, quantity: 1, emoji: '⌚' }
    ],
    subtotal: 4498,
    shipping: 0,
    totalAmount: 4498,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

// Optional Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('⚡ Supabase Client initialized with provided credentials.');
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health & Server Status
app.get('/api/status', async (req, res) => {
  let isSupabaseAlive = false;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
      isSupabaseAlive = !error;
    } catch {
      isSupabaseAlive = false;
    }
  }

  res.json({
    status: 'ok',
    database: supabase && isSupabaseAlive ? 'supabase' : 'in-memory-store',
    supabaseConfigured: !!(supabaseUrl && supabaseAnonKey),
    supabaseConnected: isSupabaseAlive,
    totalProducts: products.length,
    port: PORT,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. GET all products (with optional filtering & search)
app.get('/api/products', async (req, res) => {
  const { category, search, sort } = req.query;

  // Attempt to fetch from Supabase if configured & active
  if (supabase) {
    try {
      let query = supabase.from('products').select('*');
      if (category && category !== 'All') {
        query = query.eq('category', String(category));
      }
      if (search) {
        query = query.ilike('name', `%${String(search)}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local dataset:', err);
    }
  }

  // Local in-memory filter
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const term = String(search).toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  res.json(result);
});

// 3. GET product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 4. POST add new product (supports Express & Supabase persistence)
app.post('/api/products', async (req, res) => {
  const { name, price, emoji, category, description } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required fields' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: String(name),
    price: Number(price),
    originalPrice: Number(price) * 1.3,
    emoji: emoji || '🛍️',
    category: category || 'Fashion',
    description: description || 'Premium quality curated piece from SHOPORA.',
    rating: 5.0,
    reviewsCount: 1,
    inStock: true,
    featured: false,
  };

  // If Supabase is active, persist there too
  if (supabase) {
    try {
      await (supabase.from('products') as any).insert([newProduct]);
    } catch (err) {
      console.warn('Failed to insert product to Supabase:', err);
    }
  }

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// 5. POST checkout / place order
app.post('/api/orders', async (req, res) => {
  const { items, customer, subtotal, shipping, totalAmount } = req.body;

  if (!items || !items.length || !customer) {
    return res.status(400).json({ error: 'Order must contain items and customer details' });
  }

  const orderId = `SHOPORA-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder = {
    id: orderId,
    items,
    customer,
    subtotal: subtotal || items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
    shipping: shipping || 0,
    totalAmount: totalAmount || ((subtotal || 0) + (shipping || 0)),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  // If Supabase is connected, insert into 'checkouts' table
  if (supabase) {
    try {
      await (supabase.from('checkouts') as any).insert([
        {
          id: orderId,
          customer_name: customer.fullName || 'Anonymous Customer',
          customer_email: customer.email || '',
          customer_phone: customer.phone || '',
          shipping_address: customer.address || '',
          city: customer.city || '',
          postal_code: customer.pincode || customer.postalCode || '',
          payment_method: customer.paymentMethod || 'cod',
          subtotal: newOrder.subtotal,
          shipping: newOrder.shipping,
          total_amount: newOrder.totalAmount,
          status: newOrder.status,
          items: newOrder.items,
          created_at: newOrder.createdAt,
        },
      ]);
    } catch (err) {
      console.warn('Failed to insert checkout into Supabase table:', err);
    }
  }

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// 6. GET orders history (queries Supabase checkouts if available)
app.get('/api/orders', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('checkouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedOrders = data.map((row: any) => ({
          id: row.id,
          customer: {
            fullName: row.customer_name,
            email: row.customer_email,
            phone: row.customer_phone,
            address: row.shipping_address,
            city: row.city,
            pincode: row.postal_code,
            paymentMethod: row.payment_method,
          },
          items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
          subtotal: Number(row.subtotal),
          shipping: Number(row.shipping),
          totalAmount: Number(row.total_amount),
          status: row.status,
          createdAt: row.created_at,
        }));
        return res.json(formattedOrders);
      }
    } catch (err) {
      console.warn('Error reading from Supabase checkouts table, using local store:', err);
    }
  }

  res.json(orders);
});

// -------------------------------------------------------------
// VITE DEV SERVER OR PRODUCTION STATIC FILE SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ SHOPORA Backend Server running on http://localhost:${PORT}`);
  });
}

startServer();
