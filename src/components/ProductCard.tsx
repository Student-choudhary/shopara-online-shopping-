import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-[#f3e9dc] p-5 hover:border-[#b8860b]/40 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 flex flex-col justify-between">
      {/* Top badges & Wishlist */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#faf7f2] text-stone-600 border border-[#f3e9dc]">
          {product.category}
        </span>

        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={() => onToggleWishlist(product)}
          className={`p-2 rounded-full transition-colors ${
            isWishlisted
              ? 'text-rose-600 bg-rose-50'
              : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image / Emoji Display */}
      <div className="relative aspect-square rounded-xl bg-gradient-to-b from-[#faf7f2] to-[#f3e9dc]/60 flex items-center justify-center p-6 mb-4 group-hover:scale-[1.02] transition-transform duration-300">
        <span className="text-6xl sm:text-7xl select-none filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
          {product.emoji}
        </span>

        {discount > 0 && (
          <span className="absolute bottom-3 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-2 mb-4 grow">
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold ml-1 text-stone-800">{product.rating}</span>
          </div>
          <span className="text-stone-400">({product.reviewsCount})</span>
        </div>

        <h3 className="font-brand text-lg font-bold text-stone-900 group-hover:text-[#b8860b] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Price & Action Button */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="text-[10px] text-stone-400">Inclusive of all taxes</div>
        </div>

        <button
          id={`add-to-cart-btn-${product.id}`}
          onClick={handleAddToCart}
          disabled={justAdded}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#b8860b] hover:bg-[#996e08] text-white shadow-amber-900/10'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
