'use client';

import { Building2, Activity, CheckCircle2, AlertTriangle, TrendingUp, ArrowRight, Clock, FileText, FolderOpen, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { directorates } from '@/data/directorates';
import { units, getUnitsByDirectorate } from '@/data/units';
import { activities, getActivitiesByDirectorate, activityStatusConfig } from '@/data/activities';
import { formatDate } from '@/lib/utils';

export default function DirectorateDashboard() {
  const { user } = useAuth();

  const directorateId = user?.directorateId || 'dir-003';
  const directorate = directorates.find((d) => d.id === directorateId) || directorates[2];
  const dirUnits = getUnitsByDirectorate(directorateId);
  const dirActivities = getActivitiesByDirectorate(directorateId);

  const activeActs = dirActivities.filter((a) => a.status === 'in_progress').length;
  const completedActs = dirActivities.filter((a) => a.status === 'completed').length;
  const delayedActs = dirActivities.filter((a) => {
    const end = new Date(a.endDate);
    return end < new Date() && a.status !== 'completed';
  }).length;
  const performanceScore = directorate.performanceScore;

  const awaitingReview = dirActivities.filter((a) => a.status === 'pending_verification' || a.status === 'submitted');
  const recentEvidence = dirActivities
    .flatMap((a) => a.evidence.map((ev) => ({ ...ev, activityTitle: a.title, activityId: a.id })))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);

  const upcomingDeadlines = dirActivities
    .filter((a) => a.status !== 'completed' && new Date(a.endDate) >= new Date())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card p-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(15,76,129,0.04) 0%, rgba(0,137,123,0.03) 100%)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge-primary badge font-bold">{directorate.code}</span>
                <span className="badge text-[10px] font-bold" style={{ background: 'rgba(15,76,129,0.08)', color: '#0F4C81' }}>Director View</span>
              </div>
              <h1 className="mt-2 text-xl font-bold tracking-tight" style={{ color: '#0F172A' }}>{directorate.name}</h1>
              <p className="mt-1 text-sm" style={{ color: '#64748B' }}>
                Signed in as <span className="font-semibold">{user?.name || directorate.director}</span> — overseeing {dirUnits.length} units
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/activities" className="btn-primary btn-sm"><Activity className="w-4 h-4" /> View Activities</Link>
            <Link href="/reports" className="btn-outline btn-sm"><FileText className="w-4 h-4" /> Reports</Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
        <KpiCard icon={Building2} label="Total Units" value={`${dirUnits.length}`} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={Activity} label="Active Activities" value={`${activeActs}`} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={CheckCircle2} label="Completed" value={`${completedActs}`} color="#2E7D32" bg="rgba(46,125,50,0.08)" />
        <KpiCard icon={AlertTriangle} label="Delayed" value={`${delayedActs}`} color="#C62828" bg="rgba(198,40,40,0.08)" />
        <KpiCard icon={TrendingUp} label="Performance" value={`${performanceScore}%`} color="#00897B" bg="rgba(0,137,123,0.08)" />
      </div>

      {/* Unit Performance Comparison */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <div>
            <h3 className="heading-section">Unit Performance Comparison</h3>
            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Performance scores across units in this directorate</p>
          </div>
          <Link href="/units" className="btn-ghost btn-sm">All Units <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="p-5 space-y-4">
          {dirUnits.map((unit) => (
            <div key={unit.id} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
                {unit.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{unit.name}</div>
                <div className="text-[11px]" style={{ color: '#94A3B8' }}>{unit.focalPerson}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="progress-track w-20 h-2">
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
                <span className="text-sm font-bold tabular-nums w-10 text-right" style={{
                  color: unit.performanceScore >= 70 ? '#2E7D32' : unit.performanceScore >= 50 ? '#0F4C81' : '#C62828',
                }}>{unit.performanceScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awaiting Review & Evidence */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activities Awaiting Review */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Awaiting Your Review</h3>
            <span className="badge-warning badge">{awaitingReview.length}</span>
          </div>
          {awaitingReview.length > 0 ? (
            <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              {awaitingReview.slice(0, 5).map((act) => {
                const cfg = activityStatusConfig[act.status];
                return (
                  <Link key={act.id} href={`/activities/${act.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dotColor }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{act.title}</p>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>{act.unitName}</p>
                    </div>
                    <span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-state py-10">
              <CheckCircle2 className="w-8 h-8 mb-2" style={{ color: '#2E7D32' }} />
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>All caught up!</p>
            </div>
          )}
        </div>

        {/* Recently Submitted Evidence */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Recent Evidence</h3>
            <Link href="/evidence" className="btn-ghost btn-sm">Repository <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {recentEvidence.length > 0 ? (
            <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              {recentEvidence.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(0,137,123,0.08)' }}>
                    <FolderOpen className="w-4 h-4" style={{ color: '#00897B' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{ev.fileName}</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{ev.uploadedBy} · {formatDate(ev.uploadedAt)}</p>
                  </div>
                  {ev.verified ? (
                    <span className="badge-success badge text-[10px]">Verified</span>
                  ) : (
                    <span className="badge-warning badge text-[10px]">Pending</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-10">
              <FolderOpen className="w-8 h-8 mb-2" style={{ color: '#94A3B8' }} />
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>No evidence uploaded yet</p>
            </div>
          )}
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
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3.5 h-3.5" style={{ color: daysLeft <= 7 ? '#C62828' : '#F9A825' }} />
                    <span className="text-xs font-bold" style={{ color: daysLeft <= 7 ? '#C62828' : '#F9A825' }}>
                      {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: '#1E293B' }}>{act.title}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Due: {formatDate(act.endDate)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="progress-track flex-1 h-1.5">
                      <div className="progress-fill progress-fill-primary" style={{ width: `${act.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold tabular-nums">{act.progress}%</span>
                  </div>
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
