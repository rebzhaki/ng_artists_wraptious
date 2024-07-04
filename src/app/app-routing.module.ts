import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderHistoryComponent } from './order-history/components/order-history/order-history.component';
import { authenticationGuard } from './auth/services/authentication.guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authenticationGuard],

    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
      },
      {
        path: 'order-history/:id',
        component: OrderHistoryComponent,
        data: { title: 'Order History' },
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true,
      onSameUrlNavigation: 'ignore',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
