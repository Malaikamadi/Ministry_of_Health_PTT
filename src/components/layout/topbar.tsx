'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth, getRoleLabel, getRoleBadgeClass } from '@/lib/auth-context';
import { getInitials } from '@/lib/utils';

export function Topbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = () => {
    signOut();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 border-b px-6 py-3 bg-white/80 backdrop-blur-md"
      style={{ borderColor: '#E2E8F0' }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities, units, reports..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border bg-slate-50 outline-none transition-all focus:bg-white"
            style={{ borderColor: '#E2E8F0' }}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl transition-colors hover:bg-slate-50" aria-label="Notifications">
          <Bell className="w-5 h-5" style={{ color: '#64748B' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#C62828' }} />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl transition-colors hover:bg-slate-50"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}
            >
              {getInitials(user.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{user.name}</p>
              <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{getRoleLabel(user.role)}</p>
            </div>
            <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: '#94A3B8' }} />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-white shadow-lg z-50 py-1 animate-fade-in"
                style={{ borderColor: '#E2E8F0' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                  <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{user.name}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{user.email}</p>
                  <span className={`mt-1.5 inline-block ${getRoleBadgeClass(user.role)} badge text-[10px]`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left"
                  style={{ color: '#475569' }}
                >
                  <User className="w-4 h-4" style={{ color: '#94A3B8' }} />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 transition-colors text-left"
                  style={{ color: '#C62828' }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
