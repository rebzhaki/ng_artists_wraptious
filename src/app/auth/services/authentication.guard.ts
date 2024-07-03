import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {inject, Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {map, Observable, of, take, tap} from "rxjs";

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const allowLogin = authService.authStatus$.pipe(
    map((authState) => {
      if (authState['meta']['LoginStatus']) {
        return true;
      }
      return false;
    }),
    take(1)
  );
  return allowLogin;
};

