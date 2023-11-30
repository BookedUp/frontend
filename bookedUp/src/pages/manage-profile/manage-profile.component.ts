import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css', '../../styles.css']
})
export class ManageProfileComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const frameContainer10 = document.getElementById("frameContainer10");

    if (frameContainer10) {
      frameContainer10.addEventListener("click", function () {
        const popup = document.getElementById("deleteAccountNotification");

        if (!popup) return;

        const popupStyle = popup.style;

        if (popupStyle) {
          popupStyle.display = "flex";
          popupStyle.zIndex = "100";
          popupStyle.backgroundColor = "rgba(113, 113, 113, 0.3)";
          popupStyle.alignItems = "center";
          popupStyle.justifyContent = "center";
        }

        popup.setAttribute("closable", "");

        const onClick = (popup && popup.onclick) || function (e: Event) {
          if (popup && e.target === popup && popup.hasAttribute("closable")) {
            popup.style.display = "none";
          }
        };

        popup.addEventListener("click", onClick);
      });
    }



    var ellipseIcon = document.getElementById("ellipseIcon");
    if (ellipseIcon) {
      ellipseIcon.addEventListener("click", () => {
        var popup = document.getElementById("adminDropdownContainer");
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

    var popupframeContainer = document.getElementById("popupframeContainer");
    if (popupframeContainer) {
      popupframeContainer.addEventListener("click", () => {
        this.router.navigate(['/manage-profile']);
      });
    }

    var homeText = document.getElementById("homeText");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['/user-main-page']);
      });
    }


    var popupframeContainer4 = document.getElementById("popupframeContainer4");
    if (popupframeContainer4) {
      popupframeContainer4.addEventListener("click", () => {
        this.router.navigate(['/']);
      });
    }
  }
}
