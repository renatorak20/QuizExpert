import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionsService } from '../../services/Questions.service';
import { Question } from '../../models/Question';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizzesService } from '../../services/Quizzes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/Quiz';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrl: './edit-quiz.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditQuizComponent implements OnInit {

  constructor(private route: ActivatedRoute, private quizzesService: QuizzesService, private snackbar: MatSnackBar, private questionService: QuestionsService, private fb: FormBuilder, private quizService: QuizzesService, private router: Router) {}

  editQuizGroup!: FormGroup<any>;
  loadedQuestions: Question[] = [];
  filteredQuestions: Question[] = [];

  title: string = "";
  selectedQuestions: string[] = [];
  searchText: string = "";

  questionsIds: string[] = [];

  quiz!: Quiz;
  quizId: string = "";

  ngOnInit() {
    this.loadQuestions();

    this.quizId = this.route.snapshot.paramMap.get('id')!!;

    this.quizzesService.getQuizById(this.quizId)
    .subscribe((res: any) => {
      this.quiz = res;
      this.selectedQuestions = this.quiz.questions;

      setTimeout(() => {
        this.editQuizGroup.patchValue({
          title: this.quiz.title
        });
      });

    })

    this.editQuizGroup = this.fb.group({
      'title': new FormControl("", [Validators.required, Validators.minLength(4)]),
      'filter': new FormControl("")
    });
  }

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
    if (this.editQuizGroup.valid && this.selectedQuestions.length > 0 && this.selectedQuestions.length < 7) {
      this.quizService.editQuiz(new Quiz(this.title, this.selectedQuestions, this.quizId))
      .subscribe((res: any) => {      
        this.openSnackBar("Quiz edited", "")
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
