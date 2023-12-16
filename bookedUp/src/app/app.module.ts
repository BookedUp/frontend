import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HeaderComponent } from '../shared/layout/header/header.component';
import { HeaderUnloggedComponent } from '../shared/layout/header-unlogged/header-unlogged.component';
import { HeaderAdminComponent } from '../shared/layout/header-admin/header-admin.component';
import { HeaderHostComponent } from '../shared/layout/header-host/header-host.component';
import { HeaderGuestComponent } from '../shared/layout/header-guest/header-guest.component';
import { FooterComponent } from '../shared/layout/footer/footer.component';
import { ShorterFooterComponent } from '../shared/layout/shorter-footer/shorter-footer.component';

import { CalendarComponent } from 'src/shared/calendar/calendar.component';
import { ImageFrameComponent } from 'src/shared/image-frame/image-frame.component';

import { MapComponent } from 'src/shared/map/map.component';
import { IndexComponent } from '../pages/index/index.component';
//import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
//import { LoginComponent } from './auth/login/login.component';
import {AuthModule} from "./auth/auth.module";

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
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from "./auth/interceptor";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';


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
    ShorterFooterComponent,
    IndexComponent,
    //LoginComponent,
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
    AccommodationRequestsComponent,

    MapComponent, 
    CalendarComponent,
    ImageFrameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    ReactiveFormsModule,
    AuthModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent, MapComponent, CalendarComponent]

})
export class AppModule { }



