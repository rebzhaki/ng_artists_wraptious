import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { HostListener, Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import {functionToObjectBinder, genericRetryStrategy} from "../../shared/common-functions";
import {ConnectionStatusService} from "../../shared/services/connection-status.service";
import {UiService} from "../../shared/services/ui.service";
import {LOCAL_STORAGE_TOKEN} from "../../shared/storage/local-storage-config";
import {InterceptorService} from "../../shared/services/interceptor.service";

// Inject with Credentials
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor, OnDestroy {
  status: string;
  isConnected = true;

  connection_ref_storage_key = 'connection_ref_storage_key';

  private subs = new SubSink();
  private destroy = new Subject<void>();

  constructor(
    public uiService: UiService,
    @Inject(LOCAL_STORAGE_TOKEN) private storage: Storage,
    private connectionService: ConnectionStatusService,
    private interceptorService: InterceptorService
  ) {
    this.subs.sink = this.connectionService.connectionStatus.subscribe(
      (isConnected) => {
        this.isConnected = isConnected;

        if (this.isConnected) {
          const storage_connection_ref = JSON.parse(
            this.storage.getItem(this.connection_ref_storage_key)
          ) as boolean;

          this.status = 'INTERNET CONNECTED';

          // only show toast if there was no internet connection before.
          if (!storage_connection_ref) {
            this.uiService.showToast(
              this.status,
              'Close',
              this.uiService.toastConfig()
            );
          }

          this.storage.setItem(this.connection_ref_storage_key, 'true');
        } else {
          this.storage.setItem(this.connection_ref_storage_key, 'false');

          this.status = 'NO INTERNET CONNECTION';

          this.uiService.showToast(
            this.status,
            'Close',
            this.uiService.toastConfig({
              configurations: { duration: 60000, verticalPosition: 'top' },
            })
          );
        }
      }
    );
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    // else return the normal request
    // use ui service to display error message
    return next.handle(req).pipe(
      tap(
        (incoming: HttpResponse<any>) => {
          // console.log('-------HttpResponse---------', incoming);
          this.interceptorService.handleInterceptorResponse(incoming);
        },
        (err: HttpErrorResponse) => {
          // console.log('-------HttpErrorResponse---------', err);
          this.interceptorService.handleInterceptorResponse(err);
        }
      ),
      genericRetryStrategy({
        allowedStatusCodes: [0, 502, 503, 504],
        toastFunc: functionToObjectBinder<void, UiService>({
          func: this.uiService.showToast,
          targetObject: this.uiService,
        }),
      }),
      shareReplay()
    );
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.subs.unsubscribe();
    this.destroy.next();
    this.destroy.complete();
  }
}
