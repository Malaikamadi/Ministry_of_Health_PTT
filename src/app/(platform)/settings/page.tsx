'use client';

import { Settings, Bell, Shield, Mail, Database, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="heading-page">System Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Configure global platform preferences and system behaviors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-slate-50 transition-colors text-left" style={{ color: '#0F4C81' }}>
            <Settings className="w-4 h-4" /> General
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors text-left" style={{ color: '#64748B' }}>
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors text-left" style={{ color: '#64748B' }}>
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors text-left" style={{ color: '#64748B' }}>
            <Mail className="w-4 h-4" /> Email Templates
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors text-left" style={{ color: '#64748B' }}>
            <Database className="w-4 h-4" /> Data Backup
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1E293B' }}>General Settings</h2>
            
            <div className="space-y-5">
              <div>
                <label className="form-label">System Name</label>
                <input type="text" className="form-input max-w-md" defaultValue="Ministry of Health Performance Tracking Tool" />
              </div>
              
              <div>
                <label className="form-label">Default Support Email</label>
                <input type="email" className="form-input max-w-md" defaultValue="support@mohs.gov.sl" />
              </div>

              <div>
                <label className="form-label">Performance Calculation Strategy</label>
                <select className="form-select max-w-md">
                  <option>Weighted Average (Priority Based)</option>
                  <option>Simple Average</option>
                  <option>Milestone Completion %</option>
                </select>
                <p className="text-[11px] mt-1" style={{ color: '#64748B' }}>Determines how overall progress is calculated from individual activities.</p>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#1E293B' }}>Reporting Thresholds</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="form-label text-xs">At Risk (%)</label>
                    <input type="number" className="form-input" defaultValue="40" />
                  </div>
                  <div>
                    <label className="form-label text-xs">On Track (%)</label>
                    <input type="number" className="form-input" defaultValue="70" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 accent-[#0F4C81]" defaultChecked />
                  <div>
                    <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>Require Evidence Upload</span>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Force units to upload evidence when marking activities as 100% complete.</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button className="btn-outline">Cancel Changes</button>
                <button className="btn-primary"><Save className="w-4 h-4" /> Save Configuration</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
