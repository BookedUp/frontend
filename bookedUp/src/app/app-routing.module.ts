import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './infrastructure/auth/guard/auth.guard';
import { IndexComponent } from './layout/index/index.component';
import { SearchComponent } from './layout/search/search.component';

import { AccommodationDetailsComponent } from './accommodation/accommodation-details/accommodation-details.component';
import { AccommodationRequestsComponent } from './accommodation/accommodation-requests/accommodation-requests.component';
import { CreateAccommodationComponent } from './accommodation/create-accommodation/create-accommodation.component';
import { AccommodationsComponent } from './accommodation/accommodations/accommodations.component';

import { ReservationRequestsComponent } from './reservation/reservation-requests/reservation-requests.component';
import { CreateReservationComponent } from './reservation/create-reservation/create-reservation.component';
import {ReservationsComponent} from "./reservation/reservations/reservations.component";

import { ManageProfileComponent } from './user/manage-profile/manage-profile.component';

import { CheckInboxComponent } from './layout/check-inbox/check-inbox.component';
import { ForgotPasswordComponent } from './layout/forgot-password/forgot-password.component';

import { LoginComponent } from './infrastructure/auth/login/login.component';
import {RegistrationComponent} from "./infrastructure/auth/registration/registration.component";


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'search', component: SearchComponent },

  { path: 'accommodation-details/:id', component: AccommodationDetailsComponent },
  { path: 'accommodation-requests', component: AccommodationRequestsComponent, canActivate: [AuthGuard], data: { role: ['ROLE_ADMIN'] }},
  { path: 'create-accommodation', component: CreateAccommodationComponent, canActivate: [AuthGuard], data: { role: ['ROLE_HOST'] }},
  { path: 'my-accommodations', component: AccommodationsComponent, canActivate: [AuthGuard], data: { role: ['ROLE_HOST'] }},

  { path: 'reservation-requests', component: ReservationRequestsComponent, canActivate: [AuthGuard], data: { role: ['ROLE_HOST'] }},
  { path: 'create-reservation/:id', component: CreateReservationComponent, canActivate: [AuthGuard], data: { role: ['ROLE_GUEST'] }},
  { path: 'my-reservations', component: ReservationsComponent, canActivate: [AuthGuard], data: { role: ['ROLE_GUEST'] }},

  { path: 'manage-profile', component: ManageProfileComponent, canActivate: [AuthGuard], data: { role: ['ROLE_ADMIN', 'ROLE_HOST', 'ROLE_GUEST'] }},

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'check-inbox', component: CheckInboxComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
