import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Shared
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { PatientService } from '../../shared/services/patient.service';
import { PatientStatus } from '../../models/patient.model';

/**
 * PatientFormComponent
 * Form page to add a new patient record.
 * Route: /patients/new
 *
 * Uses Angular Reactive Forms with validation:
 *  - All fields required
 *  - Email must be a valid format
 *  - Date of birth must not be in the future
 */
@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly patientService = inject(PatientService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // ─── State ────────────────────────────────────────────────────────────
  /** Whether the form is currently submitting */
  submitting = signal<boolean>(false);
  /** Whether a submit attempt has been made (to show inline validation errors) */
  submitted = signal<boolean>(false);

  // ─── Status Options ───────────────────────────────────────────────────
  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' }
  ];

  // ─── Reactive Form ────────────────────────────────────────────────────
  /** The patient form with validation rules */
  patientForm: FormGroup = this.fb.group({
    firstName:   ['', [Validators.required, Validators.minLength(2)]],
    lastName:    ['', [Validators.required, Validators.minLength(2)]],
    email:       ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', [Validators.required]],
    status:      ['pending', [Validators.required]]
  });

  // ─── Computed helper — today's date string for max date validation ────
  /** Today's date in YYYY-MM-DD format (used to prevent future dates) */
  today: string = new Date().toISOString().split('T')[0];

  // ─── Form Submission ──────────────────────────────────────────────────

  /** Handle form submission */
  onSubmit(): void {
    this.submitted.set(true);

    // Mark all fields as touched to trigger inline error display
    this.patientForm.markAllAsTouched();

    // Validate date of birth is not in the future
    const dobValue = this.patientForm.get('dateOfBirth')?.value as string;
    if (dobValue && dobValue > this.today) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Date of birth cannot be in the future',
        life: 5000
      });
      return;
    }

    // Stop if form is invalid
    if (this.patientForm.invalid) {
      return;
    }

    this.submitting.set(true);

    const formValue = this.patientForm.value as {
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth: string;
      status: PatientStatus;
    };

    this.patientService.createPatient(formValue).subscribe({
      next: () => {
        this.submitting.set(false);
        // Show success toast then navigate back to dashboard
        this.messageService.add({
          severity: 'success',
          summary: 'Patient Created',
          detail: `${formValue.firstName} ${formValue.lastName} has been registered successfully`,
          life: 3000
        });
        // Small delay so the user can see the toast before navigation
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err: { error?: { error?: string } }) => {
        this.submitting.set(false);
        const detail = err.error?.error || 'Failed to create patient. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail,
          life: 5000
        });
        // Form remains filled on error — no reset
      }
    });
  }

  /** Navigate back to the dashboard without saving */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
