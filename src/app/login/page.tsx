'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, LogIn, Activity, BarChart3, FileCheck, Users, ChevronRight } from 'lucide-react';
import { AuthProvider, useAuth, DEMO_USERS, getDashboardRoute, type AuthUser } from '@/lib/auth-context';

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login with demo users
    const matchedUser = DEMO_USERS.find((u) => u.email === email);
    if (matchedUser) {
      setTimeout(() => {
        signIn(matchedUser);
        router.push(getDashboardRoute(matchedUser.role));
      }, 800);
    } else {
      // Default to first demo user for demo purposes
      setTimeout(() => {
        signIn(DEMO_USERS[0]);
        router.push(getDashboardRoute(DEMO_USERS[0].role));
      }, 800);
    }
  };

  const handleDemoLogin = (user: AuthUser) => {
    setIsLoading(true);
    setTimeout(() => {
      signIn(user);
      router.push(getDashboardRoute(user.role));
    }, 600);
  };

  const roleLabels: Record<string, { label: string; desc: string; color: string; bg: string }> = {
    super_admin: { label: 'Super Administrator', desc: 'Full ministry access', color: '#C62828', bg: 'rgba(198, 40, 40, 0.08)' },
    directorate_admin: { label: 'Directorate Admin', desc: 'Directorate-level access', color: '#0F4C81', bg: 'rgba(15, 76, 129, 0.08)' },
    unit_focal: { label: 'Unit Focal Person', desc: 'Unit-level access', color: '#00897B', bg: 'rgba(0, 137, 123, 0.08)' },
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8" style={{ background: '#F5F7FA' }}>
        <div className="w-full max-w-[420px] animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-md overflow-hidden shrink-0">
              <img src="/logo.png" alt="MOHS Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#0F4C81' }}>Ministry of Health</h2>
              <p className="text-xs font-medium" style={{ color: '#64748B' }}>Government of Sierra Leone</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: '#0F172A' }}>
            Performance Tracking Tool
          </h1>
          <p className="text-sm mb-8" style={{ color: '#64748B' }}>
            Sign in to monitor activities, track progress, and generate reports across all directorates.
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@mohs.gov.sl"
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#0F4C81]" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center text-sm py-3 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </span>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="flex items-center gap-2 text-xs font-semibold w-full justify-center py-2 rounded-lg border border-dashed transition-all"
              style={{
                color: '#64748B',
                borderColor: '#CBD5E1',
                background: showDemo ? '#F8FAFC' : 'transparent',
              }}
            >
              <Users className="w-3.5 h-3.5" />
              Demo Accounts {showDemo ? '▾' : '▸'}
            </button>

            {showDemo && (
              <div className="mt-3 space-y-2 animate-fade-in">
                {DEMO_USERS.map((user) => {
                  const roleInfo = roleLabels[user.role];
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleDemoLogin(user)}
                      disabled={isLoading}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md group text-left disabled:opacity-50"
                      style={{ borderColor: '#E2E8F0', background: 'white' }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: roleInfo.color }}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500">{roleInfo.label} · {roleInfo.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400">
              <Shield className="w-3 h-3" />
              <span>Government of Sierra Leone · Secure Session · SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #083058 50%, #052240 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00897B, transparent)' }} />
        <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #F9A825, transparent)' }} />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, white, transparent)' }} />

        <div className="relative z-10 max-w-md px-12 animate-fade-in-up">
          {/* Floating Cards */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0, 137, 123, 0.3)' }}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Real-time Tracking</p>
                <p className="text-white/60 text-xs">Monitor activities across all directorates</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm ml-8" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249, 168, 37, 0.3)' }}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Performance Analytics</p>
                <p className="text-white/60 text-xs">Data-driven decision making</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm ml-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(46, 125, 50, 0.3)' }}>
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Evidence-Based Reporting</p>
                <p className="text-white/60 text-xs">Verified progress with documentation</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Performance Tracking Tool
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            A comprehensive platform for monitoring, verifying, and reporting ministry-wide performance across all health directorates, units, and programmes.
          </p>

          {/* Stats row */}
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-xs text-white/50">Directorates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">20</div>
              <div className="text-xs text-white/50">Units</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">89</div>
              <div className="text-xs text-white/50">Activities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">65%</div>
              <div className="text-xs text-white/50">Avg. Performance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
