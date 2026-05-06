import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientStatus } from '../../../models/patient.model';

/**
 * StatusBadgeComponent
 * Renders a colour-coded badge for a patient's status.
 *   - active   → green
 *   - pending  → amber/orange
 *   - inactive → red/grey
 *
 * Usage:
 *   <app-status-badge [status]="patient.status" />
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="badgeClass()">
      <span class="status-dot"></span>
      {{ status() | titlecase }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      text-transform: capitalize;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    /* Active — green */
    .badge-active {
      background: rgba(34, 197, 94, 0.12);
      color: #22c55e;
    }
    .badge-active .status-dot {
      background: #22c55e;
      box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
    }

    /* Pending — amber */
    .badge-pending {
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
    }
    .badge-pending .status-dot {
      background: #f59e0b;
      box-shadow: 0 0 6px rgba(245, 158, 11, 0.5);
    }

    /* Inactive — red/grey */
    .badge-inactive {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
    }
    .badge-inactive .status-dot {
      background: #ef4444;
      box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
    }
  `]
})
export class StatusBadgeComponent {
  /** The patient status to render */
  status = input.required<PatientStatus>();

  /** Compute the CSS class based on the status value */
  badgeClass = computed(() => `badge-${this.status()}`);
}
