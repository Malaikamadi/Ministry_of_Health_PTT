export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'login' | 'logout' | 'activity_created' | 'activity_updated' | 'activity_status_change' | 'evidence_uploaded' | 'approval' | 'rejection' | 'user_created' | 'user_updated' | 'user_deactivated' | 'password_reset' | 'report_generated';
  description: string;
  targetType?: 'activity' | 'user' | 'directorate' | 'unit' | 'evidence' | 'report';
  targetId?: string;
  targetName?: string;
  ipAddress: string;
  metadata?: Record<string, string>;
}

export const actionLabels: Record<string, { label: string; badgeClass: string }> = {
  login: { label: 'Login', badgeClass: 'badge-primary' },
  logout: { label: 'Logout', badgeClass: 'badge-slate' },
  activity_created: { label: 'Activity Created', badgeClass: 'badge-success' },
  activity_updated: { label: 'Activity Updated', badgeClass: 'badge-primary' },
  activity_status_change: { label: 'Status Changed', badgeClass: 'badge-warning' },
  evidence_uploaded: { label: 'Evidence Uploaded', badgeClass: 'badge-teal' },
  approval: { label: 'Approved', badgeClass: 'badge-success' },
  rejection: { label: 'Rejected', badgeClass: 'badge-danger' },
  user_created: { label: 'User Created', badgeClass: 'badge-success' },
  user_updated: { label: 'User Updated', badgeClass: 'badge-primary' },
  user_deactivated: { label: 'User Deactivated', badgeClass: 'badge-danger' },
  password_reset: { label: 'Password Reset', badgeClass: 'badge-warning' },
  report_generated: { label: 'Report Generated', badgeClass: 'badge-teal' },
};

export const auditLogs: AuditLogEntry[] = [
  { id: 'al-001', timestamp: '2026-06-12T08:30:00', userId: 'u-001', userName: 'Dr. Austin Demby', userRole: 'Super Admin', action: 'login', description: 'Logged into the system', ipAddress: '196.45.123.10' },
  { id: 'al-002', timestamp: '2026-06-12T08:32:00', userId: 'u-001', userName: 'Dr. Austin Demby', userRole: 'Super Admin', action: 'report_generated', description: 'Generated ministry-wide Q2 performance report', targetType: 'report', targetName: 'Q2 2026 Performance Report', ipAddress: '196.45.123.10' },
  { id: 'al-003', timestamp: '2026-06-12T08:00:00', userId: 'u-008', userName: 'Mohamed Kamara', userRole: 'Unit Focal', action: 'login', description: 'Logged into the system', ipAddress: '196.45.123.55' },
  { id: 'al-004', timestamp: '2026-06-12T08:05:00', userId: 'u-008', userName: 'Mohamed Kamara', userRole: 'Unit Focal', action: 'activity_updated', description: 'Updated progress for Q1 Performance Review', targetType: 'activity', targetId: 'act-002', targetName: 'Quarterly Performance Review - Q1 2026', ipAddress: '196.45.123.55' },
  { id: 'al-005', timestamp: '2026-06-12T07:45:00', userId: 'u-004', userName: 'Dr. Fatmata Wurie', userRole: 'Director', action: 'login', description: 'Logged into the system', ipAddress: '196.45.123.22' },
  { id: 'al-006', timestamp: '2026-06-12T07:50:00', userId: 'u-004', userName: 'Dr. Fatmata Wurie', userRole: 'Director', action: 'approval', description: 'Approved maternal death surveillance review activity', targetType: 'activity', targetId: 'act-019', targetName: 'Maternal Death Surveillance Review', ipAddress: '196.45.123.22' },
  { id: 'al-007', timestamp: '2026-06-11T16:30:00', userId: 'u-005', userName: 'Dr. Amara Jambai', userRole: 'Director', action: 'login', description: 'Logged into the system', ipAddress: '196.45.123.33' },
  { id: 'al-008', timestamp: '2026-06-11T16:35:00', userId: 'u-005', userName: 'Dr. Amara Jambai', userRole: 'Director', action: 'report_generated', description: 'Generated DPC directorate monthly report', targetType: 'report', targetName: 'DPC Monthly Report - May 2026', ipAddress: '196.45.123.33' },
  { id: 'al-009', timestamp: '2026-06-11T15:30:00', userId: 'u-009', userName: 'Aminata Conteh', userRole: 'Unit Focal', action: 'activity_created', description: 'Created new activity for FY2027 work plan', targetType: 'activity', targetId: 'act-004', targetName: 'Annual Work Plan Development for FY2027', ipAddress: '196.45.123.44' },
  { id: 'al-010', timestamp: '2026-06-11T14:20:00', userId: 'u-002', userName: 'Dr. Patricia Laverley', userRole: 'Super Admin', action: 'login', description: 'Logged into the system', ipAddress: '196.45.123.11' },
  { id: 'al-011', timestamp: '2026-06-11T14:25:00', userId: 'u-002', userName: 'Dr. Patricia Laverley', userRole: 'Super Admin', action: 'user_created', description: 'Created new unit focal person account', targetType: 'user', targetId: 'u-024', targetName: 'Musa Bangura', ipAddress: '196.45.123.11' },
  { id: 'al-012', timestamp: '2026-06-11T11:30:00', userId: 'u-019', userName: 'Dr. Olabisi Thomas', userRole: 'Unit Focal', action: 'evidence_uploaded', description: 'Uploaded training photos for NCD screening pilot', targetType: 'evidence', targetId: 'ev16', targetName: 'Training_Photos.zip', ipAddress: '196.45.123.66' },
  { id: 'al-013', timestamp: '2026-06-11T10:00:00', userId: 'u-013', userName: 'Mariama Bah', userRole: 'Unit Focal', action: 'activity_updated', description: 'Updated CMAM scale-up progress to 40%', targetType: 'activity', targetId: 'act-006', targetName: 'CMAM Programme Scale-up in Northern Province', ipAddress: '196.45.123.77' },
  { id: 'al-014', timestamp: '2026-06-10T12:00:00', userId: 'u-018', userName: 'Sorie Kamara', userRole: 'Unit Focal', action: 'activity_status_change', description: 'Resubmitted essential medicines assessment', targetType: 'activity', targetId: 'act-011', targetName: 'Essential Medicines Supply Chain Assessment', ipAddress: '196.45.123.88', metadata: { from: 'returned', to: 'submitted' } },
  { id: 'al-015', timestamp: '2026-06-10T11:00:00', userId: 'u-006', userName: 'Dr. Umu Barrie', userRole: 'Director', action: 'rejection', description: 'Returned essential medicines assessment with comments', targetType: 'activity', targetId: 'act-011', targetName: 'Essential Medicines Supply Chain Assessment', ipAddress: '196.45.123.99' },
  { id: 'al-016', timestamp: '2026-06-09T15:00:00', userId: 'u-021', userName: 'Patrick Johnson', userRole: 'Unit Focal', action: 'activity_created', description: 'Created health worker redistribution plan', targetType: 'activity', targetId: 'act-014', targetName: 'Health Worker Redistribution Plan', ipAddress: '196.45.124.10' },
  { id: 'al-017', timestamp: '2026-06-09T14:00:00', userId: 'u-001', userName: 'Dr. Austin Demby', userRole: 'Super Admin', action: 'user_deactivated', description: 'Deactivated account for John Kpaka', targetType: 'user', targetId: 'u-023', targetName: 'John Kpaka', ipAddress: '196.45.123.10' },
  { id: 'al-018', timestamp: '2026-06-09T09:00:00', userId: 'u-020', userName: 'Kadiatu Sesay', userRole: 'Unit Focal', action: 'evidence_uploaded', description: 'Uploaded TNA survey results', targetType: 'evidence', targetId: 'ev17', targetName: 'TNA_Survey_Results.xlsx', ipAddress: '196.45.124.20' },
  { id: 'al-019', timestamp: '2026-06-08T16:00:00', userId: 'u-001', userName: 'Dr. Austin Demby', userRole: 'Super Admin', action: 'password_reset', description: 'Reset password for Dr. Umu Barrie', targetType: 'user', targetId: 'u-006', targetName: 'Dr. Umu Barrie', ipAddress: '196.45.123.10' },
  { id: 'al-020', timestamp: '2026-06-08T10:00:00', userId: 'u-010', userName: 'Issa Bangura', userRole: 'Unit Focal', action: 'activity_status_change', description: 'DHIS2 upgrade submitted for verification', targetType: 'activity', targetId: 'act-003', targetName: 'DHIS2 System Upgrade to v2.40', ipAddress: '196.45.124.30', metadata: { from: 'in_progress', to: 'pending_verification' } },
];
