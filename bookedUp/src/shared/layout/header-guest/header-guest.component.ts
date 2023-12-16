import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-guest',
  templateUrl: './header-guest.component.html',
  styleUrls: ['./header-guest.component.css', '../../../styles.css']
})
export class HeaderGuestComponent {

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
    this.router.navigate(['/manage-profile'], { queryParams: { role: 'guest' } });
  }

  navigateToMyReservations(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
  }

  navigateToFavourites(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
  }

  navigateToReviews(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
  }

  navigateToHome(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
  }

  navigateToSignOut(): void {
    this.router.navigate(['/']);
  }
}
