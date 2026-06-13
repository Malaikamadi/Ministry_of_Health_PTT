'use client';

import { useState } from 'react';
import { Users, Search, Plus, Shield, UserCheck, UserX, KeyRound } from 'lucide-react';
import { users as mockUsers } from '@/data/users';
import { directorates } from '@/data/directorates';
import { formatDate, timeAgo, getInitials } from '@/lib/utils';

const roleLabels: Record<string, { label: string; badge: string }> = {
  super_admin: { label: 'Super Admin', badge: 'badge-danger' },
  directorate_admin: { label: 'Director', badge: 'badge-primary' },
  unit_focal: { label: 'Unit Focal', badge: 'badge-teal' },
};

const statusConfig: Record<string, { label: string; badge: string }> = {
  active: { label: 'Active', badge: 'badge-success' },
  inactive: { label: 'Inactive', badge: 'badge-slate' },
  pending: { label: 'Pending', badge: 'badge-warning' },
};

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const activeCount = mockUsers.filter((u) => u.status === 'active').length;
  const inactiveCount = mockUsers.filter((u) => u.status === 'inactive').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">User Management</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Manage user accounts, roles, and access permissions.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Create User</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><Users className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Total Users</p><p className="kpi-value">{mockUsers.length}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><UserCheck className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Active</p><p className="kpi-value">{activeCount}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(198,40,40,0.08)' }}><UserX className="w-5 h-5" style={{ color: '#C62828' }} /></div><div><p className="kpi-label">Inactive</p><p className="kpi-value">{inactiveCount}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(249,168,37,0.08)' }}><Shield className="w-5 h-5" style={{ color: '#F9A825' }} /></div><div><p className="kpi-label">Admins</p><p className="kpi-value">{mockUsers.filter((u) => u.role === 'super_admin').length}</p></div></div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="form-input pl-10" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="form-select lg:w-48">
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="directorate_admin">Director</option>
            <option value="unit_focal">Unit Focal</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-select lg:w-40">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>User</th><th>Role</th><th>Directorate</th><th>Unit</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((u) => {
                const roleCfg = roleLabels[u.role];
                const statusCfg = statusConfig[u.status];
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
                          {getInitials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{u.name}</div>
                          <div className="text-[11px] truncate" style={{ color: '#94A3B8' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`${roleCfg.badge} badge text-[10px]`}>{roleCfg.label}</span></td>
                    <td className="text-sm">{u.directorateCode || '—'}</td>
                    <td className="text-sm" style={{ color: '#475569' }}>{u.unitName || '—'}</td>
                    <td><span className={`${statusCfg.badge} badge text-[10px]`}>{statusCfg.label}</span></td>
                    <td className="text-sm" style={{ color: '#94A3B8' }}>{u.lastLogin ? timeAgo(u.lastLogin) : 'Never'}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="btn-ghost btn-sm" title="Reset Password"><KeyRound className="w-3.5 h-3.5" /></button>
                        <button className="btn-ghost btn-sm" title={u.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Create User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Full Name</label><input type="text" className="form-input" placeholder="Full name" /></div>
                <div><label className="form-label">Email</label><input type="email" className="form-input" placeholder="email@mohs.gov.sl" /></div>
              </div>
              <div>
                <label className="form-label">Role</label>
                <select className="form-select">
                  <option value="super_admin">Super Administrator</option>
                  <option value="directorate_admin">Directorate Administrator</option>
                  <option value="unit_focal">Unit Focal Person</option>
                </select>
              </div>
              <div>
                <label className="form-label">Directorate</label>
                <select className="form-select">
                  <option value="">Select directorate...</option>
                  {directorates.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
                </select>
              </div>
              <div><label className="form-label">Temporary Password</label><input type="password" className="form-input" placeholder="Set temporary password" /></div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowCreate(false)} className="btn-outline">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="btn-primary">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
