import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getQuizzes() {
    return this.http.get(`${this.apiUrl}/quizzes`)
      .pipe(
        map((res: any) => {
          const quizzes = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              quizzes.push(res[key] as Quiz);
            }
          }
          return quizzes;
        })
      );
  }

  getQuizById(id: string) {
    return this.http.get(`${this.apiUrl}/quizzes/${id}`)
  }

  addQuiz(newQuiz: Quiz) {
    return this.http.post(`${this.apiUrl}/quizzes`, newQuiz)
  }

  deleteQuiz(quizId: string) {
    return this.http.delete(`${this.apiUrl}/quizzes/${quizId}`)
  }

  editQuiz(quizToEdit: Quiz) {
    const { _id: id, ..._quizToEdit } = quizToEdit
    return this.http.patch(`${this.apiUrl}/quizzes/${quizToEdit._id}`, _quizToEdit)
  }

}
