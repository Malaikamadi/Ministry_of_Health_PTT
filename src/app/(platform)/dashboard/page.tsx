'use client';

import { Building2, Users, Activity, CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowRight, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';
import { directorates } from '@/data/directorates';
import { units } from '@/data/units';
import { activities, activityStatusConfig, type ActivityStatus } from '@/data/activities';
import { users } from '@/data/users';
import { formatDate } from '@/lib/utils';

export default function SuperAdminDashboard() {
  const totalDirectorates = directorates.length;
  const totalUnits = units.length;
  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.status === 'completed').length;
  const inProgressActivities = activities.filter((a) => a.status === 'in_progress').length;
  const overdueActivities = activities.filter((a) => {
    const end = new Date(a.endDate);
    const now = new Date();
    return end < now && a.status !== 'completed';
  }).length;
  const totalUsers = users.length;

  const statusCounts: Record<string, number> = {};
  activities.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const sortedDirectorates = [...directorates].sort((a, b) => b.performanceScore - a.performanceScore);

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const overdueList = activities
    .filter((a) => {
      const end = new Date(a.endDate);
      const now = new Date();
      return end < now && a.status !== 'completed';
    })
    .slice(0, 5);

  const monthlyData = [
    { month: 'Jan', completed: 3, inProgress: 5 },
    { month: 'Feb', completed: 5, inProgress: 6 },
    { month: 'Mar', completed: 7, inProgress: 7 },
    { month: 'Apr', completed: 9, inProgress: 8 },
    { month: 'May', completed: 10, inProgress: 7 },
    { month: 'Jun', completed: 12, inProgress: 6 },
  ];
  const maxMonthly = Math.max(...monthlyData.map((m) => m.completed + m.inProgress));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-page">Ministry Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Consolidated view of performance across all directorates and units.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports" className="btn-outline btn-sm">
            <FileText className="w-4 h-4" /> Generate Report
          </Link>
          <Link href="/activities" className="btn-primary btn-sm">
            <Activity className="w-4 h-4" /> View All Activities
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 stagger-children">
        <KpiCard icon={Building2} label="Directorates" value={totalDirectorates} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={Users} label="Total Units" value={totalUnits} color="#00897B" bg="rgba(0,137,123,0.08)" />
        <KpiCard icon={Activity} label="Total Activities" value={totalActivities} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={CheckCircle2} label="Completed" value={completedActivities} color="#2E7D32" bg="rgba(46,125,50,0.08)" />
        <KpiCard icon={Clock} label="In Progress" value={inProgressActivities} color="#0F4C81" bg="rgba(15,76,129,0.08)" />
        <KpiCard icon={AlertTriangle} label="Overdue" value={overdueActivities} color="#C62828" bg="rgba(198,40,40,0.08)" />
        <KpiCard icon={Users} label="Total Users" value={totalUsers} color="#00897B" bg="rgba(0,137,123,0.08)" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Directorate Performance Rankings */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="section-header">
            <div>
              <h3 className="heading-section">Directorate Performance Rankings</h3>
              <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Ranked by overall performance score</p>
            </div>
            <Link href="/directorates" className="btn-ghost btn-sm">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="p-5 space-y-4">
            {sortedDirectorates.map((dir, index) => (
              <div key={dir.id} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: index === 0 ? 'rgba(46,125,50,0.1)' : index === sortedDirectorates.length - 1 ? 'rgba(198,40,40,0.1)' : 'rgba(15,76,129,0.08)',
                    color: index === 0 ? '#2E7D32' : index === sortedDirectorates.length - 1 ? '#C62828' : '#0F4C81',
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{dir.code}</span>
                    <span className="text-xs truncate" style={{ color: '#94A3B8' }}>{dir.name}</span>
                  </div>
                  <div className="progress-track h-2">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${dir.performanceScore}%`,
                        background: dir.performanceScore >= 70 ? 'linear-gradient(90deg, #2E7D32, #43A047)' :
                          dir.performanceScore >= 50 ? 'linear-gradient(90deg, #0F4C81, #1565A8)' :
                          'linear-gradient(90deg, #C62828, #E53935)',
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums shrink-0" style={{
                  color: dir.performanceScore >= 70 ? '#2E7D32' : dir.performanceScore >= 50 ? '#0F4C81' : '#C62828',
                }}>{dir.performanceScore}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Status Distribution */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Activity Status</h3>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(activityStatusConfig).map(([key, config]) => {
              const count = statusCounts[key] || 0;
              const pct = totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: config.color }} />
                  <span className="text-sm flex-1" style={{ color: '#475569' }}>{config.label}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: '#1E293B' }}>{count}</span>
                  <span className="text-xs tabular-nums w-10 text-right" style={{ color: '#94A3B8' }}>{pct}%</span>
                </div>
              );
            })}
            {/* Visual bar */}
            <div className="mt-4 flex rounded-full overflow-hidden h-3">
              {Object.entries(activityStatusConfig).map(([key, config]) => {
                const count = statusCounts[key] || 0;
                const pct = totalActivities > 0 ? (count / totalActivities) * 100 : 0;
                return pct > 0 ? (
                  <div key={key} style={{ width: `${pct}%`, background: config.color }} className="transition-all duration-500" />
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Performance Trends */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Monthly Performance Trends</h3>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1" style={{ height: '160px' }}>
                    <div className="flex-1 flex flex-col justify-end gap-1">
                      <div
                        className="w-full rounded-t-md transition-all duration-700"
                        style={{
                          height: `${(m.inProgress / maxMonthly) * 100}%`,
                          background: 'rgba(15, 76, 129, 0.2)',
                          minHeight: '4px',
                        }}
                      />
                      <div
                        className="w-full rounded-md transition-all duration-700"
                        style={{
                          height: `${(m.completed / maxMonthly) * 100}%`,
                          background: 'linear-gradient(180deg, #2E7D32, #43A047)',
                          minHeight: '4px',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: '#94A3B8' }}>{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: '#64748B' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ background: '#2E7D32' }} /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ background: 'rgba(15, 76, 129, 0.2)' }} /> In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card overflow-hidden">
          <div className="section-header">
            <h3 className="heading-section">Recent Activity Feed</h3>
            <Link href="/activities" className="btn-ghost btn-sm">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {recentActivities.map((act) => {
              const statusCfg = activityStatusConfig[act.status];
              return (
                <Link key={act.id} href={`/activities/${act.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: statusCfg.dotColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{act.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{act.unitName} · {act.directorateCode}</p>
                  </div>
                  <span className={`${statusCfg.badgeClass} badge text-[10px] shrink-0`}>{statusCfg.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overdue Activities */}
      {overdueList.length > 0 && (
        <div className="card overflow-hidden" style={{ borderColor: 'rgba(198, 40, 40, 0.2)' }}>
          <div className="section-header" style={{ background: 'rgba(198, 40, 40, 0.04)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" style={{ color: '#C62828' }} />
              <h3 className="heading-section" style={{ color: '#C62828' }}>Overdue Activities</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Unit</th>
                  <th>Directorate</th>
                  <th>Due Date</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {overdueList.map((act) => {
                  const statusCfg = activityStatusConfig[act.status];
                  return (
                    <tr key={act.id}>
                      <td>
                        <Link href={`/activities/${act.id}`} className="text-sm font-semibold hover:underline" style={{ color: '#0F4C81' }}>
                          {act.title}
                        </Link>
                      </td>
                      <td className="text-sm">{act.unitName}</td>
                      <td><span className="badge-primary badge text-[10px]">{act.directorateCode}</span></td>
                      <td className="text-sm font-medium" style={{ color: '#C62828' }}>{formatDate(act.endDate)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-track w-16 h-1.5">
                            <div className="progress-fill progress-fill-danger" style={{ width: `${act.progress}%` }} />
                          </div>
                          <span className="text-xs font-semibold tabular-nums">{act.progress}%</span>
                        </div>
                      </td>
                      <td><span className={`${statusCfg.badgeClass} badge text-[10px]`}>{statusCfg.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top & Lowest Performing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="section-header" style={{ background: 'rgba(46, 125, 50, 0.04)' }}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#2E7D32' }} />
              <h3 className="heading-section" style={{ color: '#2E7D32' }}>Top Performing Directorates</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {sortedDirectorates.slice(0, 3).map((dir, i) => (
              <div key={dir.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(46,125,50,0.1)', color: '#2E7D32' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{dir.name}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{dir.code} · {dir.director}</p>
                </div>
                <span className="text-lg font-bold" style={{ color: '#2E7D32' }}>{dir.performanceScore}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="section-header" style={{ background: 'rgba(198, 40, 40, 0.04)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" style={{ color: '#C62828' }} />
              <h3 className="heading-section" style={{ color: '#C62828' }}>Needs Improvement</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {sortedDirectorates.slice(-2).reverse().map((dir, i) => (
              <div key={dir.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(198,40,40,0.1)', color: '#C62828' }}>
                  {sortedDirectorates.length - 1 + i}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{dir.name}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{dir.code} · {dir.director}</p>
                </div>
                <span className="text-lg font-bold" style={{ color: '#C62828' }}>{dir.performanceScore}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──── Sub-component ──── */

function KpiCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: number;
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
