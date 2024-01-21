import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { Question } from '../../models/Question';
import { QuestionsService } from '../../services/Questions.service';
import { DataService } from '../../services/Data.service';
import { QuizzesService } from '../../services/Quizzes.service';
import { Quiz } from '../../models/Quiz';
import { Categories } from '../../models/Categories';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private questionsService: QuestionsService, private dataService: DataService, private quizzesService: QuizzesService) {}

  user: User | null = null;
  isAdmin: boolean = false;

  questions: Question[] = [];
  filteredQuestions: Question[] = [];

  users: User[] = [];
  usersToDelete: string[] = [];

  quizzes: Quiz[] = [];
  categories!: Categories;

  newCategoryTitle: string = "";
  searchText: string = "";

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {

        this.authService.getUserById()
        .subscribe(((res: any) => {
          this.user = res;
        }));

        this.user = this.authService.getUser();

        if (this.authService.getUser()?.isAdmin) {
          this.isAdmin = this.user?.isAdmin || false;
          this.loadQuestions();
          this.quizzesService.getQuizzes()
          .subscribe((res: any) => {
            this.quizzes = res;
          })
        }

        this.dataService.getUsers()
        .subscribe((res: any) => {
          this.users = res;
        })

        this.dataService.getCategories()
        .subscribe((res: any) => {
          const firstKey = Object.keys(res)[0];
          this.categories = new Categories(res[firstKey].categories, res[firstKey].id);
        }, error => {
          console.error('Error fetching categories:', error);
        });
    } else {
      this.router.navigate(['']);
    }
  }

  loadQuestions() {
    this.questionsService.getQuestions()
    .subscribe((res: any) => {
      this.questions = res;
      this.filteredQuestions = res;
    })
  }

  filterQuestions() {
    if (this.searchText === '') {
      this.filteredQuestions = this.questions;
    }

    this.filteredQuestions = this.questions.filter(question => {
      return question.title.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  createQuestion() {
    this.router.navigate(['admin/create-question'])
  }

  deleteQuestion(index: number) {
    let id = this.filteredQuestions[index].id;
    this.questionsService.deleteQuestion(id!!).subscribe(response => {
      this.loadQuestions();
    }, error => {
      console.error('Error deleting question:', error);
    });
  }

  editQuestion(index: number) {
    let id = this.filteredQuestions[index].id;
    console.log(this.filteredQuestions);
    console.log(index);
    this.router.navigate([`admin/edit-question/${id}`])
  }

  deleteUser(userId: string) {
    this.dataService.deleteUser(userId)
    .subscribe((res: any) => {
      this.dataService.getUsers()
        .subscribe((res: any) => {
          this.users = res;
        })
    })
  }

  createCategory() {
    let newCategories = new Categories([...this.categories.categories, this.newCategoryTitle], this.categories.id)
    this.dataService.createCategory(newCategories)
    .subscribe((res: any) => {

    });
  }

  createQuiz() {
    this.router.navigate(['admin/create-quiz'])
  }

  deleteQuiz(id: string) {
    this.quizzesService.deleteQuiz(id)
    .subscribe((res: any) => {
      this.quizzesService.getQuizzes()
      .subscribe((res: any) => {
        this.quizzes = res;
      })
    });
  }

}
