'use client';

import { useState } from 'react';
import { FileText, Download, BarChart3, Building2, Activity, Calendar } from 'lucide-react';
import { directorates } from '@/data/directorates';
import { activities, activityStatusConfig } from '@/data/activities';
import { units } from '@/data/units';
import { unitReports, getReportsByDirectorate, reportStatusConfig, reportTypeLabels } from '@/data/unit-reports';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('ministry');
  const [period, setPeriod] = useState('quarterly');
  const [filterDir, setFilterDir] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredDirectorates = user?.role === 'directorate_admin' ? directorates.filter(d => d.id === user.directorateId) : directorates;
  const filteredActivities = user?.role === 'directorate_admin' ? activities.filter(a => a.directorateId === user.directorateId) : activities;
  const filteredReports = user?.role === 'directorate_admin' ? getReportsByDirectorate(user.directorateId!) : unitReports;

  const completedCount = filteredActivities.filter((a) => a.status === 'completed').length;
  const avgPerformance = filteredDirectorates.length > 0 ? Math.round(filteredDirectorates.reduce((s, d) => s + d.performanceScore, 0) / filteredDirectorates.length) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">Reports</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Generate and export performance reports.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> Export PDF</button>
          <button className="btn-primary"><Download className="w-4 h-4" /> Export Excel</button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="card p-5">
        <h3 className="heading-section mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="form-select">
              <option value="ministry">Ministry-wide Report</option>
              <option value="directorate">Directorate Report</option>
              <option value="unit">Unit Report</option>
              <option value="activity">Activity Report</option>
            </select>
          </div>
          <div>
            <label className="form-label">Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="form-select">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div>
            <label className="form-label">Directorate</label>
            <select value={filterDir} onChange={(e) => setFilterDir(e.target.value)} className="form-select">
              <option value="all">All Directorates</option>
              {filteredDirectorates.map((d) => <option key={d.id} value={d.id}>{d.code}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Activity Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-select">
              <option value="all">All Statuses</option>
              {Object.entries(activityStatusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b text-center" style={{ background: 'linear-gradient(180deg, rgba(15,76,129,0.04), transparent)', borderColor: '#E2E8F0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #0F4C81, #0A3660)' }}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#0F172A' }}>
            {reportType === 'ministry' ? 'Ministry of Health' : reportType === 'directorate' ? 'Directorate' : reportType === 'unit' ? 'Unit' : 'Activity'} Performance Report
          </h2>
          <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
            {period === 'monthly' ? 'June 2026' : period === 'quarterly' ? 'Q2 2026 (Apr – Jun)' : 'FY 2026'}
          </p>
        </div>

        <div className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
              <p className="text-2xl font-bold" style={{ color: '#0F4C81' }}>{filteredDirectorates.length}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Directorates</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
              <p className="text-2xl font-bold" style={{ color: '#00897B' }}>{filteredActivities.length}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Total Activities</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
              <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>{completedCount}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Completed</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
              <p className="text-2xl font-bold" style={{ color: '#0F4C81' }}>{avgPerformance}%</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Avg Performance</p>
            </div>
          </div>

          {/* Directorate Summary Table */}
          <h3 className="heading-section mb-3">Directorate Summary</h3>
          <div className="overflow-x-auto mb-8">
            <table className="data-table">
              <thead><tr><th>Directorate</th><th>Units</th><th>Activities</th><th>Completed</th><th>In Progress</th><th>Overdue</th><th>Performance</th></tr></thead>
              <tbody>
                {filteredDirectorates.map((dir) => (
                  <tr key={dir.id}>
                    <td><div className="flex items-center gap-2"><span className="badge-primary badge text-[10px]">{dir.code}</span><span className="text-sm font-semibold">{dir.name}</span></div></td>
                    <td className="text-sm tabular-nums">{dir.totalUnits}</td>
                    <td className="text-sm tabular-nums">{dir.totalActivities}</td>
                    <td className="text-sm tabular-nums" style={{ color: '#2E7D32' }}>{dir.completedActivities}</td>
                    <td className="text-sm tabular-nums">{dir.inProgressActivities}</td>
                    <td className="text-sm tabular-nums" style={{ color: dir.overdueActivities > 0 ? '#C62828' : '#475569' }}>{dir.overdueActivities}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-track w-16 h-1.5">
                          <div className="progress-fill" style={{ width: `${dir.performanceScore}%`, background: dir.performanceScore >= 70 ? '#2E7D32' : dir.performanceScore >= 50 ? '#0F4C81' : '#C62828' }} />
                        </div>
                        <span className="text-xs font-bold tabular-nums">{dir.performanceScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status Distribution */}
          <h3 className="heading-section mb-3">Activity Status Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            {Object.entries(activityStatusConfig).map(([key, cfg]) => {
              const count = filteredActivities.filter((a) => a.status === key).length;
              return (
                <div key={key} className="p-3 rounded-xl text-center" style={{ background: `${cfg.color}08` }}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ background: cfg.color }} />
                  <p className="text-lg font-bold" style={{ color: cfg.color }}>{count}</p>
                  <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{cfg.label}</p>
                </div>
              );
            })}
          </div>

          {/* Unit Reports Table */}
          <h3 className="heading-section mb-3">Submitted Unit Reports</h3>
          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Report Title</th><th>Unit</th><th>Type</th><th>Period</th><th>Date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const statusCfg = reportStatusConfig[report.status];
                    return (
                      <tr key={report.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 shrink-0" style={{ color: '#0F4C81' }} />
                            <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{report.title}</span>
                          </div>
                        </td>
                        <td className="text-sm">{report.unitName}</td>
                        <td><span className="badge-slate badge text-[10px]">{reportTypeLabels[report.reportType]}</span></td>
                        <td className="text-sm">{report.period}</td>
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
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>No reports available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
