'use client';

import { use, useState } from 'react';
import { ArrowLeft, Activity, Building2, Clock, CheckCircle2, AlertTriangle, FileText, Download, MessageSquare, Upload, Calendar, User, MapPin, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { activities, activityStatusConfig, type ActivityStatus } from '@/data/activities';
import { formatDate } from '@/lib/utils';

const statusFlow: ActivityStatus[] = ['draft', 'submitted', 'approved', 'in_progress', 'pending_verification', 'completed'];

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const activity = activities.find((a) => a.id === id);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  if (!activity) {
    return (
      <div className="empty-state min-h-[400px]">
        <Activity className="w-12 h-12 mb-3" style={{ color: '#94A3B8' }} />
        <h2 className="text-lg font-bold mb-1" style={{ color: '#1E293B' }}>Activity Not Found</h2>
        <Link href="/activities" className="btn-primary mt-4"><ArrowLeft className="w-4 h-4" /> Back</Link>
      </div>
    );
  }

  const cfg = activityStatusConfig[activity.status];
  const currentStatusIndex = statusFlow.indexOf(activity.status);
  const fileCategories: Record<string, string> = {
    report: 'Report', photo: 'Photo', pdf: 'PDF Document', minutes: 'Meeting Minutes', attendance: 'Attendance Sheet', official_document: 'Official Document',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/activities" className="btn-ghost btn-sm inline-flex"><ArrowLeft className="w-4 h-4" /> Back to Activities</Link>

      {/* Activity Info Card */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`${cfg.badgeClass} status-pill`}>
                <span className="status-dot" style={{ background: cfg.dotColor }} /> {cfg.label}
              </span>
              <span className={`badge text-[10px] ${activity.priority === 'high' ? 'badge-danger' : activity.priority === 'medium' ? 'badge-warning' : 'badge-slate'}`}>
                {activity.priority} priority
              </span>
              <span className="badge-primary badge text-[10px]">{activity.directorateCode}</span>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>{activity.title}</h1>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>{activity.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2"><Building2 className="w-4 h-4 shrink-0" style={{ color: '#94A3B8' }} /><div><p className="text-[10px] uppercase font-bold" style={{ color: '#94A3B8' }}>Directorate</p><p className="font-semibold" style={{ color: '#1E293B' }}>{activity.directorateCode}</p></div></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" style={{ color: '#94A3B8' }} /><div><p className="text-[10px] uppercase font-bold" style={{ color: '#94A3B8' }}>Unit</p><p className="font-semibold" style={{ color: '#1E293B' }}>{activity.unitName}</p></div></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 shrink-0" style={{ color: '#94A3B8' }} /><div><p className="text-[10px] uppercase font-bold" style={{ color: '#94A3B8' }}>Start Date</p><p className="font-semibold" style={{ color: '#1E293B' }}>{formatDate(activity.startDate)}</p></div></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" style={{ color: '#94A3B8' }} /><div><p className="text-[10px] uppercase font-bold" style={{ color: '#94A3B8' }}>End Date</p><p className="font-semibold" style={{ color: '#1E293B' }}>{formatDate(activity.endDate)}</p></div></div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke={cfg.color} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - activity.progress / 100)}`} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold" style={{ color: cfg.color }}>{activity.progress}%</span>
              </div>
            </div>
            <p className="text-xs font-medium mt-2" style={{ color: '#94A3B8' }}>Progress</p>
          </div>
        </div>
      </div>

      {/* Status Workflow */}
      <div className="card p-5">
        <h3 className="heading-section mb-4">Activity Status Workflow</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {statusFlow.map((status, index) => {
            const statusCfg = activityStatusConfig[status];
            const isReached = index <= currentStatusIndex;
            const isCurrent = status === activity.status;
            return (
              <div key={status} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isCurrent ? 'shadow-sm' : ''}`}
                  style={{
                    background: isReached ? `${statusCfg.color}10` : '#F8FAFC',
                    color: isReached ? statusCfg.color : '#CBD5E1',
                    boxShadow: isCurrent ? `0 0 0 2px ${statusCfg.color}` : undefined,
                  }}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: isReached ? statusCfg.color : '#E2E8F0' }}>
                    {isReached ? <CheckCircle2 className="w-3 h-3 text-white" /> : <span className="w-2 h-2 rounded-full" style={{ background: '#CBD5E1' }} />}
                  </div>
                  <span className="text-[11px] font-semibold whitespace-nowrap">{statusCfg.label}</span>
                </div>
                {index < statusFlow.length - 1 && <div className="w-6 h-px" style={{ background: isReached ? statusCfg.color : '#E2E8F0' }} />}
              </div>
            );
          })}
        </div>
        {activity.status === 'returned' && activity.reviewNotes && (
          <div className="mt-4 p-4 rounded-xl border" style={{ background: 'rgba(198,40,40,0.04)', borderColor: 'rgba(198,40,40,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" style={{ color: '#C62828' }} />
              <span className="text-sm font-bold" style={{ color: '#C62828' }}>Reviewer Comments</span>
            </div>
            <p className="text-sm" style={{ color: '#475569' }}>{activity.reviewNotes}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Milestones */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Milestones</h3>
            <span className="text-xs font-bold tabular-nums" style={{ color: '#94A3B8' }}>
              {activity.milestones.filter((m) => m.completed).length}/{activity.milestones.length}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {activity.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: milestone.completed ? 'rgba(46,125,50,0.04)' : '#F8FAFC' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{
                  background: milestone.completed ? '#2E7D32' : '#E2E8F0',
                }}>
                  {milestone.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <span className="w-2 h-2 rounded-full" style={{ background: '#94A3B8' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#1E293B', textDecoration: milestone.completed ? 'none' : 'none' }}>{milestone.title}</p>
                  {milestone.completedDate && <p className="text-[11px]" style={{ color: '#94A3B8' }}>Completed: {formatDate(milestone.completedDate)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Updates Feed */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Progress Updates</h3>
            <button onClick={() => setShowUpdateModal(true)} className="btn-primary btn-sm"><Plus className="w-3.5 h-3.5" /> Update Progress</button>
          </div>
          <div className="p-5">
            {activity.progressUpdates.length > 0 ? (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: '#E2E8F0' }} />
                <div className="space-y-4">
                  {[...activity.progressUpdates].reverse().map((upd, i) => (
                    <div key={upd.id} className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10" style={{
                        background: i === 0 ? '#0F4C81' : '#E2E8F0',
                      }}>
                        <TrendingUp className="w-3 h-3" style={{ color: i === 0 ? 'white' : '#94A3B8' }} />
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold" style={{ color: '#0F4C81' }}>{upd.percentage}%</span>
                          <span className="text-[11px]" style={{ color: '#94A3B8' }}>{formatDate(upd.date)}</span>
                        </div>
                        <p className="text-sm" style={{ color: '#475569' }}>{upd.note}</p>
                        <p className="text-[11px] mt-1" style={{ color: '#CBD5E1' }}>By {upd.updatedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state py-8">
                <TrendingUp className="w-8 h-8 mb-2" style={{ color: '#94A3B8' }} />
                <p className="text-sm" style={{ color: '#64748B' }}>No updates yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Evidence & Documentation</h3>
          <button className="btn-secondary btn-sm"><Upload className="w-3.5 h-3.5" /> Upload</button>
        </div>
        {activity.evidence.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>File</th><th>Category</th><th>Size</th><th>Uploaded By</th><th>Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {activity.evidence.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 shrink-0" style={{ color: '#0F4C81' }} />
                        <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{ev.fileName}</span>
                      </div>
                    </td>
                    <td className="text-sm">{fileCategories[ev.category] || ev.category}</td>
                    <td className="text-sm tabular-nums">{ev.fileSize}</td>
                    <td className="text-sm">{ev.uploadedBy}</td>
                    <td className="text-sm tabular-nums">{formatDate(ev.uploadedAt)}</td>
                    <td>{ev.verified ? <span className="badge-success badge text-[10px]">Verified</span> : <span className="badge-warning badge text-[10px]">Pending</span>}</td>
                    <td><button className="btn-ghost btn-sm"><Download className="w-3.5 h-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-10">
            <FileText className="w-10 h-10 mb-2" style={{ color: '#94A3B8' }} />
            <p className="text-sm font-medium" style={{ color: '#64748B' }}>No evidence uploaded yet</p>
            <button className="btn-secondary btn-sm mt-3"><Upload className="w-3.5 h-3.5" /> Upload Evidence</button>
          </div>
        )}
      </div>

      {/* Update Progress Modal */}
      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Update Progress</h2>
              <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Record a new progress update for this activity.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Progress Percentage (%)</label>
                <input type="number" min="0" max="100" className="form-input" placeholder="e.g., 45" defaultValue={activity.progress} />
              </div>
              <div>
                <label className="form-label">Update Note</label>
                <textarea className="form-textarea" placeholder="Describe what was accomplished..." rows={3}></textarea>
              </div>
              <div>
                <label className="form-label">Mark Milestone Completed (Optional)</label>
                <select className="form-select">
                  <option value="">-- None --</option>
                  {activity.milestones.filter(m => !m.completed).map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowUpdateModal(false)} className="btn-outline">Cancel</button>
              <button onClick={() => {
                // In a real app, this would mutate state/make an API call
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
