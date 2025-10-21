import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { Categories, Category } from '../models/Categories';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = "http://localhost:5000/api";
  private factsApiUrl = "https://api.api-ninjas.com/v1/facts";

  constructor(private http: HttpClient) {}

  getRandomFact() {
    const headers = new HttpHeaders({'X-Api-Key':'Qlq3CKdC6SOTaAnOtJoiug==TvowNiGPb4lxD1nC'});
    return this.http.get(this.factsApiUrl, { headers });
  }

  getQuestions() {
    return this.http.get(`${this.apiUrl}/questions`)
      .pipe(
        map((res: any) => {
          const questions = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              questions.push({ ...res[key], _id: key } as Question);
            }
          }
          return questions;
        })
      );
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`)
    .pipe(map(res => {
        const users=[];
        for (let key in res){
          users.push({...res[key as keyof typeof res], userId: key} as User);
        }
        return users;
    }));
  };

  addUser(newUser: User) {
    return this.http.post(`${this.apiUrl}/users`, newUser);
  }

  getUserById(userId: string) {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  editUser(user: User) {
    return this.http.patch(`${this.apiUrl}/users/${user.userId}`, user);
  }

  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`)
    .pipe(map((res: any) => {
      const categories=[];
      for (let key in res){
        if (res.hasOwnProperty(key)) {
              categories.push(res[key] as Category);
            }
      }
      return categories;
  }));
  }

  createCategory(category: Category) {
    return this.http.post(`${this.apiUrl}/categories`, category);
  }

  editCategory(category: Category) {
    return this.http.patch(`${this.apiUrl}/categories/${category._id}`, category);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

}
