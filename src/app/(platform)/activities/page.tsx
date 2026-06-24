'use client';

import { useState } from 'react';
import { Activity, Search, Plus, Filter, TrendingUp, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [showUploadAWP, setShowUploadAWP] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [milestoneToggles, setMilestoneToggles] = useState<Record<string, boolean>>({});

  const filtered = activities.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.unitName.toLowerCase().includes(search.toLowerCase());
    const matchDir = filterDir === 'all' || a.directorateId === filterDir;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchPriority = filterPriority === 'all' || a.priority === filterPriority;
    return matchSearch && matchDir && matchStatus && matchPriority;
  });

  // Feedback #2: Calculate progress from milestones
  const getAutoProgress = (act: any) => {
    if (!act.milestones || act.milestones.length === 0) return act.progress;
    const toggledCount = Object.entries(milestoneToggles).filter(([key, val]) => val && key.startsWith(act.id)).length;
    const alreadyCompleted = act.milestones.filter((m: any) => m.completed).length;
    const total = act.milestones.length;
    const completedCount = alreadyCompleted + toggledCount;
    return Math.round((completedCount / total) * 100);
  };

  const handleOpenUpdate = (act: any) => {
    setSelectedActivity(act);
    setMilestoneToggles({});
    setShowUpdateModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">Activities</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track and manage all activities across the ministry.</p>
        </div>
        {/* Feedback #1: More visual action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #0F4C81, #1565A8)' }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Plus className="w-4 h-4" />
            </div>
            Create Activity
          </button>
          <button
            onClick={() => setShowUploadAWP(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #00897B, #00796B)' }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Upload className="w-4 h-4" />
            </div>
            Upload AWP
          </button>
        </div>
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
                        onClick={() => handleOpenUpdate(act)}
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

      {/* Upload AWP Modal — Feedback #1 */}
      {showUploadAWP && (
        <div className="modal-overlay" onClick={() => setShowUploadAWP(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Upload Annual Work Plan</h2>
              <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Upload your AWP file to import activities in bulk.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed rounded-2xl p-8 text-center transition-colors hover:border-[#0F4C81]" style={{ borderColor: '#E2E8F0' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,137,123,0.08)' }}>
                  <Upload className="w-7 h-7" style={{ color: '#00897B' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1E293B' }}>Drop your AWP file here, or click to browse</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Supports .xlsx, .csv, .pdf formats</p>
                <input type="file" className="hidden" accept=".xlsx,.csv,.pdf" />
                <button className="btn-outline btn-sm mt-4">Browse Files</button>
              </div>
              <div><label className="form-label">Directorate</label>
                <select className="form-select">{directorates.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}</select>
              </div>
              <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(15,76,129,0.04)' }}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#0F4C81' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                  Activities from the AWP will be imported as <span className="font-semibold">Draft</span> status. You can review and submit them individually after import.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowUploadAWP(false)} className="btn-outline">Cancel</button>
              <button onClick={() => { setShowUploadAWP(false); alert('AWP uploaded successfully! Activities imported as drafts. (Demo)'); }} className="btn-primary">
                <Upload className="w-4 h-4" /> Upload & Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Progress Modal — Feedback #2: Automated from milestones */}
      {showUpdateModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Update Progress</h2>
              <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>{selectedActivity.title}</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Auto-calculated progress display */}
              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(15,76,129,0.04)' }}>
                <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#94A3B8' }}>Calculated Progress</p>
                <p className="text-3xl font-bold tabular-nums" style={{ color: '#0F4C81' }}>{getAutoProgress(selectedActivity)}%</p>
                <div className="progress-track h-2 mt-2 mx-auto" style={{ maxWidth: '200px' }}>
                  <div className="progress-fill progress-fill-primary" style={{ width: `${getAutoProgress(selectedActivity)}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(46,125,50,0.04)', border: '1px solid rgba(46,125,50,0.1)' }}>
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#2E7D32' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                  Progress is <span className="font-semibold">automatically calculated</span> based on milestone completion. Mark milestones below to update progress.
                </p>
              </div>

              {/* Milestones as checkboxes */}
              <div>
                <label className="form-label">Milestones</label>
                <div className="space-y-2">
                  {selectedActivity.milestones.map((m: any) => {
                    const toggleKey = `${selectedActivity.id}-${m.id}`;
                    const isChecked = m.completed || milestoneToggles[toggleKey];
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${m.completed ? 'opacity-60' : 'hover:shadow-sm'}`}
                        style={{ background: isChecked ? 'rgba(46,125,50,0.04)' : '#F8FAFC' }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={m.completed}
                          onChange={(e) => {
                            if (!m.completed) {
                              setMilestoneToggles((prev) => ({ ...prev, [toggleKey]: e.target.checked }));
                            }
                          }}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: '#2E7D32' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: '#1E293B' }}>{m.title}</p>
                          {m.completed && m.completedDate && (
                            <p className="text-[11px]" style={{ color: '#94A3B8' }}>Completed: {formatDate(m.completedDate)}</p>
                          )}
                        </div>
                        {isChecked && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#2E7D32' }} />}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="form-label">Update Note</label>
                <textarea className="form-textarea" placeholder="Describe what was accomplished..." rows={3}></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowUpdateModal(false)} className="btn-outline">Cancel</button>
              <button onClick={() => {
                setShowUpdateModal(false);
                alert(`Progress updated to ${getAutoProgress(selectedActivity)}%! (Demo)`);
              }} className="btn-primary">Submit Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
