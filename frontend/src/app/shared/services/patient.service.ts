import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Patient,
  PatientStatus,
  DashboardStats,
  PaginatedResponse
} from '../../models/patient.model';

/**
 * PatientService
 * Centralises all HTTP calls to the backend REST API.
 * Components must use this service — no direct HttpClient usage in components.
 */
@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  // ─── Patient CRUD ─────────────────────────────────────────────────────────

  /**
   * Fetch a paginated list of patients with optional search and status filters.
   * Maps to: GET /api/patients?search=&status=&page=&pageSize=
   */
  getPatients(
    search: string = '',
    status: string = '',
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<Patient>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Patient>>(
      `${this.baseUrl}/patients`,
      { params }
    );
  }

  /**
   * Fetch a single patient by their MongoDB _id.
   * Maps to: GET /api/patients/:id
   */
  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/${id}`);
  }

  /**
   * Create a new patient record.
   * Maps to: POST /api/patients
   */
  createPatient(patient: Omit<Patient, '_id' | 'registeredDate'>): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/patients`, patient);
  }

  /**
   * Update a patient's status.
   * Maps to: PUT /api/patients/:id
   */
  updatePatientStatus(id: string, status: PatientStatus): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/patients/${id}`, { status });
  }

  // ─── Dashboard Stats ──────────────────────────────────────────────────────

  /**
   * Fetch dashboard summary counts (total, active, pending, inactive).
   * Maps to: GET /api/stats
   */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }
}
