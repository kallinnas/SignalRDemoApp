import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class SignalrService {

  hubConnection!: signalR.HubConnection;
  personName!: string;

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7217/customHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
        // , accessTokenFactory: () => localStorage.getItem('token')
      })
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('#1 Hub conn started!');
        this.authMeListenerSuccsess();
        this.authMeListenerFail();
      })
      .catch(err => console.log('Error while srating conn: ' + err));
  }

  async authMe(username: string, password: string) {
    console.log('#3 authMe started!')
    const personDto = { username: username, password: password };

    await this.hubConnection.invoke('authMe', personDto)
      .then(() => console.log('#5 authMe than()'))
      .finally(() => this.toastr.info("Loading is attempt..."))
      .catch(err => console.log(err));

    console.log('#6 Final async promt');
  }

  authMeListenerSuccsess() {
    console.log('#2 authMeListenerSuccsess started!')

    this.hubConnection.on('authMeResponseSuccess', (response) => {
      console.log('#4 authMeResponse listener()');
      this.personName = response.username;
      this.toastr.success('Login succsessfully!');
      this.router.navigate(["/home"]);
    });
  }

  authMeListenerFail() { this.hubConnection.on("authMeListenerFail", () => this.toastr.error("Wrong credentials!")); }

  offConnection(text: string) { this.hubConnection.off(text); }

}
