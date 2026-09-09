import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf7f2] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#f3e9dc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-current" />
              <h2 className="font-brand text-xl font-bold text-stone-900">
                Your Wishlist
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold">
                {wishlist.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#f3e9dc] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-3xl text-rose-400">
                  🤍
                </div>
                <h3 className="font-brand text-base font-bold text-stone-800">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Click the heart icon on any product to save your favorite luxury pieces.
                </p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-white rounded-xl border border-[#f3e9dc] flex gap-3 items-center shadow-2xs"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#faf7f2] flex items-center justify-center text-2xl shrink-0 border border-stone-100">
                    {product.emoji}
                  </div>

                  <div className="grow min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#b8860b] font-semibold mt-0.5">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#b8860b] hover:bg-[#996e08] text-white text-[11px] font-semibold flex items-center gap-1.5 transition"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
