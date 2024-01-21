import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/Data.service';
import { Categories } from '../../models/Categories';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionsService } from '../../services/Questions.service';
import { Question } from '../../models/Question';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { responsiveFontSizes } from '@material-ui/core';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private fb: FormBuilder, private dataService: DataService, private questionsService: QuestionsService, private router: Router) {}

  categories: Categories | undefined;
  createQuestionGroup!: FormGroup<any>;
  selected: any;

  ngOnInit(): void {
    this.dataService.getCategories()
      .subscribe((res: any) => {
        const firstKey = Object.keys(res)[0];
        this.categories = new Categories(res[firstKey].categories, res[firstKey].id);
      }, error => {
        console.error('Error fetching categories:', error);
      });


      this.createQuestionGroup = this.fb.group({
        'title': new FormControl("", [Validators.required, Validators.minLength(4)]),
        'answer1': new FormControl("", Validators.required),
        'answer2': new FormControl("", Validators.required),
        'answer3': new FormControl("", Validators.required),
        'answer4': new FormControl("", Validators.required),
        'correctAnswer': new FormControl("", Validators.required)
      }, {
        validators: [
          this.answersFilled('answer1', 'answer2', 'answer3', 'answer4'),
          this.checkAnswer('correctAnswer')
        ]
      });
  }

  checkAnswer(answer: string) {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const answerV = formGroup.get(answer)!!;

      if (!answerV) {
        return null;
      }

      if (answerV.value.length == "") {
        answerV.setErrors({ notSelected: true });
        return { notSelected: true };
      } else {
        answerV.setErrors(null);
        return null;
      }
    };
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

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selected = selectedValue;
  }


  onSubmit(event: Event) {
    event.preventDefault();
    let categoryType = this.categories?.categories.findIndex((category: any) => {
      return category == this.selected;
    });
    if (this.createQuestionGroup.valid) {
      const formValues = this.createQuestionGroup.value;

      let correctAnswer = formValues.correctAnswer;
      let answers = [formValues.answer1, formValues.answer2, formValues.answer3, formValues.answer4];
      let newQuestion = new Question(formValues.title, (categoryType!! + 1), correctAnswer, answers)
      this.questionsService.addQuesion(newQuestion).subscribe(response => {
        this.openSnackBar("Question created", "")
        setTimeout(() => {
          this.router.navigate(['profile'])
        },
          4000
        )
      }, error => {
        console.error('Error deleting question:', error);
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 3000,
    });
  }

}
