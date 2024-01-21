import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { AdminRoutingModule } from './admin-routing.module';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { FilterPipe } from '../utils/filter.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CreateQuizComponent, CreateQuestionComponent, EditQuestionComponent],
  imports: [
      CommonModule,
      ReactiveFormsModule,
      AdminRoutingModule,
      FormsModule,
      SharedModule
  ]
})
export class AdminModule { }
