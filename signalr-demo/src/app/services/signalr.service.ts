import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PersonAuthDto, PersonRespDto } from '../models/person.model';

@Injectable({ providedIn: 'root' })
export class SignalrService {

  hubConnection!: signalR.HubConnection;
  personName!: string;
  private signalrSubject = new Subject<any>();
  signalrSubject$ = this.signalrSubject.asObservable();

  constructor(
    public toastr: ToastrService,
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
        console.log('#0 Hub conn started!');
        this.signalrSubject.next({ type: 'HubConnStarted' });
      })
      .catch(err => console.log('Error while srating conn: ' + err));
  }

  async authMe(username: string, password: string) {
    console.log('#3 authMe started!')

    await this.hubConnection.invoke('authMe', new PersonAuthDto(username, password))
      .then(() => console.log('#5 authMe than()'))
      .finally(() => this.toastr.info("Loading is attempt..."))
      .catch(err => console.log(err));

    console.log('#6 Final async promt');
  }

  authMeListenerSuccsess() {
    console.log('#2 authMeListenerSuccsess started!')

    this.hubConnection.on('authorizationSuccess', (response: PersonRespDto) => {
      console.log('#4 authMeResponse listener()');
      this.personName = response.username;
      this.toastr.success('Login succsessfully!');
      this.router.navigate(["/home"]);
    });
  }

  authMeListenerFail() { this.hubConnection.on("authMeListenerFail", () => this.toastr.error("Wrong credentials!")); }

  offConnection(text: string) { this.hubConnection.off(text); }

}
