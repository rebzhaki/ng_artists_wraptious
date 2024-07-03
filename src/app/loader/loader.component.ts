import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  isLoading$ = false;

  constructor(private loader: LoaderService) {}

  // ngOnInit() {
  //   this.loader.isLoading$.subscribe((value) => {
  //     this.isLoading = value;
  //   });
  // }
}
