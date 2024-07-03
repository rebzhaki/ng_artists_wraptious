/* eslint-disable @typescript-eslint/quotes */
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import {UiService} from "./ui.service";
import {AuthService} from "../../auth/services/auth.service";
import {isEmptyString} from "../common-functions";
import {ErrorMessageModalComponent} from "../components/error-message-modal/error-message-modal.component";
import {environment} from "../../../environments/environment";


let interceptorClassRef: {
  appConfigModelData: { appPages: { holeInRegistrationSystem: any } };
};

// interface
type Finally = (
  httpResponse: HttpResponse<any> | HttpErrorResponse,
  statusObject: StatusDetails,
  self: any
) => any;

interface StatusDetails {
  requestUrl: string | null;
  message: string | null;
  redirectUrl: string | null;
  uiMessage: string | null;
  uiMode: 'modal' | 'toast';
  finally: Finally | null | any;
}

interface HttpStatusCode {
  [key: number]: Array<StatusDetails>;
}

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  // reference to the InterceptorService class.
  self = this;
  appConfigModel$: any;
  appConfigModelData: any;

  uiServiceConfigDefaults: MatSnackBarConfig = {
    duration: 7000,
    verticalPosition: 'top',
  };

  constructor(
    private uiService: UiService,
    private router: Router,
    public authService: AuthService,
    public dialog: MatDialog
  ) {


  }

  private runInterceptorActions(statusRules: StatusDetails) {
    switch (statusRules.uiMode) {
      case 'modal':
        if (!isEmptyString(statusRules.message)) {
          this.dialog.open(ErrorMessageModalComponent, {
            data: {
              isLoginError: true,
              error: statusRules.message,
              uiMessage: statusRules.uiMessage,
            },
          });
          this.dialog.afterAllClosed.subscribe(() => {
            this.self.router.navigateByUrl(statusRules.redirectUrl);
          });
        }
        break;
      case 'toast':
        if (!isEmptyString(statusRules.message)) {
          this.uiService.showToast(
            statusRules.message,
            'Close',
            this.uiServiceConfigDefaults
          );
        }
        break;
    }

    if (!!statusRules.finally) {
      statusRules.finally(statusRules, this.self);
    }

    if (!isEmptyString(statusRules.redirectUrl)) {
      this.self.router.navigateByUrl(statusRules.redirectUrl).then();
    }
  }

  handleInterceptorResponse(
    httpResponse: HttpErrorResponse | HttpResponse<any>
  ) {
    const statusCode = httpResponse.status;

    if (httpStatusCodesObject.hasOwnProperty(statusCode)) {
      const statusErrorDetails = httpStatusCodesObject[statusCode];

      for (const statusRules of statusErrorDetails) {
        //    if requestUrl exists and matches httpResponse.url, or requestUrl is NULL
        if (
          statusRules.requestUrl === httpResponse.url ||
          httpResponse.url.includes(statusRules.requestUrl) ||
          statusRules.requestUrl === null
        ) {
          if (httpResponse instanceof HttpResponse) {
            {
              this.runInterceptorActions(statusRules);
              break;
            }
          }

          // error
          else if (httpResponse instanceof HttpErrorResponse) {
            // if statusRules.message exists and  matches httpResponse.message, or statusRules.message is NULL
            if (
              (!isEmptyString(statusRules.message) &&
                httpResponse?.error?.error?.meta?.message?.includes(
                  statusRules.message
                )) ||
              statusRules.message === null
            ) {
              this.runInterceptorActions(statusRules);

              break;
            }
          } else {
            console.error(
              '--------handleInterceptorResponse---Should Never Execute-------------'
            );
          }
        }
      }
    }
  }
}

function logoutUser(statusObject: StatusDetails, self: any) {
  self.authService.logout();
}

function resetUser(statusObject: StatusDetails, self: InterceptorService) {
  self.authService.logout();
}

function restoreAuthSession(
  statusObject: StatusDetails,
  self: InterceptorService
) {
  self.authService.logout();
}

// @ts-ignore
function returnEmpty(
  httpResponse: HttpErrorResponse | HttpResponse<any>,
  statusObject: StatusDetails
) {
  if (
    httpResponse instanceof HttpErrorResponse &&
    httpResponse.error.error.meta.message.includes(statusObject.message)
  ) {
    return EMPTY;
  }
}

const over500Errors: StatusDetails = {
  requestUrl: null,
  message: null,
  redirectUrl: null,
  uiMode: 'toast',
  uiMessage: 'An unexpected error has occurred',
  finally: null,
};

// interceptor def
const httpStatusCodesObject: HttpStatusCode = {
  500: [over500Errors],
  502: [over500Errors],
  503: [over500Errors],
  504: [over500Errors],
  400: [{

    requestUrl: `${environment.api_base_url}/users/auth`,
    message: 'Username not provided.',
    redirectUrl: '/login',
    uiMode: 'modal',
    uiMessage:
      "Oops! You provided an empty Username. Please provide a valid Username.",
    finally: null,
  }],
  404: [
    {
      requestUrl: `${environment.api_base_url}/users/me`,
      message: null,
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage:
        "We're really sorry, there is a problem with your user account. " +
        'Please contact us via live chat.',
      finally: logoutUser,
    },
    {
      requestUrl: null,
      message:
        'The query returned no results. ' +
        'There may be nothing here, or you may not have permission to access this resource. ' +
        'Your resource request failed.',
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: null,
      finally: returnEmpty,
    },
    {
      requestUrl: `${environment.api_base_url}/users`,
      message:
        'The query returned no results. There may be nothing here, or you may not have permission to access this resource.',
      redirectUrl: null,
      uiMessage: 'Sorry! Artist Not Found.',
      uiMode: 'toast',
      finally: null,
    },
    {
      requestUrl: null,
      message: 'art_image_role not found for art',
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: null,
      finally: null,
    },
    {
      requestUrl: `${environment.api_base_url}/users/auth`,
      message: 'user not found',
      redirectUrl: '/signup',
      uiMode: 'modal',
      uiMessage:
        "Oops! We can't find a user with that email address. Would you like to sign up instead?",
      finally: null,
    },
    {
      requestUrl: `${environment.api_base_url}/users/logout`,
      message: 'No user is logged in.',
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage: 'No user is logged in.',
      finally: null,
    },
  ],
  401: [
    {
      requestUrl: `${environment.log_url}`,
      message: null,
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: null,
      finally: resetUser,
    },
    {
      requestUrl: `${environment.api_base_url}/users/authstate`,
      message: 'No User Logged In',
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage: 'No User Logged In.',
      finally: resetUser,
    },
    {
      requestUrl: `${environment.api_base_url}/users/me`,
      message: 'Invalid Token',
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: 'No User Logged In.',
      finally: resetUser,
    },
    {
      requestUrl: `${environment.api_base_url}/users/auth`,
      message: 'incorrect password',
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage: 'Incorrect Password',
      finally: resetUser,
    },
    {
      requestUrl: null,
      message: null,
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage: 'No User Logged In',
      finally: resetUser,
    },
    {
      requestUrl: `${environment.api_base_url}/users/auth`,
      message: 'Invalid Client ID',
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage: 'No User Logged In',
      finally: resetUser,
    },
  ],
  403: [
    {
      requestUrl: `${environment.api_base_url}/pages`,
      message: null,
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage:
        'You do not have permission to edit this resource, please log in with an authorised account.',
      finally: resetUser,
    },
    {
      requestUrl: `${environment.api_base_url}/users/auth`,
      message: 'User already logged in.',
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: null,
      finally: restoreAuthSession,
    },
    {
      requestUrl: `${environment.api_base_url}/users/sso`,
      message: 'User already logged in.',
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: null,
      finally: restoreAuthSession,
    },
    {
      requestUrl: null,
      message: 'User already logged in.',
      redirectUrl: '/dashboard/me/profile',
      uiMode: 'toast',
      uiMessage: null,
      finally: restoreAuthSession,
    },
    {
      requestUrl: `${environment.api_base_url}/users/password`,
      message:
        'This password reset link has expired. If you still wish to refresh your password, please get a new link.',
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage:
        'This password reset link has expired. If you still wish to refresh your password, please get a new link',
      finally: resetUser,
    },
  ],
  409: [
    {
      requestUrl: null,
      message: 'User already exists.',
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage:
        "Hey! We've noticed you already have an account with us, you lovely person." +
        ' Please log in instead!',
      finally: resetUser,
    },
    {
      requestUrl: null,
      message: 'MySQL Integrity Constraints Failed.',
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: null,
      finally: null,
    },
  ],
  413: [
    {
      requestUrl: null,
      message: 'Request Entity Too Large',
      redirectUrl: null,
      uiMode: 'toast',
      uiMessage: `Your file is too big! Files must be less than ${environment.artMaxFileSizeLimit}`,
      finally: null,
    },
  ],
  422: [
    {
      requestUrl: `${environment.api_base_url}/users/auth`,
      message: null,
      redirectUrl: `/pages/${interceptorClassRef?.appConfigModelData.appPages.holeInRegistrationSystem}`,
      uiMode: 'toast',
      uiMessage: null,
      finally: null,
    },
    {
      requestUrl: `${environment.api_base_url}/users`,
      message: null,
      redirectUrl: `/pages/${interceptorClassRef?.appConfigModelData.appPages.holeInRegistrationSystem}`,
      uiMode: 'toast',
      uiMessage: null,
      finally: null,
    },
    {
      requestUrl: `${environment.api_base_url}/competition/users`,
      message: null,
      redirectUrl: `/pages/${interceptorClassRef?.appConfigModelData.appPages.holeInRegistrationSystem}`,
      uiMode: 'toast',
      uiMessage: null,
      finally: null,
    },
  ],
  202: [
    {
      requestUrl: `${environment.api_base_url}/users/logout`,
      message: null,
      redirectUrl: '/login',
      uiMode: 'toast',
      uiMessage: null,
      finally: null,
    },
  ],
};
