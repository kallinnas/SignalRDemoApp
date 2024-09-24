import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { UserSignalrDto } from '../../models/user.model';
import { AppService } from '../app.service';
import { LogoutService } from './logout.service';

@Injectable({ providedIn: 'root' })
export class ValidationTokenService {

  private methodName: string = 'ValidationToken';
  successCommand: string = 'Valid_Token_Success';
  failCommand: string = 'Valid_Token_Fail';

  constructor(
    private appService: AppService,
    private logoutService: LogoutService,
    private signalrService: SignalrService
  ) { }

  launchValidationToken() {
    this.validateTokenListenSuccess();
    this.validateTokenListenFail();
    this.validationTokenAsync();
  }

  private async validationTokenAsync() {
    try {
      console.log('#3 validationToken');

      await this.signalrService.hubConnection.invoke(this.methodName, localStorage.getItem('token'))
        .then(() => {
          console.log('#6 after validationToken: then()');
          this.logoutService.logoutListenResponse();
        })
        .catch(err => console.log(err));
    }

    catch (err) { console.log(err); }
  }

  private validateTokenListenSuccess() {
    try {
      console.log('#2 validateTokenListenSuccess');

      this.signalrService.hubConnection.on(this.successCommand, (user: UserSignalrDto) => {
        console.log('#4 validateTokenListenSuccess');

        this.appService.userData = { ...user };
        this.appService.isAuthenticated = true;
        
        this.appService.toastr.success('Re-authentificated!');
        this.appService.router.navigate(["user-connection-state"]);
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  private validateTokenListenFail() {
    try {
      console.log('#2 validateTokenListenFail');

      this.signalrService.hubConnection.on(this.failCommand, () => {
        console.log('#4 token expaired');

        localStorage.removeItem('token');
        this.appService.toastr.info('Previous session is expired. Access again with your email and password please.');
      });
    }

    catch (err) {
      console.log(err);
    }
  }
}
