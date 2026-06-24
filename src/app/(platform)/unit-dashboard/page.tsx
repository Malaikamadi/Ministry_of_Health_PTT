'use client';

import { useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, Clock, FileText, FolderOpen, ArrowRight, Upload, TrendingUp, Plus, Info, BarChart3, X, File } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { activities, getActivitiesByUnit, activityStatusConfig } from '@/data/activities';
import { units } from '@/data/units';
import { directorates } from '@/data/directorates';
import { getUnitsByDirectorate } from '@/data/units';
import { formatDate } from '@/lib/utils';

export default function UnitDashboard() {
  const { user } = useAuth();
  const [showUploadReport, setShowUploadReport] = useState(false);

  const unitId = user?.unitId || 'unit-001';
  const unit = units.find((u) => u.id === unitId) || units[0];
  const unitActivities = getActivitiesByUnit(unitId);

  // Find parent directorate
  const directorate = directorates.find((d) => d.id === unit.directorateId);
  const dirUnits = getUnitsByDirectorate(unit.directorateId);

  // KPI counts
  const myActivities = unitActivities.length;
  const ongoing = unitActivities.filter((a) => a.status === 'in_progress').length;
  const completed = unitActivities.filter((a) => a.status === 'completed').length;
  const pending = unitActivities.filter((a) => a.status === 'pending_verification').length;
  const overdue = unitActivities.filter((a) => {
    const end = new Date(a.endDate);
    return end < new Date() && a.status !== 'completed';
  }).length;

  // Comparison scores
  const unitScore = unit.performanceScore;
  const directorateAvg = dirUnits.length > 0
    ? Math.round(dirUnits.reduce((s, u) => s + u.performanceScore, 0) / dirUnits.length)
    : 0;
  const ministryAvg = Math.round(
    directorates.reduce((s, d) => s + d.performanceScore, 0) / directorates.length
  );

  const recentUpdates = unitActivities
    .flatMap((a) => a.progressUpdates.map((pu) => ({ ...pu, activityTitle: a.title, activityId: a.id })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const upcomingDeadlines = unitActivities
    .filter((a) => a.status !== 'completed' && new Date(a.endDate) >= new Date())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 4);

  const totalEvidence = unitActivities.reduce((sum, a) => sum + a.evidence.length, 0);
  const verifiedEvidence = unitActivities.reduce((sum, a) => sum + a.evidence.filter(e => e.verified).length, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(0,137,123,0.04) 0%, rgba(15,76,129,0.03) 100%)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-teal badge font-bold">{unit.directorateCode}</span>
              <span className="badge text-[10px]" style={{ background: 'rgba(0,137,123,0.08)', color: '#00897B' }}>Unit Focal</span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight" style={{ color: '#0F172A' }}>{unit.name}</h1>
            <p className="mt-1 text-sm" style={{ color: '#64748B' }}>
              Welcome back, <span className="font-semibold">{user?.name || unit.focalPerson}</span>
            </p>
          </div>
          {/* Feedback #1: More visual action buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/activities"
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #1565A8)' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Plus className="w-4.5 h-4.5" />
              </div>
              Submit Activity
            </Link>
            <Link
              href="/evidence"
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #00897B, #00796B)' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Upload className="w-4.5 h-4.5" />
              </div>
              Upload AWP
            </Link>
            <button
              onClick={() => setShowUploadReport(true)}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <FileText className="w-4.5 h-4.5" />
              </div>
              Upload Report
            </button>
          </div>
        </div>
      </div>

      {/* KPIs — Feedback #4: Clear labels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
        <KpiCard icon={Activity} label="Total Activities" value={`${myActivities}`} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={TrendingUp} label="Ongoing" value={`${ongoing}`} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={CheckCircle2} label="Completed" value={`${completed}`} color="#2E7D32" bg="rgba(46,125,50,0.08)" />
        <KpiCard icon={Clock} label="Pending" value={`${pending}`} color="#F9A825" bg="rgba(249,168,37,0.08)" />
        <KpiCard icon={AlertTriangle} label="Overdue" value={`${overdue}`} color="#C62828" bg="rgba(198,40,40,0.08)" />
      </div>

      {/* Feedback #5: Performance Comparison — Unit vs Directorate vs Ministry */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Performance Comparison</h3>
          <span className="text-xs" style={{ color: '#94A3B8' }}>How your unit compares</span>
        </div>
        <div className="p-5 space-y-5">
          <ComparisonBar
            label="Your Unit"
            sublabel={unit.name}
            score={unitScore}
            highlight
          />
          <ComparisonBar
            label="Directorate Average"
            sublabel={directorate?.code || '—'}
            score={directorateAvg}
          />
          <ComparisonBar
            label="Ministry Average"
            sublabel="All Directorates"
            score={ministryAvg}
          />
        </div>
      </div>

      {/* Activity Progress Cards */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Activity Progress</h3>
          <Link href="/activities" className="btn-ghost btn-sm">All Activities <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {unitActivities.slice(0, 6).map((act) => {
            const cfg = activityStatusConfig[act.status];
            const daysLeft = Math.ceil((new Date(act.endDate).getTime() - new Date().getTime()) / 86400000);
            return (
              <Link key={act.id} href={`/activities/${act.id}`} className="p-4 rounded-xl border hover:shadow-md transition-all group" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span>
                  {act.priority === 'high' && <span className="badge-danger badge text-[9px]">HIGH</span>}
                </div>
                <p className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-[#0F4C81] transition-colors" style={{ color: '#1E293B' }}>{act.title}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="progress-track flex-1 h-2">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${act.progress}%`,
                        background: act.progress >= 75 ? 'linear-gradient(90deg, #2E7D32, #43A047)' :
                          act.progress >= 40 ? 'linear-gradient(90deg, #0F4C81, #1565A8)' :
                          'linear-gradient(90deg, #F9A825, #FFB300)',
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold tabular-nums">{act.progress}%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]" style={{ color: '#94A3B8' }}>
                  <span>Due: {formatDate(act.endDate)}</span>
                  {daysLeft > 0 && act.status !== 'completed' && (
                    <span style={{ color: daysLeft <= 7 ? '#C62828' : '#64748B' }}>{daysLeft}d left</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Updates & Evidence */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Recent Updates Submitted</h3>
          </div>
          {recentUpdates.length > 0 ? (
            <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              {recentUpdates.map((upd) => (
                <div key={upd.id} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#0F4C81' }}>{upd.percentage}%</span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>· {formatDate(upd.date)}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#475569' }}>{upd.note}</p>
                  <p className="text-xs mt-1" style={{ color: '#CBD5E1' }}>{upd.activityTitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-10">
              <FileText className="w-8 h-8 mb-2" style={{ color: '#94A3B8' }} />
              <p className="text-sm" style={{ color: '#64748B' }}>No updates yet</p>
            </div>
          )}
        </div>

        {/* Evidence Upload Status — Feedback #6: Clarify statuses */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Evidence Upload Status</h3>
            <Link href="/evidence" className="btn-ghost btn-sm">Upload <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#1E293B' }}>{totalEvidence}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Total Files</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>{verifiedEvidence}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Verified</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#F9A825' }}>{totalEvidence - verifiedEvidence}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Pending</p>
              </div>
            </div>
            {totalEvidence > 0 && (
              <div className="flex rounded-full overflow-hidden h-3 mb-4">
                <div style={{ width: `${(verifiedEvidence / totalEvidence) * 100}%`, background: '#2E7D32' }} className="transition-all" />
                <div style={{ width: `${((totalEvidence - verifiedEvidence) / totalEvidence) * 100}%`, background: '#F9A825' }} className="transition-all" />
              </div>
            )}

            {/* Feedback #6: Status explanations */}
            <div className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(15,76,129,0.03)', border: '1px solid rgba(15,76,129,0.08)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3.5 h-3.5 shrink-0" style={{ color: '#0F4C81' }} />
                <span className="text-[11px] font-bold" style={{ color: '#0F4C81' }}>Evidence Workflow</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: '#F9A825' }} />
                <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>
                  <span className="font-semibold" style={{ color: '#F9A825' }}>Pending</span> — Evidence uploaded, awaiting review and approval by the directorate
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: '#2E7D32' }} />
                <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>
                  <span className="font-semibold" style={{ color: '#2E7D32' }}>Verified</span> — Evidence reviewed and approved by the directorate as satisfactory
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="card overflow-hidden">
          <div className="section-header">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#F9A825' }} />
              <h3 className="heading-section">Upcoming Deadlines</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
            {upcomingDeadlines.map((act) => {
              const daysLeft = Math.ceil((new Date(act.endDate).getTime() - new Date().getTime()) / 86400000);
              return (
                <Link key={act.id} href={`/activities/${act.id}`} className="p-4 rounded-xl border hover:shadow-md transition-all" style={{ borderColor: '#E2E8F0' }}>
                  <Clock className="w-4 h-4 mb-2" style={{ color: daysLeft <= 7 ? '#C62828' : '#F9A825' }} />
                  <p className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: '#1E293B' }}>{act.title}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Due: {formatDate(act.endDate)}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: daysLeft <= 7 ? '#C62828' : '#F9A825' }}>
                    {daysLeft}d remaining
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback #7: Performance Reports section */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" style={{ color: '#0F4C81' }} />
            <h3 className="heading-section">Performance Reports</h3>
          </div>
          <Link href="/reports" className="btn-ghost btn-sm">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(15,76,129,0.04), rgba(15,76,129,0.08))' }}>
              <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#94A3B8' }}>Current Period</p>
              <p className="text-sm font-bold" style={{ color: '#0F4C81' }}>Q2 2026</p>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>Apr – Jun 2026</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0,137,123,0.04), rgba(0,137,123,0.08))' }}>
              <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#94A3B8' }}>Unit Score</p>
              <p className="text-sm font-bold" style={{ color: unitScore >= 70 ? '#2E7D32' : unitScore >= 50 ? '#0F4C81' : '#C62828' }}>{unitScore}%</p>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                {unitScore >= directorateAvg ? 'Above' : 'Below'} directorate avg ({directorateAvg}%)
              </p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(46,125,50,0.04), rgba(46,125,50,0.08))' }}>
              <p className="text-[10px] uppercase font-bold mb-1" style={{ color: '#94A3B8' }}>Completion Rate</p>
              <p className="text-sm font-bold" style={{ color: '#2E7D32' }}>
                {myActivities > 0 ? Math.round((completed / myActivities) * 100) : 0}%
              </p>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>{completed} of {myActivities} activities</p>
            </div>
          </div>
          <Link
            href="/reports"
            className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
            style={{ background: 'rgba(15,76,129,0.06)', color: '#0F4C81' }}
          >
            <FileText className="w-4 h-4" />
            View Full Performance Report
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Upload Report Modal */}
      {showUploadReport && (
        <div className="modal-overlay" onClick={() => setShowUploadReport(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>Upload Unit Report</h2>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Submit your periodic performance report.</p>
              </div>
              <button onClick={() => setShowUploadReport(false)} className="btn-ghost btn-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed rounded-2xl p-8 text-center transition-colors hover:border-[#2E7D32]" style={{ borderColor: '#E2E8F0' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(46,125,50,0.08)' }}>
                  <File className="w-7 h-7" style={{ color: '#2E7D32' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1E293B' }}>Drop your report file here, or click to browse</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>Supports .pdf, .docx, .xlsx</p>
                <input type="file" className="hidden" accept=".pdf,.docx,.xlsx" />
                <button className="btn-outline btn-sm mt-4">Browse Files</button>
              </div>
              <div>
                <label className="form-label">Report Title</label>
                <input type="text" className="form-input" placeholder="e.g., Monthly Progress Report - June 2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Report Type</label>
                  <select className="form-select">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Period</label>
                  <input type="text" className="form-input" placeholder="e.g., Q2 2026" />
                </div>
              </div>
              <div>
                <label className="form-label">Description (Optional)</label>
                <textarea className="form-textarea" placeholder="Briefly describe the contents..." rows={2}></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowUploadReport(false)} className="btn-outline">Cancel</button>
              <button onClick={() => { setShowUploadReport(false); alert('Report uploaded successfully! (Demo)'); }} className="btn-primary" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
                <Upload className="w-4 h-4" /> Upload Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <article className="kpi-card">
      <div className="kpi-icon" style={{ background: bg }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="kpi-label">{label}</p>
        <p className="kpi-value animate-count-up">{value}</p>
      </div>
    </article>
  );
}

function ComparisonBar({ label, sublabel, score, highlight }: {
  label: string;
  sublabel: string;
  score: number;
  highlight?: boolean;
}) {
  const barColor = score >= 70
    ? 'linear-gradient(90deg, #2E7D32, #43A047)'
    : score >= 50
    ? 'linear-gradient(90deg, #0F4C81, #1565A8)'
    : 'linear-gradient(90deg, #C62828, #E53935)';

  const textColor = score >= 70 ? '#2E7D32' : score >= 50 ? '#0F4C81' : '#C62828';

  return (
    <div className={`p-4 rounded-xl transition-all ${highlight ? 'shadow-sm' : ''}`}
      style={{
        background: highlight ? 'rgba(15,76,129,0.04)' : '#F8FAFC',
        border: highlight ? '2px solid rgba(15,76,129,0.15)' : '1px solid transparent',
      }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>
            {label}
            {highlight && <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(15,76,129,0.1)', color: '#0F4C81' }}>YOU</span>}
          </p>
          <p className="text-[11px]" style={{ color: '#94A3B8' }}>{sublabel}</p>
        </div>
        <span className="text-lg font-bold tabular-nums" style={{ color: textColor }}>{score}%</span>
      </div>
      <div className="progress-track h-3">
        <div
          className="progress-fill"
          style={{ width: `${score}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
