import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Fashion' | 'Electronics' | 'Beauty' | 'Home & Living'>('Fashion');
  const [emoji, setEmoji] = useState('🛍️');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setErrorMsg('Please enter both product name and price.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          category,
          emoji,
          description: description.trim() || 'Curated luxury lifestyle collection product.',
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      const created = await res.json();
      onProductAdded(created);
      onClose();
      setName('');
      setPrice('');
      setDescription('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleEmojis = ['👟', '⌚', '👜', '🎧', '✨', '🏺', '🛋️', '🧴', '🕶️', '🔊', '💍', '👗'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#f3e9dc] overflow-hidden">
        {/* Header */}
        <div className="bg-[#faf7f2] p-5 border-b border-[#f3e9dc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#b8860b] text-white flex items-center justify-center text-sm font-bold">
              +
            </div>
            <div>
              <h3 className="font-brand text-lg font-bold text-stone-900">
                Add New Product
              </h3>
              <p className="text-[11px] text-stone-500">
                Tests POST /api/products backend endpoint
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Leather Oxford Shoes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b8860b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="1499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b8860b] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b8860b]"
              >
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Beauty">Beauty</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Emoji Icon
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-[#faf7f2] border border-stone-200 rounded-lg">
              {sampleEmojis.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-lg transition ${
                    emoji === e ? 'bg-[#b8860b] text-white shadow-xs' : 'hover:bg-white'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of product features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b8860b]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-[#b8860b] hover:bg-[#996e08] text-white font-semibold text-xs transition shadow-md flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to Database...' : 'Save Product'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
