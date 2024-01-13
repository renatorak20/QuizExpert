import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizzesService } from '../../services/Quizzes.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent implements OnInit {

  constructor(private router: Router, private quizzesService: QuizzesService) {}

  ngOnInit(): void {
    this.quizzesService.getQuizzes()
    .subscribe((res: any) => {
      let index = Math.floor(Math.random() * res.length)
      console.log(index);
      let quiz = res[index];
      console.log("Play");
      console.log(quiz);
      this.router.navigate([`play/${quiz.id}`])
    })
  }

}
