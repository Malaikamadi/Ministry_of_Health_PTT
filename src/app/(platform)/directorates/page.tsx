'use client';

import { useState } from 'react';
import { Building2, Search, Plus, ArrowRight, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';
import { directorates } from '@/data/directorates';
import { getUnitsByDirectorate } from '@/data/units';

export default function DirectoratesPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = directorates.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">Directorates</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Manage ministry directorates and their administrators.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Create Directorate
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search directorates..."
          className="form-input pl-10"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
        {filtered.map((dir) => {
          const dirUnits = getUnitsByDirectorate(dir.id);
          return (
            <Link key={dir.id} href={`/directorates/${dir.id}`} className="card p-5 hover:shadow-lg transition-all group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="badge-primary badge text-[10px] font-bold mb-1">{dir.code}</span>
                  <h3 className="text-sm font-bold group-hover:text-[#0F4C81] transition-colors" style={{ color: '#1E293B' }}>{dir.name}</h3>
                </div>
              </div>

              <p className="text-xs mb-4 line-clamp-2" style={{ color: '#64748B' }}>{dir.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="progress-track flex-1 h-2">
                  <div className="progress-fill" style={{
                    width: `${dir.performanceScore}%`,
                    background: dir.performanceScore >= 70 ? '#2E7D32' : dir.performanceScore >= 50 ? '#0F4C81' : '#C62828',
                  }} />
                </div>
                <span className="text-sm font-bold tabular-nums" style={{
                  color: dir.performanceScore >= 70 ? '#2E7D32' : dir.performanceScore >= 50 ? '#0F4C81' : '#C62828',
                }}>{dir.performanceScore}%</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
                <span style={{ color: '#94A3B8' }}>{dirUnits.length} Units · {dir.totalActivities} Activities</span>
                <span className="flex items-center gap-1 font-medium" style={{ color: '#0F4C81' }}>
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Create Directorate</h2>
              <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Add a new directorate to the ministry structure.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Directorate Code</label>
                <input type="text" className="form-input" placeholder="e.g., DPPI" />
              </div>
              <div>
                <label className="form-label">Directorate Name</label>
                <input type="text" className="form-input" placeholder="Full directorate name" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Brief description..." />
              </div>
              <div>
                <label className="form-label">Director Name</label>
                <input type="text" className="form-input" placeholder="Director full name" />
              </div>
              <div>
                <label className="form-label">Director Email</label>
                <input type="email" className="form-input" placeholder="director@mohs.gov.sl" />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowCreate(false)} className="btn-outline">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="btn-primary">Create Directorate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
