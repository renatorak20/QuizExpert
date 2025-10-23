import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import * as bcrypt from 'bcryptjs';
import { DataService } from '../services/Data.service';
import { User } from '../models/User';

@Injectable()
export class AuthService implements OnInit {

  apiURL = 'http://localhost:5001/quizexpert/v1/auth';
  user : User | null = null;
  errorEmitter : Subject<string> = new Subject<string>();
  authChange : Subject<boolean> = new Subject<boolean>();

  users: User[] = [];
  usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private passwordValidSubject = new BehaviorSubject<boolean>(false);
  constructor(private router : Router, private dataService: DataService, private http: HttpClient) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    this.dataService.getUsers()
    .subscribe((res:any) => {
      this.users = res;
      this.usersSubject.next([...this.users]);
    })
  }

  login(credentials: { username: string; password: string }) {
  return this.http.post<{ token: string, user: User }>(`${this.apiURL}/login`, credentials)
    .subscribe(res => {
      this.setToken(res.token);
      this.user = res.user;
      this.authChange.next(true);
      this.router.navigate(['']);
    }, err => {
      this.errorEmitter.next(err.error.message || 'Login failed');
    });
}


  handleGoogleLogin(token: string) {
    try {
      localStorage.setItem('token', token);
      this.router.navigate(['']);
      this.authChange.next(true);
    } catch (err) {
      console.error('Google login failed', err);
      this.errorEmitter.next('Google login failed');
    }
  }
  
  getMe() {
    return this.http.get<User>(`${this.apiURL}/me`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }


  logout() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }
  

  isPasswordValid() {
    return this.passwordValidSubject.asObservable();
  }

  getUserById() {
    return this.dataService.getUserById(this.user?._id!!);
  }

  doesUserExist(username: string) {
    return this.users.find((user) => user.username == username);
  }

  async addUser(newuser: User) {
      this.dataService.getUsers()
      .subscribe(async (res:any) => {
        this.users = res;
        this.usersSubject.next([...this.users]);
        if (!this.doesUserExist(newuser.username)) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(newuser.password, salt);
          const newUser = new User(newuser.username, hash, newuser.name, newuser.email, 0, 0);
          this.dataService.addUser(newUser)
          .subscribe(((res: any) => {
            newUser.userId = res.name;
            newUser._id = res._id;
            this.users.push(newUser);
            this.usersSubject.next([...this.users]);
            const userCredentials = {
              username: newuser.username,
              password: newuser.password
            };
            this.login(userCredentials);
          }))
        }
      })
  }

}
