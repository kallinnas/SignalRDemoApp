import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PersonSignalrDto } from '../models/person.model';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class SignalrService {

  hubConnection!: signalR.HubConnection;
  
  private signalrSubject = new Subject<any>();
  signalrSubject$ = this.signalrSubject.asObservable();

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubURL, {
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

  offConnection(text: string) { this.hubConnection.off(text); }

}
