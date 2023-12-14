import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {User} from "../../app/core/model/User";
import {UserService} from "../../app/core/services/user.service";

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css', '../../styles.css']
})
export class ManageProfileComponent implements OnInit {

  loggedUser!: User;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUser(2).subscribe(
        (user: User) => {
          this.loggedUser = user;
        },
        (error) => {
          console.error('Error loading user:', error);
          // Handle error as needed
        }
    );


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
