import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizzesService } from '../../services/Quizzes.service';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent implements OnInit {

  constructor(private router: Router, private quizzesService: QuizzesService, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.quizzesService.getQuizzes()
      .subscribe((res: any) => {
        if (res.length == 0) {
          this.router.navigate(['']);
        }
        let index = Math.floor(Math.random() * res.length)
        let quiz = res[index];
        this.router.navigate([`play/${quiz.id}`])
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

}
