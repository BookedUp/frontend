import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';

import { ManageProfileComponent } from './manage-profile/manage-profile.component';


@NgModule({
  declarations: [
    ManageProfileComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    LayoutModule,
  ],
  exports:[
    //if needed add here components
  ]
})
export class UserModule { }
