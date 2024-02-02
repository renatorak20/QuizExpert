import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../services/Questions.service';
import { Question } from '../../models/Question';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Categories, Category } from '../../models/Categories';
import { DataService } from '../../services/Data.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrl: './edit-question.component.css'
})
export class EditQuestionComponent implements OnInit {

  constructor(private fb: FormBuilder, private dataService: DataService, private questionService: QuestionsService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {

  }

  categories: Category[] = [];
  editQuestionGroup!: FormGroup<any>;
  selectedCategory: string = "";
  selectedAnswer: any;
  questionId: string = "";

  loadedQuestion: Question = new Question("", "", 0, []);

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }

    this.dataService.getCategories()
    .subscribe((res: any) => {
      this.categories = res;
    });

    this.questionId = this.route.snapshot.paramMap.get('id')!!;
    this.questionService.getQuestionById(this.questionId)
    .subscribe((res: any) => {
      this.loadedQuestion = res;
      this.loadQuestionForEdit(res);
    })

    
    this.editQuestionGroup = this.fb.group({
      'title': new FormControl("", [Validators.required, Validators.minLength(4)]),
      'answer1': new FormControl("", Validators.required),
      'answer2': new FormControl("", Validators.required),
      'answer3': new FormControl("", Validators.required),
      'answer4': new FormControl("", Validators.required),
      'correctAnswer': new FormControl("", Validators.required)
    }, {
      validators: [
        this.answersFilled('answer1', 'answer2', 'answer3', 'answer4')
      ]
    });
  }

  answersFilled(a1: string, a2: string, a3: string, a4: string) {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const answer1 = formGroup.get(a1);
      const answer2 = formGroup.get(a2);
      const answer3 = formGroup.get(a3);
      const answer4 = formGroup.get(a4);

      if (!answer1 || !answer2 || !answer3 || !answer4) {
        return null;
      }

      if (answer1.value.length == 0 || answer2.value.length == 0 || answer3.value.length == 0 || answer4.value.length == 0) {
        answer1.setErrors({ requiredAnswers: true });
        return { requiredAnswers: true };
      } else {
        answer1.setErrors(null);
        return null;
      }
    };
  }

  loadQuestionForEdit(loadedQuestion: any) {
    setTimeout(() => {
      this.editQuestionGroup.patchValue({
        title: loadedQuestion.title,
        answer1: loadedQuestion.answers[0],
        answer2: loadedQuestion.answers[1],
        answer3: loadedQuestion.answers[2],
        answer4: loadedQuestion.answers[3]
      });
    });
  }


  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedCategory = selectedValue;
  }

  onAnswerChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedAnswer = selectedValue;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.editQuestionGroup.valid) {
      const formValues = this.editQuestionGroup.value;

      let answers = [formValues.answer1, formValues.answer2, formValues.answer3, formValues.answer4];
      const correctAnswer = parseInt(formValues.correctAnswer.charAt(formValues.correctAnswer.length - 1)) - 1;
      let editedQuestion = new Question(formValues.title, this.loadedQuestion.category, correctAnswer, answers, this.questionId)
      this.questionService.editQuestion(editedQuestion).subscribe(response => {
        this.router.navigate(['profile'])
      });
    }
  }

}
