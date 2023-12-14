import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HeaderComponent } from '../shared/header/header.component';
import { HeaderUnloggedComponent } from '../shared/header-unlogged/header-unlogged.component';
import { HeaderAdminComponent } from '../shared/header-admin/header-admin.component';
import { HeaderHostComponent } from '../shared/header-host/header-host.component';
import { HeaderGuestComponent } from '../shared/header-guest/header-guest.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { IndexComponent } from '../pages/index/index.component';
//import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { LoginComponent } from './auth/login/login.component';

import { RegisterStep2Component } from '../pages/register-step-2/register-step-2.component';
import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { CheckInboxComponent } from '../pages/check-inbox/check-inbox.component';
import { SearchComponent } from '../pages/search/search.component';
import { AccommodationDetailsComponent } from '../pages/accommodation-details/accommodation-details.component';
import { ManageProfileComponent } from '../pages/manage-profile/manage-profile.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccommodationsComponent } from '../pages/accommodations/accommodations.component';
import { CreateAccommodationComponent } from '../pages/create-accommodation/create-accommodation.component';
import { ReservationRequestsComponent } from '../pages/reservation-requests/reservation-requests.component';
import { AccommodationRequestsComponent } from '../pages/accommodation-requests/accommodation-requests.component';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderUnloggedComponent,
    HeaderAdminComponent,
    HeaderHostComponent,
    HeaderGuestComponent,
    FooterComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    RegisterStep2Component,
    ForgotPasswordComponent,
    CheckInboxComponent,
    SearchComponent,
    AccommodationDetailsComponent,
    ManageProfileComponent,
    AccommodationsComponent,
    CreateAccommodationComponent,
    ReservationRequestsComponent,
    AccommodationRequestsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



