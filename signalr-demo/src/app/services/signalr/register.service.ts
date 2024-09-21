import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { UserRegistrDto, UserSignalrDto } from '../../models/user.model';
import { AppService } from '../app.service';
import { LogoutService } from './logout.service';

@Injectable({ providedIn: 'root' })
export class RegisterService {

  private methodName: string = 'Registration';
  successCommand: string = 'Register_Success';
  failCommand: string = 'Register_Fail';

  constructor(
    private appService: AppService,
    private logoutService: LogoutService,
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
        this.logoutService.logoutListenResponse();
      })
      .catch(err => console.log(err));
  }

  private registrationListenSuccess() {
    console.log('#2 registrationListenSuccess');

    this.signalrService.hubConnection.on(this.successCommand, (user: UserSignalrDto) => {
      console.log(`#4 registrationListenSuccess`);

      this.appService.userData = { ...user };
      localStorage.setItem('token', user.token);
      this.appService.isAuthenticated = true;

      this.appService.toastr.success('Registrated successfully!');
      this.appService.router.navigate(["/home"]);
    });
  }

  private registrationListenFail() {
    console.log('#2 registrationListenFail');

    this.signalrService.hubConnection.on(this.failCommand, () => {
      console.log('#4 registrationListenFail');
      this.appService.toastr.info('Such email already taken. Please choose another one.');
    });
  }
}
