import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { UserSignalrDto } from '../../models/user.model';
import { AppService } from '../app.service';

@Injectable({ providedIn: 'root' })
export class ValidationTokenService {

  private methodName: string = 'ValidationToken';
  successCommand: string = 'VALID_TOKEN_SUCCESS';
  failCommand: string = 'VALID_TOKEN_FAIL';

  constructor(
    private appService: AppService,
    private signalrService: SignalrService
  ) { }

  launchValidationToken() {
    this.validateTokenListenSuccess();
    this.validateTokenListenFail();
    this.validationTokenAsync();
  }

  private async validationTokenAsync() {
    try {
      await this.signalrService.hubConnection.invoke(this.methodName, this.appService.getToken())
        .then(() => {
          console.log('#7 after validationToken: then()');
        })
        .catch(err => console.log(err));
    }

    catch (err) { console.log(err); }
  }

  private validateTokenListenSuccess() {
    try {
      this.signalrService.hubConnection.on(this.successCommand, (user: UserSignalrDto) => {

        this.appService.userData = { ...user };
        this.appService.isAuthenticated.set(true);

        this.appService.showSnackbar('Re-authentificated!');

        if (this.appService.router.url === '/auth') {
          this.appService.router.navigate(["account"]);
        } else this.appService.router.navigate([this.appService.router.url]);

        this.signalrService.offConnection([this.successCommand, this.failCommand]);
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  private validateTokenListenFail() {
    try {
      this.signalrService.hubConnection.on(this.failCommand, () => {
        localStorage.removeItem('token');
        this.appService.showSnackbar('Previous session is expired. Access again with your email and password please.');
      });
    }

    catch (err) {
      console.log(err);
    }
  }
}
