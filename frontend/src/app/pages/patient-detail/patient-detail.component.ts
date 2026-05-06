import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Shared
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PatientService } from '../../shared/services/patient.service';
import { Patient, PatientStatus } from '../../models/patient.model';

/**
 * PatientDetailComponent
 * Displays all patient information in a read-only card.
 * Allows status changes via a dropdown that calls PUT /api/patients/:id.
 * Route: /patients/:id
 */
@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    ToastModule,
    SpinnerComponent,
    StatusBadgeComponent
  ],
  providers: [MessageService],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css'
})
export class PatientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  private readonly messageService = inject(MessageService);

  // ─── State Signals ──────────────────────────────────────────────────────
  /** The patient record */
  patient = signal<Patient | null>(null);
  /** Whether the page is loading data */
  loading = signal<boolean>(false);
  /** Whether a status update is in progress */
  updating = signal<boolean>(false);
  /** Currently selected status in the dropdown */
  selectedStatus = signal<PatientStatus>('pending');

  // ─── Status Options ───────────────────────────────────────────────────
  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' }
  ];

  // ─── Lifecycle ────────────────────────────────────────────────────────
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(id);
    }
  }

  // ─── Data Loading ─────────────────────────────────────────────────────

  /** Fetch patient data by ID */
  private loadPatient(id: string): void {
    this.loading.set(true);
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient.set(patient);
        this.selectedStatus.set(patient.status);
        this.loading.set(false);
      },
      error: (err: { error?: { error?: string } }) => {
        this.loading.set(false);
        const detail = err.error?.error || 'Failed to load patient details';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail,
          life: 5000
        });
      }
    });
  }

  // ─── Status Update ───────────────────────────────────────────────────

  /** Update the patient's status via the API */
  onStatusChange(newStatus: PatientStatus): void {
    const p = this.patient();
    if (!p || newStatus === p.status) return;

    this.updating.set(true);
    this.patientService.updatePatientStatus(p._id, newStatus).subscribe({
      next: (updated) => {
        this.patient.set(updated);
        this.selectedStatus.set(updated.status);
        this.updating.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: `Patient status changed to ${updated.status}`,
          life: 3000
        });
      },
      error: (err: { error?: { error?: string } }) => {
        this.updating.set(false);
        // Revert dropdown to the current status
        this.selectedStatus.set(p.status);
        const detail = err.error?.error || 'Failed to update patient status';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail,
          life: 5000
        });
      }
    });
  }

  /** Navigate back to the dashboard */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
