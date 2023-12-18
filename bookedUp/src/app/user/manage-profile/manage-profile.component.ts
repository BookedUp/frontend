import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {User} from "../model/user.model";
import {UserService} from "../user.service";

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css', '../../../styles.css']
})
export class ManageProfileComponent implements OnInit {

  isPasswordVisible: boolean = false;
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

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  // Assuming you have a function to handle file upload in your component
  // onFileUpload(event: any): void {
  //     const file = event.target.files[0];
    
  //     // Check if loggedUser is defined and has a profilePicture property
  //     if (this.loggedUser && this.loggedUser.profilePicture) {
  //       // Perform the logic to upload the file and get the new URL
  //       // Replace the following line with your actual upload logic
  //       const newImageUrl = this.uploadImage(file);
    
  //       // Update the loggedUser with the new URL
  //       if (this.loggedUser.profilePicture) {
  //         this.loggedUser.profilePicture.url = newImageUrl;
  //       } else {
  //         // If profilePicture is undefined, create a new object
  //         this.loggedUser.profilePicture = { url: newImageUrl };
  //       }
  //     }
  //   }
  

}
