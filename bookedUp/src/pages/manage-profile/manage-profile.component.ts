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
    const frameContainer10 = document.getElementById("delete-button");

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
  }
}
