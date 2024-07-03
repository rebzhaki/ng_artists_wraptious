import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderHistoryService } from '../../order-history.service';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { OrderHistoryResource } from '../../model/order-history';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';

interface Order {
  created: string;
  grand_total: number;
  name: string;
  order_source: string;
  receipt_link: string;
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'created',
    'order_source',
    'grand_total',
    'receipt_link',
  ];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();

  orderHistory$ = new BehaviorSubject<OrderHistoryResource>(null);
  orderHistoryObservable$ = this.orderHistory$.asObservable();
  subs = new SubSink();
  route = inject(ActivatedRoute);
  router = inject(Router);
  orderHistoryService = inject(OrderHistoryService);
  datePipe = inject(DatePipe);
  artistId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.subs.sink = this.route.paramMap.subscribe((paramMap) => {
      const userUUID = paramMap.get('id');
      this.artistId = paramMap.get('id');

      // console.log('userUUID', userUUID);
      const url = `${environment.api_base_url}/orders`;

      const params: Map<any, any> = new Map<any, any>();

      params
        .set('resource_name', 'orders')
        .set('filters', `owner=[eq]${userUUID}`)
        .set('page_length', String(100))
        .set('order_by', '[desc]created')
        .set('page_number', String(1));
      console.log(params);

      this.orderHistoryService.getOrderHistoryResource(url, params).subscribe({
        next: (value: OrderHistoryResource) => {
          this.orderHistory$.next(value);
        },
        error: (error) => {
          console.error('orderHistoryHttpError - 404', error);
        },
      });
    });

    this.orderHistoryObservable$.subscribe((orderHistory) => {
      if (orderHistory) {
        this.dataSource = new MatTableDataSource<Order>(
          orderHistory.data.map((order) => {
            return {
              name: order.attributes.name,
              created: this.datePipe.transform(
                order.attributes.created,
                'yyyy/MM/dd'
              ),
              order_source: order.attributes.order_source,
              grand_total: order.attributes.grand_total,
              receipt_link: order.attributes.receipt_link,
            };
          })
        );
        this.dataSource.paginator = this.paginator;
        this.paginator.length = this.dataSource.paginator.length;
      }
    });
  }
}
