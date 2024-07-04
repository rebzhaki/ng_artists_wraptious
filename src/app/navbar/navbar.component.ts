import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser = this.authService.authStatus$.asObservable();

  openSidebar = true;
  isMobile = false;

  constructor(private mediaCheck: MediaObserver) {}

  ngOnInit() {
    this.mediaCheck.asObservable().subscribe((changes: MediaChange[]) => {
      changes.forEach((change: MediaChange) => {
        this.isMobile = change.mqAlias === 'xs' || change.mqAlias === 'sm';
        this.openSidebar = !this.isMobile;
      });
    });
  }

  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log('Logout successful', data);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
      complete: () => {
        console.log('Logout complete');
      },
    });
  }
}
