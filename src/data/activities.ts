export type ActivityStatus = 'draft' | 'submitted' | 'approved' | 'in_progress' | 'pending_verification' | 'completed' | 'returned';

export interface ActivityMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

export interface ProgressUpdate {
  id: string;
  date: string;
  percentage: number;
  note: string;
  updatedBy: string;
}

export interface ActivityEvidence {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  category: 'report' | 'photo' | 'pdf' | 'minutes' | 'attendance' | 'official_document';
  uploadedBy: string;
  uploadedAt: string;
  verified: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  directorateId: string;
  directorateCode: string;
  directorate: string;
  unitId: string;
  unitName: string;
  status: ActivityStatus;
  progress: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
  milestones: ActivityMilestone[];
  progressUpdates: ProgressUpdate[];
  evidence: ActivityEvidence[];
  reviewNotes?: string;
}

export const activityStatusConfig: Record<ActivityStatus, { label: string; color: string; dotColor: string; badgeClass: string }> = {
  draft: { label: 'Draft', color: '#64748B', dotColor: '#94A3B8', badgeClass: 'badge-slate' },
  submitted: { label: 'Submitted', color: '#0F4C81', dotColor: '#0F4C81', badgeClass: 'badge-primary' },
  approved: { label: 'Approved', color: '#00897B', dotColor: '#00897B', badgeClass: 'badge-teal' },
  in_progress: { label: 'In Progress', color: '#0F4C81', dotColor: '#0F4C81', badgeClass: 'badge-primary' },
  pending_verification: { label: 'Pending Verification', color: '#F9A825', dotColor: '#F9A825', badgeClass: 'badge-warning' },
  completed: { label: 'Completed', color: '#2E7D32', dotColor: '#2E7D32', badgeClass: 'badge-success' },
  returned: { label: 'Returned', color: '#C62828', dotColor: '#C62828', badgeClass: 'badge-danger' },
};

export const activities: Activity[] = [
  // DPPI Activities
  {
    id: 'act-001',
    title: 'Develop M&E Framework for FY2026',
    description: 'Create a comprehensive monitoring and evaluation framework aligned with the National Health Sector Strategic Plan 2024-2028.',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    directorate: 'Directorate of Policy, Planning & Information',
    unitId: 'unit-001',
    unitName: 'Monitoring & Evaluation Unit',
    status: 'completed',
    progress: 100,
    startDate: '2026-01-15',
    endDate: '2026-03-30',
    createdBy: 'Mohamed Kamara',
    createdAt: '2026-01-10',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Stakeholder consultation', completed: true, completedDate: '2026-01-28' },
      { id: 'm2', title: 'Draft framework document', completed: true, completedDate: '2026-02-15' },
      { id: 'm3', title: 'Review and validation', completed: true, completedDate: '2026-03-10' },
      { id: 'm4', title: 'Final approval & dissemination', completed: true, completedDate: '2026-03-25' },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-01-20', percentage: 15, note: 'Initiated stakeholder mapping and consultation schedule.', updatedBy: 'Mohamed Kamara' },
      { id: 'pu2', date: '2026-02-05', percentage: 40, note: 'Stakeholder consultations completed. Starting draft.', updatedBy: 'Mohamed Kamara' },
      { id: 'pu3', date: '2026-02-20', percentage: 65, note: 'Draft framework submitted for internal review.', updatedBy: 'Mohamed Kamara' },
      { id: 'pu4', date: '2026-03-15', percentage: 90, note: 'Revisions incorporated. Awaiting final sign-off.', updatedBy: 'Mohamed Kamara' },
      { id: 'pu5', date: '2026-03-25', percentage: 100, note: 'Framework approved and disseminated to all directorates.', updatedBy: 'Mohamed Kamara' },
    ],
    evidence: [
      { id: 'ev1', fileName: 'ME_Framework_Final_2026.pdf', fileType: 'application/pdf', fileSize: '2.4 MB', category: 'pdf', uploadedBy: 'Mohamed Kamara', uploadedAt: '2026-03-25', verified: true },
      { id: 'ev2', fileName: 'Stakeholder_Consultation_Report.pdf', fileType: 'application/pdf', fileSize: '1.8 MB', category: 'report', uploadedBy: 'Mohamed Kamara', uploadedAt: '2026-02-05', verified: true },
    ],
  },
  {
    id: 'act-002',
    title: 'Quarterly Performance Review - Q1 2026',
    description: 'Conduct comprehensive Q1 performance review across all directorates and produce analytical report.',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    directorate: 'Directorate of Policy, Planning & Information',
    unitId: 'unit-001',
    unitName: 'Monitoring & Evaluation Unit',
    status: 'in_progress',
    progress: 55,
    startDate: '2026-04-01',
    endDate: '2026-05-15',
    createdBy: 'Mohamed Kamara',
    createdAt: '2026-03-28',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Data collection from all directorates', completed: true, completedDate: '2026-04-15' },
      { id: 'm2', title: 'Data analysis and dashboard creation', completed: true, completedDate: '2026-04-28' },
      { id: 'm3', title: 'Draft Q1 report', completed: false },
      { id: 'm4', title: 'Validation workshop', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-04-10', percentage: 20, note: 'Data collection templates sent to all directorates.', updatedBy: 'Mohamed Kamara' },
      { id: 'pu2', date: '2026-04-20', percentage: 40, note: 'Received data from 4 out of 5 directorates.', updatedBy: 'Mohamed Kamara' },
      { id: 'pu3', date: '2026-05-01', percentage: 55, note: 'Data analysis underway. DHS data received.', updatedBy: 'Mohamed Kamara' },
    ],
    evidence: [
      { id: 'ev3', fileName: 'Q1_Data_Collection_Template.xlsx', fileType: 'application/xlsx', fileSize: '540 KB', category: 'official_document', uploadedBy: 'Mohamed Kamara', uploadedAt: '2026-04-05', verified: true },
    ],
  },
  {
    id: 'act-003',
    title: 'DHIS2 System Upgrade to v2.40',
    description: 'Upgrade the national DHIS2 instance from v2.38 to v2.40 with improved analytics and data quality modules.',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    directorate: 'Directorate of Policy, Planning & Information',
    unitId: 'unit-003',
    unitName: 'HMIS Unit',
    status: 'pending_verification',
    progress: 90,
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    createdBy: 'Issa Bangura',
    createdAt: '2026-01-25',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Setup staging environment', completed: true, completedDate: '2026-02-10' },
      { id: 'm2', title: 'Data migration testing', completed: true, completedDate: '2026-03-01' },
      { id: 'm3', title: 'User acceptance testing', completed: true, completedDate: '2026-03-20' },
      { id: 'm4', title: 'Production deployment', completed: true, completedDate: '2026-04-15' },
      { id: 'm5', title: 'Post-deployment monitoring', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-02-15', percentage: 25, note: 'Staging environment ready. Starting migration scripts.', updatedBy: 'Issa Bangura' },
      { id: 'pu2', date: '2026-03-05', percentage: 50, note: 'Migration testing complete. All data validated.', updatedBy: 'Issa Bangura' },
      { id: 'pu3', date: '2026-03-25', percentage: 75, note: 'UAT passed with minor issues. Fixing before deployment.', updatedBy: 'Issa Bangura' },
      { id: 'pu4', date: '2026-04-18', percentage: 90, note: 'Production deployment successful. Monitoring period ongoing.', updatedBy: 'Issa Bangura' },
    ],
    evidence: [
      { id: 'ev4', fileName: 'UAT_Report_DHIS2_v240.pdf', fileType: 'application/pdf', fileSize: '3.1 MB', category: 'report', uploadedBy: 'Issa Bangura', uploadedAt: '2026-03-25', verified: true },
      { id: 'ev5', fileName: 'Deployment_Checklist.pdf', fileType: 'application/pdf', fileSize: '890 KB', category: 'official_document', uploadedBy: 'Issa Bangura', uploadedAt: '2026-04-15', verified: false },
    ],
  },
  {
    id: 'act-004',
    title: 'Annual Work Plan Development for FY2027',
    description: 'Facilitate the development of the ministry-wide annual work plan for fiscal year 2027.',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    directorate: 'Directorate of Policy, Planning & Information',
    unitId: 'unit-002',
    unitName: 'Planning Unit',
    status: 'approved',
    progress: 20,
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    createdBy: 'Aminata Conteh',
    createdAt: '2026-05-15',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Planning guidelines development', completed: true, completedDate: '2026-06-10' },
      { id: 'm2', title: 'Directorate planning workshops', completed: false },
      { id: 'm3', title: 'Consolidation and review', completed: false },
      { id: 'm4', title: 'Cabinet submission', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-06-10', percentage: 20, note: 'Planning guidelines finalized and distributed.', updatedBy: 'Aminata Conteh' },
    ],
    evidence: [],
  },
  // DPHC Activities
  {
    id: 'act-005',
    title: 'National Measles-Rubella Vaccination Campaign',
    description: 'Conduct a nationwide measles-rubella vaccination campaign targeting children 9 months to 14 years.',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    directorate: 'Directorate of Primary Health Care',
    unitId: 'unit-005',
    unitName: 'Expanded Programme on Immunization (EPI)',
    status: 'completed',
    progress: 100,
    startDate: '2026-01-20',
    endDate: '2026-02-28',
    createdBy: 'Ibrahim Sesay',
    createdAt: '2025-12-15',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Micro-planning at district level', completed: true, completedDate: '2026-01-10' },
      { id: 'm2', title: 'Vaccine procurement & cold chain readiness', completed: true, completedDate: '2026-01-18' },
      { id: 'm3', title: 'Campaign implementation', completed: true, completedDate: '2026-02-15' },
      { id: 'm4', title: 'Post-campaign coverage survey', completed: true, completedDate: '2026-02-28' },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-01-15', percentage: 20, note: 'Micro-plans completed for all 16 districts.', updatedBy: 'Ibrahim Sesay' },
      { id: 'pu2', date: '2026-01-25', percentage: 40, note: 'Vaccines distributed. Cold chain functional.', updatedBy: 'Ibrahim Sesay' },
      { id: 'pu3', date: '2026-02-10', percentage: 75, note: 'Campaign ongoing. 12/16 districts completed.', updatedBy: 'Ibrahim Sesay' },
      { id: 'pu4', date: '2026-02-28', percentage: 100, note: 'Campaign concluded. 94% coverage achieved.', updatedBy: 'Ibrahim Sesay' },
    ],
    evidence: [
      { id: 'ev6', fileName: 'MR_Campaign_Final_Report.pdf', fileType: 'application/pdf', fileSize: '4.2 MB', category: 'report', uploadedBy: 'Ibrahim Sesay', uploadedAt: '2026-03-05', verified: true },
      { id: 'ev7', fileName: 'Campaign_Photos.zip', fileType: 'application/zip', fileSize: '28 MB', category: 'photo', uploadedBy: 'Ibrahim Sesay', uploadedAt: '2026-03-01', verified: true },
      { id: 'ev8', fileName: 'Coverage_Survey_Results.xlsx', fileType: 'application/xlsx', fileSize: '1.2 MB', category: 'report', uploadedBy: 'Ibrahim Sesay', uploadedAt: '2026-03-10', verified: true },
    ],
  },
  {
    id: 'act-006',
    title: 'CMAM Programme Scale-up in Northern Province',
    description: 'Expand Community-based Management of Acute Malnutrition services to all chiefdoms in Northern Province.',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    directorate: 'Directorate of Primary Health Care',
    unitId: 'unit-006',
    unitName: 'Nutrition Programme',
    status: 'in_progress',
    progress: 40,
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    createdBy: 'Mariama Bah',
    createdAt: '2026-02-15',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Baseline assessment', completed: true, completedDate: '2026-03-20' },
      { id: 'm2', title: 'Training of health workers', completed: true, completedDate: '2026-04-10' },
      { id: 'm3', title: 'Supply procurement', completed: false },
      { id: 'm4', title: 'Service delivery rollout', completed: false },
      { id: 'm5', title: 'Monitoring & supervision', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-03-22', percentage: 15, note: 'Baseline assessment completed in target chiefdoms.', updatedBy: 'Mariama Bah' },
      { id: 'pu2', date: '2026-04-12', percentage: 40, note: '85 health workers trained on CMAM protocol.', updatedBy: 'Mariama Bah' },
    ],
    evidence: [
      { id: 'ev9', fileName: 'Baseline_Assessment_Northern.pdf', fileType: 'application/pdf', fileSize: '2.7 MB', category: 'report', uploadedBy: 'Mariama Bah', uploadedAt: '2026-03-22', verified: true },
      { id: 'ev10', fileName: 'Training_Attendance_Sheet.pdf', fileType: 'application/pdf', fileSize: '1.1 MB', category: 'attendance', uploadedBy: 'Mariama Bah', uploadedAt: '2026-04-12', verified: true },
    ],
  },
  {
    id: 'act-007',
    title: 'CHW Monthly Supervision Round - April 2026',
    description: 'Conduct monthly supportive supervision visits to community health workers across all districts.',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    directorate: 'Directorate of Primary Health Care',
    unitId: 'unit-007',
    unitName: 'Community Health Workers Programme',
    status: 'completed',
    progress: 100,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    createdBy: 'Abu Bakarr Koroma',
    createdAt: '2026-03-28',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Supervision schedule finalization', completed: true, completedDate: '2026-03-30' },
      { id: 'm2', title: 'Field visits', completed: true, completedDate: '2026-04-20' },
      { id: 'm3', title: 'Report compilation', completed: true, completedDate: '2026-04-28' },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-04-05', percentage: 20, note: 'Visits commenced in Western Area districts.', updatedBy: 'Abu Bakarr Koroma' },
      { id: 'pu2', date: '2026-04-15', percentage: 60, note: '10/16 districts covered.', updatedBy: 'Abu Bakarr Koroma' },
      { id: 'pu3', date: '2026-04-28', percentage: 100, note: 'All districts visited. Report submitted.', updatedBy: 'Abu Bakarr Koroma' },
    ],
    evidence: [
      { id: 'ev11', fileName: 'CHW_Supervision_Report_Apr2026.pdf', fileType: 'application/pdf', fileSize: '3.5 MB', category: 'report', uploadedBy: 'Abu Bakarr Koroma', uploadedAt: '2026-04-28', verified: true },
    ],
  },
  // DPC Activities
  {
    id: 'act-008',
    title: 'Weekly IDSR Surveillance Data Analysis',
    description: 'Compile and analyze weekly Integrated Disease Surveillance and Response data from all district health management teams.',
    directorateId: 'dir-003',
    directorateCode: 'DPC',
    directorate: 'Directorate of Disease Prevention & Control',
    unitId: 'unit-010',
    unitName: 'Disease Surveillance Unit',
    status: 'in_progress',
    progress: 65,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    createdBy: 'Samuel Williams',
    createdAt: '2025-12-20',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Q1 reports compilation', completed: true, completedDate: '2026-04-05' },
      { id: 'm2', title: 'Q2 reports compilation', completed: true, completedDate: '2026-06-10' },
      { id: 'm3', title: 'Q3 reports compilation', completed: false },
      { id: 'm4', title: 'Annual surveillance report', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-04-05', percentage: 30, note: 'Q1 IDSR bulletin published. 95% reporting completeness.', updatedBy: 'Samuel Williams' },
      { id: 'pu2', date: '2026-06-10', percentage: 65, note: 'Q2 data compiled. Notable increase in malaria cases in Eastern Province.', updatedBy: 'Samuel Williams' },
    ],
    evidence: [
      { id: 'ev12', fileName: 'IDSR_Bulletin_Q1_2026.pdf', fileType: 'application/pdf', fileSize: '5.2 MB', category: 'report', uploadedBy: 'Samuel Williams', uploadedAt: '2026-04-05', verified: true },
    ],
  },
  {
    id: 'act-009',
    title: 'LLIN Mass Distribution Campaign',
    description: 'Distribute 3.5 million long-lasting insecticide-treated nets through a nationwide door-to-door campaign.',
    directorateId: 'dir-003',
    directorateCode: 'DPC',
    directorate: 'Directorate of Disease Prevention & Control',
    unitId: 'unit-011',
    unitName: 'National Malaria Control Programme',
    status: 'completed',
    progress: 100,
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    createdBy: 'Adama Kargbo',
    createdAt: '2026-01-10',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Household registration', completed: true, completedDate: '2026-02-15' },
      { id: 'm2', title: 'Net procurement and warehousing', completed: true, completedDate: '2026-02-25' },
      { id: 'm3', title: 'Distribution in urban areas', completed: true, completedDate: '2026-03-20' },
      { id: 'm4', title: 'Distribution in rural areas', completed: true, completedDate: '2026-04-15' },
      { id: 'm5', title: 'End-process coverage survey', completed: true, completedDate: '2026-04-28' },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-02-18', percentage: 15, note: 'Household registration completed. 1.2M households registered.', updatedBy: 'Adama Kargbo' },
      { id: 'pu2', date: '2026-03-01', percentage: 30, note: '3.5M nets received and distributed to district warehouses.', updatedBy: 'Adama Kargbo' },
      { id: 'pu3', date: '2026-03-25', percentage: 60, note: 'Urban distribution completed. Starting rural phase.', updatedBy: 'Adama Kargbo' },
      { id: 'pu4', date: '2026-04-20', percentage: 90, note: 'Rural distribution 95% complete.', updatedBy: 'Adama Kargbo' },
      { id: 'pu5', date: '2026-04-28', percentage: 100, note: 'Campaign concluded. 97% coverage achieved.', updatedBy: 'Adama Kargbo' },
    ],
    evidence: [
      { id: 'ev13', fileName: 'LLIN_Campaign_Report.pdf', fileType: 'application/pdf', fileSize: '6.8 MB', category: 'report', uploadedBy: 'Adama Kargbo', uploadedAt: '2026-05-05', verified: true },
    ],
  },
  {
    id: 'act-010',
    title: 'HIV Testing Week Campaign',
    description: 'Organize national HIV testing week with free voluntary counselling and testing at all health facilities.',
    directorateId: 'dir-003',
    directorateCode: 'DPC',
    directorate: 'Directorate of Disease Prevention & Control',
    unitId: 'unit-012',
    unitName: 'National HIV/AIDS Programme',
    status: 'submitted',
    progress: 10,
    startDate: '2026-07-01',
    endDate: '2026-07-14',
    createdBy: 'Josephine Mansaray',
    createdAt: '2026-05-20',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Social mobilization planning', completed: false },
      { id: 'm2', title: 'Test kit procurement', completed: false },
      { id: 'm3', title: 'Campaign implementation', completed: false },
      { id: 'm4', title: 'Results compilation', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-05-25', percentage: 10, note: 'Planning meeting held. Budget approved.', updatedBy: 'Josephine Mansaray' },
    ],
    evidence: [],
  },
  // DHS Activities
  {
    id: 'act-011',
    title: 'Essential Medicines Supply Chain Assessment',
    description: 'Conduct comprehensive assessment of essential medicines availability across all government hospitals.',
    directorateId: 'dir-004',
    directorateCode: 'DHS',
    directorate: 'Directorate of Hospital & Laboratory Services',
    unitId: 'unit-014',
    unitName: 'Pharmacy Services Unit',
    status: 'returned',
    progress: 35,
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    createdBy: 'Sorie Kamara',
    createdAt: '2026-02-20',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Assessment tool development', completed: true, completedDate: '2026-03-10' },
      { id: 'm2', title: 'Data collection at hospitals', completed: true, completedDate: '2026-04-15' },
      { id: 'm3', title: 'Analysis and report', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-03-15', percentage: 15, note: 'Assessment tool piloted and finalized.', updatedBy: 'Sorie Kamara' },
      { id: 'pu2', date: '2026-04-18', percentage: 35, note: 'Data collected from 18 out of 23 hospitals.', updatedBy: 'Sorie Kamara' },
    ],
    evidence: [
      { id: 'ev14', fileName: 'Assessment_Tool_v2.pdf', fileType: 'application/pdf', fileSize: '420 KB', category: 'official_document', uploadedBy: 'Sorie Kamara', uploadedAt: '2026-03-10', verified: true },
    ],
    reviewNotes: 'Data collection incomplete. Please ensure all 23 hospitals are covered before resubmission.',
  },
  {
    id: 'act-012',
    title: 'NCD Screening Programme Pilot',
    description: 'Pilot non-communicable disease screening at 10 primary health units in Western Area.',
    directorateId: 'dir-004',
    directorateCode: 'DHS',
    directorate: 'Directorate of Hospital & Laboratory Services',
    unitId: 'unit-015',
    unitName: 'NCD & Mental Health Unit',
    status: 'in_progress',
    progress: 50,
    startDate: '2026-04-01',
    endDate: '2026-07-31',
    createdBy: 'Dr. Olabisi Thomas',
    createdAt: '2026-03-15',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Protocol development', completed: true, completedDate: '2026-04-10' },
      { id: 'm2', title: 'Staff training', completed: true, completedDate: '2026-04-25' },
      { id: 'm3', title: 'Equipment procurement', completed: true, completedDate: '2026-05-05' },
      { id: 'm4', title: 'Screening implementation', completed: false },
      { id: 'm5', title: 'Pilot evaluation', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-04-12', percentage: 15, note: 'Screening protocol developed and approved.', updatedBy: 'Dr. Olabisi Thomas' },
      { id: 'pu2', date: '2026-04-28', percentage: 30, note: '25 health workers trained on NCD screening.', updatedBy: 'Dr. Olabisi Thomas' },
      { id: 'pu3', date: '2026-05-10', percentage: 50, note: 'Equipment deployed. Screening started at 6/10 PHUs.', updatedBy: 'Dr. Olabisi Thomas' },
    ],
    evidence: [
      { id: 'ev15', fileName: 'NCD_Screening_Protocol.pdf', fileType: 'application/pdf', fileSize: '1.5 MB', category: 'pdf', uploadedBy: 'Dr. Olabisi Thomas', uploadedAt: '2026-04-10', verified: true },
      { id: 'ev16', fileName: 'Training_Photos.zip', fileType: 'application/zip', fileSize: '15 MB', category: 'photo', uploadedBy: 'Dr. Olabisi Thomas', uploadedAt: '2026-04-28', verified: false },
    ],
  },
  // DHRH Activities
  {
    id: 'act-013',
    title: 'In-Service Training Needs Assessment',
    description: 'Conduct nationwide assessment of in-service training needs for health workers across all cadres.',
    directorateId: 'dir-005',
    directorateCode: 'DHRH',
    directorate: 'Directorate of Human Resources for Health',
    unitId: 'unit-018',
    unitName: 'Training & Development Unit',
    status: 'pending_verification',
    progress: 85,
    startDate: '2026-02-15',
    endDate: '2026-05-30',
    createdBy: 'Kadiatu Sesay',
    createdAt: '2026-02-01',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Survey tool development', completed: true, completedDate: '2026-02-28' },
      { id: 'm2', title: 'Data collection', completed: true, completedDate: '2026-04-10' },
      { id: 'm3', title: 'Analysis and priority setting', completed: true, completedDate: '2026-05-05' },
      { id: 'm4', title: 'Report and training plan', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-03-05', percentage: 20, note: 'Survey tool developed and piloted.', updatedBy: 'Kadiatu Sesay' },
      { id: 'pu2', date: '2026-04-15', percentage: 55, note: 'Data collected from 85% of health facilities.', updatedBy: 'Kadiatu Sesay' },
      { id: 'pu3', date: '2026-05-10', percentage: 85, note: 'Analysis complete. Drafting final report.', updatedBy: 'Kadiatu Sesay' },
    ],
    evidence: [
      { id: 'ev17', fileName: 'TNA_Survey_Results.xlsx', fileType: 'application/xlsx', fileSize: '2.1 MB', category: 'report', uploadedBy: 'Kadiatu Sesay', uploadedAt: '2026-05-05', verified: true },
    ],
  },
  {
    id: 'act-014',
    title: 'Health Worker Redistribution Plan',
    description: 'Develop and implement a health worker redistribution plan to address staffing gaps in underserved areas.',
    directorateId: 'dir-005',
    directorateCode: 'DHRH',
    directorate: 'Directorate of Human Resources for Health',
    unitId: 'unit-019',
    unitName: 'Deployment & Staffing Unit',
    status: 'draft',
    progress: 5,
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    createdBy: 'Patrick Johnson',
    createdAt: '2026-06-01',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Staffing gap analysis', completed: false },
      { id: 'm2', title: 'Redistribution framework', completed: false },
      { id: 'm3', title: 'Stakeholder consultation', completed: false },
      { id: 'm4', title: 'Implementation', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-06-05', percentage: 5, note: 'Initial concept note prepared.', updatedBy: 'Patrick Johnson' },
    ],
    evidence: [],
  },
  // More activities for comprehensive data
  {
    id: 'act-015',
    title: 'Health Facility Data Quality Audit',
    description: 'Conduct data quality audits at 50 randomly selected health facilities to verify DHIS2 data accuracy.',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    directorate: 'Directorate of Policy, Planning & Information',
    unitId: 'unit-003',
    unitName: 'HMIS Unit',
    status: 'in_progress',
    progress: 30,
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    createdBy: 'Issa Bangura',
    createdAt: '2026-04-20',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Sampling and tool preparation', completed: true, completedDate: '2026-05-10' },
      { id: 'm2', title: 'Field data collection', completed: false },
      { id: 'm3', title: 'Verification and analysis', completed: false },
      { id: 'm4', title: 'Feedback and remediation', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-05-12', percentage: 15, note: 'Sampling completed. 50 facilities selected using PPS.', updatedBy: 'Issa Bangura' },
      { id: 'pu2', date: '2026-05-28', percentage: 30, note: 'Audits completed in 15 facilities. Data reconciliation ongoing.', updatedBy: 'Issa Bangura' },
    ],
    evidence: [],
  },
  {
    id: 'act-016',
    title: 'Routine Immunization Microplanning',
    description: 'Update routine immunization microplans for all health facilities in preparation for Q3 2026.',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    directorate: 'Directorate of Primary Health Care',
    unitId: 'unit-005',
    unitName: 'Expanded Programme on Immunization (EPI)',
    status: 'draft',
    progress: 0,
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    createdBy: 'Ibrahim Sesay',
    createdAt: '2026-06-10',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Template updates', completed: false },
      { id: 'm2', title: 'District-level planning sessions', completed: false },
      { id: 'm3', title: 'Compilation and review', completed: false },
    ],
    progressUpdates: [],
    evidence: [],
  },
  {
    id: 'act-017',
    title: 'Blood Bank Equipment Maintenance',
    description: 'Conduct annual maintenance and calibration of blood bank refrigerators and testing equipment at national and regional centres.',
    directorateId: 'dir-004',
    directorateCode: 'DHS',
    directorate: 'Directorate of Hospital & Laboratory Services',
    unitId: 'unit-017',
    unitName: 'Blood Transfusion Services',
    status: 'in_progress',
    progress: 45,
    startDate: '2026-04-15',
    endDate: '2026-06-30',
    createdBy: 'Ramatu Sesay',
    createdAt: '2026-04-01',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Equipment inventory update', completed: true, completedDate: '2026-04-25' },
      { id: 'm2', title: 'Maintenance scheduling', completed: true, completedDate: '2026-05-01' },
      { id: 'm3', title: 'National centre maintenance', completed: true, completedDate: '2026-05-20' },
      { id: 'm4', title: 'Regional centres maintenance', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-04-28', percentage: 20, note: 'Inventory completed. 42 units identified for maintenance.', updatedBy: 'Ramatu Sesay' },
      { id: 'pu2', date: '2026-05-22', percentage: 45, note: 'National centre equipment serviced. Moving to regional.', updatedBy: 'Ramatu Sesay' },
    ],
    evidence: [
      { id: 'ev18', fileName: 'Equipment_Inventory_2026.xlsx', fileType: 'application/xlsx', fileSize: '680 KB', category: 'official_document', uploadedBy: 'Ramatu Sesay', uploadedAt: '2026-04-28', verified: true },
    ],
  },
  {
    id: 'act-018',
    title: 'National Health Workforce Census',
    description: 'Conduct biennial census of all health workers in the public and private sectors.',
    directorateId: 'dir-005',
    directorateCode: 'DHRH',
    directorate: 'Directorate of Human Resources for Health',
    unitId: 'unit-020',
    unitName: 'Health Workforce Registry',
    status: 'submitted',
    progress: 15,
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    createdBy: 'Fatu Bangura',
    createdAt: '2026-05-15',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Census tool design', completed: true, completedDate: '2026-05-28' },
      { id: 'm2', title: 'Enumerator training', completed: false },
      { id: 'm3', title: 'Data collection', completed: false },
      { id: 'm4', title: 'Data cleaning and analysis', completed: false },
      { id: 'm5', title: 'Census report', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-06-05', percentage: 15, note: 'Census questionnaire finalized. Enumerator recruitment ongoing.', updatedBy: 'Fatu Bangura' },
    ],
    evidence: [],
  },
  {
    id: 'act-019',
    title: 'Maternal Death Surveillance Review',
    description: 'Review and analyze Q1-Q2 maternal death surveillance data and recommend interventions.',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    directorate: 'Directorate of Primary Health Care',
    unitId: 'unit-008',
    unitName: 'Reproductive Health Unit',
    status: 'approved',
    progress: 25,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    createdBy: 'Hawa Turay',
    createdAt: '2026-05-25',
    priority: 'high',
    milestones: [
      { id: 'm1', title: 'Data extraction from MDSR system', completed: true, completedDate: '2026-06-08' },
      { id: 'm2', title: 'Case review meetings', completed: false },
      { id: 'm3', title: 'Analytical report', completed: false },
      { id: 'm4', title: 'Policy brief', completed: false },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-06-10', percentage: 25, note: 'Data extracted. 48 maternal deaths identified for review.', updatedBy: 'Hawa Turay' },
    ],
    evidence: [],
  },
  {
    id: 'act-020',
    title: 'Laboratory Accreditation Readiness Assessment',
    description: 'Assess readiness of 5 regional laboratories for WHO/AFRO SLIPTA accreditation.',
    directorateId: 'dir-003',
    directorateCode: 'DPC',
    directorate: 'Directorate of Disease Prevention & Control',
    unitId: 'unit-013',
    unitName: 'Laboratory Services Unit',
    status: 'completed',
    progress: 100,
    startDate: '2026-01-15',
    endDate: '2026-04-15',
    createdBy: 'James Koroma',
    createdAt: '2026-01-05',
    priority: 'medium',
    milestones: [
      { id: 'm1', title: 'Checklist development', completed: true, completedDate: '2026-01-25' },
      { id: 'm2', title: 'On-site assessments', completed: true, completedDate: '2026-03-10' },
      { id: 'm3', title: 'Gap analysis reports', completed: true, completedDate: '2026-03-30' },
      { id: 'm4', title: 'Improvement action plans', completed: true, completedDate: '2026-04-12' },
    ],
    progressUpdates: [
      { id: 'pu1', date: '2026-01-28', percentage: 15, note: 'SLIPTA checklist customized for SL context.', updatedBy: 'James Koroma' },
      { id: 'pu2', date: '2026-03-12', percentage: 60, note: 'All 5 labs assessed. Average score: 2.5 stars.', updatedBy: 'James Koroma' },
      { id: 'pu3', date: '2026-04-12', percentage: 100, note: 'Improvement plans finalized for all labs.', updatedBy: 'James Koroma' },
    ],
    evidence: [
      { id: 'ev19', fileName: 'SLIPTA_Assessment_Report.pdf', fileType: 'application/pdf', fileSize: '4.8 MB', category: 'report', uploadedBy: 'James Koroma', uploadedAt: '2026-04-12', verified: true },
    ],
  },
];

export function getActivitiesByDirectorate(directorateId: string): Activity[] {
  return activities.filter((a) => a.directorateId === directorateId);
}

export function getActivitiesByUnit(unitId: string): Activity[] {
  return activities.filter((a) => a.unitId === unitId);
}

export function getActivityById(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

export function getActivityStats() {
  const total = activities.length;
  const completed = activities.filter((a) => a.status === 'completed').length;
  const inProgress = activities.filter((a) => a.status === 'in_progress').length;
  const overdue = activities.filter((a) => {
    const end = new Date(a.endDate);
    const now = new Date();
    return end < now && a.status !== 'completed';
  }).length;
  const pending = activities.filter((a) => a.status === 'pending_verification').length;
  const draft = activities.filter((a) => a.status === 'draft').length;
  const submitted = activities.filter((a) => a.status === 'submitted').length;
  const approved = activities.filter((a) => a.status === 'approved').length;
  const returned = activities.filter((a) => a.status === 'returned').length;

  return { total, completed, inProgress, overdue, pending, draft, submitted, approved, returned };
}
