import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';

// Shared Components & Services
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PatientService } from '../../shared/services/patient.service';
import { Patient, DashboardStats, PatientStatus } from '../../models/patient.model';

/**
 * DashboardComponent
 * Main page displaying patient summary statistics, charts, and a searchable/filterable patient table.
 * Route: /dashboard
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ChartModule,
    ToastModule,
    PaginatorModule,
    SpinnerComponent,
    StatusBadgeComponent
  ],
  providers: [MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly patientService = inject(PatientService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // ─── State Signals ──────────────────────────────────────────────────────
  /** Patient list from API */
  patients = signal<Patient[]>([]);
  /** Dashboard summary stats */
  stats = signal<DashboardStats>({ total: 0, active: 0, pending: 0, inactive: 0 });
  /** Loading state for spinner overlay */
  loading = signal<boolean>(false);
  /** Search input value */
  searchQuery = signal<string>('');
  /** Selected status filter */
  selectedStatus = signal<string>('');
  /** Total records for pagination */
  totalRecords = signal<number>(0);
  /** Current page number (1-indexed) */
  currentPage = signal<number>(1);
  /** Number of records per page */
  pageSize = signal<number>(10);

  // ─── Status Filter Options ────────────────────────────────────────────
  statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' }
  ];

  /** Page size options for the paginator */
  pageSizeOptions = [5, 10, 25];

  // ─── Chart Data (computed from stats) ─────────────────────────────────
  /** Pie/Bar chart data built reactively from the stats signal */
  chartData = computed(() => {
    const s = this.stats();
    return {
      labels: ['Active', 'Pending', 'Inactive'],
      datasets: [
        {
          data: [s.active, s.pending, s.inactive],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          hoverBackgroundColor: ['#16a34a', '#d97706', '#dc2626'],
          borderWidth: 0
        }
      ]
    };
  });

  /** Chart display options */
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          padding: 16,
          font: { size: 13, weight: 500 as const }
        }
      }
    }
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadStats();
    this.loadPatients();
  }

  // ─── Data Loading ─────────────────────────────────────────────────────

  /** Fetch dashboard summary statistics */
  loadStats(): void {
    this.patientService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => this.showError('Failed to load dashboard statistics', err)
    });
  }

  /** Fetch paginated patient list with current filters */
  loadPatients(): void {
    this.loading.set(true);
    this.patientService
      .getPatients(
        this.searchQuery(),
        this.selectedStatus(),
        this.currentPage(),
        this.pageSize()
      )
      .subscribe({
        next: (response) => {
          this.patients.set(response.data);
          this.totalRecords.set(response.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.showError('Failed to load patients', err);
        }
      });
  }

  // ─── User Actions ─────────────────────────────────────────────────────

  /** Trigger search — resets to page 1 */
  onSearch(): void {
    this.currentPage.set(1);
    this.loadPatients();
  }

  /** Trigger status filter — resets to page 1 */
  onStatusFilter(): void {
    this.currentPage.set(1);
    this.loadPatients();
  }

  /** Handle paginator page change */
  onPageChange(event: { first?: number; rows?: number }): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.pageSize();
    const newPage = Math.floor(first / rows) + 1;
    this.currentPage.set(newPage);
    this.pageSize.set(rows);
    this.loadPatients();
  }

  /** Navigate to the Add Patient form */
  navigateToAddPatient(): void {
    this.router.navigate(['/patients/new']);
  }

  /** Navigate to a patient's detail page */
  viewPatient(id: string): void {
    this.router.navigate(['/patients', id]);
  }

  // ─── Error Handling ───────────────────────────────────────────────────

  /** Display a dismissible error toast */
  private showError(summary: string, err: unknown): void {
    const detail = err instanceof Error ? err.message : 'An unexpected error occurred';
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }
}
