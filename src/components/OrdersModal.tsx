import React, { useState, useEffect } from 'react';
import { X, Receipt, ShoppingBag, CheckCircle, Clock, Search, ExternalLink, Copy, Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Order } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  onOpenGuide,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [showSqlDrawer, setShowSqlDrawer] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copySql = (sql: string, id: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedQuery(id);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.customer.fullName.toLowerCase().includes(q) ||
      order.customer.email.toLowerCase().includes(q) ||
      order.customer.phone.includes(q)
    );
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#f3e9dc] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#faf7f2] p-5 sm:p-6 border-b border-[#f3e9dc] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b8860b] text-white flex items-center justify-center shadow-md shadow-amber-900/10">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-brand text-xl sm:text-2xl font-bold text-stone-900">
                  Completed Checkouts
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {orders.length} Placed
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Live orders received by the Express API and Supabase <code>checkouts</code> table
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-[#f3e9dc] rounded-full transition"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#f3e9dc] transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Row & SQL Toggle */}
        <div className="bg-stone-50 px-5 sm:px-6 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-stone-500">Total Checkouts: </span>
              <span className="font-bold text-stone-800">{orders.length}</span>
            </div>
            <div className="h-3 w-px bg-stone-300" />
            <div>
              <span className="text-stone-500">Gross Sales: </span>
              <span className="font-bold text-[#b8860b]">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => setShowSqlDrawer(!showSqlDrawer)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#b8860b]/40 text-[#b8860b] hover:bg-[#faf7f2] rounded-full font-semibold transition"
          >
            <span>Supabase SQL Queries</span>
            {showSqlDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* SQL Drawer */}
        {showSqlDrawer && (
          <div className="p-4 sm:p-5 bg-stone-900 text-stone-200 border-b border-stone-800 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-emerald-400 font-bold">
                -- Run in Supabase SQL Editor to see these exact checkouts:
              </span>
              <button
                onClick={() => copySql(`select * from checkouts order by created_at desc;`, 'sql-drawer-select')}
                className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1"
              >
                {copiedQuery === 'sql-drawer-select' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>Copy Query</span>
              </button>
            </div>
            <pre className="bg-black/50 p-2.5 rounded font-mono text-[11px] text-amber-200 overflow-x-auto">
{`select id, customer_name, concat('₹', total_amount) as total, payment_method, status, created_at
from checkouts order by created_at desc;`}
            </pre>
            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-400 text-[11px]">
                Need the table creation script or revenue aggregations?
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenGuide();
                }}
                className="text-amber-400 hover:text-amber-300 underline font-semibold"
              >
                Open Full Supabase Guide &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Search filter */}
        <div className="p-4 sm:px-6 border-b border-stone-100 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer name, order ID, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#b8860b]"
            />
          </div>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              Loading completed checkouts...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-stone-600 text-sm font-medium">No checkouts match your search</p>
              <p className="text-stone-400 text-xs">Complete a checkout in the shop to see it appear here!</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#b8860b]/50 transition shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {order.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    <span className="font-bold text-sm text-[#b8860b]">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                  <div>
                    <span className="font-semibold text-stone-800">{order.customer.fullName}</span>
                    <div className="text-stone-500">{order.customer.email} • {order.customer.phone}</div>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Shipping To:</span>
                    <span className="text-stone-700 truncate block">
                      {order.customer.address}, {order.customer.city} {order.customer.pincode}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-stone-500">
                      Payment: {order.customer.paymentMethod?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Purchased Items ({order.items?.length || 0}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item: any, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-stone-100 rounded-lg text-stone-800"
                      >
                        <span>{item.emoji || '🛍️'}</span>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-stone-400">x{item.quantity}</span>
                        <span className="font-semibold text-[#b8860b]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            Records update instantly on checkout completion.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
