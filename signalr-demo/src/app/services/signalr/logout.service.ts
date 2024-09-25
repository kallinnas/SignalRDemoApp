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
    console.log('#7 logoutListenResponse');

    this.signalrService.hubConnection.on('Logout_Response', () => {
      console.log('#9 logoutListenResponse: response');

      localStorage.removeItem('token');
      location.reload();
      this.signalrService.hubConnection.stop();
    });
  }
}
