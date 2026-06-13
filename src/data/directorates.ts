export interface Directorate {
  id: string;
  code: string;
  name: string;
  description: string;
  director: string;
  directorEmail: string;
  totalUnits: number;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  overdueActivities: number;
  performanceScore: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

export const directorates: Directorate[] = [
  {
    id: 'dir-001',
    code: 'DPPI',
    name: 'Directorate of Policy, Planning & Information',
    description: 'Oversees health policy development, strategic planning, M&E, and health management information systems.',
    director: 'Dr. Santigie Sesay',
    directorEmail: 'dppi.director@mohs.gov.sl',
    totalUnits: 4,
    totalActivities: 18,
    completedActivities: 8,
    inProgressActivities: 6,
    overdueActivities: 2,
    performanceScore: 72,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'dir-002',
    code: 'DPHC',
    name: 'Directorate of Primary Health Care',
    description: 'Manages community health, immunization, nutrition, reproductive health, and CHW programmes.',
    director: 'Dr. Fatmata Wurie',
    directorEmail: 'dphc.director@mohs.gov.sl',
    totalUnits: 5,
    totalActivities: 24,
    completedActivities: 10,
    inProgressActivities: 9,
    overdueActivities: 3,
    performanceScore: 65,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'dir-003',
    code: 'DPC',
    name: 'Directorate of Disease Prevention & Control',
    description: 'Leads surveillance, disease outbreak response, malaria control, and laboratory services.',
    director: 'Dr. Amara Jambai',
    directorEmail: 'dpc.director@mohs.gov.sl',
    totalUnits: 4,
    totalActivities: 20,
    completedActivities: 12,
    inProgressActivities: 5,
    overdueActivities: 1,
    performanceScore: 81,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'dir-004',
    code: 'DHS',
    name: 'Directorate of Hospital & Laboratory Services',
    description: 'Manages hospital administration, pharmacy, NCD programmes, mental health, and clinical services.',
    director: 'Dr. Umu Barrie',
    directorEmail: 'dhs.director@mohs.gov.sl',
    totalUnits: 4,
    totalActivities: 15,
    completedActivities: 4,
    inProgressActivities: 6,
    overdueActivities: 4,
    performanceScore: 48,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'dir-005',
    code: 'DHRH',
    name: 'Directorate of Human Resources for Health',
    description: 'Oversees health workforce training, deployment, staffing, and professional development.',
    director: 'Mrs. Isata Mahoi',
    directorEmail: 'dhrh.director@mohs.gov.sl',
    totalUnits: 3,
    totalActivities: 12,
    completedActivities: 5,
    inProgressActivities: 4,
    overdueActivities: 2,
    performanceScore: 58,
    createdAt: '2024-01-15',
    status: 'active',
  },
];

export function getDirectorateById(id: string): Directorate | undefined {
  return directorates.find((d) => d.id === id);
}

export function getDirectorateByCode(code: string): Directorate | undefined {
  return directorates.find((d) => d.code === code);
}
