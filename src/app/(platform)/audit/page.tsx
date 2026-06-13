'use client';

import { useState } from 'react';
import { ScrollText, Search, Filter, Download, Calendar, Shield } from 'lucide-react';
import { auditLogs, actionLabels } from '@/data/audit-logs';
import { formatDate } from '@/lib/utils';

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = auditLogs.filter((log) => {
    const matchSearch = log.userName.toLowerCase().includes(search.toLowerCase()) || 
                        log.description.toLowerCase().includes(search.toLowerCase()) ||
                        (log.targetName && log.targetName.toLowerCase().includes(search.toLowerCase()));
    const matchAction = filterAction === 'all' || log.action === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">Audit Logs</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>System-wide activity and security log.</p>
        </div>
        <button className="btn-outline"><Download className="w-4 h-4" /> Export Logs</button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users, actions, or details..." className="form-input pl-10" />
          </div>
          <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="form-select lg:w-48">
            <option value="all">All Actions</option>
            {Object.entries(actionLabels).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
          </select>
          <div className="relative lg:w-48">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input type="date" className="form-input pl-10" title="Filter by date" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Description</th><th>IP Address</th></tr></thead>
            <tbody>
              {filtered.map((log) => {
                const actionCfg = actionLabels[log.action];
                return (
                  <tr key={log.id}>
                    <td className="text-sm tabular-nums whitespace-nowrap" style={{ color: '#475569' }}>
                      {new Date(log.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{log.userName}</p>
                        <p className="text-[11px]" style={{ color: '#94A3B8' }}>{log.userRole}</p>
                      </div>
                    </td>
                    <td><span className={`${actionCfg.badgeClass} badge text-[10px]`}>{actionCfg.label}</span></td>
                    <td>
                      <p className="text-sm" style={{ color: '#1E293B' }}>{log.description}</p>
                      {log.targetName && <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Target: {log.targetName}</p>}
                    </td>
                    <td className="text-xs tabular-nums" style={{ color: '#94A3B8' }}>{log.ipAddress}</td>
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
