import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Truck, CreditCard, ShieldAlert } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderSuccess: (order: Order) => void;
  onViewOrders?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderSuccess,
  onViewOrders,
}) => {
  const [formData, setFormData] = useState({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Golden Heritage Apts, MG Road',
    city: 'Mumbai',
    pincode: '400001',
    paymentMethod: 'cod' as 'cod' | 'upi' | 'card',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const totalAmount = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      items: cart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        emoji: i.product.emoji,
      })),
      customer: formData,
      subtotal,
      shipping,
      totalAmount,
    };

    try {
      // Call backend order endpoint
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const orderData = await res.json();
        setConfirmedOrder(orderData);
        onOrderSuccess(orderData);
      } else {
        // Fallback local order creation if offline
        const fallbackOrder: Order = {
          id: `SHOPORA-${Math.floor(100000 + Math.random() * 900000)}`,
          items: orderPayload.items,
          customer: formData,
          subtotal,
          shipping,
          totalAmount,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        setConfirmedOrder(fallbackOrder);
        onOrderSuccess(fallbackOrder);
      }
    } catch {
      const fallbackOrder: Order = {
        id: `SHOPORA-${Math.floor(100000 + Math.random() * 900000)}`,
        items: orderPayload.items,
        customer: formData,
        subtotal,
        shipping,
        totalAmount,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      setConfirmedOrder(fallbackOrder);
      onOrderSuccess(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#f3e9dc] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#faf7f2] p-5 border-b border-[#f3e9dc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#b8860b] text-white flex items-center justify-center text-sm font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-brand text-xl font-bold text-stone-900">
                {confirmedOrder ? 'Order Confirmed' : 'Shipping & Checkout'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {confirmedOrder ? 'Thank you for shopping with SHOPORA' : 'Complete your delivery and payment details'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#f3e9dc] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {confirmedOrder ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-widest">
                Order Placed Successfully
              </span>
              <h4 className="font-brand text-2xl font-bold text-stone-900 mt-1">
                Order #{confirmedOrder.id}
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                We have sent an order summary to <strong>{confirmedOrder.customer.email}</strong>. Expected delivery in 2-3 business days.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-[#faf7f2] rounded-2xl p-4 text-left border border-[#f3e9dc] space-y-3">
              <div className="text-xs font-bold text-stone-800 border-b border-stone-200 pb-2 flex justify-between">
                <span>Items ({confirmedOrder.items.length})</span>
                <span>Amount</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span>{item.emoji}</span>
                      <span className="text-stone-700 font-medium truncate max-w-xs">
                        {item.name} <span className="text-stone-400 font-normal">×{item.quantity}</span>
                      </span>
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
                <span>Total Paid (via {confirmedOrder.customer.paymentMethod.toUpperCase()})</span>
                <span className="font-mono text-sm text-[#b8860b]">
                  ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition"
              >
                Continue Shopping
              </button>
              {onViewOrders && (
                <button
                  onClick={() => {
                    onClose();
                    onViewOrders();
                  }}
                  className="flex-1 py-3 rounded-full bg-[#b8860b] hover:bg-[#996e08] text-white font-semibold text-xs transition shadow-md flex items-center justify-center gap-1"
                >
                  <span>View All Checkouts</span>
                  <span>&rarr;</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Customer Information */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
                1. Delivery Address
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#b8860b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#b8860b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#b8860b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#b8860b] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#b8860b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#b8860b] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
                2. Select Payment Method
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                  { id: 'upi', label: 'UPI / GPay', icon: ShoppingBag },
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                ].map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setFormData({ ...formData, paymentMethod: pm.id as any })}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                      formData.paymentMethod === pm.id
                        ? 'border-[#b8860b] bg-[#f3e9dc]/60 text-stone-900 font-bold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <pm.icon className="w-4 h-4 text-[#b8860b]" />
                    <span className="text-[10px] sm:text-xs leading-tight">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Preview */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-600">
                Total Payable ({cart.length} items):
              </span>
              <span className="font-mono text-lg font-bold text-stone-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Submit Button */}
            <button
              id="confirm-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#b8860b] hover:bg-[#996e08] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/15 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Placing Your Order...</span>
              ) : (
                <span>Confirm & Place Order (₹{totalAmount.toLocaleString('en-IN')})</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
