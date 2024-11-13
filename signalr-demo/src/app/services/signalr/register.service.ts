import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { UserRegistrDto, UserSignalrDto } from '../../models/user.model';
import { AppService } from '../app.service';

@Injectable({ providedIn: 'root' })
export class RegisterService {

  private methodName: string = 'Registration';
  successCommand: string = 'Register_Success';
  failCommand: string = 'Register_Fail';

  constructor(
    private appService: AppService,
    private signalrService: SignalrService
  ) { }

  launchRegistration(user: UserRegistrDto) {
    this.registrationListenSuccess();
    this.registrationListenFail();
    this.registrationAsync(user);
  }

  private async registrationAsync(user: UserRegistrDto) {
    console.log('#3 registration: invoke');

    await this.signalrService.hubConnection.invoke(this.methodName, user)
      .then(() => {
        console.log('#6 registration After Listener');
      })
      .catch(err => console.log(err));
  }

  private registrationListenSuccess() {
    console.log('#2 registrationListenSuccess');

    this.signalrService.hubConnection.on(this.successCommand, (user: UserSignalrDto) => {
      console.log(`#4 registrationListenSuccess`);

      this.appService.userData = { ...user };
      localStorage.setItem('token', user.token);
      this.appService.isAuthenticated.set(true);

      this.appService.showSnackbar('Registrated successfully!');
      this.appService.router.navigate(["account"]);

      this.signalrService.offConnection([this.successCommand, this.failCommand]);
    });
  }

  private registrationListenFail() {
    console.log('#2 registrationListenFail');

    this.signalrService.hubConnection.on(this.failCommand, () => {
      console.log('#4 registrationListenFail');

      // TODO: reset auth email form field
      this.appService.showSnackbar('Such email already taken. Please choose another one.');
    });
  }
}
