import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.authStatus$.asObservable();

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
