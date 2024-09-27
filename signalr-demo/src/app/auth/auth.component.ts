import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralModule } from '../modules/general.model';
import { UserAuthDto, UserRegistrDto } from '../models/user.model';
import { AuthService } from '../services/signalr/auth.service';
import { RegisterService } from '../services/signalr/register.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {

  errorMessage = '';
  isRegisterMode: boolean = false;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private registerService: RegisterService,
  ) { }

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['']
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    if (this.isRegisterMode) {
      this.registerService.launchRegistration(new UserRegistrDto(this.authForm.value.email, this.authForm.value.password, this.authForm.value.name));
    }

    else {
      this.authService.launchAuthentification(new UserAuthDto(this.authForm.value.email, this.authForm.value.password));
    }
  }

}
