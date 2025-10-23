import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-google-success',
  template: '<p>Logging in...</p>',
})
export class GoogleSuccessComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      this.authService.handleGoogleLogin(token);
    } else {
      this.router.navigate(['']);
    }
  }
}
