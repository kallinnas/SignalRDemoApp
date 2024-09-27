import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { SignalrService } from './signalr.service';

@Injectable({ providedIn: 'root' })
export class LogoutService {

  private methodName: string = 'LogoutUser';
  successCommand: string = 'Logout_Response';

  constructor(
    private appService: AppService,
    private signalrService: SignalrService
  ) { }

  logout(): void {
    console.log('#8 logout: invoke');

    this.signalrService.hubConnection.invoke(this.methodName, this.appService.userData.id)
      .then(() => {
        console.log('#10 authentificationAsync: First authorization');
      })
      .catch(err => console.error(err));
  }

  logoutListenResponse(): void {
    console.log('#6 logoutListenResponse');

    this.signalrService.hubConnection.on(this.successCommand, () => {
      console.log('#9 logoutListenResponse: response');

      localStorage.removeItem('token');
      location.reload(); // No need to stop or unsubscribe since the page will reload.
    });
  }
}
