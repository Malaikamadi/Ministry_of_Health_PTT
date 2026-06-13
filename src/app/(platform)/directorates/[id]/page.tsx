'use client';

import { use } from 'react';
import { Building2, ArrowLeft, Users, Activity, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { directorates } from '@/data/directorates';
import { getUnitsByDirectorate } from '@/data/units';
import { getActivitiesByDirectorate, activityStatusConfig } from '@/data/activities';
import { formatDate } from '@/lib/utils';

export default function DirectorateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const directorate = directorates.find((d) => d.id === id);

  if (!directorate) {
    return (
      <div className="empty-state min-h-[400px]">
        <Building2 className="w-12 h-12 mb-3" style={{ color: '#94A3B8' }} />
        <h2 className="text-lg font-bold mb-1" style={{ color: '#1E293B' }}>Directorate Not Found</h2>
        <Link href="/directorates" className="btn-primary mt-4"><ArrowLeft className="w-4 h-4" /> Back</Link>
      </div>
    );
  }

  const dirUnits = getUnitsByDirectorate(id);
  const dirActivities = getActivitiesByDirectorate(id);

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/directorates" className="btn-ghost btn-sm inline-flex"><ArrowLeft className="w-4 h-4" /> Back to Directorates</Link>

      <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(15,76,129,0.04), rgba(0,137,123,0.02))' }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="badge-primary badge font-bold">{directorate.code}</span>
            <h1 className="mt-2 text-xl font-bold" style={{ color: '#0F172A' }}>{directorate.name}</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>{directorate.description}</p>
            <p className="text-sm mt-2" style={{ color: '#475569' }}>Director: <span className="font-semibold">{directorate.director}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><Users className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Units</p><p className="kpi-value">{dirUnits.length}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Completed</p><p className="kpi-value">{directorate.completedActivities}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(198,40,40,0.08)' }}><AlertTriangle className="w-5 h-5" style={{ color: '#C62828' }} /></div><div><p className="kpi-label">Overdue</p><p className="kpi-value">{directorate.overdueActivities}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(0,137,123,0.08)' }}><TrendingUp className="w-5 h-5" style={{ color: '#00897B' }} /></div><div><p className="kpi-label">Performance</p><p className="kpi-value">{directorate.performanceScore}%</p></div></div>
      </div>

      <div className="card overflow-hidden">
        <div className="section-header"><h3 className="heading-section">Units in {directorate.code}</h3></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Unit</th><th>Focal Person</th><th>Activities</th><th>Performance</th><th>Status</th></tr></thead>
            <tbody>
              {dirUnits.map((unit) => (
                <tr key={unit.id}>
                  <td><Link href={`/units/${unit.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>{unit.name}</Link></td>
                  <td className="text-sm">{unit.focalPerson}</td>
                  <td className="text-sm tabular-nums">{unit.totalActivities}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-track w-16 h-1.5"><div className="progress-fill" style={{ width: `${unit.performanceScore}%`, background: unit.performanceScore >= 70 ? '#2E7D32' : unit.performanceScore >= 50 ? '#0F4C81' : '#C62828' }} /></div>
                      <span className="text-xs font-bold tabular-nums">{unit.performanceScore}%</span>
                    </div>
                  </td>
                  <td><span className={unit.status === 'active' ? 'badge-success badge text-[10px]' : 'badge-slate badge text-[10px]'}>{unit.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="section-header"><h3 className="heading-section">Activities</h3></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Activity</th><th>Unit</th><th>Status</th><th>Progress</th><th>Due Date</th></tr></thead>
            <tbody>
              {dirActivities.map((act) => {
                const cfg = activityStatusConfig[act.status];
                return (
                  <tr key={act.id}>
                    <td><Link href={`/activities/${act.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>{act.title}</Link></td>
                    <td className="text-sm">{act.unitName}</td>
                    <td><span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span></td>
                    <td><div className="flex items-center gap-2"><div className="progress-track w-16 h-1.5"><div className="progress-fill progress-fill-primary" style={{ width: `${act.progress}%` }} /></div><span className="text-xs font-bold tabular-nums">{act.progress}%</span></div></td>
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
