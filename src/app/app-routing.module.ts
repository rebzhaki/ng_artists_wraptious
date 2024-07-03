import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {OrderHistoryComponent} from "./order-history/components/order-history/order-history.component";
import {authenticationGuard} from "./auth/services/authentication.guard";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: 'order-history/:id',
    component: OrderHistoryComponent,
    canActivate: [authenticationGuard]
  },
  { path: '**',
  component: PageNotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    enableTracing: true,
    onSameUrlNavigation: 'ignore'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
