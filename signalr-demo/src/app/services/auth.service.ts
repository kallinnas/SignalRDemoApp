import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrService } from './signalr.service';
import { HubConnectionState } from '@microsoft/signalr';
import { PersonSignalrDto } from '../models/person.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthenticated: boolean = false;
  personData!: PersonSignalrDto;

  constructor(
    private signalrService: SignalrService,
    public toastr: ToastrService,
    public router: Router
  ) {
    if (typeof window !== 'undefined') {
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
  }

  async authMe(userName: string, password: string) {
    console.log('#1 authMe First authorization');
    const personDto = { userName: userName, password: password };

    await this.signalrService.hubConnection.invoke('authMe', personDto)
      .then(() => {
        console.log('#3 authMe After Listener');
        this.toastr.info("Loading is attempt...")
      })
      .catch(err => console.log(err));
  }

  authorizeListenerSuccess() {
    console.log('#4 authorizeListenerSuccess')

    this.signalrService.hubConnection.on('authorizationSuccess', (person: PersonSignalrDto) => {
      const step = localStorage.getItem('personId') ? 8 : 2;
      console.log(`#${step} authorizeListenerSuccess => setLocalStorage`);

      this.personData = { ...person };
      localStorage.setItem('personId', person.id.toString());

      this.isAuthenticated = true;
      this.toastr.success('Login succsessfully!');
      this.router.navigate(["/home"]);
    });
  }

  authorizeListenerFail() {
    console.log('#5 authorizeListenerFail');
    this.signalrService.hubConnection.on("authorizeListenerFail", () => this.toastr.error("Wrong credentials!"));
  }

  async reAuthorize(personId: number) {
    console.log('#7 reAuth');
    await this.signalrService.hubConnection.invoke('ReAuthMe', personId)
      .then(() => {
        console.log('#10 reAuth then()');
        this.toastr.info("Loading is attempt...");
      })
      .catch(err => console.log(err));
  }

  reAuthorizeListener() {
    console.log('#6 reAuthListener');
    this.signalrService.hubConnection.on('authorizationSuccess', (person: PersonSignalrDto) => {
      console.log('#9 reAuthListener => response');

      this.personData = { ...person };
      this.isAuthenticated = true;
      this.toastr.success('Re-authentificated!');
      if (this.router.url == "/auth")
        this.router.navigate(["/home"]);
    });
  }

}
