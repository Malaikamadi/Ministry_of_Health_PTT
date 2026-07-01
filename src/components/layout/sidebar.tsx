'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Activity,
  FileText,
  ClipboardCheck,
  FolderOpen,
  ScrollText,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/cn';
import { useAuth, getRoleLabel } from '@/lib/auth-context';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navSections: NavSection[] = useMemo(() => {
    if (user?.role === 'super_admin') {
      return [
        {
          label: 'Overview',
          items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
        },
        {
          label: 'Management',
          items: [
            { href: '/directorates', label: 'Directorates', icon: Building2 },
            { href: '/units', label: 'Units', icon: ClipboardCheck },
            { href: '/activities', label: 'Activities', icon: Activity },
          ],
        },
        {
          label: 'Monitoring',
          items: [
            { href: '/progress', label: 'Performance Monitoring', icon: TrendingUp },
            { href: '/reports', label: 'Reports', icon: FileText },
          ],
        },
        {
          label: 'Administration',
          items: [
            { href: '/users', label: 'User Management', icon: Users },
            { href: '/audit', label: 'Audit Logs', icon: ScrollText },
            { href: '/settings', label: 'System Settings', icon: Settings },
          ],
        },
      ];
    }

    if (user?.role === 'directorate_admin') {
      return [
        {
          label: 'Overview',
          items: [{ href: '/directorate-dashboard', label: 'Dashboard', icon: LayoutDashboard }],
        },
        {
          label: 'Management',
          items: [
            { href: '/units', label: 'Units', icon: ClipboardCheck },
            { href: '/activities', label: 'Activities', icon: Activity },
          ],
        },
        {
          label: 'Monitoring',
          items: [
            { href: '/progress', label: 'Performance Monitoring', icon: TrendingUp },
            { href: '/evidence', label: 'Evidence Repository', icon: FolderOpen },
            { href: '/reports', label: 'Reports', icon: FileText },
          ],
        },
      ];
    }

    // unit_focal
    return [
      {
        label: 'Overview',
        items: [{ href: '/unit-dashboard', label: 'Dashboard', icon: LayoutDashboard }],
      },
      {
        label: 'My Work',
        items: [
          { href: '/activities', label: 'Activities', icon: Activity },
          { href: '/progress', label: 'Performance Monitoring', icon: TrendingUp },
          { href: '/evidence', label: 'Evidence Uploads', icon: FolderOpen },
        ],
      },
      {
        label: 'Monitoring',
        items: [{ href: '/reports', label: 'Reports', icon: FileText }],
      },
    ];
  }, [user]);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out relative border-r bg-white',
        collapsed ? 'w-[72px]' : 'w-[264px]'
      )}
      style={{
        borderColor: '#E2E8F0',
        boxShadow: '2px 0 12px -4px rgba(15, 76, 129, 0.06)',
      }}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center border-b px-4 py-4 gap-3 min-h-[72px]',
          collapsed && 'justify-center px-2'
        )}
        style={{ borderColor: '#E2E8F0', background: 'linear-gradient(180deg, rgba(15, 76, 129, 0.04) 0%, transparent 100%)' }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-white overflow-hidden">
          <img src="/logo.png" alt="MOHS Logo" className="w-full h-full object-contain p-0.5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <p className="text-sm font-bold truncate" style={{ color: '#0F4C81' }}>MOH PTT</p>
            <p className="text-[10px] font-medium truncate" style={{ color: '#94A3B8' }}>Performance Tracking</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#94A3B8' }}>
                {section.label}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'shadow-sm'
                        : 'hover:bg-slate-50'
                    )}
                    style={
                      isActive
                        ? { background: 'rgba(15, 76, 129, 0.08)', color: '#0F4C81' }
                        : { color: '#64748B' }
                    }
                  >
                    <Icon
                      className="w-[18px] h-[18px] shrink-0 transition-colors"
                      style={{ color: isActive ? '#0F4C81' : '#94A3B8' }}
                    />
                    {!collapsed && <span className="truncate">{label}</span>}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#0F4C81' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mx-2 mb-3 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50"
        style={{ borderColor: '#E2E8F0', color: '#94A3B8' }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <>
            <ChevronLeft className="w-4 h-4" />
            <span>Collapse</span>
          </>
        )}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t px-4 py-3" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: '#94A3B8' }}>
            <Shield className="w-3 h-3 shrink-0" style={{ color: '#0F4C81' }} />
            <span>Government of Sierra Leone · Secure</span>
          </div>
        </div>
      )}
    </aside>
  );
}
