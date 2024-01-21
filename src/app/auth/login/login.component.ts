import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup<any>;
  wrongUsername = false;
  wrongPassword = false;

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {
    this.authService.getUsers();
    this.loginForm = new FormGroup({
      'username' : new FormControl(null, [Validators.required]),
      'password' : new FormControl(null, [Validators.required])
    });

    if(this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  onLogin() {
    let doesExist = this.authService.doesUserExist(this.loginForm.value.username);
    if (doesExist == undefined) {
      this.wrongUsername = true;
    } else {
      this.wrongUsername = false;
      this.authService.login({username: this.loginForm.value.username, password: this.loginForm.value.password});
      this.authService.isPasswordValid()
      .subscribe(isValid => {
        if (!isValid) {
          this.wrongPassword = true;
        } else {
          this.wrongPassword = false;
        }
      })
    }
  }
  

}
