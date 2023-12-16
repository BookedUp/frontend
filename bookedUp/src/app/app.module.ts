import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from "./auth/interceptor";
import { LayoutModule } from './layout/layout.module';
import {AuthModule} from "./auth/auth.module";



import { CalendarComponent } from 'src/shared/calendar/calendar.component';
import { ImageFrameComponent } from 'src/shared/image-frame/image-frame.component';
import { MapComponent } from 'src/shared/map/map.component';

import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { CheckInboxComponent } from '../pages/check-inbox/check-inbox.component';
import { SearchComponent } from '../pages/search/search.component';
import { AccommodationDetailsComponent } from '../pages/accommodation-details/accommodation-details.component';
import { ManageProfileComponent } from '../pages/manage-profile/manage-profile.component';
import { AccommodationsComponent } from '../pages/accommodations/accommodations.component';
import { CreateAccommodationComponent } from '../pages/create-accommodation/create-accommodation.component';
import { ReservationRequestsComponent } from '../pages/reservation-requests/reservation-requests.component';
import { AccommodationRequestsComponent } from '../pages/accommodation-requests/accommodation-requests.component';


@NgModule({
  declarations: [
    AppComponent,


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
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    AuthModule,
    //AccommodationModule


    HttpClientModule,
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



