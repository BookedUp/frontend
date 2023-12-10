import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header-host',
  templateUrl: './header-host.component.html',
  styleUrls: ['./header-host.component.css', '../../styles.css']
})
export class HeaderHostComponent {
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
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
  }

  navigateToReservations(): void {
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
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