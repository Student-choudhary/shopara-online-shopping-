import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExploreCategories: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExploreCategories }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f3e9dc]/60 via-[#faf7f2] to-[#faf7f2] border-b border-[#f3e9dc]/60 py-12 lg:py-16">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#b8860b]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3e9dc] border border-[#b8860b]/30 text-[#b8860b] text-xs font-semibold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Curated Premium Collection 2025</span>
            </div>

            <h1 className="font-brand text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
              Elegance in Every <span className="text-[#b8860b]">Detail.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover handpicked luxury essentials across Fashion, Audio, Beauty, and Contemporary Living. Crafted for individuals who appreciate refined quality.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={onShopNow}
                className="px-7 py-3.5 rounded-full bg-[#b8860b] hover:bg-[#996e08] text-white font-semibold text-sm shadow-lg shadow-amber-900/20 flex items-center gap-2 transition-all hover:translate-x-0.5 active:scale-95"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-categories-btn"
                onClick={onExploreCategories}
                className="px-7 py-3.5 rounded-full bg-white hover:bg-[#f3e9dc]/60 text-stone-800 font-semibold text-sm border border-stone-300 shadow-sm transition"
              >
                Explore Categories
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#b8860b] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-stone-900">Free Express</div>
                  <div className="text-[11px] text-stone-500">On ₹999+ orders</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#b8860b] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-stone-900">100% Genuine</div>
                  <div className="text-[11px] text-stone-500">Verified quality</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-[#b8860b] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-stone-900">7-Day Return</div>
                  <div className="text-[11px] text-stone-500">Hassle-free policy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Showcase Banner / Floating Hero Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 border border-[#f3e9dc]">
              <div className="absolute -top-3 right-8 bg-[#b8860b] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Editor's Choice
              </div>

              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-[#faf7f2] to-[#f3e9dc] text-6xl shadow-inner border border-stone-200/50 mb-4 animate-bounce duration-1000">
                  👟
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#b8860b] mb-1">
                  Trending Now • Fashion
                </div>
                <h3 className="font-brand text-2xl font-bold text-stone-900">
                  Classic Urban Sneakers
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Breathable ergonomic cushion design tailored for modern street style.
                </p>

                <div className="flex items-center justify-center gap-3 mt-4">
                  <span className="font-mono text-2xl font-bold text-stone-900">₹1,499</span>
                  <span className="font-mono text-sm text-stone-400 line-through">₹2,499</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    40% OFF
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  ★ 4.8 <span className="text-stone-400 font-normal">(142 reviews)</span>
                </span>
                <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock & Ready to Ship
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
