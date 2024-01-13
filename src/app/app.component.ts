import { Component, OnInit } from '@angular/core';
import { QuestionsService } from './services/Questions.service';
import { Question } from './models/Question';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'QuizExpert';

  questions!: Question[];
  questionsSubject: BehaviorSubject<Question[]> | null = null;
  subscription: Subscription | null = null;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.questionsService.getQuestions()
    .subscribe((res:any) => {
      this.questions = res;
    });
  }

}
