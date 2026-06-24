'use client';

import { use } from 'react';
import { ClipboardCheck, ArrowLeft, Activity, CheckCircle2, AlertTriangle, TrendingUp, User, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { units } from '@/data/units';
import { directorates } from '@/data/directorates';
import { getActivitiesByUnit, activityStatusConfig } from '@/data/activities';
import { getReportsByUnit, reportStatusConfig, reportTypeLabels } from '@/data/unit-reports';
import { formatDate } from '@/lib/utils';

export default function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const unit = units.find((u) => u.id === id);

  if (!unit) {
    return (
      <div className="empty-state min-h-[400px]">
        <ClipboardCheck className="w-12 h-12 mb-3" style={{ color: '#94A3B8' }} />
        <h2 className="text-lg font-bold mb-1" style={{ color: '#1E293B' }}>Unit Not Found</h2>
        <Link href="/units" className="btn-primary mt-4"><ArrowLeft className="w-4 h-4" /> Back</Link>
      </div>
    );
  }

  const directorate = directorates.find((d) => d.id === unit.directorateId);
  const unitActivities = getActivitiesByUnit(id);
  const reports = getReportsByUnit(id);

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/units" className="btn-ghost btn-sm inline-flex"><ArrowLeft className="w-4 h-4" /> Back to Units</Link>

      <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(0,137,123,0.04), rgba(15,76,129,0.02))' }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0" style={{ background: 'linear-gradient(135deg, #00897B, #00796B)' }}>
            <ClipboardCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex gap-2"><span className="badge-primary badge text-[10px]">{unit.directorateCode}</span><span className="badge-teal badge text-[10px]">{directorate?.code}</span></div>
            <h1 className="mt-2 text-xl font-bold" style={{ color: '#0F172A' }}>{unit.name}</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>{unit.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <User className="w-4 h-4" style={{ color: '#94A3B8' }} />
              <span className="text-sm" style={{ color: '#475569' }}>Focal Person: <span className="font-semibold">{unit.focalPerson}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><Activity className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Activities</p><p className="kpi-value">{unit.totalActivities}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Completed</p><p className="kpi-value">{unit.completedActivities}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(198,40,40,0.08)' }}><AlertTriangle className="w-5 h-5" style={{ color: '#C62828' }} /></div><div><p className="kpi-label">Overdue</p><p className="kpi-value">{unit.overdueActivities}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(0,137,123,0.08)' }}><TrendingUp className="w-5 h-5" style={{ color: '#00897B' }} /></div><div><p className="kpi-label">Performance</p><p className="kpi-value">{unit.performanceScore}%</p></div></div>
      </div>

      <div className="card overflow-hidden">
        <div className="section-header"><h3 className="heading-section">Activities</h3></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Activity</th><th>Status</th><th>Progress</th><th>Start Date</th><th>End Date</th><th>Priority</th></tr></thead>
            <tbody>
              {unitActivities.map((act) => {
                const cfg = activityStatusConfig[act.status];
                return (
                  <tr key={act.id}>
                    <td><Link href={`/activities/${act.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>{act.title}</Link></td>
                    <td><span className={`${cfg.badgeClass} badge text-[10px]`}>{cfg.label}</span></td>
                    <td><div className="flex items-center gap-2"><div className="progress-track w-16 h-1.5"><div className="progress-fill progress-fill-primary" style={{ width: `${act.progress}%` }} /></div><span className="text-xs font-bold tabular-nums">{act.progress}%</span></div></td>
                    <td className="text-sm tabular-nums">{formatDate(act.startDate)}</td>
                    <td className="text-sm tabular-nums">{formatDate(act.endDate)}</td>
                    <td><span className={act.priority === 'high' ? 'badge-danger' : act.priority === 'medium' ? 'badge-warning' : 'badge-slate'} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{act.priority}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="section-header"><h3 className="heading-section">Unit Reports</h3></div>
        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Report Title</th><th>Type</th><th>Period</th><th>Uploaded By</th><th>Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {reports.map((report) => {
                  const statusCfg = reportStatusConfig[report.status];
                  return (
                    <tr key={report.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 shrink-0" style={{ color: '#0F4C81' }} />
                          <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{report.title}</span>
                        </div>
                      </td>
                      <td><span className="badge-slate badge text-[10px]">{reportTypeLabels[report.reportType]}</span></td>
                      <td className="text-sm">{report.period}</td>
                      <td className="text-sm">{report.uploadedBy}</td>
                      <td className="text-sm tabular-nums">{formatDate(report.uploadedAt)}</td>
                      <td><span className={`${statusCfg.badgeClass} badge text-[10px]`}>{statusCfg.label}</span></td>
                      <td><button className="btn-ghost btn-sm" title="Download"><Download className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-8">
            <FileText className="w-10 h-10 mb-2" style={{ color: '#94A3B8' }} />
            <p className="text-sm font-medium" style={{ color: '#64748B' }}>No reports submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
