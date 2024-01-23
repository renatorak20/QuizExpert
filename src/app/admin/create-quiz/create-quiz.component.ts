import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/Question';
import { QuestionsService } from '../../services/Questions.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuizzesService } from '../../services/Quizzes.service';
import { Quiz } from '../../models/Quiz';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private questionService: QuestionsService, private fb: FormBuilder, private quizService: QuizzesService, private router: Router) {}

  ngOnInit() {
    this.loadQuestions();

    this.createQuizGroup = this.fb.group({
      'title': new FormControl("", [Validators.required, Validators.minLength(4)]),
      'filter': new FormControl("")
    });
  }

  createQuizGroup!: FormGroup<any>;

  questionsIds: string[] = [];

  loadedQuestions: Question[] = [];
  filteredQuestions: Question[] = [];

  title: string = "";
  selectedQuestions: string[] = [];
  searchText: string = "";

  loadQuestions() {
    this.questionService.getQuestions()
    .subscribe((res:any) => {
      this.loadedQuestions = res;
    })
  }

  questionSelection(event: any, questionId: string): void {
    if (event.target.checked) {
      this.selectedQuestions.push(questionId);
    } else {
      this.selectedQuestions = this.selectedQuestions.filter(id => id !== questionId);
    }
  }

  onFilterChange() {
    if (this.searchText.length > 0) {
      this.filteredQuestions = this.loadedQuestions.filter(question => {
        const filterTextLower = this.searchText.toLowerCase();
        const titleMatch = question.title.toLowerCase().includes(filterTextLower);
        return titleMatch;
      });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.createQuizGroup.valid && this.selectedQuestions.length > 0 && this.selectedQuestions.length < 7) {
      this.quizService.addQuiz(new Quiz(this.title, this.selectedQuestions))
      .subscribe((res: any) => {      
        this.openSnackBar("Quiz created", "")
        setTimeout(() => {
          this.router.navigate([''])  
        },
          4000
        )
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 3000,
    });
  }

}
