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

  login(credentials : {username : string, password: string}){
    this.dataService.getUsers()
    .subscribe((res:any) => {
      this.users = res;
      this.usersSubject.next([...this.users]);
      new Observable(observer => {
        setTimeout(async ()=> {
          let u = this.users.find(u => u.username==credentials.username);
          if(u) {
            const passwordValid = await bcrypt.compare(credentials.password, u?.password!!);
            if(passwordValid) {
              observer.next(u);
              this.passwordValidSubject.next(true);
            } else {
              this.passwordValidSubject.next(false);
            }
          }
        },1);
      }).subscribe((user : any) => {
        if (user) {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.authChange.next(true);
          this.router.navigate(['']);
        }
      });
    })
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
