import { Schema, model, Document } from 'mongoose';

export type PatientStatus = 'active' | 'pending' | 'inactive';

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;       // ISO 8601: YYYY-MM-DD
  status: PatientStatus;
  registeredDate: string;    // ISO 8601
}

const PatientSchema = new Schema<IPatient>({
  firstName:      { type: String, required: true },
  lastName:       { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  dateOfBirth:    { type: String, required: true },
  status:         { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
  registeredDate: { type: String, default: () => new Date().toISOString() }
});

export const Patient = model<IPatient>('Patient', PatientSchema);

// ─── Supporting interfaces ───────────────────────────────────────────────────

export interface DashboardStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
