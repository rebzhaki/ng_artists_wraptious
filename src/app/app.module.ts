import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import { OrderHistoryComponent } from './order-history/components/order-history/order-history.component';
import {HttpRequestInterceptor} from "./auth/services/auth.interceptor";
import {LoginComponent} from "./auth/login/login.component";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    // core modules
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,

    // Material modules
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
