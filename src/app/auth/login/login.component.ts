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
  isPasswordWrong = false;

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      'username' : new FormControl(null, [Validators.required]),
      'password' : new FormControl(null, [Validators.required])
    });

    if(this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  onLogin(){
    this.authService.login(this.loginForm!!.value);
  }

}
