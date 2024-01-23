import { NgModule } from '@angular/core';
import {Route, RouterModule} from "@angular/router";
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';

const routes : Route[] = [
  {path:'create-quiz',component: CreateQuizComponent},
  {path: 'create-question', component: CreateQuestionComponent},
  {path: 'edit-question/:id', component: EditQuestionComponent},
  {path: 'edit-quiz/:id', component: EditQuizComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
