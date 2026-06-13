'use client';

import { useState } from 'react';
import { ClipboardCheck, Search, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { units } from '@/data/units';
import { directorates } from '@/data/directorates';

export default function UnitsPage() {
  const [search, setSearch] = useState('');
  const [filterDir, setFilterDir] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = units.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.focalPerson.toLowerCase().includes(search.toLowerCase());
    const matchDir = filterDir === 'all' || u.directorateId === filterDir;
    return matchSearch && matchDir;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">Units</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Manage units across all directorates.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Create Unit</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search units..." className="form-input pl-10" />
        </div>
        <select value={filterDir} onChange={(e) => setFilterDir(e.target.value)} className="form-select max-w-xs">
          <option value="all">All Directorates</option>
          {directorates.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Unit</th><th>Directorate</th><th>Focal Person</th><th>Activities</th><th>Performance</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((unit) => (
                <tr key={unit.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
                        {unit.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>{unit.name}</span>
                    </div>
                  </td>
                  <td><span className="badge-primary badge text-[10px]">{unit.directorateCode}</span></td>
                  <td className="text-sm">{unit.focalPerson}</td>
                  <td className="text-sm tabular-nums">{unit.totalActivities}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-track w-16 h-1.5">
                        <div className="progress-fill" style={{ width: `${unit.performanceScore}%`, background: unit.performanceScore >= 70 ? '#2E7D32' : unit.performanceScore >= 50 ? '#0F4C81' : '#C62828' }} />
                      </div>
                      <span className="text-xs font-bold tabular-nums">{unit.performanceScore}%</span>
                    </div>
                  </td>
                  <td><span className={unit.status === 'active' ? 'badge-success badge text-[10px]' : 'badge-slate badge text-[10px]'}>{unit.status}</span></td>
                  <td><Link href={`/units/${unit.id}`} className="btn-ghost btn-sm">View <ArrowRight className="w-3 h-3" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state py-12">
            <ClipboardCheck className="w-10 h-10 mb-2" style={{ color: '#94A3B8' }} />
            <p className="text-sm font-medium" style={{ color: '#64748B' }}>No units found</p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Create Unit</h2>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="form-label">Unit Name</label><input type="text" className="form-input" placeholder="e.g., Monitoring & Evaluation Unit" /></div>
              <div><label className="form-label">Directorate</label>
                <select className="form-select">{directorates.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}</select>
              </div>
              <div><label className="form-label">Focal Person Name</label><input type="text" className="form-input" placeholder="Full name" /></div>
              <div><label className="form-label">Focal Person Email</label><input type="email" className="form-input" placeholder="email@mohs.gov.sl" /></div>
              <div><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Unit description..." /></div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowCreate(false)} className="btn-outline">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="btn-primary">Create Unit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
