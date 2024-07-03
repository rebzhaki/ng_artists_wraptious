import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { filter, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {
  EmailValidation,
  PasswordValidation,
} from '../../shared/common-functions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;

  localUserDataUsername: string;
  localUserDataPassword: string;
  isTnCsChecked: boolean;
  isNewsLetterChecked: boolean;
  subs = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    protected authService: AuthService
  ) {
    // By default, wraptious bespoke terms need to be active.
    this.isTnCsChecked = true;
    this.isNewsLetterChecked = false;
  }

  ngOnInit() {
    this.buildLoginForm();
    this.onChanges();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: [this.localUserDataUsername, EmailValidation],
      password: [this.localUserDataPassword, PasswordValidation],
    });
  }

  onChanges() {
    this.loginForm.valueChanges
      .pipe(
        tap((loginData) => {
          this.localUserDataUsername = loginData.username;
          this.localUserDataPassword = loginData.password;
        })
      )
      .subscribe();
  }

  login(submittedForm: FormGroup) {
    let formValues = {} as any;
    formValues = submittedForm.value;
    this.authService
      .login(formValues)
      .pipe(
        filter((data) => data.meta.LoginStatus),
        tap((data) => {
          return this.router.navigateByUrl('/dashboard');
        })
      )
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe({
      next(data) {
        console.error('Logout successful', data);
      },
      error(error) {
        console.error('Logout failed', error);
      },
      complete() {
        console.error('Logout complete');
      },
    });
  }
}
