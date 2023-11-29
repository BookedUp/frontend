import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.css', '../../styles.css']
})
export class UserMainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
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
