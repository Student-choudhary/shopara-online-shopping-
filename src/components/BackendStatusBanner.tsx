import React from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { ServerStatus } from '../types';

interface BackendStatusBannerProps {
  status: ServerStatus | null;
  loading: boolean;
  onRefresh: () => void;
  onOpenGuide?: () => void;
  productsCount: number;
}

export const BackendStatusBanner: React.FC<BackendStatusBannerProps> = ({
  status,
  loading,
  onRefresh,
  productsCount,
}) => {
  return (
    <div className="bg-stone-900 text-stone-200 border-b border-stone-800 py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Server status badge */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-stone-300">
              API Status: <strong className="text-white">Active (Express)</strong>
            </span>
          </div>

          <span className="text-stone-700 hidden sm:inline">|</span>

          {/* Database indicator */}
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="text-stone-400">Database:</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
              {status?.database === 'supabase' ? 'Supabase Cloud DB' : 'In-Memory Store (Ready for Supabase)'}
            </span>
          </div>

          <span className="text-stone-700 hidden sm:inline">|</span>

          {/* Products loaded */}
          <div className="flex items-center gap-1 text-stone-400">
            <span>Catalog:</span>
            <span className="text-[#b8860b] font-bold font-mono">{productsCount} products</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1 text-stone-400 hover:text-white transition disabled:opacity-40"
            title="Reload from API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
