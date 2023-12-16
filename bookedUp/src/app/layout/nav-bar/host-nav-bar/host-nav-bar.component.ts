import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-nav-bar',
  templateUrl: './host-nav-bar.component.html',
  styleUrls: ['./host-nav-bar.component.css', '../../../../styles.css']
})
export class HostNavBarComponent {
  isPopupVisible = false;

  constructor(private router: Router) {}

  onProfilePictureClick(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  onPopupClick(event: Event): void {
    if (this.isPopupVisible && event.target instanceof HTMLElement && event.target.hasAttribute('closable')) {
      this.isPopupVisible = false;
    }
  }

  navigateToManageAccount(): void {
    this.router.navigate(['/manage-profile'], { queryParams: { role: 'host' } });
  }

  navigateToMyAmenities(): void {
    this.router.navigate(['/accommodations'], { queryParams: { role: 'host' } });
  }

  navigateToReservations(): void {
    this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'all' },  });
  }

  navigateToComments(): void {
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
  }

  navigateToReports(): void {
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
  }

  navigateToHome(): void {
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
  }

  navigateToSignOut(): void {
    this.router.navigate(['/']);
  }
}
