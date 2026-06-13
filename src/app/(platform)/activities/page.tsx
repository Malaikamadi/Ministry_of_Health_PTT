'use client';

import { useState } from 'react';
import { Activity, Search, Plus, Filter, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { activities, activityStatusConfig, type ActivityStatus } from '@/data/activities';
import { directorates } from '@/data/directorates';
import { formatDate } from '@/lib/utils';

export default function ActivitiesPage() {
  const [search, setSearch] = useState('');
  const [filterDir, setFilterDir] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const filtered = activities.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.unitName.toLowerCase().includes(search.toLowerCase());
    const matchDir = filterDir === 'all' || a.directorateId === filterDir;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchPriority = filterPriority === 'all' || a.priority === filterPriority;
    return matchSearch && matchDir && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">Activities</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track and manage all activities across the ministry.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Create Activity</button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activities..." className="form-input pl-10" />
          </div>
          <select value={filterDir} onChange={(e) => setFilterDir(e.target.value)} className="form-select lg:w-56">
            <option value="all">All Directorates</option>
            {directorates.map((d) => <option key={d.id} value={d.id}>{d.code}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-select lg:w-48">
            <option value="all">All Statuses</option>
            {Object.entries(activityStatusConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="form-select lg:w-36">
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: '#94A3B8' }}>
          <Filter className="w-3 h-3" />
          <span>Showing {filtered.length} of {activities.length} activities</span>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Unit</th>
                <th>Directorate</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((act) => {
                const cfg = activityStatusConfig[act.status];
                const isOverdue = new Date(act.endDate) < new Date() && act.status !== 'completed';
                return (
                  <tr key={act.id}>
                    <td>
                      <Link href={`/activities/${act.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>
                        {act.title}
                      </Link>
                    </td>
                    <td className="text-sm">{act.unitName}</td>
                    <td><span className="badge-primary badge text-[10px]">{act.directorateCode}</span></td>
                    <td><span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-track w-20 h-1.5">
                          <div className="progress-fill" style={{
                            width: `${act.progress}%`,
                            background: act.progress >= 75 ? '#2E7D32' : act.progress >= 40 ? '#0F4C81' : act.progress >= 20 ? '#F9A825' : '#C62828',
                          }} />
                        </div>
                        <span className="text-xs font-bold tabular-nums">{act.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge text-[10px] ${act.priority === 'high' ? 'badge-danger' : act.priority === 'medium' ? 'badge-warning' : 'badge-slate'}`}>
                        {act.priority}
                      </span>
                    </td>
                    <td className="text-sm tabular-nums" style={{ color: isOverdue ? '#C62828' : '#475569', fontWeight: isOverdue ? 600 : 400 }}>
                      {formatDate(act.endDate)}
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          setSelectedActivity(act);
                          setShowUpdateModal(true);
                        }}
                        className="btn-ghost btn-sm text-[#0F4C81]"
                        title="Update Progress"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Update</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state py-12">
            <Activity className="w-10 h-10 mb-2" style={{ color: '#94A3B8' }} />
            <p className="text-sm font-medium" style={{ color: '#64748B' }}>No activities found</p>
            <p className="text-xs mt-1" style={{ color: '#CBD5E1' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Create Activity</h2>
              <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Define a new activity for tracking.</p>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="form-label">Activity Title</label><input type="text" className="form-input" placeholder="Activity name" /></div>
              <div><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Detailed description..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Directorate</label>
                  <select className="form-select">{directorates.map((d) => <option key={d.id} value={d.id}>{d.code}</option>)}</select>
                </div>
                <div><label className="form-label">Priority</label>
                  <select className="form-select"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Start Date</label><input type="date" className="form-input" /></div>
                <div><label className="form-label">End Date</label><input type="date" className="form-input" /></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowCreate(false)} className="btn-outline">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="btn-primary">Create Activity</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {showUpdateModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Update Progress</h2>
              <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>{selectedActivity.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Progress Percentage (%)</label>
                <input type="number" min="0" max="100" className="form-input" placeholder="e.g., 45" defaultValue={selectedActivity.progress} />
              </div>
              <div>
                <label className="form-label">Update Note</label>
                <textarea className="form-textarea" placeholder="Describe what was accomplished..." rows={3}></textarea>
              </div>
              <div>
                <label className="form-label">Mark Milestone Completed (Optional)</label>
                <select className="form-select">
                  <option value="">-- None --</option>
                  {selectedActivity.milestones.filter((m: any) => !m.completed).map((m: any) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowUpdateModal(false)} className="btn-outline">Cancel</button>
              <button onClick={() => {
                setShowUpdateModal(false);
                alert('Progress update submitted successfully! (Demo)');
              }} className="btn-primary">Submit Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
