import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth.service';
import { DataService } from '../../services/Data.service';
import { Fact } from '../../models/Facts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private dataService: DataService) {}

  facts: Fact[] = [];
  isLoadingFact = true;

  ngOnInit() {
    this.dataService.getRandomFact()
    .subscribe((res: any) => {
      this.facts = res;
      this.isLoadingFact = false;
    })
  }


  startQuiz() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['play'])
    } else {
      this.router.navigate(['/login'])
    }
  }

}
