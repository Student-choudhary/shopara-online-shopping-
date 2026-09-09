import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AddProductModal } from './components/AddProductModal';
import { DeveloperGuideModal } from './components/DeveloperGuideModal';
import { OrdersModal } from './components/OrdersModal';
import { BackendStatusBanner } from './components/BackendStatusBanner';
import { Footer } from './components/Footer';
import { Product, CartItem, Order, ServerStatus } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Filter, SlidersHorizontal, Sparkles, RefreshCw, ShoppingBag, ArrowUpDown } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filtering and Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [activeNav, setActiveNav] = useState<string>('home');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('shopora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Save wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('shopora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [wishlist]);

  // Fetch server status & products on mount
  const fetchProductsAndStatus = async () => {
    setLoading(true);
    try {
      // 1. Check API health
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        const sData = await statusRes.json();
        setServerStatus(sData);
      }

      // 2. Fetch products
      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const pData = await productsRes.json();
        if (Array.isArray(pData) && pData.length > 0) {
          setProducts(pData);
        }
      }
    } catch (err) {
      console.warn('API fetch warning, using local initial products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndStatus();
  }, []);

  // Cart Actions
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // After order completion
  const handleOrderSuccess = (order: Order) => {
    setCart([]);
  };

  // Add new product callback
  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Nav-specific filter
    if (activeNav === 'new-arrivals') {
      list = list.slice(0, 6);
    } else if (activeNav === 'offers') {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchTerm, sortBy, activeNav]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Fashion: 0,
      Electronics: 0,
      Beauty: 0,
      'Home & Living': 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [products]);

  // Cart total & count
  const cartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-800">
      {/* Real-time Express & Database Backend Status Banner */}
      <BackendStatusBanner
        status={serverStatus}
        loading={loading}
        onRefresh={fetchProductsAndStatus}
        productsCount={products.length}
      />

      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        apiConnected={!!serverStatus}
      />

      {/* Hero Section (Visible on Home or Shop tab) */}
      {(activeNav === 'home' || activeNav === 'shop') && !searchTerm && (
        <Hero
          onShopNow={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreCategories={() => {
            const el = document.getElementById('categories-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Category Filter Pills */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeNav !== 'shop' && activeNav !== 'categories') {
            setActiveNav('shop');
          }
        }}
        categoryCounts={categoryCounts}
      />

      {/* Main Catalog & Products Section */}
      <main id="catalog-section" className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Section Header & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f3e9dc]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-brand text-2xl font-bold text-stone-900">
                {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f3e9dc] text-[#b8860b] font-bold">
                {filteredProducts.length} items
              </span>
            </div>
            {searchTerm && (
              <p className="text-xs text-stone-500 mt-1">
                Showing search results for: <span className="font-semibold text-stone-800">"{searchTerm}"</span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-rose-600 underline text-xs"
                >
                  Clear search
                </button>
              </p>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span>Sort by:</span>
            </div>
            <select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#b8860b]"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#f3e9dc] flex items-center justify-center text-4xl">
              🔍
            </div>
            <h3 className="font-brand text-xl font-bold text-stone-800">
              No products found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find any products matching your search. Try resetting filters or adding a new item.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#b8860b] text-white text-xs font-semibold hover:bg-[#996e08] transition"
              >
                + Add New Product
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

        {/* Value Proposition Callout */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-[#f3e9dc]/60 via-[#faf7f2] to-[#f3e9dc]/40 border border-[#f3e9dc] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
              Why Choose SHOPORA
            </span>
            <h3 className="font-brand text-2xl font-bold text-stone-900">
              Luxury Craftsmanship, Guaranteed Satisfaction
            </h3>
            <p className="text-xs text-stone-600 max-w-xl">
              Every item in our collection is handpicked by luxury curators. We offer express door-step delivery, 7-day no-questions-asked returns, and 24/7 client care.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-[#b8860b] hover:bg-[#996e08] text-white text-xs font-semibold shadow-md shadow-amber-900/10 transition"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
        onViewOrders={() => setIsOrdersOpen(true)}
      />

      {/* Add Product Modal (Test POST API) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Completed Checkouts Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onOpenGuide={() => {
          setIsOrdersOpen(false);
          setIsGuideOpen(true);
        }}
      />

      {/* Developer & Beginner Guide Modal */}
      <DeveloperGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        serverStatus={serverStatus}
      />
    </div>
  );
}
