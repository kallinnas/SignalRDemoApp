import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { GeneralModule } from '../modules/general.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(
    private signalrService: SignalrService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('#3 AuthComp_ngOnInit After Wait connection to start');
    this.authService.authMeListenerSuccess();
    this.authService.authMeListenerFail();
  }

  ngOnDestroy(): void {
    this.signalrService.offConnection('authorizationSuccess');
    this.signalrService.offConnection('authorizationFail');
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.authMe(form.value.username, form.value.password);
      form.reset();
    } else return;
  }

}
