import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import * as bcrypt from 'bcryptjs';
import { DataService } from '../services/Data.service';
import { User } from '../models/User';

@Injectable()
export class AuthService implements OnInit {

  user : User | null = null;
  errorEmitter : Subject<string> = new Subject<string>();
  authChange : Subject<boolean> = new Subject<boolean>();

  users: User[] = [];
  usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private passwordValidSubject = new BehaviorSubject<boolean>(false);
  constructor(private router : Router, private dataService: DataService) { }

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

  async login(credentials: { username: string, password: string }) {
    if (!this.users || this.users.length === 0) {
      await this.fetchUsers();
    }
  
    const user = this.users.find(u => u.username === credentials.username);
    if (user) {
      const passwordValid = await bcrypt.compare(credentials.password, user.password);
      this.passwordValidSubject.next(passwordValid);
  
      if (passwordValid) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.authChange.next(true);
        this.router.navigate(['']);
      }
    }
  }
  
  private async fetchUsers() {
    const res = await this.dataService.getUsers().toPromise();
    this.users = res!!;
    this.usersSubject.next([...this.users]);
  }
  

  isPasswordValid() {
    return this.passwordValidSubject.asObservable();
  }

  logout(){
    this.user=null;
    localStorage.removeItem('user');
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser(){
    let u = localStorage.getItem('user');
    if (u) {
      this.user=JSON.parse(u);
      return {...this.user} as User;
    }
    return null;
  }

  getUserById() {
    return this.dataService.getUserById(this.user?.userId!!);
  }

  isAuthenticated(){
    const user = this.getUser();
    console.log(user);
    return user != null;
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
          const newUser = new User(newuser.username, hash, newuser.name, newuser.email);
          this.dataService.addUser(newUser)
          .subscribe((res => {
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
