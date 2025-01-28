import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfileInfoPage } from './edit-profile-info.page';

const routes: Routes = [
  {
    path: '',
    component: EditProfileInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfileInfoPageRoutingModule {}
