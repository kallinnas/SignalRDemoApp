import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { GeneralModule } from '../modules/general.model';
import { UserAuthDto, UserRegistrDto } from '../models/user.model';

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
    private signalrService: SignalrService,
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
      this.authService.registrationAsync(new UserRegistrDto(this.authForm.value.email, this.authForm.value.password, this.authForm.value.name));
    }

    else {
      this.authService.authentificationAsync(new UserAuthDto(this.authForm.value.email, this.authForm.value.password));
    }
  }

}
