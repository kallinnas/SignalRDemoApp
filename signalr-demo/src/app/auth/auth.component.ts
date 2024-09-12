import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(private signalrService: SignalrService) { }

  ngOnInit(): void {
    this.signalrService.startConnection();
  }

  ngOnDestroy(): void {
    this.signalrService.offConnection('authMeResponseSuccess');
    this.signalrService.offConnection('authMeResponseFail');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.signalrService.authMe(form.value.username, form.value.password);
    form.reset();
  }

}
