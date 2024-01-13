import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../services/Questions.service';
import { Question } from '../../models/Question';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Categories } from '../../models/Categories';
import { DataService } from '../../services/Data.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrl: './edit-question.component.css'
})
export class EditQuestionComponent implements OnInit {

  constructor(private fb: FormBuilder, private dataService: DataService, private questionService: QuestionsService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {

  }

  categories: Categories | undefined;
  editQuestionGroup!: FormGroup<any>;
  selectedCategory: any;
  selectedAnswer: any;
  questionId: string = "";

  loadedQuestion: Question = new Question("", 1, 0, []);

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }

    this.dataService.getCategories()
    .subscribe((res: any) => {
      const firstKey = Object.keys(res)[0];
      this.categories = new Categories(res[firstKey].categories);
    }, error => {
      console.error('Error fetching categories:', error);
    });

    this.questionId = this.route.snapshot.paramMap.get('id')!!;
    this.questionService.getQuestionById(this.questionId)
    .subscribe((res: any) => {
      this.loadedQuestion = res;
      console.log(res);
    })

    
    this.editQuestionGroup = this.fb.group({
      'title': new FormControl("", [Validators.required, Validators.minLength(4)]),
      'answer1': new FormControl("", Validators.required),
      'answer2': new FormControl("", Validators.required),
      'answer3': new FormControl("", Validators.required),
      'answer4': new FormControl("", Validators.required)
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
    let categoryType = this.categories?.categories.findIndex((category: any) => {
      return category == this.selectedCategory;
    });
    console.log(this.editQuestionGroup.value)
    if (this.editQuestionGroup.valid) {
      const formValues = this.editQuestionGroup.value;

      let answers = [formValues.answer1, formValues.answer2, formValues.answer3, formValues.answer4];

      let category = this.categories?.categories.findIndex(category => {
        return category == this.selectedCategory
      });
      if (category == -1) {
        category = this.loadedQuestion.category;
      } else {
        category!!++;
      }
      let editedQuestion = new Question(formValues.title, (category!!), this.selectedAnswer, answers, this.questionId)
      this.questionService.editQuestion(editedQuestion).subscribe(response => {
        this.router.navigate(['profile'])
      }, error => {
        console.error('Error deleting question:', error);
      });
    }
  }

}
