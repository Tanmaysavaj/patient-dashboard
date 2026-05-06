/**
 * Patient Model Interfaces
 * Shared type definitions for the Patient Registration Dashboard.
 * These mirror the backend Mongoose schema but without the Document dependency.
 */

/** Allowed status values for a patient record */
export type PatientStatus = 'active' | 'pending' | 'inactive';

/** Core patient data structure */
export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;       // ISO 8601 format: YYYY-MM-DD
  status: PatientStatus;
  registeredDate: string;    // ISO 8601 format
}

/** Dashboard summary statistics */
export interface DashboardStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

/** Generic paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
