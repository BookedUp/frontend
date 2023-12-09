import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-guest',
  templateUrl: './header-guest.component.html',
  styleUrls: ['./header-guest.component.css', '../../styles.css']
})
export class HeaderGuestComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {

    var profilePict = document.getElementById("profile-picture-guest");
    if (profilePict) {
      profilePict.addEventListener("click", () => {
        var popup = document.getElementById("guestDropdownContainer");
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


    var manageAcc = document.getElementById("manageAcc");
    if (manageAcc) {
      manageAcc.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var myReservation = document.getElementById("myReservation");
    if (myReservation) {
      myReservation.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var favourties = document.getElementById("favourties");
    if (favourties) {
      favourties.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var reviews = document.getElementById("reviews");
    if (reviews) {
      reviews.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var popupframeContainer4 = document.getElementById("signOut");
    if (popupframeContainer4) {
      popupframeContainer4.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var homeText = document.getElementById("homeText");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }
  }
}
