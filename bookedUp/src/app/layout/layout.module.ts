import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminNavBarComponent} from "./nav-bar/admin-nav-bar/admin-nav-bar.component";
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {GuestNavBarComponent} from "./nav-bar/guest-nav-bar/guest-nav-bar.component";
import {HostNavBarComponent} from "./nav-bar/host-nav-bar/host-nav-bar.component";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    // HomeComponent, nama je index
    // HeaderComponent,
    NavBarComponent,
    AdminNavBarComponent,
    GuestNavBarComponent,
    HostNavBarComponent
  ],
  exports: [
    NavBarComponent
    //HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }
