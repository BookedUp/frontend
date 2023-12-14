import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { HeaderUnloggedComponent } from '../shared/header-unlogged/header-unlogged.component';
import { HeaderAdminComponent } from '../shared/header-admin/header-admin.component';
import { HeaderHostComponent } from '../shared/header-host/header-host.component';
import { HeaderGuestComponent } from '../shared/header-guest/header-guest.component';
import { FooterComponent } from 'src/shared/footer/footer.component';
import { IndexComponent } from '../pages/index/index.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { RegisterStep2Component } from '../pages/register-step-2/register-step-2.component';
import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { CheckInboxComponent } from '../pages/check-inbox/check-inbox.component';
import { SearchComponent } from '../pages/search/search.component';
import { AccommodationDetailsComponent } from '../pages/accommodation-details/accommodation-details.component';
import { ManageProfileComponent } from '../pages/manage-profile/manage-profile.component'
import { AccommodationsComponent } from '../pages/accommodations/accommodations.component';
import { CreateAccommodationComponent } from '../pages/create-accommodation/create-accommodation.component';
import { ReservationRequestsComponent } from '../pages/reservation-requests/reservation-requests.component';
import { AccommodationRequestsComponent } from '../pages/accommodation-requests/accommodation-requests.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'header-unlogged', component: HeaderUnloggedComponent },
  { path: 'header-admin', component: HeaderAdminComponent },
  { path: 'header-host', component: HeaderHostComponent },
  { path: 'header-guest', component: HeaderGuestComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-step-2', component: RegisterStep2Component },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'check-inbox', component: CheckInboxComponent },
  { path: 'search', component: SearchComponent },
  { path: 'accommodation-details', component: AccommodationDetailsComponent },
  { path: 'manage-profile', component: ManageProfileComponent },
  { path: 'accommodations', component: AccommodationsComponent },
  { path: 'add-new-accommodation', component: CreateAccommodationComponent },
  { path: 'reservation-requests', component: ReservationRequestsComponent },
  { path: 'accommodation-requests', component: AccommodationRequestsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
