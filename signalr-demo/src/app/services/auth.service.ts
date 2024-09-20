import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrService } from './signalr.service';
import { HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UserAuthDto, UserRegistrDto, UserSignalrDto } from '../models/user.model';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthenticated: boolean = false;
  userData!: UserSignalrDto;

  private isAuthenticatedState = new BehaviorSubject<boolean>(false);
  isAuthenticatedState$ = this.isAuthenticatedState.asObservable();

  constructor(
    private signalrService: SignalrService,
    public toastr: ToastrService,
    public router: Router
  ) { }

  checkAuthentication(): void {
    if (typeof window !== 'undefined') {
      this.launchHub();
    }
  }

  launchHub() {
    try {
      this.signalrService.startConnection().then(() => {

        const token = localStorage.getItem('token');

        if (this.signalrService.hasConnection()) {
          if (token) {
            console.log('#0 Has token');
            this.validateTokenListenSuccess();
            this.validateTokenListenFail();
            this.validationTokenAsync();
          }

          else {
            this.isAuthenticatedState.next(false);
            this.authentificationListenSuccess();
            this.authentificationListenFail();
            this.registrationListenSuccess();
            this.registrationListenFail();
          }

          this.logoutResponse();
          this.signalrService.offConnection([
            'Authentification_ResponseSuccess',
            'Authentification_Fail',
            'Registration_ResponseSuccess',
            'Registration_Fail',
            'ValidationToken_ResponseSuccess',
            'ValidationToken_Fail',
            "ngOnDestroy in app"
          ]);
        } else {
          console.error('SignalR connection is not connected.');
        }
      }).catch((err: any) => {
        console.error('Error starting SignalR connection:', err);
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  async authentificationAsync(user: UserAuthDto) {
    console.log('#3 authentificationAsync: First authorization');

    await this.signalrService.hubConnection.invoke('Authentification', user)
      .then(() => console.log('#4 authentificationAsync: After Listener'))
      .catch(err => console.log(err));
  }

  authentificationListenSuccess() {
    try {
      console.log('#1 authentificationListenSuccess')

      this.signalrService.hubConnection.on('Authentification_Success', (user: UserSignalrDto) => {
        const step = localStorage.getItem('token') ? 8 : 4;
        console.log(`#${step} authentificationListenSuccess => setLocalStorage`);

        this.userData = { ...user };
        localStorage.setItem('token', user.token);

        this.isAuthenticated = true;
        this.toastr.success('Login succsessfully!');
        this.router.navigate(["/home"]);
      });
    }

    catch (err) { console.log(err); }
  }

  authentificationListenFail() {
    console.log('#2 authentificationListenFail');
    this.signalrService.hubConnection.on("Authentification_Fail", () => this.toastr.error("Wrong credentials!"));
  }

  async registrationAsync(user: UserRegistrDto) {
    console.log('#3 registration: invoke');

    await this.signalrService.hubConnection.invoke('Registration', user)
      .then(() => console.log('#4 registration After Listener'))
      .catch(err => console.log(err));
  }

  registrationListenSuccess() {
    console.log('#1 registrationListener');

    if (this.signalrService.hubConnection && this.signalrService.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.signalrService.hubConnection.on('Registration_ResponseSuccess', (user: UserSignalrDto) => {

        const step = localStorage.getItem('token') ? 8 : 4;
        console.log(`#${step} registrationListener => setLocalStorage`);

        this.userData = { ...user };
        localStorage.setItem('token', user.token);

        this.isAuthenticated = true;
        this.toastr.success('Registrated successfully!');
        this.router.navigate(["/home"]);
      });
    } else {
      console.error('Hub connection is not in a connected state.');
    }
  }

  registrationListenFail() {
    console.log('#2 registrationListenerFail');
    this.signalrService.hubConnection.on("Registration_Fail", () => alert("Such email already taken."));
  }

  async validationTokenAsync() {
    try {
      console.log('#3 validationToken');

      await this.signalrService.hubConnection.invoke('ValidationToken', localStorage.getItem('token'))
        .then(() => console.log('#5 validationToken: then()'))
        .catch(err => console.log(err));
    }

    catch (err) { console.log(err); }
  }

  validateTokenListenSuccess() {
    try {
      console.log('#1 validateTokenListenSuccess');

      this.signalrService.hubConnection.on('ValidationToken_Success', (user: UserSignalrDto) => {
        console.log('#4 validateTokenListenSuccess => response');

        this.userData = { ...user };
        this.isAuthenticated = true;
        this.toastr.success('Re-authentificated!');

        if (this.router.url == "/auth")
          this.router.navigate(["/home"]);
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  validateTokenListenFail() {
    console.log('#2 validateTokenListenFail');
    this.signalrService.hubConnection.on("ValidationToken_Fail", () => {
      this.toastr.info('Previous session is expired. Access again with your email and password please.');
      localStorage.removeItem('token');
      alert("The current token is expired.")
    });
  }

  logout(): void {
    this.signalrService.hubConnection.invoke("LogoutUser", this.userData.id)
      .then(() => {

      })
      .catch(err => console.error(err));
  }

  logoutResponse(): void {
    this.signalrService.hubConnection.on('Logout_Response', () => {
      localStorage.removeItem('token');
      this.checkAuthentication()
      location.reload();
      this.signalrService.hubConnection.stop();
    });
  }
}
