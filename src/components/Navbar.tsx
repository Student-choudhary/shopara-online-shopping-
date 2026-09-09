import React from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, Receipt } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenGuide?: () => void;
  onOpenOrders: () => void;
  onOpenAddProduct: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  apiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  searchTerm,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAddProduct,
  activeNav,
  setActiveNav,
  apiConnected,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'offers', label: 'Offers' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#f3e9dc] transition-all">
      {/* Top Notification Bar */}
      <div className="bg-[#292524] text-[#f3e9dc] text-xs py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
          <span>Special Launch Offer: Flat 20% OFF with code <strong>SHOPORA20</strong></span>
        </span>
        <span className="hidden sm:inline text-stone-500">|</span>
        <span className="hidden sm:inline text-stone-300">Free Express Delivery on orders above ₹999</span>
        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          API Live
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-[#f3e9dc] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveNav('home'); }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b8860b] to-[#996e08] flex items-center justify-center text-white shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform">
                <span className="font-brand font-bold text-xl tracking-wider">S</span>
              </div>
              <div>
                <span className="font-brand text-2xl sm:text-3xl font-bold tracking-widest text-stone-900">
                  SHOPORA
                </span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-[#b8860b] font-medium -mt-1">
                  Luxury Store
                </span>
              </div>
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => setActiveNav(link.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#b8860b] bg-[#f3e9dc]/70 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-[#f3e9dc]/40'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Search, Actions & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Search Input (Desktop) */}
            <div className="relative hidden lg:block w-52 xl:w-64">
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Search products, brands..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f3e9dc]/50 border border-stone-300/70 rounded-full focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40 focus:border-[#b8860b] placeholder-stone-400 text-stone-800 transition"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              id="search-toggle-mobile"
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-[#b8860b] hover:bg-[#f3e9dc] rounded-full transition"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Checkouts / Orders Button */}
            <button
              id="view-orders-btn"
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition shadow-xs"
              title="View Completed Checkouts"
            >
              <Receipt className="w-3.5 h-3.5 text-[#b8860b]" />
              <span className="hidden sm:inline">Checkouts</span>
            </button>

            {/* Add Product Button (Quick test API) */}
            <button
              id="add-product-modal-btn"
              onClick={onOpenAddProduct}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-full hover:bg-stone-100 transition"
            >
              <span>+ Add Item</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 text-stone-700 hover:text-[#b8860b] hover:bg-[#f3e9dc] rounded-full transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-drawer-toggle"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 pl-3 pr-4 py-2 bg-[#b8860b] hover:bg-[#996e08] text-white rounded-full text-xs font-semibold shadow-md shadow-amber-900/15 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
              <span className="w-5 h-5 bg-white text-[#996e08] rounded-full text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {searchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input
                id="search-input-mobile"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#f3e9dc]/60 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#f3e9dc] space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveNav(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg ${
                  activeNav === link.id
                    ? 'bg-[#f3e9dc] text-[#b8860b] font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenOrders();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold bg-stone-100 border border-stone-300 rounded-lg text-stone-800 flex items-center justify-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>View Completed Checkouts</span>
              </button>
              <button
                onClick={() => {
                  onOpenAddProduct();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-medium border border-stone-300 rounded-lg text-stone-700"
              >
                + Add Product (POST API)
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
