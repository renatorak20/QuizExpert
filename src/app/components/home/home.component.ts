import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router, private authService: AuthService) {}

  startQuiz() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['play'])
    } else {
      this.router.navigate(['/register'])
    }
  }

}
