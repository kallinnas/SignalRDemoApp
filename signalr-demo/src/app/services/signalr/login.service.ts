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
    if (typeof window !== 'undefined') {
      this.launchHub();
    }
  }

  launchHub() {
    try {
      this.signalrService.startConnection()
        .then(() => {
          const token = this.appService.getToken();

          if (this.signalrService.hasConnection()) {
            if (token) {
              console.log('#1 Has token');
              this.validationTokenService.launchValidationToken();
            }
          }

          else { console.error('SignalR connection is not connected.'); }
        })

        .catch((err: any) => { console.error('Error starting SignalR connection:', err); });
    }

    catch (err) { console.log(err); }
  }
  
}
