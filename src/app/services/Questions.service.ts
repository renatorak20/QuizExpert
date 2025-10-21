import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Question } from '../models/Question';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {

    return this.http.get(`${this.apiUrl}/questions`)
      .pipe(
        map((res: any) => {
          const questions = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              questions.push(res[key] as Question);
            }
          }
          return questions;
        })
      );
  }

  getQuestionById(id: string) {
    return this.http.get(`${this.apiUrl}/questions/${id}`)
  }

  addQuesion(newQuestion: Question) {
    return this.http.post(`${this.apiUrl}/questions`, newQuestion)
  }

  deleteQuestion(questionId: string) {
    return this.http.delete(`${this.apiUrl}/questions/${questionId}`)
  }

  editQuestion(questionToEdit: Question) {
    const { _id: id, ..._questionToEdit } = questionToEdit
    return this.http.patch(`${this.apiUrl}/questions/${questionToEdit._id}`, _questionToEdit)
  }

}
