import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { UserSignalrDto, UserAuthDto } from '../../models/user.model';
import { AppService } from '../app.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private methodName: string = 'Authentification';
  successCommand: string = 'Auth_Success';
  failCommand: string = 'Auth_Fail';

  constructor(
    private appService: AppService,
    private signalrService: SignalrService,
  ) { }

  launchAuthentification(user: UserAuthDto) {
    this.authentificationListenSuccess();
    this.authentificationListenFail();
    this.authentificationAsync(user);
  }

  private async authentificationAsync(user: UserAuthDto) {
    console.log('#3 authentificationAsync: First authorization');

    await this.signalrService.hubConnection.invoke(this.methodName, user)
      .then(() => {
        console.log('#6 authentificationAsync: After Listener');
      })
      .catch(err => console.log(err));
  }

  private authentificationListenSuccess() {
    try {
      console.log('#2 authentificationListenSuccess')

      this.signalrService.hubConnection.on(this.successCommand, (user: UserSignalrDto) => {
        console.log('#4 authentificationListenSuccess');

        this.appService.userData = { ...user };
        localStorage.setItem('token', user.token);
        this.appService.isAuthenticated.set(true);

        this.appService.showSnackbar('Login succsessfully!');

        if (this.appService.isAdminUser()) {
          this.appService.router.navigate(["user-connection-state"]);
        } else this.appService.router.navigate(["account"]);

        this.signalrService.offConnection([this.successCommand, this.failCommand]);
      });
    }

    catch (err) { console.log(err); }
  }

  private authentificationListenFail() {
    console.log('#2 authentificationListenFail');

    this.signalrService.hubConnection.on(this.failCommand, () => {
      console.log('#4 wrong credentials');

      // TODO: reset auth password form field
      this.appService.showSnackbar("Wrong credentials!")
    });
  }

}
