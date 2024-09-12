import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrService } from './signalr.service';
import { HubConnectionState } from '@microsoft/signalr';
import { PersonRespDto } from '../models/person.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated: boolean = false;

  constructor(
    private signalrService: SignalrService,
    public router: Router
  ) {
    const id = localStorage.getItem('personId');
    if (id) {
      console.log('#1 constructor Has token');

      if (signalrService.hubConnection.state === HubConnectionState.Connected) {
        console.log('#2 constructor Connection exists');
        this.reAuthorizeListener();
        this.reAuthorize(+id);
      }

      else {
        console.log('#2 constructor Wait connection to start');
        signalrService.signalrSubject$.subscribe(response => {
          if (response.type == "HubConnStarted") {
            this.reAuthorizeListener();
            this.reAuthorize(+id);
          }
        });
      }
    }
  }

  async authMe(userName: string, password: string) {
    console.log('#1 authMe First authorization');
    const personDto = { userName: userName, password: password };

    await this.signalrService.hubConnection.invoke('authMe', personDto)
      .then(() => {
        console.log('#3 authMe After Listener');
        this.signalrService.toastr.info("Loading is attempt...")
      })
      .catch(err => console.log(err));
  }

  authMeListenerSuccess() {
    console.log('#4 authMeListenerSuccess')

    this.signalrService.hubConnection.on('authorizationSuccess', (response: PersonRespDto) => {
      const step = localStorage.getItem('personId') ? 8 : 2;
      console.log(`#${step} authMeListenerSuccess => setLocalStorage`);
      localStorage.setItem('personId', response.id.toString());
      this.signalrService.personName = response.name;
      this.isAuthenticated = true;
      this.signalrService.toastr.success('Login succsessfully!');
      this.router.navigate(["/home"]);
    });
  }

  authMeListenerFail() {
    console.log('#5 authMeListenerFail');
    this.signalrService.hubConnection.on("authMeListenerFail", () => this.signalrService.toastr.error("Wrong credentials!"));
  }

  async reAuthorize(personId: number) {
    console.log('#7 reAuth');
    await this.signalrService.hubConnection.invoke('ReAuthMe', personId)
      .then(() => {
        console.log('#10 reAuth then()');
        this.signalrService.toastr.info("Loading is attempt...");
      })
      .catch(err => console.log(err));
  }

  reAuthorizeListener() {
    console.log('#6 reAuthListener');
    this.signalrService.hubConnection.on('authorizationSuccess', (response: PersonRespDto) => {
      console.log('#9 reAuthListener => response');
      this.signalrService.personName = response.name;
      this.isAuthenticated = true;
      this.signalrService.toastr.success('Re-authentificated!');
      if (this.router.url == "/auth")
        this.router.navigate(["/home"]);
    });
  }

}
