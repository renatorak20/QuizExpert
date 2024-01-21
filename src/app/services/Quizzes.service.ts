import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  private apiUrl = 'https://quizexpert-e2f59-default-rtdb.europe-west1.firebasedatabase.app/quizzes.json';
  private apiUrlShort = 'https://quizexpert-e2f59-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient) {}

  getQuizzes() {
    return this.http.get(`${this.apiUrl}`)
      .pipe(
        map((res: any) => {
          const questions = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              questions.push({ ...res[key], id: key } as Quiz);
            }
          }
          return questions;
        })
      );
  }

  getQuizById(id: string) {
    return this.http.get(`${this.apiUrlShort}/quizzes/${id}.json`)
  }

  addQuiz(newQuiz: Quiz) {
    return this.http.post(`${this.apiUrl}`, newQuiz)
  }

  deleteQuiz(quizId: string) {
    return this.http.delete(`${this.apiUrlShort}/quizzes/${quizId}.json`)
  }

  editQuiz(quizToEdit: Quiz) {
    const { id, ..._quizToEdit } = quizToEdit
    return this.http.patch(`https://quizexpert-e2f59-default-rtdb.europe-west1.firebasedatabase.app/quizzes/${quizToEdit.id}.json`, _quizToEdit)
  }

}
