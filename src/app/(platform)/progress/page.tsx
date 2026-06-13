'use client';

import { TrendingUp, Activity, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { activities, activityStatusConfig } from '@/data/activities';
import { directorates } from '@/data/directorates';
import { formatDate } from '@/lib/utils';

export default function ProgressPage() {
  const inProgressActivities = activities.filter((a) => a.status === 'in_progress' || a.status === 'pending_verification');
  const avgProgress = Math.round(activities.reduce((s, a) => s + a.progress, 0) / activities.length);

  const monthlyProgress = [
    { month: 'Jan', value: 25 }, { month: 'Feb', value: 35 }, { month: 'Mar', value: 48 },
    { month: 'Apr', value: 55 }, { month: 'May', value: 62 }, { month: 'Jun', value: avgProgress },
  ];
  const maxVal = Math.max(...monthlyProgress.map((m) => m.value));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="heading-page">Performance Monitoring</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track progress, completion rates, and performance trends.</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><TrendingUp className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Avg Progress</p><p className="kpi-value">{avgProgress}%</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Completion Rate</p><p className="kpi-value">{Math.round((activities.filter(a => a.status === 'completed').length / activities.length) * 100)}%</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><Activity className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Active Tracking</p><p className="kpi-value">{inProgressActivities.length}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(249,168,37,0.08)' }}><Clock className="w-5 h-5" style={{ color: '#F9A825' }} /></div><div><p className="kpi-label">Pending Verify</p><p className="kpi-value">{activities.filter(a => a.status === 'pending_verification').length}</p></div></div>
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
