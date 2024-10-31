import { Injectable } from '@angular/core';

import { ValidationTokenService } from './validation-token.service';
import { SignalrService } from './signalr.service';
import { AppService } from '../app.service';

@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(
    private appService: AppService,
    private signalrService: SignalrService,
    private validationTokenService: ValidationTokenService,
  ) { }

  checkAuthentication(): void {
    if (typeof window === 'undefined') return;

    this.signalrService.startConnection()
      .then(() => {
        const token = this.appService.getToken();

        if (this.signalrService.hasConnection() && token) {
          console.log('#1 Has token');
          this.validationTokenService.launchValidationToken();
        }

        else { console.log('SignalR connection not established or no token.'); }
      })
      .catch(err => console.error('Error starting SignalR connection:', err));
  }

}
