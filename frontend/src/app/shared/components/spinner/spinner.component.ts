import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SpinnerComponent
 * A reusable loading overlay spinner.
 * Use [overlay]="true" for full-screen overlay, or false for inline usage.
 *
 * Usage:
 *   <app-spinner [show]="isLoading()" [overlay]="true" />
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show()) {
      <div [class.spinner-overlay]="overlay()" [class.spinner-inline]="!overlay()">
        <div class="spinner-container">
          <div class="spinner"></div>
          @if (message()) {
            <p class="spinner-message">{{ message() }}</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(3px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .spinner-inline {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(99, 102, 241, 0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner-message {
      color: #e2e8f0;
      font-size: 0.9rem;
      font-weight: 500;
      margin: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  /** Whether to show the spinner */
  show = input<boolean>(false);

  /** Whether to render as a full-screen overlay */
  overlay = input<boolean>(true);

  /** Optional loading message displayed below the spinner */
  message = input<string>('');
}
