import { Component, OnInit } from '@angular/core';
import { QuestionsService } from './services/Questions.service';
import { Question } from './models/Question';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'QuizExpert';

}
