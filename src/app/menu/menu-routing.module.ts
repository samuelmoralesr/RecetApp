import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
import { LoginGuard } from '../guards/login.guard';
import { IntroGuard } from '../guards/intro.guard';

const routes: Routes = [
  {
    path: '',
    component: MenuPage, 
    children: [
      {
        path: "home",
        loadChildren: () => 
          import("../home/home.module").then(m => m.HomePageModule), canActivate:[LoginGuard, IntroGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
