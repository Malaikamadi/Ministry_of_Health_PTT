'use client';

import { TrendingUp, Activity, CheckCircle2, Clock, ArrowRight, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import { activities, getActivitiesByUnit, getActivitiesByDirectorate, activityStatusConfig } from '@/data/activities';
import { directorates } from '@/data/directorates';
import { units, getUnitsByDirectorate } from '@/data/units';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';

export default function ProgressPage() {
  const { user } = useAuth();

  // Role-aware rendering
  if (user?.role === 'unit_focal') {
    return <UnitFocalView />;
  }
  if (user?.role === 'directorate_admin') {
    return <DirectorateAdminView />;
  }
  return <SuperAdminView />;
}

/* ────────────────────────────────────────────────────────────────
   UNIT FOCAL VIEW — Feedback #3 & #5
   Show unit-specific progress and compare to directorate/Ministry
──────────────────────────────────────────────────────────────── */
function UnitFocalView() {
  const { user } = useAuth();
  const unitId = user?.unitId || 'unit-001';
  const unit = units.find((u) => u.id === unitId) || units[0];
  const unitActivities = getActivitiesByUnit(unitId);
  const directorate = directorates.find((d) => d.id === unit.directorateId);
  const dirUnits = getUnitsByDirectorate(unit.directorateId);

  const completed = unitActivities.filter((a) => a.status === 'completed').length;
  const ongoing = unitActivities.filter((a) => a.status === 'in_progress').length;
  const pending = unitActivities.filter((a) => a.status === 'pending_verification').length;
  const avgProgress = unitActivities.length > 0
    ? Math.round(unitActivities.reduce((s, a) => s + a.progress, 0) / unitActivities.length)
    : 0;

  const unitScore = unit.performanceScore;
  const directorateAvg = dirUnits.length > 0
    ? Math.round(dirUnits.reduce((s, u) => s + u.performanceScore, 0) / dirUnits.length)
    : 0;
  const ministryAvg = Math.round(directorates.reduce((s, d) => s + d.performanceScore, 0) / directorates.length);

  // Mock monthly progress for unit
  const monthlyProgress = [
    { month: 'Jan', value: Math.max(10, unitScore - 40) },
    { month: 'Feb', value: Math.max(15, unitScore - 30) },
    { month: 'Mar', value: Math.max(25, unitScore - 20) },
    { month: 'Apr', value: Math.max(35, unitScore - 12) },
    { month: 'May', value: Math.max(45, unitScore - 5) },
    { month: 'Jun', value: unitScore },
  ];
  const maxVal = Math.max(...monthlyProgress.map((m) => m.value));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="heading-page">Performance Monitoring</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track your unit's progress and compare to directorate and ministry performance.</p>
      </div>

      {/* Summary KPIs — Feedback #4: Rename labels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><TrendingUp className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Avg Progress</p><p className="kpi-value">{avgProgress}%</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Completed Activities</p><p className="kpi-value">{completed}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><Activity className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Ongoing Activities</p><p className="kpi-value">{ongoing}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(249,168,37,0.08)' }}><Clock className="w-5 h-5" style={{ color: '#F9A825' }} /></div><div><p className="kpi-label">Pending Activities</p><p className="kpi-value">{pending}</p></div></div>
      </div>

      {/* Unit Progress Trend */}
      <div className="card overflow-hidden">
        <div className="section-header"><h3 className="heading-section">Your Progress Trend</h3></div>
        <div className="p-5">
          <div className="flex items-end gap-4 h-52">
            {monthlyProgress.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold tabular-nums" style={{ color: '#0F4C81' }}>{m.value}%</span>
                <div className="w-full flex flex-col justify-end" style={{ height: '180px' }}>
                  <div className="w-full rounded-t-lg transition-all duration-700" style={{
                    height: `${(m.value / maxVal) * 100}%`,
                    background: `linear-gradient(180deg, #00897B 0%, ${i === monthlyProgress.length - 1 ? '#0F4C81' : '#00796B'} 100%)`,
                    opacity: 0.3 + (i / monthlyProgress.length) * 0.7,
                  }} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: '#94A3B8' }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback #5: Performance Comparison — Unit vs Directorate vs Ministry */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Performance Comparison</h3>
          <span className="text-xs" style={{ color: '#94A3B8' }}>Your unit vs directorate vs ministry</span>
        </div>
        <div className="p-5 space-y-5">
          <ComparisonBar label="Your Unit" sublabel={unit.name} score={unitScore} highlight />
          <ComparisonBar label="Directorate Average" sublabel={directorate?.code || '—'} score={directorateAvg} />
          <ComparisonBar label="Ministry Average" sublabel="All Directorates" score={ministryAvg} />
        </div>
      </div>

      {/* Unit's Active Activities */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Your Activities</h3>
          <Link href="/activities" className="btn-ghost btn-sm">All Activities <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Activity</th><th>Progress</th><th>Status</th><th>Due Date</th></tr></thead>
            <tbody>
              {unitActivities.map((act) => {
                const cfg = activityStatusConfig[act.status];
                return (
                  <tr key={act.id}>
                    <td><Link href={`/activities/${act.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>{act.title}</Link></td>
                    <td><div className="flex items-center gap-2"><div className="progress-track w-24 h-2"><div className="progress-fill progress-fill-primary" style={{ width: `${act.progress}%` }} /></div><span className="text-xs font-bold tabular-nums">{act.progress}%</span></div></td>
                    <td><span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span></td>
                    <td className="text-sm tabular-nums">{formatDate(act.endDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   DIRECTORATE ADMIN VIEW — Feedback #10
   Compare directorate to other directorates and Ministry overall
──────────────────────────────────────────────────────────────── */
function DirectorateAdminView() {
  const { user } = useAuth();
  const directorateId = user?.directorateId || 'dir-003';
  const directorate = directorates.find((d) => d.id === directorateId) || directorates[2];
  const dirActivities = getActivitiesByDirectorate(directorateId);
  const dirUnits = getUnitsByDirectorate(directorateId);

  const completed = dirActivities.filter((a) => a.status === 'completed').length;
  const ongoing = dirActivities.filter((a) => a.status === 'in_progress').length;
  const pending = dirActivities.filter((a) => a.status === 'pending_verification').length;
  const avgProgress = dirActivities.length > 0
    ? Math.round(dirActivities.reduce((s, a) => s + a.progress, 0) / dirActivities.length)
    : 0;

  const ministryAvg = Math.round(directorates.reduce((s, d) => s + d.performanceScore, 0) / directorates.length);

  // Rank directorates by performance
  const rankedDirs = [...directorates].sort((a, b) => b.performanceScore - a.performanceScore);

  // In-progress activities for tracking table
  const inProgressActivities = dirActivities.filter((a) => a.status === 'in_progress' || a.status === 'pending_verification');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="heading-page">Performance Monitoring</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          {directorate.code} — Track performance and compare to other directorates and the ministry.
        </p>
      </div>

      {/* Summary KPIs — Feedback #4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><TrendingUp className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Avg Progress</p><p className="kpi-value">{avgProgress}%</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Completed Activities</p><p className="kpi-value">{completed}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><Activity className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Ongoing Activities</p><p className="kpi-value">{ongoing}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(249,168,37,0.08)' }}><Clock className="w-5 h-5" style={{ color: '#F9A825' }} /></div><div><p className="kpi-label">Pending Activities</p><p className="kpi-value">{pending}</p></div></div>
      </div>

      {/* Feedback #10: Directorate Comparison */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <div>
            <h3 className="heading-section">Directorate Comparison</h3>
            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Your directorate compared to others and the Ministry overall</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Ministry Average header */}
          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(0,137,123,0.04)', border: '1px solid rgba(0,137,123,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00897B, #00796B)' }}>
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>Ministry Average</p>
                <p className="text-[11px]" style={{ color: '#94A3B8' }}>All Directorates</p>
              </div>
            </div>
            <span className="text-lg font-bold tabular-nums" style={{ color: '#00897B' }}>{ministryAvg}%</span>
          </div>

          {/* Directorate bars */}
          {rankedDirs.map((dir) => {
            const isCurrent = dir.id === directorate.id;
            const barColor = dir.performanceScore >= 70
              ? 'linear-gradient(90deg, #2E7D32, #43A047)'
              : dir.performanceScore >= 50
              ? 'linear-gradient(90deg, #0F4C81, #1565A8)'
              : 'linear-gradient(90deg, #C62828, #E53935)';
            const textColor = dir.performanceScore >= 70 ? '#2E7D32' : dir.performanceScore >= 50 ? '#0F4C81' : '#C62828';

            return (
              <div key={dir.id} className={`p-4 rounded-xl transition-all ${isCurrent ? 'shadow-sm' : ''}`}
                style={{
                  background: isCurrent ? 'rgba(15,76,129,0.04)' : '#F8FAFC',
                  border: isCurrent ? '2px solid rgba(15,76,129,0.15)' : '1px solid transparent',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="badge-primary badge text-[10px] font-bold">{dir.code}</span>
                    <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>{dir.name}</span>
                    {isCurrent && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(15,76,129,0.1)', color: '#0F4C81' }}>YOU</span>}
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: textColor }}>{dir.performanceScore}%</span>
                </div>
                <div className="progress-track h-3">
                  <div className="progress-fill" style={{ width: `${dir.performanceScore}%`, background: barColor }} />
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs" style={{ color: '#94A3B8' }}>
                  <span>{dir.completedActivities}/{dir.totalActivities} completed</span>
                  <span>{dir.totalUnits} units</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit Performance within Directorate */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Unit Performance — {directorate.code}</h3>
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
                  <div className="progress-fill" style={{
                    width: `${unit.performanceScore}%`,
                    background: unit.performanceScore >= 70 ? 'linear-gradient(90deg, #2E7D32, #43A047)' :
                      unit.performanceScore >= 50 ? 'linear-gradient(90deg, #0F4C81, #1565A8)' :
                      'linear-gradient(90deg, #C62828, #E53935)',
                  }} />
                </div>
                <span className="text-sm font-bold tabular-nums w-10 text-right" style={{
                  color: unit.performanceScore >= 70 ? '#2E7D32' : unit.performanceScore >= 50 ? '#0F4C81' : '#C62828',
                }}>{unit.performanceScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Tracking */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Currently Tracking</h3>
          <Link href="/activities" className="btn-ghost btn-sm">All Activities <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Activity</th><th>Unit</th><th>Progress</th><th>Status</th><th>Updates</th></tr></thead>
            <tbody>
              {inProgressActivities.map((act) => {
                const cfg = activityStatusConfig[act.status];
                return (
                  <tr key={act.id}>
                    <td><Link href={`/activities/${act.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>{act.title}</Link></td>
                    <td className="text-sm">{act.unitName}</td>
                    <td><div className="flex items-center gap-2"><div className="progress-track w-24 h-2"><div className="progress-fill progress-fill-primary" style={{ width: `${act.progress}%` }} /></div><span className="text-xs font-bold tabular-nums">{act.progress}%</span></div></td>
                    <td><span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span></td>
                    <td className="text-sm tabular-nums">{act.progressUpdates.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   SUPER ADMIN VIEW — Original Ministry-wide view
──────────────────────────────────────────────────────────────── */
function SuperAdminView() {
  const inProgressActivities = activities.filter((a) => a.status === 'in_progress' || a.status === 'pending_verification');
  const avgProgress = Math.round(activities.reduce((s, a) => s + a.progress, 0) / activities.length);

  const completed = activities.filter(a => a.status === 'completed').length;
  const ongoing = activities.filter(a => a.status === 'in_progress').length;
  const pending = activities.filter(a => a.status === 'pending_verification').length;

  const monthlyProgress = [
    { month: 'Jan', value: 25 }, { month: 'Feb', value: 35 }, { month: 'Mar', value: 48 },
    { month: 'Apr', value: 55 }, { month: 'May', value: 62 }, { month: 'Jun', value: avgProgress },
  ];
  const maxVal = Math.max(...monthlyProgress.map((m) => m.value));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="heading-page">Performance Monitoring</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track progress, completion rates, and performance trends across the ministry.</p>
      </div>

      {/* Summary KPIs — Feedback #4: Rename labels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><TrendingUp className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Avg Progress</p><p className="kpi-value">{avgProgress}%</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Completed Activities</p><p className="kpi-value">{completed}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><Activity className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Ongoing Activities</p><p className="kpi-value">{ongoing}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(249,168,37,0.08)' }}><Clock className="w-5 h-5" style={{ color: '#F9A825' }} /></div><div><p className="kpi-label">Pending Activities</p><p className="kpi-value">{pending}</p></div></div>
      </div>

      {/* Progress Trend Chart */}
      <div className="card overflow-hidden">
        <div className="section-header"><h3 className="heading-section">Ministry-wide Progress Trend</h3></div>
        <div className="p-5">
          <div className="flex items-end gap-4 h-52">
            {monthlyProgress.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold tabular-nums" style={{ color: '#0F4C81' }}>{m.value}%</span>
                <div className="w-full flex flex-col justify-end" style={{ height: '180px' }}>
                  <div className="w-full rounded-t-lg transition-all duration-700" style={{
                    height: `${(m.value / maxVal) * 100}%`,
                    background: `linear-gradient(180deg, #0F4C81 0%, ${i === monthlyProgress.length - 1 ? '#00897B' : '#1565A8'} 100%)`,
                    opacity: 0.2 + (i / monthlyProgress.length) * 0.8,
                  }} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: '#94A3B8' }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Directorate-level Progress */}
      <div className="card overflow-hidden">
        <div className="section-header"><h3 className="heading-section">Directorate Performance Breakdown</h3></div>
        <div className="p-5 space-y-5">
          {directorates.map((dir) => {
            const dirActs = activities.filter((a) => a.directorateId === dir.id);
            const dirCompleted = dirActs.filter((a) => a.status === 'completed').length;
            const dirTotal = dirActs.length;
            return (
              <div key={dir.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="badge-primary badge text-[10px] font-bold">{dir.code}</span>
                    <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>{dir.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: dir.performanceScore >= 70 ? '#2E7D32' : dir.performanceScore >= 50 ? '#0F4C81' : '#C62828' }}>
                    {dir.performanceScore}%
                  </span>
                </div>
                <div className="progress-track h-3">
                  <div className="progress-fill" style={{
                    width: `${dir.performanceScore}%`,
                    background: dir.performanceScore >= 70 ? 'linear-gradient(90deg, #2E7D32, #43A047)' : dir.performanceScore >= 50 ? 'linear-gradient(90deg, #0F4C81, #1565A8)' : 'linear-gradient(90deg, #C62828, #E53935)',
                  }} />
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs" style={{ color: '#94A3B8' }}>
                  <span>{dirCompleted}/{dirTotal} completed</span>
                  <span>{dir.totalUnits} units</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Activities List */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h3 className="heading-section">Currently Tracking</h3>
          <Link href="/activities" className="btn-ghost btn-sm">All Activities <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Activity</th><th>Unit</th><th>Progress</th><th>Status</th><th>Updates</th></tr></thead>
            <tbody>
              {inProgressActivities.map((act) => {
                const cfg = activityStatusConfig[act.status];
                return (
                  <tr key={act.id}>
                    <td><Link href={`/activities/${act.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>{act.title}</Link></td>
                    <td className="text-sm">{act.unitName}</td>
                    <td><div className="flex items-center gap-2"><div className="progress-track w-24 h-2"><div className="progress-fill progress-fill-primary" style={{ width: `${act.progress}%` }} /></div><span className="text-xs font-bold tabular-nums">{act.progress}%</span></div></td>
                    <td><span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span></td>
                    <td className="text-sm tabular-nums">{act.progressUpdates.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───── Shared Components ───── */
function ComparisonBar({ label, sublabel, score, highlight }: {
  label: string; sublabel: string; score: number; highlight?: boolean;
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
        <div className="progress-fill" style={{ width: `${score}%`, background: barColor }} />
      </div>
    </div>
  );
}
