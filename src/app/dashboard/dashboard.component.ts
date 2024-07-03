import {Component, inject} from '@angular/core';
import {AuthService} from "../auth/services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentUser = inject(AuthService)
}
