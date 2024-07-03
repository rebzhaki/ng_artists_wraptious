import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {OrderHistoryResource} from "./model/order-history";
import {getHttpParams} from "../shared/common-functions";

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  constructor(private httpClient: HttpClient) {}

  getOrderHistoryResource(
    url: string,
    params?: any
  ): Observable<OrderHistoryResource> {
    return this.httpClient.get<OrderHistoryResource>(`${url}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/vnd.api+json',
      }),
      params: getHttpParams(params),
    });
  }
}
