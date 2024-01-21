import { Component } from '@angular/core';
import { Question } from '../../models/Question';
import { QuestionsService } from '../../services/Questions.service';
import { QuizzesService } from '../../services/Quizzes.service';
import { Quiz } from '../../models/Quiz';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DataService } from '../../services/Data.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/Auth.service';
import { Categories } from '../../models/Categories';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {

  quiz: Quiz | undefined;

  selectedAnswer: number | null = null;
  isWrongAnswerSelected: boolean = false;
  questionIds: string[] = [];
  questions!: Question[];

  currentQuestion!: Question;
  currentQuestionIndex: number = 0;
  showNextBtn: boolean = false;

  score: number = 0;
  quizOver: boolean = false;

  categories!: Categories;

  constructor(private authService: AuthService, private dataService: DataService, private quizzesService: QuizzesService, private questionService: QuestionsService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.quizzesService.getQuizById(this.activatedRoute.snapshot.paramMap.get('id')!!)
    .subscribe((res: any) => {
      this.quiz = res;
      this.questionIds = this.quiz?.questions!!;
    
      const questionObservables = this.questionIds.map(questionId =>
        this.questionService.getQuestionById(questionId)
      );
    
      forkJoin(questionObservables).subscribe((responses: any) => {
        this.questions = responses;
        if (this.questions.length == 0 || (this.questions[0] == null && this.questions.length == 1)) {
          this.router.navigate(['']);
        }
        this.currentQuestion = this.questions[0];
        if (this.currentQuestion == null) {
          this.nextQuestion();
        }
      });
    });

    this.dataService.getCategories()
    .subscribe((res: any) => {
      const firstKey = Object.keys(res)[0];
      this.categories = new Categories(res[firstKey].categories, res[firstKey].id);
    })
  }

  checkAnswer(selectedIndex: number): void {
    if (this.selectedAnswer == null) {
      this.selectedAnswer = selectedIndex;
      const isCorrect = this.selectedAnswer === this.currentQuestion.correct_answer_index;
      if (isCorrect) {
        this.score += 10;
      }
      this.showNextBtn = true;
    }
  }

  isSelectedCorrect(index: number): boolean {
    const isCorrect = this.selectedAnswer === this.currentQuestion?.correct_answer_index && this.selectedAnswer === index;
    return isCorrect;
  }

  isSelectedIncorrect(index: number): boolean {
    const isWrong = this.selectedAnswer !== this.currentQuestion?.correct_answer_index && this.selectedAnswer === index;
    if (isWrong) {
      this.isWrongAnswerSelected = true;
    }
    return isWrong;
  }

  showNextButton(): boolean {
    return this.showNextBtn;
  }

  nextQuestion(): void {
    this.showNextBtn = false;
    this.currentQuestionIndex++;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.selectedAnswer = null;
    this.isWrongAnswerSelected = false;

    if (this.currentQuestionIndex == this.questions.length) {

      let loggedUser = this.authService.getUser();
      let newUser = new User(loggedUser?.username!!, loggedUser?.password!!, loggedUser?.name!!, loggedUser?.email!!, ((loggedUser?.quizesPlayed || 0) + 1), ((loggedUser?.points || 0) + this.score), loggedUser?.userId, loggedUser?.isAdmin || false)
      this.dataService.editUser(newUser)
      .subscribe((res: any) => {
        this.quizOver = true;
        localStorage.setItem('user', JSON.stringify(newUser));
        setTimeout(() => {
          this.router.navigate([''])
        },
          7000
        )
      })
    }
  }

}
