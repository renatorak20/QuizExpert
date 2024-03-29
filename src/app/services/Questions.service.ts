import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Question } from '../models/Question';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private apiUrl = 'https://quizexpert-e2f59-default-rtdb.europe-west1.firebasedatabase.app/questions.json';
  private apiUrlShort = 'https://quizexpert-e2f59-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {

    return this.http.get(`${this.apiUrl}`)
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

  getQuestionById(id: string) {
    return this.http.get(`${this.apiUrlShort}/questions/${id}.json`)
  }

  addQuesion(newQuestion: Question) {
    return this.http.post(`${this.apiUrl}`, newQuestion)
  }

  deleteQuestion(questionId: string) {
    return this.http.delete(`${this.apiUrlShort}/questions/${questionId}.json`)
  }

  editQuestion(questionToEdit: Question) {
    const { id, ..._questionToEdit } = questionToEdit
    return this.http.patch(`https://quizexpert-e2f59-default-rtdb.europe-west1.firebasedatabase.app/questions/${questionToEdit.id}.json`, _questionToEdit)
  }

}
