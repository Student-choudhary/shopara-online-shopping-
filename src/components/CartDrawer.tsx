import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = discountApplied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SHOPORA20') {
      setDiscountApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try "SHOPORA20" for 20% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf7f2] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#f3e9dc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#b8860b]" />
              <h2 className="font-brand text-xl font-bold text-stone-900">
                Your Shopping Cart
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#f3e9dc] text-[#b8860b] font-bold">
                {cart.reduce((count, item) => count + item.quantity, 0)}
              </span>
            </div>

            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#f3e9dc] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#f3e9dc] flex items-center justify-center text-4xl">
                  🛍️
                </div>
                <div>
                  <h3 className="font-brand text-lg font-bold text-stone-800">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Explore our curated collection and add luxury pieces to your cart.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#b8860b] text-white text-xs font-semibold shadow-sm hover:bg-[#996e08] transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                  <span>Selected items ({cart.length})</span>
                  <button
                    onClick={onClearCart}
                    className="text-stone-400 hover:text-rose-600 transition"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-white rounded-xl border border-[#f3e9dc] flex gap-3 items-center shadow-2xs"
                  >
                    {/* Emoji Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-[#faf7f2] flex items-center justify-center text-2xl shrink-0 border border-stone-100">
                      {item.product.emoji}
                    </div>

                    {/* Info */}
                    <div className="grow min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {item.product.category}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-[#faf7f2] border border-[#f3e9dc] rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-stone-600 hover:text-stone-900 transition"
                            title="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs px-2 font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 text-stone-600 hover:text-stone-900 transition"
                            title="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Box */}
                <form onSubmit={handleApplyPromo} className="mt-4 p-3 bg-white rounded-xl border border-[#f3e9dc] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <Tag className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>Have a Coupon Code?</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SHOPORA20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="grow px-3 py-1.5 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b8860b] uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {discountApplied && (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      ✓ 20% discount coupon applied successfully!
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-600">
                      {promoError}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer Order Calculation */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#f3e9dc] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount (20%)</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <div className="flex items-center gap-1">
                    <span>Shipping</span>
                    {shipping === 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        FREE
                      </span>
                    )}
                  </div>
                  <span className="font-mono">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-[#b8860b]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                id="checkout-proceed-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-full bg-[#b8860b] hover:bg-[#996e08] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/15 transition active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted 256-Bit SSL Checkout • 100% Secure</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
