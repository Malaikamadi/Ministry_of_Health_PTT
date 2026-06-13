'use client';

import { Activity, CheckCircle2, AlertTriangle, Clock, FileText, FolderOpen, ArrowRight, Upload, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { activities, getActivitiesByUnit, activityStatusConfig } from '@/data/activities';
import { units } from '@/data/units';
import { formatDate } from '@/lib/utils';

export default function UnitDashboard() {
  const { user } = useAuth();

  const unitId = user?.unitId || 'unit-001';
  const unit = units.find((u) => u.id === unitId) || units[0];
  const unitActivities = getActivitiesByUnit(unitId);

  const myActivities = unitActivities.length;
  const active = unitActivities.filter((a) => a.status === 'in_progress').length;
  const completed = unitActivities.filter((a) => a.status === 'completed').length;
  const pendingVerification = unitActivities.filter((a) => a.status === 'pending_verification').length;
  const overdue = unitActivities.filter((a) => {
    const end = new Date(a.endDate);
    return end < new Date() && a.status !== 'completed';
  }).length;

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
          <div className="flex gap-2">
            <Link href="/activities" className="btn-secondary btn-sm"><Activity className="w-4 h-4" /> My Activities</Link>
            <Link href="/evidence" className="btn-outline btn-sm"><Upload className="w-4 h-4" /> Upload Evidence</Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
        <KpiCard icon={Activity} label="My Activities" value={`${myActivities}`} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={TrendingUp} label="Active" value={`${active}`} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={CheckCircle2} label="Completed" value={`${completed}`} color="#2E7D32" bg="rgba(46,125,50,0.08)" />
        <KpiCard icon={Clock} label="Pending Verify" value={`${pendingVerification}`} color="#F9A825" bg="rgba(249,168,37,0.08)" />
        <KpiCard icon={AlertTriangle} label="Overdue" value={`${overdue}`} color="#C62828" bg="rgba(198,40,40,0.08)" />
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

        {/* Evidence Upload Status */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Evidence Upload Status</h3>
            <Link href="/evidence" className="btn-ghost btn-sm">Upload <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-6 mb-6">
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
              <div className="flex rounded-full overflow-hidden h-3">
                <div style={{ width: `${(verifiedEvidence / totalEvidence) * 100}%`, background: '#2E7D32' }} className="transition-all" />
                <div style={{ width: `${((totalEvidence - verifiedEvidence) / totalEvidence) * 100}%`, background: '#F9A825' }} className="transition-all" />
              </div>
            )}

            {/* Performance Summary */}
            <div className="mt-6 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#1E293B' }}>Performance Summary</h4>
              <div className="flex items-center gap-3">
                <div className="progress-track flex-1 h-3">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${unit.performanceScore}%`,
                      background: unit.performanceScore >= 70 ? 'linear-gradient(90deg, #2E7D32, #43A047)' :
                        unit.performanceScore >= 50 ? 'linear-gradient(90deg, #0F4C81, #1565A8)' :
                        'linear-gradient(90deg, #C62828, #E53935)',
                    }}
                  />
                </div>
                <span className="text-lg font-bold" style={{
                  color: unit.performanceScore >= 70 ? '#2E7D32' : unit.performanceScore >= 50 ? '#0F4C81' : '#C62828',
                }}>{unit.performanceScore}%</span>
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
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ComponentType<{ className?: string }>;
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
