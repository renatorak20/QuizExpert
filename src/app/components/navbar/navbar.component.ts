import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  isAdmin = false;
  authSubscription!: Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isLoggedIn = authStatus;
      this.isAdmin = this.authService.getUser()?.isAdmin || false;
    });
  }

  signOut() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getClass(a: string) {
    return this.router.url === a ? 'active' : '';
  }

}
