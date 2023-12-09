import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header-host',
  templateUrl: './header-host.component.html',
  styleUrls: ['./header-host.component.css', '../../styles.css']
})
export class HeaderHostComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {

    var profilePict = document.getElementById("profile-picture-host");
    if (profilePict) {
      profilePict.addEventListener("click", () => {
        var popup = document.getElementById("hostDropdownContainer");
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

    var myAmenities = document.getElementById("myAmenities");
    if (myAmenities) {
      myAmenities.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var favourties = document.getElementById("reservations");
    if (favourties) {
      favourties.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var comments = document.getElementById("comments");
    if (comments) {
      comments.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }

    var reports = document.getElementById("reports");
    if (reports) {
      reports.addEventListener("click", () => {
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