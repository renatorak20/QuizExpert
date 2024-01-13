import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [FormsModule]
})
export class RegisterComponent implements OnInit {
  registerGroup!: FormGroup<any>;

  constructor(private fb: FormBuilder,private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
    this.registerGroup = this.fb.group({
      'username': new FormControl("", [Validators.required, Validators.minLength(4)]),
      'password': new FormControl("", Validators.required),
      'passwordRepeat': new FormControl("", Validators.required),
      'name': new FormControl("", Validators.required),
      'email': new FormControl("", [Validators.required, Validators.email])
    }, {
      validators: this.passwordMatch('password', 'passwordRepeat')
    });
  }

  passwordMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }


  public getPasswordError() {
    const control: AbstractControl = this.registerGroup.get('passwordRepeat')!!;
    return control.hasError('passwordMismatch')
      ? 'The passwords do not match'
      : '';
  }
  
  onSubmit(event: Event) {
    event.preventDefault();
    if (this.registerGroup.valid) {
      const formValues = this.registerGroup.value;
      this.authService.addUser(new User(formValues.username, formValues.password, formValues.name, formValues.email));
    }
  }
  
}