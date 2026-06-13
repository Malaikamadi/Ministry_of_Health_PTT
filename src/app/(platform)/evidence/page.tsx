'use client';

import { useState } from 'react';
import { FolderOpen, Search, Upload, Download, FileText, Image, File, CheckCircle2, Clock } from 'lucide-react';
import { activities } from '@/data/activities';
import { formatDate } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  report: 'Reports', photo: 'Photos', pdf: 'PDF Documents', minutes: 'Meeting Minutes', attendance: 'Attendance Sheets', official_document: 'Official Documents',
};

const categoryIcons: Record<string, typeof FileText> = {
  report: FileText, photo: Image, pdf: File, minutes: FileText, attendance: FileText, official_document: File,
};

export default function EvidencePage() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');

  const allEvidence = activities.flatMap((a) =>
    a.evidence.map((ev) => ({ ...ev, activityTitle: a.title, activityId: a.id, unitName: a.unitName, directorateCode: a.directorateCode }))
  );

  const filtered = allEvidence.filter((ev) => {
    const matchSearch = ev.fileName.toLowerCase().includes(search.toLowerCase()) || ev.activityTitle.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || ev.category === filterCategory;
    const matchVerification = filterVerification === 'all' || (filterVerification === 'verified' ? ev.verified : !ev.verified);
    return matchSearch && matchCategory && matchVerification;
  });

  const categories = [...new Set(allEvidence.map((e) => e.category))];
  const totalVerified = allEvidence.filter((e) => e.verified).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-page">Evidence Repository</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>View, upload, and manage evidence documentation.</p>
        </div>
        <button className="btn-secondary"><Upload className="w-4 h-4" /> Upload Evidence</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(0,137,123,0.08)' }}><FolderOpen className="w-5 h-5" style={{ color: '#00897B' }} /></div><div><p className="kpi-label">Total Files</p><p className="kpi-value">{allEvidence.length}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(46,125,50,0.08)' }}><CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} /></div><div><p className="kpi-label">Verified</p><p className="kpi-value">{totalVerified}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(249,168,37,0.08)' }}><Clock className="w-5 h-5" style={{ color: '#F9A825' }} /></div><div><p className="kpi-label">Pending</p><p className="kpi-value">{allEvidence.length - totalVerified}</p></div></div>
        <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(15,76,129,0.08)' }}><FileText className="w-5 h-5" style={{ color: '#0F4C81' }} /></div><div><p className="kpi-label">Categories</p><p className="kpi-value">{categories.length}</p></div></div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="form-input pl-10" />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="form-select lg:w-52">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{categoryLabels[c] || c}</option>)}
          </select>
          <select value={filterVerification} onChange={(e) => setFilterVerification(e.target.value)} className="form-select lg:w-40">
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>File</th><th>Activity</th><th>Category</th><th>Size</th><th>Uploaded By</th><th>Date</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((ev) => {
                const IconComp = categoryIcons[ev.category] || FileText;
                return (
                  <tr key={ev.id}>
                    <td><div className="flex items-center gap-2"><IconComp className="w-4 h-4 shrink-0" style={{ color: '#0F4C81' }} /><span className="text-sm font-medium" style={{ color: '#1E293B' }}>{ev.fileName}</span></div></td>
                    <td className="text-sm" style={{ color: '#475569' }}>{ev.activityTitle}</td>
                    <td><span className="badge-slate badge text-[10px]">{categoryLabels[ev.category] || ev.category}</span></td>
                    <td className="text-sm tabular-nums">{ev.fileSize}</td>
                    <td className="text-sm">{ev.uploadedBy}</td>
                    <td className="text-sm tabular-nums">{formatDate(ev.uploadedAt)}</td>
                    <td>{ev.verified ? <span className="badge-success badge text-[10px]">Verified</span> : <span className="badge-warning badge text-[10px]">Pending</span>}</td>
                    <td><button className="btn-ghost btn-sm"><Download className="w-3.5 h-3.5" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state py-12">
            <FolderOpen className="w-10 h-10 mb-2" style={{ color: '#94A3B8' }} />
            <p className="text-sm font-medium" style={{ color: '#64748B' }}>No evidence files found</p>
          </div>
        )}
      </div>
    </div>
  );
}
