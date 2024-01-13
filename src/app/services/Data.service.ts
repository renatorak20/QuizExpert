import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { Categories } from '../models/Categories';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = "https://quizexpert-e2f59-default-rtdb.europe-west1.firebasedatabase.app";

  constructor(private http: HttpClient) {}

  getQuestions() {
    return this.http.get(`${this.apiUrl}/questions.json`)
      .pipe(
        map((res: any) => {
          const questions = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              questions.push({ ...res[key], id: key } as Question);
            }
          }
          return questions;
        })
      );
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users.json`)
    .pipe(map(res => {
        const users=[];
        for (let key in res){
          users.push({...res[key as keyof typeof res], userId: key} as User);
        }
        return users;
    }));
  };

  addUser(newUser: User) {
    return this.http.post(`${this.apiUrl}/users.json`, newUser);
  }

  getUserById(userId: string) {
    return this.http.get(`${this.apiUrl}/users/${userId}.json`);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/users/${userId}.json`);
  }

  editUser(user: User) {
    console.log("Editing user");
    console.log(user);
    return this.http.patch(`${this.apiUrl}/users/${user.userId}.json`, user);
  }

  getCategories() {
    return this.http.get(`${this.apiUrl}/categories.json`);
  }

  createCategory(categories: Categories) {
    return this.http.patch(`${this.apiUrl}/categories/${categories.id}.json`, categories);
  }

}
