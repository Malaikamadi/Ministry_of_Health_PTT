'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

/* ──── Role & User Types ──── */

export type UserRole = 'super_admin' | 'directorate_admin' | 'unit_focal';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
  /** Set for directorate_admin and unit_focal roles */
  directorate?: string;
  directorateId?: string;
  /** Set for unit_focal role only */
  unitName?: string;
  unitId?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'moh_ptt_auth';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: () => { },
  signOut: () => { },
  isLoading: true,
});

/* ──── Demo Users ──── */

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'sa-001',
    role: 'super_admin',
    name: 'Dr. Austin Demby',
    email: 'admin@mohs.gov.sl',
  },
  {
    id: 'da-001',
    role: 'directorate_admin',
    name: 'Dr. Tom Seasay',
    email: 'director.dppi@mohs.gov.sl',
    directorate: 'Directorate of Policy, Planning & Information',
    directorateId: 'dir-003',
  },
  {
    id: 'uf-001',
    role: 'unit_focal',
    name: 'Khadija Kamara',
    email: 'me.unit@mohs.gov.sl',
    directorate: 'Directorate of Policy, Planning & Information',
    directorateId: 'dir-001',
    unitName: 'Monitoring & Evaluation Unit',
    unitId: 'unit-001',
  },
];

/* ──── Provider ──── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed && parsed.role && parsed.name) {
          setUser(parsed);
        }
      }
    } catch {
      // ignore corrupt data
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback((profile: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ──── Hook ──── */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

/* ──── Role Helpers ──── */

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'super_admin': return 'Super Administrator';
    case 'directorate_admin': return 'Directorate Administrator';
    case 'unit_focal': return 'Unit Focal Person';
  }
}

export function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case 'super_admin': return 'badge-danger';
    case 'directorate_admin': return 'badge-primary';
    case 'unit_focal': return 'badge-teal';
  }
}

export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'super_admin': return '/dashboard';
    case 'directorate_admin': return '/directorate-dashboard';
    case 'unit_focal': return '/unit-dashboard';
  }
}
