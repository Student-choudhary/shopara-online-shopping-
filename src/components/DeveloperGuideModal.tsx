import React, { useState } from 'react';
import { X, Check, Copy, FolderCheck, Database, Terminal, Globe, Code2, AlertTriangle, Layers, ChevronRight, Receipt } from 'lucide-react';

interface DeveloperGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverStatus: any;
}

export const DeveloperGuideModal: React.FC<DeveloperGuideModalProps> = ({
  isOpen,
  onClose,
  serverStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'folders' | 'supabase' | 'checkouts' | 'server' | 'frontend' | 'deploy'>('checkouts');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#f3e9dc] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#faf7f2] p-5 sm:p-6 border-b border-[#f3e9dc] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b8860b] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-900/10">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-brand text-xl sm:text-2xl font-bold text-stone-900">
                  SHOPORA Supabase & Express Backend Guide
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Step-by-Step
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Exact commands, file structures, and code to fix backend duplicate folders and connect Supabase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#f3e9dc] transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 flex gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'folders', label: '1. Fix Duplicate Folders', icon: FolderCheck },
            { id: 'supabase', label: '2. Supabase Setup (2 Keys)', icon: Layers },
            { id: 'checkouts', label: '3. Checkout Table & Queries (SQL)', icon: Receipt },
            { id: 'server', label: '4. Server & npm run dev', icon: Terminal },
            { id: 'frontend', label: '5. Connect script.js to API', icon: Code2 },
            { id: 'deploy', label: '6. Free Deployment', icon: Globe },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-[#b8860b] text-[#b8860b] bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-stone-800 text-sm">
          {/* TAB 1: FIX DUPLICATE FOLDERS */}
          {activeTab === 'folders' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <div className="font-bold">What caused the "backend/backend" folder issue?</div>
                  <div>
                    When you extract a ZIP file (or run <code>mkdir backend</code> inside an existing backend directory), an extra nested folder is created. For example: <code>shopora/backend/backend/server.js</code> instead of <code>shopora/backend/server.js</code>.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-brand text-lg font-bold text-stone-900">
                  Target Clean Project Folder Structure
                </h3>
                <p className="text-xs text-stone-500 mb-3">
                  This is the exact clean structure your project should have on your computer:
                </p>
                <div className="bg-stone-900 text-stone-200 font-mono text-xs p-4 rounded-2xl overflow-x-auto">
                  <pre>{`shopora/
├── index.html            # Your frontend HTML
├── style.css             # Your cream & gold CSS
├── script.js             # Your frontend JS (fetches from backend)
└── backend/              # Clean backend root (NO second "backend" folder!)
    ├── .env              # Environment secrets (PORT, SUPABASE_URL, SUPABASE_ANON_KEY)
    ├── package.json      # Backend dependencies (express, cors, dotenv, @supabase/supabase-js)
    ├── server.js         # Main server entry file
    ├── models/
    │   └── Product.js    # Product data schema
    └── routes/
        └── productRoutes.js  # GET & POST endpoints`}</pre>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  Exact Commands to Fix It in Your Terminal:
                </h4>
                <p className="text-xs text-stone-600">
                  Open your terminal (or VS Code integrated terminal) at your main <strong>shopora</strong> root folder:
                </p>

                {/* Command 1 */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">Option A: If using Mac, Linux, or Git Bash</span>
                    <button
                      onClick={() => copyToClipboard(`cd backend/backend\nmv * ../\ncd ..\nrmdir backend`, 'cmd-bash')}
                      className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'cmd-bash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy commands</span>
                    </button>
                  </div>
                  <pre className="bg-stone-900 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`# 1. Move into the accidental inner backend folder:
cd backend/backend

# 2. Move all files one level up into the main backend folder:
mv * ../

# 3. Step back up to the main backend folder:
cd ..

# 4. Remove the empty duplicate folder:
rmdir backend`}
                  </pre>
                </div>

                {/* Command 2 */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">Option B: If using Windows (PowerShell)</span>
                    <button
                      onClick={() => copyToClipboard(`cd backend\\backend\nMove-Item * ..\\\ncd ..\nRemove-Item backend`, 'cmd-ps')}
                      className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'cmd-ps' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy commands</span>
                    </button>
                  </div>
                  <pre className="bg-stone-900 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`cd backend\\backend
Move-Item * ..\\
cd ..
Remove-Item backend`}
                  </pre>
                </div>

                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs">
                  ✓ <strong>Or simplest in VS Code:</strong> Open your project in VS Code, expand the folders in the left sidebar, select all files inside the inner <code>backend</code> folder, drag them up into the outer <code>backend</code> folder, then right-click and delete the empty inner folder!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPABASE SETUP */}
          {activeTab === 'supabase' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-brand text-base font-bold text-emerald-950">
                  You requested Supabase: 2 Environment Variables
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Supabase provides an instant PostgreSQL cloud database with an easy web dashboard and generous free tier. You only need:
                  <code className="mx-1 px-1.5 py-0.5 bg-emerald-200/60 rounded font-mono font-bold">SUPABASE_URL</code>
                  and
                  <code className="mx-1 px-1.5 py-0.5 bg-emerald-200/60 rounded font-mono font-bold">SUPABASE_ANON_KEY</code> (the "anon" key).
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="font-bold text-xs text-[#b8860b] uppercase tracking-wider">
                    Step 1: Create Free Project
                  </div>
                  <ol className="list-decimal list-inside text-xs text-stone-600 space-y-1.5 pl-1">
                    <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">supabase.com</a> and click <strong>"Start your project"</strong>.</li>
                    <li>Sign up with GitHub or Google (takes 30 seconds, no credit card required).</li>
                    <li>Click <strong>"New Project"</strong>, set name to <code>shopora-db</code>, and choose a database password.</li>
                  </ol>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="font-bold text-xs text-[#b8860b] uppercase tracking-wider">
                    Step 2: Copy the 2 Keys
                  </div>
                  <p className="text-xs text-stone-600">
                    In your Supabase dashboard, click <strong>Project Settings (gear icon)</strong> &gt; <strong>API</strong>. Copy:
                  </p>
                  <ul className="list-disc list-inside text-xs text-stone-700 pl-1 space-y-1 font-mono">
                    <li><strong>Project URL</strong> (e.g. <code>https://xyzcompany.supabase.co</code>)</li>
                    <li><strong>Project API Key (anon / public)</strong> (a long key starting with <code>eyJhbGci...</code>)</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#b8860b] uppercase tracking-wider">
                      Step 3: Paste into backend/.env
                    </span>
                    <button
                      onClick={() => copyToClipboard(`PORT=5000\nSUPABASE_URL=https://your-project.supabase.co\nSUPABASE_ANON_KEY=your-long-anon-key-here`, 'env-supabase')}
                      className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'env-supabase' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy .env snippet</span>
                    </button>
                  </div>
                  <pre className="bg-stone-900 text-stone-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...`}
                  </pre>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#b8860b] uppercase tracking-wider">
                      Step 4: Create 'products' Table in SQL Editor
                    </span>
                    <button
                      onClick={() => copyToClipboard(`create table products (
  id text primary key,
  name text not null,
  price numeric not null,
  original_price numeric,
  emoji text,
  category text not null,
  description text,
  rating numeric default 4.8,
  reviews_count integer default 10,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);`, 'sql-supabase')}
                      className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'sql-supabase' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy SQL</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-600">
                    In Supabase, click <strong>SQL Editor</strong> &gt; <strong>New query</strong>, paste this, and click <strong>Run</strong>:
                  </p>
                  <pre className="bg-stone-900 text-emerald-300 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`create table products (
  id text primary key,
  name text not null,
  price numeric not null,
  emoji text,
  category text not null,
  description text,
  rating numeric default 4.8,
  reviews_count integer default 10,
  in_stock boolean default true
);`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHECKOUT TABLE & SQL QUERIES */}
          {activeTab === 'checkouts' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-brand text-lg font-bold text-stone-900">
                    Supabase Checkout Table & SQL Queries
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    SQL Editor Ready
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Run these queries in your <strong>Supabase Dashboard &gt; SQL Editor &gt; New query</strong> to create the checkout table and inspect all completed orders.
                </p>
              </div>

              {/* 1. Create Checkouts Table */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    Query 1: Create 'checkouts' Table in Supabase
                  </span>
                  <button
                    onClick={() => copyToClipboard(`-- 1. Create checkouts / orders table in Supabase
create table checkouts (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  city text,
  postal_code text,
  payment_method text default 'cod',
  subtotal numeric not null,
  shipping numeric default 0,
  total_amount numeric not null,
  status text default 'confirmed',
  items jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable public / anonymous access for web client insert & read
alter table checkouts enable row level security;
create policy "Allow anonymous insert" on checkouts for insert with check (true);
create policy "Allow anonymous select" on checkouts for select using (true);`, 'sql-create-checkouts')}
                    className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'sql-create-checkouts' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Create Table SQL</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  This table stores customer details, delivery address, ordered items in a fast <code>JSONB</code> array, payment method, and total amount:
                </p>
                <pre className="bg-stone-900 text-emerald-300 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`-- 1. Create checkouts / orders table in Supabase
create table checkouts (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  city text,
  postal_code text,
  payment_method text default 'cod',
  subtotal numeric not null,
  shipping numeric default 0,
  total_amount numeric not null,
  status text default 'confirmed',
  items jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable public access for your web frontend/backend
alter table checkouts enable row level security;
create policy "Allow anonymous insert" on checkouts for insert with check (true);
create policy "Allow anonymous select" on checkouts for select using (true);`}
                </pre>
              </div>

              {/* 2. Queries to Show Checkouts Done */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    Query 2: Show All Checkouts Done (Newest First)
                  </span>
                  <button
                    onClick={() => copyToClipboard(`select * from checkouts order by created_at desc;`, 'sql-show-all')}
                    className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'sql-show-all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Query</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  Runs the standard query to list all completed checkouts in chronological order:
                </p>
                <pre className="bg-stone-900 text-amber-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`select * from checkouts order by created_at desc;`}
                </pre>
              </div>

              {/* 3. Formatted Business Report View */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    Query 3: Formatted Checkouts Report (With Currency & Date)
                  </span>
                  <button
                    onClick={() => copyToClipboard(`select 
  id as order_number,
  customer_name,
  customer_email,
  customer_phone,
  payment_method,
  concat('₹', total_amount) as total_paid,
  status,
  to_char(created_at, 'DD Mon YYYY, HH12:MI AM') as checkout_time,
  jsonb_array_length(items) as total_items
from checkouts
order by created_at desc;`, 'sql-formatted-report')}
                    className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'sql-formatted-report' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Formatted Query</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  Outputs clean human-readable columns with formatted timestamp and INR total:
                </p>
                <pre className="bg-stone-900 text-sky-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`select 
  id as order_number,
  customer_name,
  customer_email,
  customer_phone,
  payment_method,
  concat('₹', total_amount) as total_paid,
  status,
  to_char(created_at, 'DD Mon YYYY, HH12:MI AM') as checkout_time,
  jsonb_array_length(items) as total_items
from checkouts
order by created_at desc;`}
                </pre>
              </div>

              {/* 4. Sales & Checkouts Total Analytics */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                    Query 4: Revenue & Total Completed Checkouts
                  </span>
                  <button
                    onClick={() => copyToClipboard(`select 
  count(*) as total_completed_checkouts,
  concat('₹', coalesce(sum(total_amount), 0)) as total_sales_revenue,
  concat('₹', round(coalesce(avg(total_amount), 0), 2)) as avg_checkout_value
from checkouts;`, 'sql-stats')}
                    className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'sql-stats' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Stats Query</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-emerald-300 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`select 
  count(*) as total_completed_checkouts,
  concat('₹', coalesce(sum(total_amount), 0)) as total_sales_revenue,
  concat('₹', round(coalesce(avg(total_amount), 0), 2)) as avg_checkout_value
from checkouts;`}
                </pre>
              </div>

              {/* 5. Insert Sample Checkout */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#b8860b] uppercase tracking-wider">
                    Query 5: Insert Sample Test Checkout (Run Once)
                  </span>
                  <button
                    onClick={() => copyToClipboard(`insert into checkouts (
  id, customer_name, customer_email, customer_phone,
  shipping_address, city, postal_code, payment_method,
  subtotal, shipping, total_amount, status, items
) values (
  'SHOPORA-928410',
  'Priya Sharma',
  'priya.sharma@example.com',
  '+91 98765 43210',
  'Flat 402, Golden Palms, Bandra West',
  'Mumbai',
  '400050',
  'UPI',
  4498,
  0,
  4498,
  'confirmed',
  '[
    {"name": "Classic Urban Sneakers", "price": 1499, "quantity": 1, "emoji": "👟"},
    {"name": "Aura Pulse Smart Watch", "price": 2999, "quantity": 1, "emoji": "⌚"}
  ]'::jsonb
);`, 'sql-insert-sample')}
                    className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'sql-insert-sample' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Sample Insert</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  Run this to immediately populate your table with a test order, then run Query 2 or 3 to inspect it!
                </p>
                <pre className="bg-stone-900 text-stone-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`insert into checkouts (
  id, customer_name, customer_email, customer_phone,
  shipping_address, city, postal_code, payment_method,
  subtotal, shipping, total_amount, status, items
) values (
  'SHOPORA-928410',
  'Priya Sharma',
  'priya.sharma@example.com',
  '+91 98765 43210',
  'Flat 402, Golden Palms, Bandra West',
  'Mumbai',
  '400050',
  'UPI',
  4498,
  0,
  4498,
  'confirmed',
  '[
    {"name": "Classic Urban Sneakers", "price": 1499, "quantity": 1, "emoji": "👟"},
    {"name": "Aura Pulse Smart Watch", "price": 2999, "quantity": 1, "emoji": "⌚"}
  ]'::jsonb
);`}
                </pre>
              </div>

              {/* 6. Fetch in Node.js / Express */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-xs text-stone-900">
                  How to Fetch Checkouts in your Node.js / Express Backend:
                </div>
                <p className="text-xs text-stone-600">
                  In your <code>backend/server.js</code>, use the Supabase SDK:
                </p>
                <pre className="bg-stone-900 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`// Fetch all checkouts done
app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase
    .from('checkouts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SERVER & RUN DEV */}
          {activeTab === 'server' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-brand text-lg font-bold text-stone-900">
                  Running the Backend Server (npm run dev)
                </h3>
                <p className="text-xs text-stone-500">
                  How to install dependencies and start your backend with automatic reload on changes.
                </p>
              </div>

              {/* package.json snippet */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">backend/package.json</span>
                  <button
                    onClick={() => copyToClipboard(`{
  "name": "shopora-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "@supabase/supabase-js": "^2.45.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`, 'pkg-json')}
                    className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'pkg-json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy package.json</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-stone-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "name": "shopora-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "@supabase/supabase-js": "^2.45.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`}
                </pre>
              </div>

              {/* Exact terminal commands */}
              <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl space-y-3 font-mono text-xs">
                <div className="text-stone-400 font-sans font-bold">Exact Terminal Commands:</div>
                <div className="space-y-1">
                  <p className="text-stone-400"># 1. Open terminal inside your backend folder:</p>
                  <p className="text-emerald-400 font-bold">cd backend</p>
                </div>
                <div className="space-y-1">
                  <p className="text-stone-400"># 2. Install all required packages:</p>
                  <p className="text-emerald-400 font-bold">npm install</p>
                </div>
                <div className="space-y-1">
                  <p className="text-stone-400"># 3. Start development server:</p>
                  <p className="text-emerald-400 font-bold">npm run dev</p>
                </div>
              </div>

              {/* Expected Output */}
              <div className="p-4 bg-emerald-950 text-emerald-200 rounded-xl font-mono text-xs space-y-1">
                <div className="font-bold text-emerald-400 font-sans">Expected Terminal Output:</div>
                <div>[nodemon] 3.1.0</div>
                <div>[nodemon] starting \`node server.js\`</div>
                <div className="text-emerald-300 font-bold">✓ Server running on port 5000</div>
                <div className="text-emerald-300 font-bold">✓ Supabase Connected Successfully!</div>
              </div>
            </div>
          )}

          {/* TAB 4: FRONTEND SCRIPT.JS CONNECTION */}
          {activeTab === 'frontend' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-brand text-lg font-bold text-stone-900">
                  Connecting script.js to fetch from Backend
                </h3>
                <p className="text-xs text-stone-500">
                  Replace hardcoded HTML cards with dynamic products fetched from your database API!
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">script.js (Frontend Code)</span>
                  <button
                    onClick={() => copyToClipboard(`// Fetch products from backend API
async function loadProducts() {
  const container = document.getElementById('products-container');
  container.innerHTML = '<p class="loading">Loading SHOPORA collection...</p>';

  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();

    container.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = \`
        <div class="product-emoji">\${product.emoji || '🛍️'}</div>
        <span class="category-badge">\${product.category}</span>
        <h3>\${product.name}</h3>
        <p class="price">₹\${product.price}</p>
        <button class="add-to-cart-btn" onclick="addToCart('\${product._id || product.id}')">
          Add to Cart
        </button>
      \`;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    container.innerHTML = '<p class="error">Could not connect to backend server. Make sure backend is running on port 5000.</p>';
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadProducts);`, 'fe-script')}
                    className="text-xs text-[#b8860b] hover:text-[#996e08] flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'fe-script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy script.js</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-stone-200 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-72">
{`// Fetch products from backend API
async function loadProducts() {
  const container = document.getElementById('products-container');
  
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();

    container.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = \`
        <div class="product-emoji">\${product.emoji || '🛍️'}</div>
        <span class="category-badge">\${product.category}</span>
        <h3>\${product.name}</h3>
        <p class="price">₹\${product.price}</p>
        <button onclick="addToCart('\${product._id || product.id}')">
          Add to Cart
        </button>
      \`;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);`}
                </pre>
              </div>

              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs">
                ⚠️ <strong>CORS Note:</strong> Ensure your backend <code>server.js</code> has <code>const cors = require('cors'); app.use(cors());</code> so your browser doesn't block the request between frontend (port 5500 or Live Server) and backend (port 5000).
              </div>
            </div>
          )}

          {/* TAB 5: FREE DEPLOYMENT */}
          {activeTab === 'deploy' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-brand text-lg font-bold text-stone-900">
                  Deploying SHOPORA Live for Free
                </h3>
                <p className="text-xs text-stone-500">
                  Simple recommended platforms for hosting your frontend and backend at zero cost.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#b8860b]" />
                    <span>Frontend: Vercel / Netlify / GitHub Pages</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Host your <code>index.html</code>, <code>style.css</code>, and <code>script.js</code> on Vercel or GitHub Pages in 1 click.
                  </p>
                  <ul className="text-xs text-stone-500 list-disc list-inside space-y-1">
                    <li>Push code to GitHub repository</li>
                    <li>Connect repo on vercel.com</li>
                    <li>Instant live HTTPS URL (e.g. shopora.vercel.app)</li>
                  </ul>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#b8860b]" />
                    <span>Backend: Render.com / Railway</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Host your Node/Express backend on Render.com free web service.
                  </p>
                  <ul className="text-xs text-stone-500 list-disc list-inside space-y-1">
                    <li>Create "Web Service" on render.com</li>
                    <li>Root directory: <code>backend</code></li>
                    <li>Build command: <code>npm install</code></li>
                    <li>Start command: <code>node server.js</code></li>
                    <li>Add your <code>SUPABASE_URL</code> & <code>SUPABASE_ANON_KEY</code> in Environment variables!</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Server API endpoint: <code className="font-mono text-stone-800">/api/products</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
          >
            Got it, back to store
          </button>
        </div>
      </div>
    </div>
  );
};
