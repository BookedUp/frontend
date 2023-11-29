import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Dodajte ovu liniju
//import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Dodajte i BrowserAnimationsModule

import { IndexComponent } from '../pages/index/index.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { RegisterStep2Component } from '../pages/register-step-2/register-step-2.component';
import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { CheckInboxComponent } from '../pages/check-inbox/check-inbox.component';
import { SearchComponent } from '../pages/search/search.component';
import { AccommodationDetailsComponent } from '../pages/accommodation-details/accommodation-details.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    RegisterStep2Component,
    ForgotPasswordComponent,
    CheckInboxComponent,
    SearchComponent,
    AccommodationDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  // Dodajte ovde FormsModule
    AppRoutingModule,
//    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
