import { Component, Input, OnInit } from '@angular/core';
import { AccommodationService } from '../../app/core/services/accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../../app/core/model/Accommodation';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css', '../../styles.css']
})
export class AccommodationsComponent implements OnInit {

  accommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();
  selectedClass: string = 'active-accommodations';
  filter: string = 'active';
  constructor(private accommodationService: AccommodationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'active';
      this.loadAccommodations();
    });

    // necu da diram dalje

    var adminManage = document.getElementById("ownerManage-acc");
    if (adminManage) {
      adminManage.addEventListener("click", () => {
        var popup = document.getElementById("ownerDropdownContainer");
        var popupStyle = popup?.style;

        if (popupStyle) {
          popupStyle.display = "flex";
          popupStyle.zIndex = "100";
          popupStyle.backgroundColor = "rgba(113, 113, 113, 0.3)";
          popupStyle.alignItems = "center";
          popupStyle.justifyContent = "center";
        }

        popup?.setAttribute("closable", "");

        var onClick = (popup && popup.onclick) || function (e: Event) {
          if (e.target === popup && popup && popup.hasAttribute("closable")) {
            popup.style.display = "none";
          }
        };

        popup?.addEventListener("click", onClick);
      });
    }

    var manageProfile = document.getElementById("manageProfile-acc");
      if (manageProfile) {
        manageProfile.addEventListener("click", () => {
          this.router.navigate(['/manage-profile']);
        });
      }

    var myAccommodations = document.getElementById("myAccommodations-acc");
      if (myAccommodations) {
        myAccommodations.addEventListener("click", () => {
          this.router.navigate(['/accommodations']);
        });
      }

    var logOut = document.getElementById("logOut-acc");
    if (logOut) {
      logOut.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var reservationRequests = document.getElementById("reservation-requests-acc");
      if (reservationRequests) {
        reservationRequests.addEventListener("click", () => {
          this.router.navigate(['/reservation-requests']);
        });
      }

    var homeText = document.getElementById("homeText-acc");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['/owner-main-page']);
      });
    }

    var accDetails = document.getElementById("accommodation-owner-details");
    if (accDetails) {
      accDetails.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var newAcc = document.getElementById("new-acc");
      if (newAcc) {
        newAcc.addEventListener("click", () => {
          this.router.navigate(['/add-new-accommodation']);
      });
    }
  }

    private loadAccommodations(): void {
        if (this.filter === 'active') {
            this.accommodations = this.accommodationService.getAllModifiedAccommodations();
        } else if (this.filter === 'requests') {
            this.accommodations = this.accommodationService.getAllCreatedAccommodations();
        } else if (this.filter === 'rejected') {
            this.accommodations = this.accommodationService.getAllCreatedAccommodations();

        } else {
            this.accommodations = this.accommodationService.getAllChangedAccommodations();
        }
    }

    changeStyle(className: string): void {
        this.selectedClass = className;
        if (className === 'active-accommodations') {
            this.router.navigate(['/accommodations'], { queryParams: { filter: 'active' } });
        } else if (className === 'requests-accommodations') {
            this.router.navigate(['/accommodations'], { queryParams: { filter: 'requests' } });
        } else {
            this.router.navigate(['/accommodations'], { queryParams: { filter: 'rejected' } });
        }
    }


    generateStars(rating: number): string[] {
        const stars: string[] = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push('★');
            } else if (i - 0.5 === rating) {
                stars.push('✯');
            } else {
                stars.push('☆');
            }
        }
        return stars;
    }

    roundHalf(value: number): number {
        return Math.round(value * 2) / 2;
    }
}
