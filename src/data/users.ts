export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'directorate_admin' | 'unit_focal';
  directorateId?: string;
  directorateCode?: string;
  unitId?: string;
  unitName?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
}

export const users: MockUser[] = [
  // Super Admins
  { id: 'u-001', name: 'Dr. Austin Demby', email: 'admin@mohs.gov.sl', role: 'super_admin', status: 'active', lastLogin: '2026-06-12T08:30:00', createdAt: '2024-01-01' },
  { id: 'u-002', name: 'Dr. Patricia Laverley', email: 'deputy.admin@mohs.gov.sl', role: 'super_admin', status: 'active', lastLogin: '2026-06-11T14:20:00', createdAt: '2024-01-01' },
  // Directorate Admins
  { id: 'u-003', name: 'Dr. Santigie Sesay', email: 'dppi.director@mohs.gov.sl', role: 'directorate_admin', directorateId: 'dir-001', directorateCode: 'DPPI', status: 'active', lastLogin: '2026-06-12T09:15:00', createdAt: '2024-01-15' },
  { id: 'u-004', name: 'Dr. Fatmata Wurie', email: 'dphc.director@mohs.gov.sl', role: 'directorate_admin', directorateId: 'dir-002', directorateCode: 'DPHC', status: 'active', lastLogin: '2026-06-12T07:45:00', createdAt: '2024-01-15' },
  { id: 'u-005', name: 'Dr. Amara Jambai', email: 'dpc.director@mohs.gov.sl', role: 'directorate_admin', directorateId: 'dir-003', directorateCode: 'DPC', status: 'active', lastLogin: '2026-06-11T16:30:00', createdAt: '2024-01-15' },
  { id: 'u-006', name: 'Dr. Umu Barrie', email: 'dhs.director@mohs.gov.sl', role: 'directorate_admin', directorateId: 'dir-004', directorateCode: 'DHS', status: 'active', lastLogin: '2026-06-10T11:00:00', createdAt: '2024-01-15' },
  { id: 'u-007', name: 'Mrs. Isata Mahoi', email: 'dhrh.director@mohs.gov.sl', role: 'directorate_admin', directorateId: 'dir-005', directorateCode: 'DHRH', status: 'active', lastLogin: '2026-06-12T10:00:00', createdAt: '2024-01-15' },
  // Unit Focal Persons
  { id: 'u-008', name: 'Mohamed Kamara', email: 'me.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-001', directorateCode: 'DPPI', unitId: 'unit-001', unitName: 'Monitoring & Evaluation Unit', status: 'active', lastLogin: '2026-06-12T08:00:00', createdAt: '2024-02-01' },
  { id: 'u-009', name: 'Aminata Conteh', email: 'planning.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-001', directorateCode: 'DPPI', unitId: 'unit-002', unitName: 'Planning Unit', status: 'active', lastLogin: '2026-06-11T15:30:00', createdAt: '2024-02-01' },
  { id: 'u-010', name: 'Issa Bangura', email: 'hmis.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-001', directorateCode: 'DPPI', unitId: 'unit-003', unitName: 'HMIS Unit', status: 'active', lastLogin: '2026-06-12T09:30:00', createdAt: '2024-02-01' },
  { id: 'u-011', name: 'Fatmata Kargbo', email: 'research.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-001', directorateCode: 'DPPI', unitId: 'unit-004', unitName: 'Research & Statistics Unit', status: 'active', lastLogin: '2026-06-10T14:00:00', createdAt: '2024-02-15' },
  { id: 'u-012', name: 'Ibrahim Sesay', email: 'epi.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-002', directorateCode: 'DPHC', unitId: 'unit-005', unitName: 'Expanded Programme on Immunization', status: 'active', lastLogin: '2026-06-12T07:00:00', createdAt: '2024-02-01' },
  { id: 'u-013', name: 'Mariama Bah', email: 'nutrition.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-002', directorateCode: 'DPHC', unitId: 'unit-006', unitName: 'Nutrition Programme', status: 'active', lastLogin: '2026-06-11T10:00:00', createdAt: '2024-02-01' },
  { id: 'u-014', name: 'Abu Bakarr Koroma', email: 'chw.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-002', directorateCode: 'DPHC', unitId: 'unit-007', unitName: 'CHW Programme', status: 'active', lastLogin: '2026-06-12T06:30:00', createdAt: '2024-02-01' },
  { id: 'u-015', name: 'Hawa Turay', email: 'rh.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-002', directorateCode: 'DPHC', unitId: 'unit-008', unitName: 'Reproductive Health Unit', status: 'active', lastLogin: '2026-06-11T09:00:00', createdAt: '2024-02-01' },
  { id: 'u-016', name: 'Samuel Williams', email: 'surveillance.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-003', directorateCode: 'DPC', unitId: 'unit-010', unitName: 'Disease Surveillance Unit', status: 'active', lastLogin: '2026-06-12T05:00:00', createdAt: '2024-02-01' },
  { id: 'u-017', name: 'Adama Kargbo', email: 'malaria.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-003', directorateCode: 'DPC', unitId: 'unit-011', unitName: 'National Malaria Control Programme', status: 'active', lastLogin: '2026-06-12T08:45:00', createdAt: '2024-02-01' },
  { id: 'u-018', name: 'Sorie Kamara', email: 'pharmacy.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-004', directorateCode: 'DHS', unitId: 'unit-014', unitName: 'Pharmacy Services Unit', status: 'active', lastLogin: '2026-06-10T12:00:00', createdAt: '2024-02-01' },
  { id: 'u-019', name: 'Dr. Olabisi Thomas', email: 'ncd.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-004', directorateCode: 'DHS', unitId: 'unit-015', unitName: 'NCD & Mental Health Unit', status: 'active', lastLogin: '2026-06-11T11:30:00', createdAt: '2024-02-01' },
  { id: 'u-020', name: 'Kadiatu Sesay', email: 'training.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-005', directorateCode: 'DHRH', unitId: 'unit-018', unitName: 'Training & Development Unit', status: 'active', lastLogin: '2026-06-12T09:00:00', createdAt: '2024-02-01' },
  { id: 'u-021', name: 'Patrick Johnson', email: 'deployment.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-005', directorateCode: 'DHRH', unitId: 'unit-019', unitName: 'Deployment & Staffing Unit', status: 'active', lastLogin: '2026-06-09T15:00:00', createdAt: '2024-02-01' },
  { id: 'u-022', name: 'Fatu Bangura', email: 'registry.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-005', directorateCode: 'DHRH', unitId: 'unit-020', unitName: 'Health Workforce Registry', status: 'active', lastLogin: '2026-06-11T16:00:00', createdAt: '2024-02-15' },
  { id: 'u-023', name: 'John Kpaka', email: 'john.kpaka@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-003', directorateCode: 'DPC', unitId: 'unit-012', unitName: 'HIV/AIDS Programme', status: 'inactive', lastLogin: '2026-04-15T10:00:00', createdAt: '2024-03-01' },
  { id: 'u-024', name: 'Musa Bangura', email: 'hospital.unit@mohs.gov.sl', role: 'unit_focal', directorateId: 'dir-004', directorateCode: 'DHS', unitId: 'unit-016', unitName: 'Hospital Administration Unit', status: 'pending', lastLogin: '', createdAt: '2026-05-01' },
];

export function getUsersByRole(role: string): MockUser[] {
  return users.filter((u) => u.role === role);
}
