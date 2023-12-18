import { Component , OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {User} from "../model/user.model";
import {UserService} from "../user.service";

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css']
})
export class ManageProfileComponent implements OnInit {

  isPasswordVisible: boolean = false;
  loggedUser!: User;
  displayedImageUrl: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
      this.userService.getUser(2).subscribe(
        (user: User) => {
          this.loggedUser = user;
        },
        (error) => {
          console.error('Error loading user:', error);
        }
    );
  }

  ngAfterViewInit() {
    this.fileInput.nativeElement.addEventListener('change', (event: any) => {
      
      const file = event.target.files[0];
      console.log('Nova slika dodata', event.target.files[0]);
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        this.displayedImageUrl = imageUrl;
      }
    });
  }
  handleFileButtonClick() {
    
  console.log('File button clicked');
  this.fileInput.nativeElement.click();
  console.log('After triggering click');
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  

}
