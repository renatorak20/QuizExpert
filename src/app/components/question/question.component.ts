import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Question } from '../../models/Question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class QuestionComponent {

  @Input('question') question!: Question;
  selectedAnswer: number | null = null;
  isWrongAnswerSelected: boolean = false;

  checkAnswer(selectedIndex: number): void {
    if (this.selectedAnswer == null) {
      this.selectedAnswer = selectedIndex;
    }
  }

  isSelectedCorrect(index: number): boolean {
    return this.selectedAnswer === this.question.correct_answer_index && this.selectedAnswer === index;
  }

  isSelectedIncorrect(index: number): boolean {
    const isWrong = this.selectedAnswer !== this.question.correct_answer_index && this.selectedAnswer === index;
    if (isWrong) {
      this.isWrongAnswerSelected = true;
    }
    return isWrong;
  }

}
