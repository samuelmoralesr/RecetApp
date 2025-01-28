import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfileInfoPageRoutingModule } from './edit-profile-info-routing.module';

import { EditProfileInfoPage } from './edit-profile-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfileInfoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditProfileInfoPage]
})
export class EditProfileInfoPageModule {}
