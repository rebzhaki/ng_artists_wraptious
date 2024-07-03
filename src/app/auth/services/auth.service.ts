import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, share, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import {
  ArtistsAuthStateModel,
  defaultUserAuthState,
} from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { jsonToFormData } from '../../shared/common-functions';
import { LOCAL_STORAGE_TOKEN } from '../../shared/storage/local-storage-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authProvider: (formData) => Observable<any>;
  readonly apiAuthInvalidator: () => Observable<unknown>;
  readonly AUTHKEY: string = 'AssignmentAuthState';

  initialAuthState: ArtistsAuthStateModel =
    JSON.parse(localStorage.getItem(this.AUTHKEY)) ?? defaultUserAuthState;

  authStatus$ = new BehaviorSubject<ArtistsAuthStateModel>(
    this.initialAuthState
  );

  private wraptiousAuthProvider(resource: any) {
    return this.httpClient.post<FormData>(
      `${environment.api_base_url}/users/auth`,
      jsonToFormData(resource)
    );
  }

  private wraptiousAuthInvalidator(): Observable<unknown> {
    return this.httpClient.get(`${environment.api_base_url}/users/logout`);
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(LOCAL_STORAGE_TOKEN) private storage: Storage
  ) {
    this.authProvider = this.wraptiousAuthProvider;
    this.apiAuthInvalidator = this.wraptiousAuthInvalidator;
  }
  conform_user_data(
    userModelData: ArtistsAuthStateModel
  ): ArtistsAuthStateModel {
    this.storage.setItem(this.AUTHKEY, JSON.stringify(userModelData));
    this.authStatus$.next(userModelData);
    return {
      ...userModelData,
      ['meta']: {
        ...userModelData['meta'],
        ['LoginStatus']: true,
        ['stateLoaded']: true,
      },
    };
  }

  login(formData: {
    username: string;
    password: string;
  }): Observable<ArtistsAuthStateModel> {
    const authValues = {
      username: formData.username,
      password: formData.password,
      client_id: environment.client_id,
      redirect_url: '/api/v0.1/users/me',
      user_requested_role: null,
    };
    return this.authProvider(authValues).pipe(
      map((data) => this.conform_user_data(data)),
      tap((userModelData) => {
        this.storage.setItem(this.AUTHKEY, JSON.stringify(userModelData));
        this.authStatus$.next(userModelData);
      }),
      share()
    );
  }

  logout(): Observable<unknown> {
    return this.apiAuthInvalidator().pipe(
      tap(() => {
        this.authStatus$.next(defaultUserAuthState);
        this.storage.setItem(
          this.AUTHKEY,
          JSON.stringify(defaultUserAuthState)
        );
      }),
      share()
    );
  }
}
