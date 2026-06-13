'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F7FA' }}>
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading PTT...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
