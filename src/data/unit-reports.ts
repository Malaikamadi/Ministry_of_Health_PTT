export interface UnitReport {
  id: string;
  title: string;
  description: string;
  unitId: string;
  unitName: string;
  directorateId: string;
  directorateCode: string;
  reportType: 'monthly' | 'quarterly' | 'annual' | 'special';
  period: string;
  uploadedBy: string;
  uploadedAt: string;
  fileName: string;
  fileSize: string;
  status: 'submitted' | 'reviewed' | 'approved';
}

export const unitReports: UnitReport[] = [
  {
    id: 'rpt-001',
    title: 'M&E Unit Monthly Report — May 2026',
    description: 'Monthly progress report covering all M&E activities and indicator tracking.',
    unitId: 'unit-001',
    unitName: 'Monitoring & Evaluation Unit',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    reportType: 'monthly',
    period: 'May 2026',
    uploadedBy: 'Mohamed Kamara',
    uploadedAt: '2026-06-05',
    fileName: 'ME_Unit_Monthly_May2026.pdf',
    fileSize: '1.8 MB',
    status: 'approved',
  },
  {
    id: 'rpt-002',
    title: 'Planning Unit Q1 Report 2026',
    description: 'Quarterly report on work plan development activities and strategic planning progress.',
    unitId: 'unit-002',
    unitName: 'Planning Unit',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    reportType: 'quarterly',
    period: 'Q1 2026',
    uploadedBy: 'Aminata Conteh',
    uploadedAt: '2026-04-10',
    fileName: 'Planning_Unit_Q1_2026.pdf',
    fileSize: '2.3 MB',
    status: 'approved',
  },
  {
    id: 'rpt-003',
    title: 'HMIS Unit Monthly Report — June 2026',
    description: 'Monthly report on DHIS2 system maintenance, data quality audits, and user support.',
    unitId: 'unit-003',
    unitName: 'HMIS Unit',
    directorateId: 'dir-001',
    directorateCode: 'DPPI',
    reportType: 'monthly',
    period: 'June 2026',
    uploadedBy: 'Issa Bangura',
    uploadedAt: '2026-06-20',
    fileName: 'HMIS_Unit_Monthly_Jun2026.pdf',
    fileSize: '1.2 MB',
    status: 'submitted',
  },
  {
    id: 'rpt-004',
    title: 'EPI Unit Q2 Report 2026',
    description: 'Quarterly immunization performance report including coverage rates and campaign updates.',
    unitId: 'unit-005',
    unitName: 'Expanded Programme on Immunization (EPI)',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    reportType: 'quarterly',
    period: 'Q2 2026',
    uploadedBy: 'Ibrahim Sesay',
    uploadedAt: '2026-06-18',
    fileName: 'EPI_Q2_2026_Report.pdf',
    fileSize: '3.5 MB',
    status: 'reviewed',
  },
  {
    id: 'rpt-005',
    title: 'Nutrition Programme Monthly Report — May 2026',
    description: 'Monthly update on CMAM scale-up, IYCF activities, and nutrition surveillance.',
    unitId: 'unit-006',
    unitName: 'Nutrition Programme',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    reportType: 'monthly',
    period: 'May 2026',
    uploadedBy: 'Mariama Bah',
    uploadedAt: '2026-06-08',
    fileName: 'Nutrition_Monthly_May2026.pdf',
    fileSize: '1.5 MB',
    status: 'approved',
  },
  {
    id: 'rpt-006',
    title: 'Disease Surveillance Unit Q2 Report',
    description: 'Quarterly IDSR surveillance report with epidemiological analysis and outbreak summaries.',
    unitId: 'unit-010',
    unitName: 'Disease Surveillance Unit',
    directorateId: 'dir-003',
    directorateCode: 'DPC',
    reportType: 'quarterly',
    period: 'Q2 2026',
    uploadedBy: 'Samuel Williams',
    uploadedAt: '2026-06-15',
    fileName: 'Surveillance_Q2_2026.pdf',
    fileSize: '5.2 MB',
    status: 'approved',
  },
  {
    id: 'rpt-007',
    title: 'Malaria Control Monthly Report — June 2026',
    description: 'Monthly malaria programme update including case data and LLIN distribution progress.',
    unitId: 'unit-011',
    unitName: 'National Malaria Control Programme',
    directorateId: 'dir-003',
    directorateCode: 'DPC',
    reportType: 'monthly',
    period: 'June 2026',
    uploadedBy: 'Adama Kargbo',
    uploadedAt: '2026-06-22',
    fileName: 'Malaria_Monthly_Jun2026.pdf',
    fileSize: '2.1 MB',
    status: 'submitted',
  },
  {
    id: 'rpt-008',
    title: 'Pharmacy Services Unit Special Assessment Report',
    description: 'Special report on essential medicines supply chain assessment findings.',
    unitId: 'unit-014',
    unitName: 'Pharmacy Services Unit',
    directorateId: 'dir-004',
    directorateCode: 'DHS',
    reportType: 'special',
    period: 'Q2 2026',
    uploadedBy: 'Sorie Kamara',
    uploadedAt: '2026-05-20',
    fileName: 'Pharmacy_Assessment_2026.pdf',
    fileSize: '4.1 MB',
    status: 'reviewed',
  },
  {
    id: 'rpt-009',
    title: 'Training & Development Unit Q2 Report',
    description: 'Quarterly training activities summary including TNA results and capacity building events.',
    unitId: 'unit-018',
    unitName: 'Training & Development Unit',
    directorateId: 'dir-005',
    directorateCode: 'DHRH',
    reportType: 'quarterly',
    period: 'Q2 2026',
    uploadedBy: 'Kadiatu Sesay',
    uploadedAt: '2026-06-12',
    fileName: 'Training_Q2_2026.pdf',
    fileSize: '1.9 MB',
    status: 'submitted',
  },
  {
    id: 'rpt-010',
    title: 'CHW Programme Monthly Report — June 2026',
    description: 'Monthly CHW supervision report with coverage data and performance indicators.',
    unitId: 'unit-007',
    unitName: 'Community Health Workers Programme',
    directorateId: 'dir-002',
    directorateCode: 'DPHC',
    reportType: 'monthly',
    period: 'June 2026',
    uploadedBy: 'Abu Bakarr Koroma',
    uploadedAt: '2026-06-21',
    fileName: 'CHW_Monthly_Jun2026.pdf',
    fileSize: '2.4 MB',
    status: 'submitted',
  },
];

export function getReportsByUnit(unitId: string): UnitReport[] {
  return unitReports.filter((r) => r.unitId === unitId);
}

export function getReportsByDirectorate(directorateId: string): UnitReport[] {
  return unitReports.filter((r) => r.directorateId === directorateId);
}

export const reportStatusConfig: Record<string, { label: string; badgeClass: string }> = {
  submitted: { label: 'Submitted', badgeClass: 'badge-primary' },
  reviewed: { label: 'Reviewed', badgeClass: 'badge-warning' },
  approved: { label: 'Approved', badgeClass: 'badge-success' },
};

export const reportTypeLabels: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
  special: 'Special',
};
