import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/guard/auth.guard';
import { IndexComponent } from './layout/index/index.component';
import { LoginComponent } from './auth/login/login.component';
import {RegistrationComponent} from "./auth/registration/registration.component";


// import { CalendarComponent } from 'src/shared/calendar/calendar.component';
// import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
// import { CheckInboxComponent } from '../pages/check-inbox/check-inbox.component';
// import { SearchComponent } from '../pages/search/search.component';
// import { AccommodationDetailsComponent } from '../pages/accommodation-details/accommodation-details.component';
// import { ManageProfileComponent } from '../pages/manage-profile/manage-profile.component'
// import { AccommodationsComponent } from '../pages/accommodations/accommodations.component';
// import { CreateAccommodationComponent } from '../pages/create-accommodation/create-accommodation.component';
// import { ReservationRequestsComponent } from '../pages/reservation-requests/reservation-requests.component';
// import { AccommodationRequestsComponent } from '../pages/accommodation-requests/accommodation-requests.component';


//import { LoginComponent } from '../pages/login/login.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  
  // { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: 'check-inbox', component: CheckInboxComponent },
  // { path: 'search', component: SearchComponent },
  // { path: 'accommodation-details/:id', component: AccommodationDetailsComponent },
  // { path: 'manage-profile', component: ManageProfileComponent },
  // { path: 'accommodations', component: AccommodationsComponent },
  // { path: 'add-new-accommodation', component: CreateAccommodationComponent },
  // { path: 'reservation-requests', component: ReservationRequestsComponent },
  // { path: 'accommodation-requests', component: AccommodationRequestsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }