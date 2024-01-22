import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Role } from 'src/app/user/model/role.enum';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  role: string = '' ;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
      if(this.authService.getRole() == Role.Guest){
        this.role = 'ROLE_GUEST';
      }else if(this.authService.getRole() == Role.Host){
        this.role = 'ROLE_HOST';
      }else{
        this.role = 'ROLE_ADMIN';
      }
  }
}
