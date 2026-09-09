import React from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-white border-t border-[#f3e9dc] pt-14 pb-8 mt-16 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-stone-100">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#b8860b] text-white flex items-center justify-center font-brand font-bold text-base shadow-sm">
                S
              </div>
              <span className="font-brand text-2xl font-bold tracking-widest text-stone-900">
                SHOPORA
              </span>
            </div>
            <p className="text-stone-500 max-w-sm text-xs leading-relaxed">
              Your premier online shopping sanctuary for exquisite fashion, refined audio, luxury beauty, and curated home aesthetics.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-[#faf7f2] border border-[#f3e9dc] text-[11px] font-semibold text-stone-700">
                100% Genuine
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#faf7f2] border border-[#f3e9dc] text-[11px] font-semibold text-stone-700">
                Free Delivery &gt; ₹999
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-stone-900">
              Departments
            </h4>
            <ul className="space-y-2">
              {['Fashion', 'Electronics', 'Beauty', 'Home & Living'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-[#b8860b] transition"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-stone-900">
              Customer Experience
            </h4>
            <ul className="space-y-2 text-stone-500">
              <li>Track Order</li>
              <li>Returns & Exchange Policy</li>
              <li>Shipping & Delivery Information</li>
              <li>Authenticity Guarantee</li>
              <li>Contact Concierge: <span className="text-stone-800">support@shopora.in</span></li>
            </ul>
          </div>

          {/* Customer Assurance / Guarantee */}
          <div className="md:col-span-3 space-y-3 bg-[#faf7f2] p-4 rounded-2xl border border-[#f3e9dc]">
            <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-[#b8860b] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Authentic Luxury</span>
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Every item in our collection is curated and certified for quality. Enjoy complimentary insured express delivery and 14-day hassle-free returns.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-stone-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>100% Verified Merchant Guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
          <div>
            © 2025 SHOPORA Online Shopping. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
