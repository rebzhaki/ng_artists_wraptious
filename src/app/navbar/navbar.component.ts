import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser = this.authService.authStatus$.asObservable();

  isMobile: boolean;
  openSidebar = false;

  constructor() {
    this.isMobile = window.innerWidth <= 600;
    if (!this.isMobile) {
      this.openSidebar = true; // Open sidebar by default on larger screens
    }
  }

  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth <= 600;
    if (!this.isMobile) {
      this.openSidebar = true; // Ensure sidebar is open on larger screens
    }
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
