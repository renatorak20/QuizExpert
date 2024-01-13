import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/Data.service';
import { Categories } from '../../models/Categories';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      });
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
    console.log(categoryType);
    if (this.createQuestionGroup.valid) {
      const formValues = this.createQuestionGroup.value;

      let correctAnswer = formValues.correctAnswer;
      let answers = [formValues.answer1, formValues.answer2, formValues.answer3, formValues.answer4];
      console.log(correctAnswer);
      console.log(answers);
      let newQuestion = new Question(formValues.title, (categoryType!! + 1), correctAnswer, answers)
      this.questionsService.addQuesion(newQuestion).subscribe(response => {
        console.log("res");
        console.log(response);
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
